/* The single pricing module: discounts, free shipping and their wording.
   Used by the storefront, the cart, WhatsApp messages and the admin previews.
   Pure functions with no browser APIs, so the Worker can import it as-is.
   Dates are evaluated at call time (Egypt time), so a scheduled rule starts and
   ends on time even when the catalog itself is served from a cache. */
import type { Audience, Product, SizeMl } from "../types/catalog";
import type { DiscountRule, DiscountScope, FreeShipping, StoreSettings } from "../types/content";

type Rules = Pick<StoreSettings, "discounts">;
/** What a rule needs to know about a product (a storefront Product fits). */
export type Priceable = Pick<Product, "id" | "prices"> & { tags: { audience: Audience } };

export interface PriceInfo {
  base: number;
  final: number;
  discounted: boolean;
  /** The winning rule's percentage (0 when not discounted). */
  percent: number;
  rule: DiscountRule | null;
}

export const STORE_TIME_ZONE = "Africa/Cairo";

const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: STORE_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" });
/** Today's date in Egypt as YYYY-MM-DD. */
export const storeDay = (now: Date = new Date()) => dayFmt.format(now);

export type RuleStatus = "active" | "off" | "scheduled" | "ended";

export function ruleStatus(r: DiscountRule, now: Date = new Date()): RuleStatus {
  if (!r.enabled) return "off";
  const today = storeDay(now);
  if (r.endDate && today > r.endDate) return "ended";
  if (r.startDate && today < r.startDate) return "scheduled";
  return "active";
}

export function scopeMatches(scope: DiscountScope, p: Priceable, size: SizeMl): boolean {
  switch (scope.kind) {
    case "all": return true;
    case "category": return p.tags.audience === scope.category;
    case "products": return scope.productIds.includes(p.id);
    case "sizes": return scope.sizes.includes(Number(size));
    case "variant": return scope.productId === p.id && scope.sizes.includes(Number(size));
  }
}

export const discountedPrice = (base: number, percent: number) => Math.round((base * (100 - percent)) / 100);

/** Highest active rule for one bottle (no stacking). Ties keep the earlier rule in the list. */
export function bestRule(p: Priceable, size: SizeMl, settings: Rules, now: Date = new Date()): DiscountRule | null {
  let best: DiscountRule | null = null;
  for (const r of settings.discounts ?? []) {
    if (ruleStatus(r, now) !== "active" || !scopeMatches(r.scope, p, size)) continue;
    if (!best || r.percent > best.percent) best = r;
  }
  return best;
}

export function priceInfo(p: Priceable, size: SizeMl, settings: Rules, now: Date = new Date()): PriceInfo {
  const base = p.prices[size] ?? 0;
  const rule = base > 0 ? bestRule(p, size, settings, now) : null;
  if (!rule) return { base, final: base, discounted: false, percent: 0, rule: null };
  return { base, final: discountedPrice(base, rule.percent), discounted: true, percent: rule.percent, rule };
}

/** Sizes this product is sold in (ascending). Each product has its own sizes. */
export const productSizes = (p: Pick<Product, "prices">): SizeMl[] => Object.keys(p.prices).map(Number).filter((n) => p.prices[n] > 0).sort((a, b) => a - b);

/** Price of the smallest size — the "يبدأ من" price. */
export const startingPrice = (p: Priceable, settings: Rules, now: Date = new Date()) => {
  const s = productSizes(p)[0];
  return s === undefined ? 0 : priceInfo(p, s, settings, now).final;
};

/** The biggest discount on any size of this product (for the badge on its photo). */
export function productBestDiscount(p: Priceable, settings: Rules, now: Date = new Date()): PriceInfo | null {
  let best: PriceInfo | null = null;
  for (const s of productSizes(p)) {
    const i = priceInfo(p, s, settings, now);
    if (i.discounted && (!best || i.percent > best.percent)) best = i;
  }
  return best;
}

/** Highest % among rules active right now — the {discount} placeholder (0 = none). */
export const maxActivePercent = (settings: Rules, now: Date = new Date()) =>
  (settings.discounts ?? []).reduce((m, r) => (ruleStatus(r, now) === "active" ? Math.max(m, r.percent) : m), 0);

/* ------------------------------ Shipping ------------------------------ */

export interface ShippingState {
  free: boolean;
  /** How much more (after discounts) would unlock free shipping; null when free shipping is off or already reached. */
  remaining: number | null;
  /** 0–100 for the progress bar (null when free shipping is off). */
  progress: number | null;
}

export function shippingState(subtotal: number, fs: FreeShipping): ShippingState {
  if (!fs.enabled) return { free: false, remaining: null, progress: null };
  if (subtotal >= fs.min) return { free: true, remaining: null, progress: 100 };
  return { free: false, remaining: fs.min - subtotal, progress: fs.min > 0 ? Math.min(100, (subtotal / fs.min) * 100) : 100 };
}

/* ------------------------------- Wording ------------------------------ */

export const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/** "-20%" */
export const percentBadge = (percent: number) => `-${percent}%`;

/** Short text for a winning rule, e.g. "خصم الافتتاح −20%" or "خصم 20%". */
export const discountLabel = (info: Pick<PriceInfo, "percent" | "rule">) =>
  info.rule?.name ? `${info.rule.name} ${percentBadge(info.percent)}` : `خصم ${info.percent}%`;
