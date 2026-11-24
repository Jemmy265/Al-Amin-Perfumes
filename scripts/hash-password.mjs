/* Creates the ADMIN_PASSWORD_HASH secret value.
   Usage:  node scripts/hash-password.mjs            (prompts, input hidden)
   Then:   npx wrangler secret put ADMIN_PASSWORD_HASH -c worker/wrangler.jsonc
   100,000 PBKDF2 iterations = the maximum Cloudflare Workers allows. */
import { webcrypto as crypto } from "node:crypto";
import { createInterface } from "node:readline";

async function ask(q) {
  const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  rl._writeToOutput = (s) => rl.output.write(s.includes(q) ? s : "");
  const v = await new Promise((r) => rl.question(q, r));
  rl.close(); process.stdout.write("\n");
  return v;
}

const pw = process.env.ADMIN_PASSWORD ?? (await ask("كلمة المرور الجديدة (12 حرف على الأقل): "));
if (pw.length < 12) { console.error("كلمة المرور قصيرة — استخدم 12 حرف على الأقل."); process.exit(1); }
const salt = crypto.getRandomValues(new Uint8Array(16));
const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveBits"]);
const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: 100000 }, key, 256);
const b64 = (u) => Buffer.from(u).toString("base64");
console.log(`pbkdf2-sha256$100000$${b64(salt)}$${b64(new Uint8Array(bits))}`);
