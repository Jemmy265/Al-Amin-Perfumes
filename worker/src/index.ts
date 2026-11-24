/* Al-Amin Perfumes API — Hono on Cloudflare Workers (D1 + R2).
   Only /api/* and /images/* reach this code; every other path is a static
   asset served by Cloudflare without invoking the Worker (see wrangler.jsonc).
   Public, read-only:  GET /api/catalog (one request = everything the storefront
                       needs), GET /api/products, GET /api/site, GET /images/<key>
   Auth:               POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me
   Admin (session):    /api/admin/* — products CRUD, ordering, tags, uploads, content */
import { Hono, type Context } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { z } from "zod";
import { QUIZ } from "../../src/domain/quiz";
import { LABELS } from "../../src/data/seed/content";
import {
  AUDIENCES, fieldErrors, INTENSITIES, loginSchema, OCCASIONS, PRODUCT_ID_RE, productInputSchema,
  reorderSchema, SCENTS, slugify, tagsInputSchema,
} from "../../src/shared/product";
import { contentSchema, normalizeSections, SERVER_SETTINGS_KEYS, settingsSchema, siteImageKeys } from "../../src/shared/content";
import type { SiteContent } from "../../src/types/content";
import { readCatalog, refreshCatalog } from "./catalog";
import { endSession, lockedFor, recordFailure, requireAdmin, sameOrigin, startSession, verifyPassword, hasSession } from "./auth";
import * as db from "./db";
import type { AppEnv } from "./env";

const app = new Hono<AppEnv>();

app.use("*", secureHeaders({ crossOriginResourcePolicy: "same-site" }));
app.use("/api/*", sameOrigin);
app.use("/api/*", async (c, next) => {
  await next();
  if (!c.res.headers.has("Cache-Control")) c.res.headers.set("Cache-Control", "no-store");
});

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "حصلت مشكلة في الخادم. حاول تاني بعد شوية." }, 500);
});
app.notFound((c) => c.json({ error: "غير موجود" }, 404));

/** Parses JSON safely and validates it; returns [data] or a 400 response. */
async function body<T extends z.ZodType>(c: Context<AppEnv>, schema: T) {
  let raw: unknown;
  try { raw = await c.req.json(); } catch { return { res: c.json({ error: "بيانات غير صالحة" }, 400) }; }
  const r = schema.safeParse(raw);
  if (!r.success) {
    const fields = fieldErrors(r.error);
    return { res: c.json({ error: Object.values(fields)[0] ?? "بيانات غير صالحة", fields }, 422) };
  }
  return { data: r.data as z.output<T> };
}

/* ------------------------------ Public ------------------------------ */

app.get("/api/health", (c) => c.json({ ok: true }));

/** Public catalog cache policy: browsers reuse it for 60 s, then may show it
    once more (≤ 60 s) while refreshing in the background → a customer sees an
    admin change within ~2 minutes at most. Revalidating an unchanged catalog
    costs a 1-row read and returns 304. The admin refreshes its own copy at once. */
const CATALOG_CACHE = "public, max-age=60, stale-while-revalidate=60";

app.get("/api/catalog", async (c) => {
  const snap = await readCatalog(c.env.DB);
  const headers = { "Cache-Control": CATALOG_CACHE, ETag: snap.etag, "Content-Type": "application/json; charset=utf-8" };
  if (c.req.header("If-None-Match") === snap.etag) return new Response(null, { status: 304, headers });
  return new Response(snap.body, { headers });
});

// Older split endpoints, kept for compatibility — same snapshot, same caching.
app.get("/api/products", async (c) => {
  const snap = await readCatalog(c.env.DB);
  c.header("Cache-Control", CATALOG_CACHE);
  return c.json(JSON.parse(snap.body).products);
});
app.get("/api/site", async (c) => {
  const { settings, content, labels } = JSON.parse((await readCatalog(c.env.DB)).body);
  c.header("Cache-Control", CATALOG_CACHE);
  return c.json({ settings, content, labels });
});

/** Uploaded photos from R2. Keys are random and never reused, so they are cached
    "forever" by browsers; repeat visits do not hit the Worker at all. */
