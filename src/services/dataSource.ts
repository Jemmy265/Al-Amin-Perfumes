import type { Product } from "../types/catalog";
import type { Labels, SiteContent, StoreSettings } from "../types/content";

/** Everything the storefront needs to render. */
export interface StoreData {
  products: Product[];
  settings: StoreSettings;
  content: SiteContent;
  labels: Labels;
}

/**
 * The single seam between UI and data. Components never import seed files
 * directly — they read from StoreProvider, which loads through this interface.
 * Swap the implementation (static ↔ Hono API) without touching components.
 */
export interface StoreDataSource {
  load(): Promise<StoreData>;
}
