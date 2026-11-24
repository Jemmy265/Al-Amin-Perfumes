/* Shared by the admin dashboard (form validation) and the Worker API
   (server-side validation). One source of truth for product rules.
   Tag values come from the storefront quiz taxonomy — not a new system. */
import { z } from "zod";
import type { Audience, Intensity, Occasion, Product, ScentFamily } from "../types/catalog";

export const AUDIENCES = ["men", "women", "unisex"] as const satisfies readonly Audience[];
export const SCENTS = ["fresh", "sweet", "woody", "fruity"] as const satisfies readonly ScentFamily[];
export const OCCASIONS = ["daily", "evening", "occasion"] as const satisfies readonly Occasion[];
export const INTENSITIES = ["light", "medium", "strong"] as const satisfies readonly Intensity[];
export const STATUSES = ["published", "draft"] as const;
export type ProductStatus = (typeof STATUSES)[number];

/** Product photo keys: uploads in R2 (products/…) or the original bundled photos (assets/products/…). */
export const IMAGE_KEY_RE = /^(products|assets\/products)\/[a-z0-9][a-z0-9._-]{0,120}\.(jpe?g|png|webp)$/;
export const PRODUCT_ID_RE = /^[a-z0-9][a-z0-9-]{1,79}$/;

const text = (max: number, label: string) =>
  z.string({ error: `${label} غير صالح` }).trim().max(max, `${label} طويل جدًا (الحد ${max} حرف)`);

const scentEnum = z.enum(SCENTS, { error: "نوع ريحة غير معروف" });
const occasionEnum = z.enum(OCCASIONS, { error: "استخدام غير معروف" });

export const variantSchema = z.object({
  sizeMl: z.coerce.number({ error: "اكتب الحجم بالأرقام" })
    .int("الحجم لازم يكون رقم صحيح").min(1, "الحجم لازم يكون أكبر من صفر").max(1000, "الحجم كبير جدًا"),
  price: z.coerce.number({ error: "اكتب السعر بالأرقام" })
    .int("السعر لازم يكون رقم صحيح بالجنيه").min(1, "السعر لازم يكون أكبر من صفر").max(1_000_000, "السعر كبير جدًا"),
});

export const productInputSchema = z.object({
  name: text(120, "الاسم العربي"),
  nameEn: text(120, "الاسم الإنجليزي"),
  house: text(80, "الماركة").min(1, "اكتب الماركة (مستوحى من)"),
  category: z.enum(AUDIENCES, { error: "اختر التصنيف" }),
  status: z.enum(STATUSES, { error: "اختر حالة النشر" }),
  isFeatured: z.boolean().default(false),
  label: text(30, "الوسم").default(""),
  isNew: z.boolean().default(false),
  family: text(80, "العائلة العطرية").default(""),
  year: z.coerce.number().int().min(1800, "السنة غير صحيحة").max(2200, "السنة غير صحيحة").nullable().default(null),
  perfumer: text(120, "اسم العطّار").default(""),
  notes: z.object({
    top: text(600, "الافتتاحية").default(""),
    heart: text(600, "القلب").default(""),
    base: text(600, "القاعدة").default(""),
    all: text(800, "المكوّنات").default(""),
  }).default({ top: "", heart: "", base: "", all: "" }),
  variants: z.array(variantSchema).min(1, "أضف حجمًا وسعرًا واحدًا على الأقل").max(8, "عدد الأحجام كبير جدًا"),
  /** Ordered: the first family is the primary one (weighted higher by the quiz). */
  scents: z.array(scentEnum).max(SCENTS.length).default([]),
  occasions: z.array(occasionEnum).max(OCCASIONS.length).default([]),
  intensity: z.enum(INTENSITIES, { error: "اختر قوة العطر" }),
  imageKey: z.string().regex(IMAGE_KEY_RE, "الصورة غير صالحة").nullable().default(null),
}).superRefine((p, ctx) => {
  for (const [path, message] of Object.entries(crossFieldErrors(p))) ctx.addIssue({ code: "custom", path: [path], message });
});

/** Rules that span several fields. Exported so the form can show them together
    with the basic field errors (Zod only runs refinements once fields are valid). */
export function crossFieldErrors(p: Partial<Pick<ProductData, "name" | "nameEn" | "status" | "imageKey" | "scents" | "occasions">> & { variants?: { sizeMl: unknown }[] }): Record<string, string> {
  const e: Record<string, string> = {};
  if (!p.name?.trim() && !p.nameEn?.trim()) e.name = "اكتب اسم العطر بالعربي أو بالإنجليزي";
  const sizes = (p.variants ?? []).map((v) => Number(v.sizeMl)).filter(Boolean);
  if (new Set(sizes).size !== sizes.length) e.variants = "فيه حجم متكرر — كل حجم يتكتب مرة واحدة";
  const scents = p.scents ?? [], occasions = p.occasions ?? [];
  if (new Set(scents).size !== scents.length) e.scents = "نوع ريحة متكرر";
  if (new Set(occasions).size !== occasions.length) e.occasions = "استخدام متكرر";
  // Drafts may be incomplete; anything shown to customers must be complete.
  if (p.status === "published") {
    if (!p.imageKey) e.imageKey = "ارفع صورة العطر قبل النشر";
    if (!scents.length) e.scents ??= "اختر نوع ريحة واحد على الأقل (للاختبار)";
    if (!occasions.length) e.occasions ??= "اختر استخدام واحد على الأقل (للاختبار)";
  }
  return e;
}

export type ProductInput = z.input<typeof productInputSchema>;
export type ProductData = z.output<typeof productInputSchema>;

export const tagsInputSchema = z.object({
  category: z.enum(AUDIENCES, { error: "اختر التصنيف" }),
  scents: z.array(scentEnum).min(1, "اختر نوع ريحة واحد على الأقل").max(SCENTS.length),
  occasions: z.array(occasionEnum).min(1, "اختر استخدام واحد على الأقل").max(OCCASIONS.length),
  intensity: z.enum(INTENSITIES, { error: "اختر قوة العطر" }),
});

export const reorderSchema = z.object({
  ids: z.array(z.string().regex(PRODUCT_ID_RE)).max(2000),
});

export const loginSchema = z.object({
  username: z.string().trim().min(1, "اكتب اسم المستخدم").max(100),
  password: z.string().min(1, "اكتب كلمة المرور").max(200),
});

/** Product as the admin API returns it. */
export interface AdminProduct extends ProductData {
  id: string;
  sortOrder: number;
  featuredRank: number | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

/** First Zod issue per field path → Arabic message, for forms and API errors. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

/** Admin product → storefront Product (the shape the storefront already uses). */
export function toStorefrontProduct(p: AdminProduct): Product {
  return {
    id: p.id,
    name: p.name || p.nameEn,
    nameEn: p.nameEn,
    house: p.house,
    label: p.label,
    isNew: p.isNew,
    tags: { audience: p.category, scents: p.scents, occasions: p.occasions, intensity: p.intensity },
    family: p.family,
    year: p.year,
    perfumer: p.perfumer,
    notes: Object.fromEntries(Object.entries(p.notes).filter(([, v]) => v)),
    prices: Object.fromEntries([...p.variants].sort((a, b) => a.sizeMl - b.sizeMl).map((v) => [v.sizeMl, v.price])),
    image: p.imageUrl ?? "",
    sortOrder: p.sortOrder,
  };
}

/** Readable id from the English (or Arabic) name; uniqueness is checked by the API. */
export function slugify(name: string): string {
  const s = name.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
  return s.length >= 2 ? s : "";
}
