import type { Product } from "../types/catalog";
import type { Labels, SiteContent, StoreSettings } from "../types/content";
import type { StoreDataSource } from "./dataSource";

/**
 * Adapter for the future Hono REST API (Cloudflare Workers + D1 + R2).
 * Expected endpoints (public, read-only, cacheable at the edge):
 *   GET /api/products   → Product[]        (image = absolute R2/CDN URL)
 *   GET /api/site       → { settings, content, labels }
 * The admin dashboard will use authenticated write endpoints on the same API.
 */
export function createApiDataSource(baseUrl: string): StoreDataSource {
  const get = async <T>(path: string): Promise<T> => {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
    return res.json() as Promise<T>;
  };
  return {
    async load() {
      const [products, site] = await Promise.all([
        get<Product[]>("/api/products"),
        get<{ settings: StoreSettings; content: SiteContent; labels: Labels }>("/api/site"),
      ]);
      return { products: [...products].sort((a, b) => a.sortOrder - b.sortOrder), ...site };
    },
  };
}
