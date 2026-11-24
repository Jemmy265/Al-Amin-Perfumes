import { SEED_PRODUCTS } from "../data/seed/products";
import { LABELS, SEED_CONTENT, SEED_SETTINGS } from "../data/seed/content";
import type { StoreDataSource } from "./dataSource";

/** Bundled data — used today, and as the offline fallback later. */
export const staticDataSource: StoreDataSource = {
  async load() {
    return {
      products: [...SEED_PRODUCTS].sort((a, b) => a.sortOrder - b.sortOrder),
      settings: SEED_SETTINGS,
      content: SEED_CONTENT,
      labels: LABELS,
    };
  },
};