app.get("/images/*", async (c) => {
  const key = decodeURIComponent(c.req.path.replace(/^\/images\//, ""));
  if (!db.isR2Key(key) || key.includes("..")) return c.notFound();
  const obj = await c.env.IMAGES.get(key, { onlyIf: c.req.raw.headers });
  if (!obj) return c.notFound();
  const h = new Headers();
  obj.writeHttpMetadata(h);
  h.set("ETag", obj.httpEtag);
  h.set("Cache-Control", "public, max-age=31536000, immutable");
  h.set("X-Content-Type-Options", "nosniff");
  if (!("body" in obj)) return new Response(null, { status: 304, headers: h }); // If-None-Match matched
  return new Response(obj.body, { headers: h });
});

/* ------------------------------- Auth ------------------------------- */

app.post("/api/auth/login", async (c) => {
  const wait = await lockedFor(c);
  if (wait) return c.json({ error: `محاولات كتير غلط. استنى ${Math.ceil(wait / 60)} دقيقة وجرّب تاني.` }, 429);
  const r = await body(c, loginSchema);
  if (r.res) return r.res;
  const userOk = r.data.username.toLowerCase() === (c.env.ADMIN_USERNAME ?? "").toLowerCase();
  const passOk = await verifyPassword(r.data.password, c.env.ADMIN_PASSWORD_HASH); // always run: no timing hint
  if (!userOk || !passOk) {
    await recordFailure(c);
    return c.json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" }, 401);
  }
  await startSession(c);
  return c.json({ ok: true });
});

app.post("/api/auth/logout", async (c) => {
  await endSession(c);
  return c.json({ ok: true });
});

app.get("/api/auth/me", async (c) => c.json({ authenticated: await hasSession(c) }));

/* ------------------------------- Admin ------------------------------ */

const admin = new Hono<AppEnv>();
admin.use("*", requireAdmin);
// Private data: never stored by browsers or any shared cache.
admin.use("*", async (c, next) => { await next(); c.res.headers.set("Cache-Control", "private, no-store"); });
// Cache invalidation: every successful write rebuilds the public catalog snapshot,
// which changes its ETag — customers get the new data on their next revalidation.
admin.use("*", async (c, next) => {
  await next();
  if (c.req.method !== "GET" && c.res.status < 400 && !c.req.path.endsWith("/uploads")) await refreshCatalog(c.env.DB);
});

admin.get("/products", async (c) => c.json(await db.listProducts(c.env.DB)));

admin.get("/tags", (c) => c.json({
  questions: QUIZ,
  labels: LABELS,
  groups: { audience: AUDIENCES, scent: SCENTS, occasion: OCCASIONS, intensity: INTENSITIES },
}));

admin.get("/content", async (c) => {
  const kv = await db.getSiteKv(c.env.DB);
  const content = kv.content as SiteContent;
  return c.json({ ...kv, content: { ...content, sections: normalizeSections(content.sections) } });
});

/** Replace the homepage content document (validated as a whole). */
admin.put("/content", async (c) => {
  const r = await body(c, contentSchema);
  if (r.res) return r.res;
  for (const key of siteImageKeys(r.data))
    if (!(await imageExists(c, key))) return c.json({ error: "صورة مش موجودة — ارفعها تاني" }, 422);
  const before = (await db.getSiteKv(c.env.DB)).content as SiteContent | undefined;
  await db.putSiteKv(c.env.DB, "content", r.data);
  // Delete uploads that this save replaced.
  const kept = new Set(siteImageKeys(r.data));
  if (before) for (const key of siteImageKeys(before)) if (!kept.has(key)) await c.env.IMAGES.delete(key);
  return c.json({ ok: true, content: r.data });
});

/** Update store settings. Fields the editor doesn't own (best sellers, sizes…) are preserved. */
admin.put("/settings", async (c) => {
  const r = await body(c, settingsSchema);
  if (r.res) return r.res;
  const before = ((await db.getSiteKv(c.env.DB)).settings ?? {}) as Record<string, unknown>;
  const kept = Object.fromEntries(SERVER_SETTINGS_KEYS.filter((k) => k in before).map((k) => [k, before[k]]));
  const settings = { ...r.data, ...kept };
  await db.putSiteKv(c.env.DB, "settings", settings);
  return c.json({ ok: true, settings });
});

/** Full new catalog order. Must list every product exactly once. */
admin.patch("/products/reorder", async (c) => {
  const r = await body(c, reorderSchema);
  if (r.res) return r.res;
  const current = await db.allIds(c.env.DB);
  if (!sameSet(r.data.ids, current))
    return c.json({ error: "قائمة العطور اتغيرت من مكان تاني. حدّث الصفحة ورتّب من جديد." }, 409);
  await db.applyOrder(c.env.DB, r.data.ids, "sort_order");
  return c.json({ ok: true });
});

/** Order of the "الأكثر طلبًا" strip. Must list every featured product exactly once. */
admin.patch("/products/featured-order", async (c) => {
  const r = await body(c, reorderSchema);
  if (r.res) return r.res;
  if (!sameSet(r.data.ids, await db.allIds(c.env.DB, true)))
    return c.json({ error: "قائمة الأكثر طلبًا اتغيرت. حدّث الصفحة ورتّب من جديد." }, 409);
  await db.applyOrder(c.env.DB, r.data.ids, "featured_rank");
  return c.json({ ok: true });
});

admin.post("/products", async (c) => {
  const r = await body(c, productInputSchema);
  if (r.res) return r.res;
  if (r.data.imageKey && !(await imageExists(c, r.data.imageKey)))
    return c.json({ error: "الصورة مش موجودة — ارفعها تاني", fields: { imageKey: "ارفع الصورة تاني" } }, 422);
  const id = await uniqueId(c.env.DB, slugify(r.data.nameEn) || slugify(r.data.name));
  await db.createProduct(c.env.DB, id, r.data);
  return c.json(await db.getProduct(c.env.DB, id), 201);
});

admin.get("/products/:id", async (c) => {
  const p = await db.getProduct(c.env.DB, c.req.param("id"));
  return p ? c.json(p) : c.json({ error: "العطر غير موجود" }, 404);
});

/** Partial update: merged with the stored product, then validated as a whole. The id never changes. */
admin.patch("/products/:id", async (c) => {
  const id = c.req.param("id");
  const current = await db.getProduct(c.env.DB, id);
  if (!current) return c.json({ error: "العطر غير موجود" }, 404);
  let patch: unknown;
  try { patch = await c.req.json(); } catch { return c.json({ error: "بيانات غير صالحة" }, 400); }
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) return c.json({ error: "بيانات غير صالحة" }, 400);
  const { id: _i, sortOrder: _s, featuredRank: _f, imageUrl: _u, createdAt: _c, updatedAt: _d, ...base } = current;
  const r = productInputSchema.safeParse({ ...base, ...(patch as object) });
  if (!r.success) {
    const fields = fieldErrors(r.error);
    return c.json({ error: Object.values(fields)[0], fields }, 422);
  }
  if (r.data.imageKey && r.data.imageKey !== current.imageKey && !(await imageExists(c, r.data.imageKey)))
    return c.json({ error: "الصورة مش موجودة — ارفعها تاني", fields: { imageKey: "ارفع الصورة تاني" } }, 422);
  await db.updateProduct(c.env.DB, id, r.data, current);
  if (current.imageKey && db.isR2Key(current.imageKey) && current.imageKey !== r.data.imageKey) await c.env.IMAGES.delete(current.imageKey);
  return c.json(await db.getProduct(c.env.DB, id));
});

admin.patch("/products/:id/tags", async (c) => {
  const id = c.req.param("id");
  if (!(await db.idExists(c.env.DB, id))) return c.json({ error: "العطر غير موجود" }, 404);
  const r = await body(c, tagsInputSchema);
  if (r.res) return r.res;
  await db.updateTags(c.env.DB, id, r.data);
  return c.json(await db.getProduct(c.env.DB, id));
});

admin.delete("/products/:id", async (c) => {
  const p = await db.getProduct(c.env.DB, c.req.param("id"));
  if (!p) return c.json({ error: "العطر غير موجود" }, 404);
  await db.deleteProduct(c.env.DB, p.id);
  if (p.imageKey && db.isR2Key(p.imageKey)) await c.env.IMAGES.delete(p.imageKey);
  return c.json({ ok: true });
});

const MAX_UPLOAD = 6 * 1024 * 1024;
/** Image upload → R2. The file type is checked from its bytes, not the client's claim. */
admin.post("/uploads", async (c) => {
  const len = Number(c.req.header("Content-Length") ?? 0);
  if (len > MAX_UPLOAD + 64 * 1024) return c.json({ error: "الصورة كبيرة جدًا (الحد 6 ميجا)" }, 413);
  let file: unknown;
  try { file = (await c.req.formData()).get("file"); } catch { return c.json({ error: "ارفع ملف صورة" }, 400); }
  if (!(file instanceof File)) return c.json({ error: "ارفع ملف صورة" }, 400);
  if (file.size > MAX_UPLOAD) return c.json({ error: "الصورة كبيرة جدًا (الحد 6 ميجا)" }, 413);
  if (file.size < 100) return c.json({ error: "الملف فاضي أو تالف" }, 400);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniffImage(bytes);
  if (!type) return c.json({ error: "نوع الملف غير مدعوم — استخدم صورة JPG أو PNG أو WebP" }, 415);
  const folder = c.req.query("kind") === "site" ? "site" : "products";
  const key = `${folder}/${crypto.randomUUID()}.${type.ext}`;
  await c.env.IMAGES.put(key, bytes, { httpMetadata: { contentType: type.mime } });
  return c.json({ key, url: db.imageUrl(key) }, 201);
});

app.route("/api/admin", admin);

/* ------------------------------ Helpers ----------------------------- */

/** Uploaded photo in R2, or one of the original photos bundled as static assets. */
async function imageExists(c: Context<AppEnv>, key: string): Promise<boolean> {
  if (db.isR2Key(key)) return !!(await c.env.IMAGES.head(key));
  if (key.startsWith("assets/")) return (await c.env.ASSETS.fetch(new URL(`/${key}`, c.req.url), { method: "HEAD" })).ok;
  return false;
}

function sameSet(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  const s = new Set(b);
  return new Set(a).size === a.length && a.every((x) => s.has(x));
}

async function uniqueId(d: D1Database, base: string): Promise<string> {
  const root = PRODUCT_ID_RE.test(base) ? base : `perfume-${crypto.randomUUID().slice(0, 8)}`;
  for (let i = 0; i < 50; i++) {
    const id = i === 0 ? root : `${root}-${i + 1}`;
    if (!(await db.idExists(d, id))) return id;
  }
  return `${root}-${crypto.randomUUID().slice(0, 6)}`;
}

function sniffImage(b: Uint8Array): { ext: string; mime: string } | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { ext: "jpg", mime: "image/jpeg" };
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return { ext: "png", mime: "image/png" };
  const ascii = (s: number, e: number) => String.fromCharCode(...b.slice(s, e));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return { ext: "webp", mime: "image/webp" };
  return null;
}

export default app;
