/* Discount rules & free shipping — validation shared by the admin form and
   the Worker, plus the one-time move from the old single size discount. */
import { z } from "zod";
import type { DiscountRule, FreeShipping, PricingSettings } from "../types/content";
import { AUDIENCES, PRODUCT_ID_RE } from "./product";

export const MAX_DISCOUNT_RULES = 50;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

const isRealDay = (s: string) => {
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
};
const day = (label: string) => z.string().trim().regex(DAY_RE, `${label} غير صحيح`).refine(isRealDay, `${label} غير صحيح`);
/** Optional date: "" / null / missing → null. */
const optionalDay = (label: string) => z.preprocess((v) => (v === "" || v === undefined ? null : v), day(label).nullable());

const size = z.coerce.number().int().min(1).max(1000);
const sizes = z.array(size).min(1, "اختار حجم واحد على الأقل").max(30)
  .transform((l) => [...new Set(l)].sort((a, b) => a - b));
const productId = z.string().regex(PRODUCT_ID_RE, "عطر غير صالح");

export const discountScopeSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("all") }),
  z.object({ kind: z.literal("category"), category: z.enum(AUDIENCES, { error: "اختار التصنيف" }) }),
  z.object({ kind: z.literal("products"), productIds: z.array(productId).min(1, "اختار عطر واحد على الأقل").max(500).transform((l) => [...new Set(l)]) }),
  z.object({ kind: z.literal("sizes"), sizes }),
  z.object({ kind: z.literal("variant"), productId: z.string({ error: "اختار العطر" }).regex(PRODUCT_ID_RE, "اختار العطر"), sizes }),
], { error: "اختار الخصم هيتطبق على إيه" });

export const discountRuleInputSchema = z.object({
  name: z.string().trim().max(40, "اسم الخصم: الحد 40 حرف").default(""),
  percent: z.coerce.number({ error: "اكتب نسبة الخصم" }).int("نسبة الخصم رقم صحيح").min(1, "النسبة من 1 لـ 90").max(90, "النسبة من 1 لـ 90"),
  scope: discountScopeSchema,
  enabled: z.boolean().default(true),
  startDate: optionalDay("تاريخ البداية"),
  endDate: optionalDay("تاريخ النهاية"),
}).refine((r) => !r.startDate || !r.endDate || r.endDate >= r.startDate, { message: "تاريخ النهاية لازم يكون بعد البداية أو نفس اليوم", path: ["endDate"] });
export type DiscountRuleInput = z.input<typeof discountRuleInputSchema>;
export type DiscountRuleData = z.output<typeof discountRuleInputSchema>;

export const freeShippingSchema = z.object({
  enabled: z.boolean(),
  min: z.coerce.number({ error: "اكتب المبلغ" }).int("المبلغ رقم صحيح").min(0, "المبلغ مينفعش يكون سالب").max(1_000_000, "المبلغ كبير جدًا"),
});

const storedRuleSchema = z.object({ id: z.string().min(1).max(40) }).and(discountRuleInputSchema);

/** Stored document (site_kv "pricing"). Invalid rules are dropped instead of breaking the site. */
export function parsePricing(raw: unknown): PricingSettings | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as { discounts?: unknown; freeShipping?: unknown };
  if (!Array.isArray(r.discounts)) return null;
  const discounts = r.discounts.flatMap((d) => {
    const p = storedRuleSchema.safeParse(d);
    return p.success ? [p.data as DiscountRule] : [];
  });
  const fs = freeShippingSchema.safeParse(r.freeShipping);
  return { discounts, freeShipping: fs.success ? fs.data : { enabled: false, min: 0 } };
}

/** Settings saved before discount rules existed: { sizeDiscount: {size, percent}, freeShippingMin }. */
export function pricingFromLegacy(settings: unknown): PricingSettings {
  const s = (settings ?? {}) as { sizeDiscount?: { size?: unknown; percent?: unknown }; freeShippingMin?: unknown };
  const percent = Number(s.sizeDiscount?.percent ?? 0);
  const sizeMl = Number(s.sizeDiscount?.size ?? 0);
  const discounts: DiscountRule[] = percent >= 1 && percent <= 90 && sizeMl >= 1
    ? [{ id: "legacy-size", name: "", percent: Math.round(percent), scope: { kind: "sizes", sizes: [sizeMl] }, enabled: true, startDate: null, endDate: null }]
    : [];
  const min = Number(s.freeShippingMin);
  const freeShipping: FreeShipping = Number.isFinite(min) && min >= 0 ? { enabled: true, min: Math.round(min) } : { enabled: false, min: 0 };
  return { discounts, freeShipping };
}

/** Settings as the storefront uses them: rules + free shipping always present, legacy fields removed. */
export function withPricing<T extends object>(settings: T, pricing?: unknown): Omit<T, "sizeDiscount" | "freeShippingMin"> & PricingSettings {
  const { sizeDiscount: _d, freeShippingMin: _f, ...rest } = settings as T & { sizeDiscount?: unknown; freeShippingMin?: unknown };
  const own = settings as Partial<PricingSettings>;
  const p = parsePricing(pricing ?? (Array.isArray(own.discounts) ? own : null)) ?? pricingFromLegacy(settings);
  return { ...rest, ...p } as Omit<T, "sizeDiscount" | "freeShippingMin"> & PricingSettings;
}
