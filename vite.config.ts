import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

const root = import.meta.dirname;

// base: "./" keeps the storefront build portable (Cloudflare Pages root or
// GitHub Pages sub-path); it uses hash links, not path routes.
// Two pages: the storefront (index.html) and the admin dashboard (admin/index.html).
// In development, /api and /images are proxied to the local Worker (npm run dev:api).
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    assetsDir: "static",
    rollupOptions: {
      input: { main: resolve(root, "index.html"), admin: resolve(root, "admin/index.html") },
    },
  },
  server: {
    proxy: {
      "/api": { target: "http://127.0.0.1:8787" },
      "/images": { target: "http://127.0.0.1:8787" },
    },
  },
  test: { environment: "node" },
});
