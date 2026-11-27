/* Site content & store settings — validation shared by the admin editor and
   the Worker API (one source of truth, like src/shared/product.ts). */
import { z } from "zod";
import type { SectionId, SectionSetting, SiteContent, StoreSettings } from "../types/content";

export const SECTION_IDS = ["best", "quizCta", "catalog", "reviews", "about", "faq", "contact"] as const satisfies readonly SectionId[];
export const SECTION_LABELS: Record<SectionId, string> = {
  best: "الأكثر طلبًا", quizCta: "اكتشف عطرك", catalog: "التشكيلة", reviews: "آراء العملاء",
  about: "من نحن", faq: "الأسئلة الشائعة", contact: "تواصل معنا",
};
export const DEFAULT_SECTIONS: SectionSetting[] = SECTION_IDS.map((id) => ({ id, visible: true }));

/** Fills in section settings for data saved before they existed, and repairs gaps. */
export function normalizeSections(list: SectionSetting[] | undefined): SectionSetting[] {
  const seen = new Set<SectionId>();
  const out = (list ?? []).filter((s) => SECTION_IDS.includes(s.id) && !seen.has(s.id) && seen.add(s.id));
  for (const id of SECTION_IDS) if (!seen.has(id)) out.push({ id, visible: true });
  return out;
}

/** Bundled images (assets/…) or uploaded ones served from R2 (/images/products|site/…). */
export const SITE_IMAGE_RE = /^(assets\/[a-z0-9/_.-]+\.(jpe?g|png|webp)|\/images\/(products|site)\/[a-z0-9._-]+\.(jpe?g|png|webp))$/;

const t = (max: number, label: string, required = true) => {
  const s = z.string({ error: `${label} غير صالح` }).trim().max(max, `${label}: الحد ${max} حرف`);
  return required ? s.min(1, `اكتب ${label}`) : s;
};
const image = z.string().regex(SITE_IMAGE_RE, "الصورة غير صالحة — ارفعها تاني");

const head = (label: string) => z.object({
  kicker: t(60, `العنوان الصغير (${label})`),
  title: t(120, `عنوان ${label}`),
  text: t(400, `نص ${label}`, false).optional(),
});

export const contentSchema = z.object({
  sections: z.array(z.object({ id: z.enum(SECTION_IDS), visible: z.boolean() })).length(SECTION_IDS.length)
    .refine((l) => new Set(l.map((s) => s.id)).size === l.length, "ترتيب الأقسام غير صالح"),
  announcements: z.array(t(160, "نص العرض")).min(1, "اكتب عرض واحد على الأقل").max(6, "الحد 6 عروض"),
  hero: z.object({
    slogan: t(80, "الشعار"),
    tagline: t(80, "السطر تحت الصورة"),
    titleLine1: t(80, "العنوان الرئيسي"),
    titleLine2: t(80, "السطر التاني للعنوان", false),
    description: t(400, "النص التعريفي"),
    primaryCta: t(40, "زرار التصفح"),
    secondaryCta: t(40, "زرار اكتشف عطرك"),
    image,
    stats: z.array(z.object({ value: t(12, "الرقم"), label: t(30, "وصف الرقم") })).max(4, "الحد 4 أرقام"),
  }),
  benefitsTitle: t(80, "عنوان المميزات"),
  benefits: z.array(z.object({
    icon: z.enum(["star", "drop", "truck", "chat"]),
    title: t(60, "عنوان الميزة"),
    text: t(120, "وصف الميزة"),
  })).length(4),
  bestSellers: head("الأكثر طلبًا"),
  quizCta: head("اكتشف عطرك").extend({ button: t(40, "زرار الاختبار") }),
  catalog: head("التشكيلة").extend({ searchPlaceholder: t(80, "نص خانة البحث"), noResults: t(160, "رسالة عدم وجود نتائج") }),
  reviews: head("آراء العملاء"),
  reviewItems: z.array(z.object({
    text: t(800, "نص الرأي"),
    name: t(60, "اسم العميل", false),
    source: z.enum(["facebook", "whatsapp", "message"]),
  })).max(60, "الحد 60 رأي"),
  about: head("من نحن").extend({ cta: t(40, "زرار من نحن"), images: z.array(image).length(3) }),
  faq: head("الأسئلة الشائعة"),
  faqItems: z.array(z.object({ q: t(200, "السؤال"), a: t(1200, "الإجابة") })).max(40, "الحد 40 سؤال"),
  contact: head("تواصل معنا").extend({ whatsappCta: t(40, "زرار واتساب"), deliveryNote: t(80, "ملاحظة التوصيل") }),
  footer: z.object({ brandName: t(60, "اسم المتجر"), tagline: t(160, "جملة الفوتر"), copyright: t(200, "نص الحقوق") }),
}) satisfies z.ZodType<SiteContent>;

const httpsUrl = (label: string) => z.string().trim().url(`${label}: رابط غير صحيح`).startsWith("https://", `${label}: الرابط لازم يبدأ بـ https://`);

export const settingsSchema = z.object({
  whatsappNumber: z.string().trim().regex(/^[1-9]\d{7,14}$/, "رقم الواتساب بالصيغة الدولية بدون + وبدون صفر في الأول (مثال 201006747034)"),
  generalWhatsappMessage: t(300, "رسالة الواتساب"),
  shippingZones: z.array(z.object({
    id: z.string().regex(/^[a-z0-9-]{2,40}$/),
    label: t(60, "اسم المنطقة"),
    fee: z.coerce.number({ error: "اكتب سعر الشحن" }).int("سعر الشحن رقم صحيح").min(0).max(100_000),
  })).min(1, "لازم منطقة شحن واحدة على الأقل").max(12)
    .refine((l) => new Set(l.map((z) => z.id)).size === l.length, "منطقة شحن متكررة"),
  phone: z.string().trim().regex(/^\+?\d{8,15}$/, "رقم التليفون أرقام بس، ممكن يبدأ بـ +"),
  phoneDisplay: t(30, "رقم التليفون كما يظهر"),
  email: z.string().trim().email("البريد الإلكتروني غير صحيح"),
  social: z.object({ instagram: httpsUrl("إنستجرام"), facebook: httpsUrl("فيسبوك"), tiktok: httpsUrl("تيك توك") }),
});
export type EditableSettings = z.output<typeof settingsSchema>;

/** Settings fields the editor does not touch (kept from the stored document). */
export const SERVER_SETTINGS_KEYS = ["siteUrl", "currency", "sizes", "bestSellers"] as const satisfies readonly (keyof StoreSettings)[];
/** Old settings fields now stored with the discount rules (site_kv "pricing"); dropped on the next settings save. */
export const LEGACY_PRICING_KEYS = ["sizeDiscount", "freeShippingMin"] as const;

/** R2 keys referenced by a content document (for cleaning up replaced uploads). */
export const siteImageKeys = (c: Pick<SiteContent, "hero" | "about">) =>
  [c.hero.image, ...c.about.images].filter((p) => p.startsWith("/images/site/")).map((p) => p.replace(/^\/images\//, ""));
