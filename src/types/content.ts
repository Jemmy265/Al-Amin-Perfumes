/* Editable site content and commercial settings. In the static build this
   comes from src/data/seed/content.ts; later it is served by the Hono API
   (D1) and edited from the admin dashboard. */
import type { Audience, Intensity, Occasion, ScentFamily, SizeMl } from "./catalog";

export interface ShippingZone { id: string; label: string; fee: number }

/** What a discount rule applies to (one simple choice in the admin). */
export type DiscountScope =
  | { kind: "all" }
  | { kind: "category"; category: Audience }
  | { kind: "products"; productIds: string[] }
  | { kind: "sizes"; sizes: SizeMl[] }
  | { kind: "variant"; productId: string; sizes: SizeMl[] };

/** A percentage discount. Rules never stack: the highest active % on a bottle wins. */
export interface DiscountRule {
  id: string;
  /** Optional badge shown on the site, e.g. "خصم الافتتاح". */
  name: string;
  percent: number;
  scope: DiscountScope;
  enabled: boolean;
  /** Whole days in Egypt time (YYYY-MM-DD), inclusive. null = no limit. */
  startDate: string | null;
  endDate: string | null;
}

/** One global threshold, checked against the subtotal after discounts. */
export interface FreeShipping { enabled: boolean; min: number }

/** Discounts + free shipping: stored together (site_kv "pricing"), edited in "الخصومات والشحن". */
export interface PricingSettings { discounts: DiscountRule[]; freeShipping: FreeShipping }
export interface SocialLinks { instagram: string; facebook: string; tiktok: string }

export interface StoreSettings {
  whatsappNumber: string;
  generalWhatsappMessage: string;
  siteUrl: string;
  currency: string;
  sizes: SizeMl[];
  shippingZones: ShippingZone[];
  discounts: DiscountRule[];
  freeShipping: FreeShipping;
  /** Product ids, in rank order. */
  bestSellers: string[];
  phone: string;
  phoneDisplay: string;
  email: string;
  social: SocialLinks;
}

export interface Labels {
  audience: Record<Audience, string>;
  scents: Record<ScentFamily, { label: string; emoji: string }>;
  occasions: Record<Occasion, string>;
  intensity: Record<Intensity, string>;
}

/** Simple rich text: **bold**, {{quiz|link text}} opens the quiz, \n = line break. */
export type RichText = string;

export interface SectionHead { kicker: string; title: string; text?: string }
export interface Review { text: string; name: string; source: "facebook" | "whatsapp" | "message" }
export interface FaqItem { q: string; a: RichText }
/** Homepage sections whose visibility and order the owner controls (the hero is always first). */
export type SectionId = "best" | "quizCta" | "catalog" | "reviews" | "about" | "faq" | "contact";
export interface SectionSetting { id: SectionId; visible: boolean }

export interface Benefit { icon: "star" | "drop" | "truck" | "chat"; title: string; text: string }

export interface SiteContent {
  /** Order + visibility of homepage sections. Missing in older data → default order, all visible. */
  sections?: SectionSetting[];
  announcements: RichText[];
  hero: {
    slogan: string;
    tagline: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    image: string;
    stats: { value: string; label: string }[];
  };
  benefitsTitle: string;
  benefits: Benefit[];
  bestSellers: SectionHead;
  quizCta: SectionHead & { button: string };
  catalog: SectionHead & { searchPlaceholder: string; noResults: string };
  reviews: SectionHead;
  reviewItems: Review[];
  about: SectionHead & { cta: string; images: string[] };
  faq: SectionHead;
  faqItems: FaqItem[];
  contact: SectionHead & { whatsappCta: string; deliveryNote: string };
  footer: { brandName: string; tagline: string; copyright: string };
}
