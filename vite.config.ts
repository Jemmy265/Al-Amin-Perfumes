import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// base: "./" keeps the build portable — it works on Cloudflare Pages (root)
// and on GitHub Pages (/Al-Amin-Perfumes/) without changes, because the
// storefront uses hash links (#products, #perfume/<id>) rather than path routes.
export default defineConfig({
  base: "./",
  plugins: [react()],
  // Keep hashed build output separate from the public/assets images.
  build: { assetsDir: "static" },
  test: { environment: "node" },
});
