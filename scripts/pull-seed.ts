/* Rewrites src/data/seed/* so the bundled data matches the D1 database exactly
   (what the storefront shows: published products, settings, discounts, content,
   labels). The bundled seed is the storefront's fallback when the API can't be
   reached, so it should mirror the live site.
   Read-only on the database: it only runs SELECTs.
     npm run db:pull-seed            # production (remote) D1
     npm run db:pull-seed -- --local # local dev D1
   Never edit the seed files by hand after this; pull again instead. */
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { withPricing } from "../src/shared/pricing.ts";

const where = process.argv.includes("--local") ? "--local" : "--remote";

function query<T>(sql: string): T[] {
  const out = execFileSync("npx", ["wrangler", "d1", "execute", "alamin-db", where, "--json", "--command", sql], {
    encoding: "utf8", stdio: ["ignore", "pipe", "inherit"], maxBuffer: 64 * 1024 * 1024,
  });
  return (JSON.parse(out) as { results: T[] }[])[0].results;
}

type Row = { key: string; value: string; updated_at: string };
const rows = Object.fromEntries(
  query<Row>("SELECT key, value, updated_at FROM site_kv WHERE key IN ('catalog', 'settings', 'content', 'labels', 'pricing')").map((r) => [r.key, r]),
);
if (!rows.catalog) throw new Error("No catalog snapshot in D1 yet — open the site (GET /api/catalog) once, then pull again.");

// The snapshot is rebuilt after every admin save; make sure it isn't older than the documents it is built from.
const newest = Math.max(...["settings", "content", "labels", "pricing"].filter((k) => rows[k]).map((k) => Date.parse(rows[k].updated_at)));
if (Date.parse(rows.catalog.updated_at) < newest) throw new Error("The catalog snapshot is older than the settings/content. Save anything in the admin (or open the site after deploying), then pull again.");

const snap = JSON.parse(rows.catalog.value);
const pricing = rows.pricing ? JSON.parse(rows.pricing.value) : undefined;
const settings = withPricing(snap.settings, pricing);
const { reviewItems, ...content } = snap.content;

const json = (v: unknown) => JSON.stringify(v, null, 2);
const head = (what: string) =>
  `/* ${what} — generated from the D1 database by scripts/pull-seed.ts (${where.slice(2)}, ${new Date().toISOString().slice(0, 10)}).\n` +
  `   Mirrors what the live site shows; it is the storefront's fallback when the API is unreachable.\n` +
  `   Do not edit by hand: change the data in the admin, then run \`npm run db:pull-seed\`. */\n`;

writeFileSync("src/data/seed/products.ts",
  head("Product catalog (published products, in catalog order)") +
  `import type { Product } from "../../types/catalog";\n\nexport const SEED_PRODUCTS: Product[] = ${json(snap.products)};\n`);

writeFileSync("src/data/seed/reviews.ts",
  head("Customer reviews") +
  `import type { Review } from "../../types/content";\n\nexport const SEED_REVIEWS: Review[] = ${json(reviewItems)};\n`);

writeFileSync("src/data/seed/content.ts",
  head("Store settings, discounts & free shipping, labels and homepage content") +
  `import type { Labels, SiteContent, StoreSettings } from "../../types/content";\nimport { SEED_REVIEWS } from "./reviews";\n\n` +
  `export const SEED_SETTINGS: StoreSettings = ${json(settings)};\n\n` +
  `export const LABELS: Labels = ${json(snap.labels)};\n\n` +
  `export const SEED_CONTENT: SiteContent = {\n${json(content).slice(2, -2)},\n  "reviewItems": SEED_REVIEWS\n};\n`);

console.log(`Seed updated from ${where.slice(2)} D1: ${snap.products.length} products, ${reviewItems.length} reviews, ${settings.discounts.length} discount rule(s).`);
