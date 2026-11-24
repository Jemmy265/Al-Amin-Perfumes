/* Uploads the original product photos (public/assets/products) to R2 under
   products/<file> — the keys referenced by worker/migrations/0002_seed.sql.
   Usage: node scripts/upload-seed-images.mjs --local    (wrangler dev storage)
          node scripts/upload-seed-images.mjs --remote   (production bucket) */
import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";

const mode = process.argv.includes("--remote") ? "--remote" : "--local";
const dir = "public/assets/products";
const files = readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
for (const [i, f] of files.entries()) {
  const type = f.endsWith(".png") ? "image/png" : f.endsWith(".webp") ? "image/webp" : "image/jpeg";
  execFileSync("npx", ["wrangler", "r2", "object", "put", `alamin-images/products/${f}`, "--file", `${dir}/${f}`,
    "--content-type", type, mode, "-c", "worker/wrangler.jsonc"], { stdio: "ignore" });
  console.log(`${i + 1}/${files.length} products/${f}`);
}
