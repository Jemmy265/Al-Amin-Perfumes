import type { Product, SizeMl } from "../types/catalog";
import type { StoreSettings } from "../types/content";
import { discountLabel, fmt, priceInfo } from "./pricing";

export const waLink = (number: string, message: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

export function singleOrderMessage(p: Product, size: SizeMl, settings: StoreSettings, now: Date = new Date()): string {
  const info = priceInfo(p, size, settings, now);
  const C = settings.currency;
  return [
    "مرحبًا، أرغب في طلب العطر التالي من الأمين للعطور:",
    `العطر: ${p.name} (${p.nameEn}) — مستوحى من ${p.house}`,
    `الحجم: ${size} مل`,
    `السعر: ${fmt(info.final)} ${C}${info.discounted ? ` (${discountLabel(info)} — بدل ${fmt(info.base)} ${C}، وفّرت ${fmt(info.base - info.final)} ${C})` : ""}`,
  ].join("\n");
}

export const perfumeUrl = (p: Product, settings: StoreSettings) => `${settings.siteUrl}#perfume/${p.id}`;

export const shareMessage = (p: Product, settings: StoreSettings) =>
  `${p.name} (${p.nameEn}) من الأمين للعطور 👇\n${perfumeUrl(p, settings)}`;
