/* Editable site content and commercial settings. In the static build this
   comes from src/data/seed/content.ts; later it is served by the Hono API
   (D1) and edited from the admin dashboard. */
import type { Audience, Intensity, Occasion, ScentFamily, SizeMl } from "./catalog";

export interface ShippingZone { id: string; label: string; fee: number }
export interface SizeDiscount { size: SizeMl; percent: number }
export interface SocialLinks { instagram: string; facebook: string; tiktok: string }

export interface StoreSettings {
  whatsappNumber: string;
  generalWhatsappMessage: string;
  siteUrl: string;
  currency: string;
  sizes: SizeMl[];
  shippingZones: ShippingZone[];
  freeShippingMin: number;
  sizeDiscount: SizeDiscount;
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
