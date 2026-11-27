import { describe, expect, it } from "vitest";
import { addItem, EMPTY_CART, orderMessage, totals } from "../cart";
import { maxActivePercent, priceInfo, productBestDiscount, ruleStatus, startingPrice, storeDay } from "../pricing";
import { singleOrderMessage } from "../whatsapp";
import { LEGACY_SETTINGS as SEED_SETTINGS } from "../__fixtures__/legacy-data";
import { discountRuleInputSchema, pricingFromLegacy, withPricing } from "../../shared/pricing";
import type { Product } from "../../types/catalog";
import type { DiscountRule, StoreSettings } from "../../types/content";

const prod = (id: string, audience: Product["tags"]["audience"], prices: Record<number, number>): Product => ({
  id, name: id, nameEn: id, house: "H", label: "", isNew: false, family: "", year: null, perfumer: "", notes: {},
  tags: { audience, scents: ["fresh"], occasions: ["daily"], intensity: "medium" }, prices, image: "", sortOrder: 1,
});
const A = prod("a", "men", { 35: 300, 55: 500, 110: 1000 });
const B = prod("b", "women", { 35: 400, 110: 700 });
const byId = (id: string) => [A, B].find((p) => p.id === id);

const rule = (r: Partial<DiscountRule> & Pick<DiscountRule, "percent" | "scope">): DiscountRule =>
  ({ id: Math.random().toString(36).slice(2), name: "", enabled: true, startDate: null, endDate: null, ...r });
const settings = (discounts: DiscountRule[], freeShipping = { enabled: true, min: 1500 }): StoreSettings =>
  ({ ...SEED_SETTINGS, discounts, freeShipping });

// 2026-06-15 12:00 in Cairo
const NOW = new Date("2026-06-15T09:00:00Z");

describe("discount rules", () => {
  it("applies a 20% rule on everything, rounded to whole EGP", () => {
    const s = settings([rule({ percent: 20, scope: { kind: "all" }, name: "خصم الافتتاح" })]);
    expect(priceInfo(A, 110, s, NOW)).toMatchObject({ base: 1000, final: 800, discounted: true, percent: 20 });
    expect(priceInfo(prod("c", "men", { 35: 333 }), 35, s, NOW).final).toBe(266); // 266.4 → 266
    expect(productBestDiscount(B, s, NOW)?.rule?.name).toBe("خصم الافتتاح");
  });

  it("never stacks: the highest percentage wins", () => {
    const s = settings([
      rule({ percent: 20, scope: { kind: "all" } }),
      rule({ percent: 35, scope: { kind: "products", productIds: ["a"] }, name: "عرض مضاوي" }),
      rule({ percent: 10, scope: { kind: "sizes", sizes: [110] } }),
    ]);
    expect(priceInfo(A, 110, s, NOW)).toMatchObject({ final: 650, percent: 35 });
    expect(priceInfo(B, 110, s, NOW)).toMatchObject({ final: 560, percent: 20 });
  });

  it("matches each scope", () => {
    const s = (scope: DiscountRule["scope"]) => settings([rule({ percent: 50, scope })]);
    expect(priceInfo(A, 35, s({ kind: "category", category: "men" }), NOW).discounted).toBe(true);
    expect(priceInfo(B, 35, s({ kind: "category", category: "men" }), NOW).discounted).toBe(false);
    expect(priceInfo(A, 55, s({ kind: "sizes", sizes: [55] }), NOW).discounted).toBe(true);
    expect(priceInfo(A, 35, s({ kind: "sizes", sizes: [55] }), NOW).discounted).toBe(false);
    expect(priceInfo(A, 110, s({ kind: "variant", productId: "a", sizes: [110] }), NOW).discounted).toBe(true);
    expect(priceInfo(A, 35, s({ kind: "variant", productId: "a", sizes: [110] }), NOW).discounted).toBe(false);
    expect(priceInfo(B, 110, s({ kind: "variant", productId: "a", sizes: [110] }), NOW).discounted).toBe(false);
  });

  it("respects on/off and whole-day dates in Egypt time", () => {
    const r = (x: Partial<DiscountRule>) => rule({ percent: 20, scope: { kind: "all" }, ...x });
    expect(ruleStatus(r({ enabled: false }), NOW)).toBe("off");
    expect(ruleStatus(r({ startDate: "2026-06-16" }), NOW)).toBe("scheduled");
    expect(ruleStatus(r({ startDate: "2026-06-15", endDate: "2026-06-15" }), NOW)).toBe("active");
    expect(ruleStatus(r({ endDate: "2026-06-14" }), NOW)).toBe("ended");
    // 23:30 UTC on the 14th is already the 15th in Cairo (UTC+3 in summer).
    expect(storeDay(new Date("2026-06-14T23:30:00Z"))).toBe("2026-06-15");
    const scheduled = settings([r({ startDate: "2026-06-16" })]);
    expect(priceInfo(A, 110, scheduled, NOW).discounted).toBe(false);
    expect(priceInfo(A, 110, scheduled, new Date("2026-06-16T09:00:00Z")).final).toBe(800);
    expect(maxActivePercent(scheduled, NOW)).toBe(0);
  });

  it("uses the discounted smallest size as the starting price", () => {
    expect(startingPrice(A, settings([rule({ percent: 50, scope: { kind: "sizes", sizes: [35] } })]), NOW)).toBe(150);
  });

  it("validates rules (1–90%, scope, dates)", () => {
    expect(discountRuleInputSchema.safeParse({ percent: 0, scope: { kind: "all" } }).success).toBe(false);
    expect(discountRuleInputSchema.safeParse({ percent: 91, scope: { kind: "all" } }).success).toBe(false);
    expect(discountRuleInputSchema.safeParse({ percent: 20, scope: { kind: "products", productIds: [] } }).success).toBe(false);
    expect(discountRuleInputSchema.safeParse({ percent: 20, scope: { kind: "all" }, startDate: "2026-02-30" }).success).toBe(false);
    expect(discountRuleInputSchema.safeParse({ percent: 20, scope: { kind: "all" }, startDate: "2026-06-10", endDate: "2026-06-01" }).success).toBe(false);
    const ok = discountRuleInputSchema.safeParse({ percent: "20", scope: { kind: "sizes", sizes: [110, 35, 110] }, startDate: "" });
    expect(ok.success && ok.data).toMatchObject({ percent: 20, enabled: true, name: "", startDate: null, scope: { sizes: [35, 110] } });
  });
});

