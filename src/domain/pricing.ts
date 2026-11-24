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

/** Sizes this product is sold in (ascending). Each product has its own sizes. */
export const productSizes = (p: Product): SizeMl[] => Object.keys(p.prices).map(Number).filter((n) => p.prices[n] > 0).sort((a, b) => a - b);

/** Price of the smallest size — the "يبدأ من" price. */
export const startingPrice = (p: Product, settings: Pick<StoreSettings, "sizeDiscount">) => {
  const s = productSizes(p)[0];
  return s === undefined ? 0 : priceInfo(p, s, settings).final;
};

export const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
