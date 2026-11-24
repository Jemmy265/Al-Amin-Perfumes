import type { Product, SizeMl } from "../types/catalog";
import type { StoreSettings } from "../types/content";

export interface PriceInfo { base: number; final: number; discounted: boolean }

/** Same rule as the original site: a % discount on one bottle size. */
export function priceInfo(p: Product, size: SizeMl, settings: Pick<StoreSettings, "sizeDiscount">): PriceInfo {
  const base = p.prices[size];
  const d = settings.sizeDiscount;
  const off = !!(d && d.percent && Number(size) === d.size);
  const final = off ? Math.round((base * (100 - d.percent)) / 100) : base;
  return { base, final, discounted: off };
}

export const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
