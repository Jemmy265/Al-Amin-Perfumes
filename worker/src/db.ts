/* D1 access for products. All multi-statement writes go through
   DB.batch(), which D1 runs as a single transaction. */
import { parsePricing, pricingFromLegacy } from "../../src/shared/pricing";
import type { PricingSettings } from "../../src/types/content";
import type { AdminProduct, ProductData } from "../../src/shared/product";

interface ProductRow {
  id: string; name: string; name_en: string; house: string; label: string; is_new: number;
  category: AdminProduct["category"]; intensity: AdminProduct["intensity"]; status: AdminProduct["status"];
  family: string; year: number | null; perfumer: string;
  notes_top: string; notes_heart: string; notes_base: string; notes_all: string;
  sort_order: number; featured_rank: number | null; created_at: string; updated_at: string;
}

/** Original photos ship as static assets (assets/…, served without the Worker);
    uploads live in R2 (products/…, site/…) and are served by the Worker at /images/…. */
export const imageUrl = (key: string) => (key.startsWith("assets/") ? `/${key}` : `/images/${key}`);
export const isR2Key = (key: string | null | undefined): boolean => !!key && /^(products|site)\//.test(key);

/** Loads products (optionally only published) with variants, tags and primary image, in display order. */
export async function listProducts(db: D1Database, opts: { publishedOnly?: boolean; id?: string } = {}): Promise<AdminProduct[]> {
  const where: string[] = [];
  const args: string[] = [];
  if (opts.publishedOnly) where.push("status = 'published'");
  if (opts.id) { where.push("id = ?"); args.push(opts.id); }
  const w = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const sub = () => `product_id IN (SELECT id FROM products ${w})`;

  const [rows, variants, tags, images] = await db.batch([
    db.prepare(`SELECT * FROM products ${w} ORDER BY sort_order, id`).bind(...args),
    db.prepare(`SELECT product_id, size_ml, price FROM product_variants WHERE ${sub()} ORDER BY size_ml`).bind(...args),
    db.prepare(`SELECT product_id, tag_group, tag FROM product_tags WHERE ${sub()} ORDER BY position`).bind(...args),
    db.prepare(`SELECT product_id, object_key FROM product_images WHERE ${sub()} ORDER BY sort_order, id`).bind(...args),
  ]);

  const by = <T extends { product_id: string }>(list: T[]) => {
    const m = new Map<string, T[]>();
    for (const r of list) (m.get(r.product_id) ?? m.set(r.product_id, []).get(r.product_id)!).push(r);
    return m;
  };
  const vMap = by(variants.results as { product_id: string; size_ml: number; price: number }[]);
  const tMap = by(tags.results as { product_id: string; tag_group: string; tag: string }[]);
  const iMap = by(images.results as { product_id: string; object_key: string }[]);

  return (rows.results as unknown as ProductRow[]).map((r) => {
    const t = tMap.get(r.id) ?? [];
    const key = iMap.get(r.id)?.[0]?.object_key ?? null;
    return {
      id: r.id, name: r.name, nameEn: r.name_en, house: r.house, label: r.label, isNew: !!r.is_new,
      category: r.category, intensity: r.intensity, status: r.status,
      family: r.family, year: r.year, perfumer: r.perfumer,
      notes: { top: r.notes_top, heart: r.notes_heart, base: r.notes_base, all: r.notes_all },
      variants: (vMap.get(r.id) ?? []).map((v) => ({ sizeMl: v.size_ml, price: v.price })),
      scents: t.filter((x) => x.tag_group === "scent").map((x) => x.tag) as AdminProduct["scents"],
      occasions: t.filter((x) => x.tag_group === "occasion").map((x) => x.tag) as AdminProduct["occasions"],
      isFeatured: r.featured_rank !== null,
      featuredRank: r.featured_rank,
      sortOrder: r.sort_order,
      imageKey: key,
      imageUrl: key ? imageUrl(key) : null,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  });
}

export const getProduct = async (db: D1Database, id: string) => (await listProducts(db, { id }))[0] ?? null;

/** Statements that (re)write a product's child rows. */
function childStatements(db: D1Database, id: string, p: ProductData): D1PreparedStatement[] {
  const s: D1PreparedStatement[] = [
    db.prepare("DELETE FROM product_variants WHERE product_id = ?").bind(id),
    db.prepare("DELETE FROM product_tags WHERE product_id = ?").bind(id),
  ];
  for (const v of p.variants) s.push(db.prepare("INSERT INTO product_variants (product_id, size_ml, price) VALUES (?, ?, ?)").bind(id, v.sizeMl, v.price));
  p.scents.forEach((t, i) => s.push(db.prepare("INSERT INTO product_tags (product_id, tag_group, tag, position) VALUES (?, 'scent', ?, ?)").bind(id, t, i)));
  p.occasions.forEach((t, i) => s.push(db.prepare("INSERT INTO product_tags (product_id, tag_group, tag, position) VALUES (?, 'occasion', ?, ?)").bind(id, t, i)));
  return s;
}

function imageStatements(db: D1Database, id: string, p: ProductData, currentKey: string | null): D1PreparedStatement[] {
  if (p.imageKey === currentKey) return [];
  const s = [db.prepare("DELETE FROM product_images WHERE product_id = ?").bind(id)];
  if (p.imageKey) {
    const alt = [p.name, p.nameEn].filter(Boolean).join(" — ");
    s.push(db.prepare("INSERT INTO product_images (product_id, object_key, alt_text, sort_order) VALUES (?, ?, ?, 0)").bind(id, p.imageKey, alt));
  }
  return s;
}

const productColumns = (p: ProductData) => [
  p.name, p.nameEn, p.house, p.label, p.isNew ? 1 : 0, p.category, p.intensity, p.status,
  p.family, p.year, p.perfumer, p.notes.top, p.notes.heart, p.notes.base, p.notes.all,
];

/** Creates a product at the TOP of the catalog (new arrivals first, as on the current site). */
export async function createProduct(db: D1Database, id: string, p: ProductData) {
  await db.batch([
    db.prepare("UPDATE products SET sort_order = sort_order + 1"),
    db.prepare(
      `INSERT INTO products (name, name_en, house, label, is_new, category, intensity, status, family, year, perfumer,
        notes_top, notes_heart, notes_base, notes_all, id, sort_order, featured_rank)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1,
        CASE WHEN ? THEN (SELECT COALESCE(MAX(featured_rank), 0) + 1 FROM products) ELSE NULL END)`,
    ).bind(...productColumns(p), id, p.isFeatured ? 1 : 0),
    ...childStatements(db, id, p),
    ...imageStatements(db, id, p, null),
  ]);
}

export async function updateProduct(db: D1Database, id: string, p: ProductData, current: AdminProduct) {
  await db.batch([
    db.prepare(
      `UPDATE products SET name = ?, name_en = ?, house = ?, label = ?, is_new = ?, category = ?, intensity = ?, status = ?,
        family = ?, year = ?, perfumer = ?, notes_top = ?, notes_heart = ?, notes_base = ?, notes_all = ?,
        featured_rank = CASE
          WHEN ? = 0 THEN NULL
          WHEN featured_rank IS NOT NULL THEN featured_rank
          ELSE (SELECT COALESCE(MAX(featured_rank), 0) + 1 FROM products) END,
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
       WHERE id = ?`,
    ).bind(...productColumns(p), p.isFeatured ? 1 : 0, id),
    ...childStatements(db, id, p),
    ...imageStatements(db, id, p, current.imageKey),
  ]);
}

/** Deletes a product; variants, tags and image rows cascade. Gaps left in
    sort_order / featured_rank are harmless (only relative order matters) and
    disappear on the next reorder. */
export async function deleteProduct(db: D1Database, id: string) {
  await db.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
}

/** Applies a complete new order. `ids` must contain every product exactly once. */
export async function applyOrder(db: D1Database, ids: string[], column: "sort_order" | "featured_rank") {
  if (!ids.length) return;
  // One transaction: either the whole new order is saved, or nothing is.
  await db.batch(ids.map((id, i) => db.prepare(`UPDATE products SET ${column} = ? WHERE id = ?`).bind(i + 1, id)));
}

export async function allIds(db: D1Database, featuredOnly = false): Promise<string[]> {
  const r = await db.prepare(`SELECT id FROM products ${featuredOnly ? "WHERE featured_rank IS NOT NULL" : ""}`).all<{ id: string }>();
  return r.results.map((x) => x.id);
}

export async function idExists(db: D1Database, id: string) {
  return !!(await db.prepare("SELECT 1 FROM products WHERE id = ?").bind(id).first());
}

export async function updateTags(db: D1Database, id: string, t: Pick<ProductData, "category" | "scents" | "occasions" | "intensity">) {
  const s: D1PreparedStatement[] = [
    db.prepare("UPDATE products SET category = ?, intensity = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?").bind(t.category, t.intensity, id),
    db.prepare("DELETE FROM product_tags WHERE product_id = ?").bind(id),
  ];
  t.scents.forEach((x, i) => s.push(db.prepare("INSERT INTO product_tags (product_id, tag_group, tag, position) VALUES (?, 'scent', ?, ?)").bind(id, x, i)));
  t.occasions.forEach((x, i) => s.push(db.prepare("INSERT INTO product_tags (product_id, tag_group, tag, position) VALUES (?, 'occasion', ?, ?)").bind(id, x, i)));
  await db.batch(s);
}

export async function putSiteKv(db: D1Database, key: "content" | "settings" | "pricing", value: unknown) {
  await db.prepare(
    `INSERT INTO site_kv (key, value) VALUES (?1, ?2)
     ON CONFLICT (key) DO UPDATE SET value = ?2, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`,
  ).bind(key, JSON.stringify(value)).run();
}

export async function getSiteKv(db: D1Database): Promise<Record<string, unknown>> {
  // The catalog snapshot also lives in site_kv; never load it here.
  const r = await db.prepare("SELECT key, value FROM site_kv WHERE key IN ('settings', 'content', 'labels')").all<{ key: string; value: string }>();
  return Object.fromEntries(r.results.map((x) => [x.key, JSON.parse(x.value)]));
}

/** Discount rules + free shipping (site_kv "pricing"). Before migration 0003 has run,
    the old single size discount / threshold in "settings" are moved here on first read. */
export async function getPricing(db: D1Database, settings?: unknown): Promise<PricingSettings> {
  const row = await db.prepare("SELECT value FROM site_kv WHERE key = 'pricing'").first<{ value: string }>();
  const stored = row ? parsePricing(JSON.parse(row.value)) : null;
  if (stored) return stored;
  const legacy = pricingFromLegacy(settings ?? (await getSiteKv(db)).settings);
  await db.prepare("INSERT OR IGNORE INTO site_kv (key, value) VALUES ('pricing', ?)").bind(JSON.stringify(legacy)).run();
  return legacy;
}
