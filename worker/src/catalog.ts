/* Public catalog snapshot.
   The storefront needs products + settings + content + labels. Building that
   from the relational tables reads ~200 D1 rows, so it is built ONCE after
   every successful admin change and stored as a single JSON row
   (site_kv key "catalog"). A public request then reads exactly one row and
   returns the stored text as-is (no JSON parse/serialize → minimal CPU). */
import { toStorefrontProduct } from "../../src/shared/product";
import { normalizeSections } from "../../src/shared/content";
import { LABELS } from "../../src/data/seed/content";
import type { SiteContent } from "../../src/types/content";
import { getSiteKv, listProducts } from "./db";

export interface Snapshot { body: string; etag: string }

export async function buildCatalog(db: D1Database): Promise<string> {
  const [products, kv] = await Promise.all([listProducts(db, { publishedOnly: true }), getSiteKv(db)]);
  const bestSellers = products
    .filter((p) => p.featuredRank !== null)
    .sort((a, b) => a.featuredRank! - b.featuredRank!)
    .map((p) => p.id);
  const content = kv.content as SiteContent;
  return JSON.stringify({
    products: products.map(toStorefrontProduct),
    settings: { ...(kv.settings as object), bestSellers },
    content: { ...content, sections: normalizeSections(content.sections) },
    labels: kv.labels ?? LABELS,
  });
}

/** Rebuild + store. Called after every successful admin write. */
export async function refreshCatalog(db: D1Database): Promise<void> {
  const json = await buildCatalog(db);
  await db.prepare(
    `INSERT INTO site_kv (key, value) VALUES ('catalog', ?1)
     ON CONFLICT (key) DO UPDATE SET value = ?1, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`,
  ).bind(json).run();
}

/** One-row read. Builds the snapshot on first use (fresh database). */
export async function readCatalog(db: D1Database): Promise<Snapshot> {
  let row = await db.prepare("SELECT value, updated_at FROM site_kv WHERE key = 'catalog'").first<{ value: string; updated_at: string }>();
  if (!row) {
    await refreshCatalog(db);
    row = await db.prepare("SELECT value, updated_at FROM site_kv WHERE key = 'catalog'").first<{ value: string; updated_at: string }>();
  }
  return { body: row!.value, etag: `"c-${row!.updated_at.replace(/[^0-9]/g, "")}"` };
}
