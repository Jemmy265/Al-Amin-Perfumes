import type { Product } from "../types/catalog";
import type { Labels, SiteContent, StoreSettings } from "../types/content";
import type { StoreDataSource } from "./dataSource";
import { withPricing } from "../shared/pricing";

/**
 * Adapter for the future Hono REST API (Cloudflare Workers + D1 + R2).
 * One public, cacheable request returns everything the storefront needs:
 *   GET /api/catalog → { products, settings, content, labels }
 * (served from a precomputed snapshot, cached ~10–30 s at the Cloudflare edge;
 *  browsers revalidate on every visit, cheaply with ETag).
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
      let data: { products: Product[]; settings: StoreSettings; content: SiteContent; labels: Labels };
      try { data = await get("/api/catalog"); }
      catch { await new Promise((r) => setTimeout(r, 800)); data = await get("/api/catalog"); } // one retry
      return {
        ...data,
        // Older snapshots carry sizeDiscount / freeShippingMin instead of discount rules.
        settings: withPricing(data.settings) as StoreSettings,
        products: [...data.products].sort((a, b) => a.sortOrder - b.sortOrder),
      };
    },
  };
}