describe("free shipping after discounts", () => {
  it("is free when the subtotal AFTER discount reaches the threshold", () => {
    let c = addItem(EMPTY_CART, "a", 110, 2);               // 2000 before → 1600 after 20%
    c = { ...c, zone: "cairo" };
    const t = totals(c, byId, settings([rule({ percent: 20, scope: { kind: "all" } })]), NOW);
    expect(t).toMatchObject({ original: 2000, subtotal: 1600, savings: 400, free: true, shipping: 0, total: 1600 });
  });

  it("charges shipping when the discount takes the subtotal under the threshold", () => {
    let c = addItem(EMPTY_CART, "a", 110);                  // 1000
    c = addItem(c, "b", 110);                               // + 700 = 1700 before → 1360 after 20%
    c = { ...c, zone: "cairo" };
    const t = totals(c, byId, settings([rule({ percent: 20, scope: { kind: "all" } })]), NOW);
    expect(t).toMatchObject({ original: 1700, subtotal: 1360, free: false, shipping: 95, total: 1455, freeRemaining: 140 });
  });

  it("never gives free shipping when it is turned off", () => {
    const c = { ...addItem(EMPTY_CART, "a", 110, 5), zone: "cairo" };
    const t = totals(c, byId, settings([], { enabled: false, min: 1500 }), NOW);
    expect(t).toMatchObject({ free: false, shipping: 95, freeRemaining: null, freeProgress: null });
  });
});

describe("WhatsApp messages show what was applied", () => {
  it("lists discounted prices, the rule name, savings and shipping", () => {
    const s = settings([rule({ percent: 20, scope: { kind: "all" }, name: "خصم الافتتاح" })]);
    const c = { ...addItem(EMPTY_CART, "a", 110), zone: "cairo" };
    const m = orderMessage(c, byId, s, NOW);
    expect(m).toContain("110 مل × 1 = 800 ج.م (خصم الافتتاح -20% — بدل 1,000 ج.م)");
    expect(m).toContain("الخصم (خصم الافتتاح -20%): - 200 ج.م");
    expect(m).toContain("الشحن (القاهرة والجيزة): 95 ج.م");
    expect(m).toContain("إجمالي التوفير: 200 ج.م");
    expect(singleOrderMessage(A, 110, s, NOW)).toContain("السعر: 800 ج.م (خصم الافتتاح -20% — بدل 1,000 ج.م، وفّرت 200 ج.م)");
  });
});

describe("migration from the old single size discount", () => {
  it("turns sizeDiscount + freeShippingMin into a rule and a threshold", () => {
    expect(pricingFromLegacy({ sizeDiscount: { size: 110, percent: 20 }, freeShippingMin: 1500 })).toEqual({
      discounts: [{ id: "legacy-size", name: "", percent: 20, scope: { kind: "sizes", sizes: [110] }, enabled: true, startDate: null, endDate: null }],
      freeShipping: { enabled: true, min: 1500 },
    });
    expect(pricingFromLegacy({ sizeDiscount: { size: 110, percent: 0 } }).discounts).toEqual([]);
  });

  it("normalizes an old snapshot's settings and drops the old fields", () => {
    const old = { ...SEED_SETTINGS, discounts: undefined, freeShipping: undefined, sizeDiscount: { size: 110, percent: 20 }, freeShippingMin: 1500 };
    const s = withPricing(old) as StoreSettings & { sizeDiscount?: unknown };
    expect(s.sizeDiscount).toBeUndefined();
    expect(s.freeShipping).toEqual({ enabled: true, min: 1500 });
    expect(priceInfo(A, 110, s, NOW).final).toBe(800);
  });
});
