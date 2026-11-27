/* Cart rules (totals, discounts, free shipping, WhatsApp order message).
   All prices come from domain/pricing. Pure functions; React state lives in
   state/CartProvider. A future checkout endpoint can reuse these. */
import type { Product, SizeMl } from "../types/catalog";
import type { ShippingZone, StoreSettings } from "../types/content";
import { discountLabel, fmt, priceInfo, shippingState } from "./pricing";

export interface CartItem { id: string; size: SizeMl; qty: number }
export interface CartState { items: CartItem[]; zone: string; name: string; address: string }

export const EMPTY_CART: CartState = { items: [], zone: "", name: "", address: "" };

export function addItem(s: CartState, id: string, size: SizeMl, qty = 1): CartState {
  const exists = s.items.some((x) => x.id === id && x.size === size);
  const items = exists
    ? s.items.map((x) => (x.id === id && x.size === size ? { ...x, qty: x.qty + qty } : x))
    : [...s.items, { id, size, qty }];
  return { ...s, items };
}

export function setQty(s: CartState, id: string, size: SizeMl, qty: number): CartState {
  return {
    ...s,
    items: s.items.map((x) => (x.id === id && x.size === size ? { ...x, qty: Math.max(0, qty) } : x)).filter((x) => x.qty > 0),
  };
}

/** Drop items whose product or size no longer exists (e.g. after a catalog update). */
export function sanitize(s: CartState, byId: (id: string) => Product | undefined): CartState {
  return { ...s, items: (s.items || []).filter((it) => (byId(it.id)?.prices[Number(it.size)] ?? 0) > 0 && it.qty > 0) };
}

export interface CartTotals {
  subtotal: number; original: number; savings: number; count: number;
  zone: ShippingZone | undefined; free: boolean; shipping: number | null; total: number;
  /** Free shipping enabled and not reached yet: amount still missing (after discounts). */
  freeRemaining: number | null;
  /** 0–100, null when free shipping is off. */
  freeProgress: number | null;
  /** Names / percentages of the discounts applied in this cart (for the order message). */
  applied: string[];
}

export function totals(s: CartState, byId: (id: string) => Product | undefined, settings: StoreSettings, now: Date = new Date()): CartTotals {
  let subtotal = 0, original = 0, count = 0;
  const applied = new Set<string>();
  for (const it of s.items) {
    const p = byId(it.id);
    if (!p) continue;
    const info = priceInfo(p, it.size, settings, now);
    subtotal += info.final * it.qty;
    original += info.base * it.qty;
    count += it.qty;
    if (info.discounted) applied.add(discountLabel(info));
  }
  const zone = settings.shippingZones.find((z) => z.id === s.zone);
  const ship = shippingState(subtotal, settings.freeShipping);
  const free = !!count && ship.free;
  const shipping = !count ? 0 : free ? 0 : zone ? zone.fee : null;
  return {
    subtotal, original, savings: original - subtotal, count, zone, free, shipping, total: subtotal + (shipping || 0),
    freeRemaining: count ? ship.remaining : null, freeProgress: ship.progress, applied: [...applied],
  };
}

export function orderMessage(s: CartState, byId: (id: string) => Product | undefined, settings: StoreSettings, now: Date = new Date()): string {
  const t = totals(s, byId, settings, now);
  const C = settings.currency;
  const lines = ["مرحبًا، أرغب في طلب الآتي من الأمين للعطور:", ""];
  s.items.forEach((it, i) => {
    const p = byId(it.id);
    if (!p) return;
    const info = priceInfo(p, it.size, settings, now);
    const off = info.discounted ? ` (${discountLabel(info)} — بدل ${fmt(info.base * it.qty)} ${C})` : "";
    lines.push(`${i + 1}) ${p.name} (${p.nameEn}) — ${it.size} مل × ${it.qty} = ${fmt(info.final * it.qty)} ${C}${off}`);
  });
  lines.push("");
  if (t.savings > 0) {
    lines.push(`قبل الخصم: ${fmt(t.original)} ${C}`);
    lines.push(`الخصم (${t.applied.join("، ")}): - ${fmt(t.savings)} ${C}`);
  }
  lines.push(`المجموع: ${fmt(t.subtotal)} ${C}`);
  if (t.free) lines.push("الشحن: مجاني 🎉");
  else if (t.zone) lines.push(`الشحن (${t.zone.label}): ${fmt(t.shipping ?? 0)} ${C}`);
  else lines.push("الشحن: حسب المحافظة");
  lines.push(`الإجمالي: ${fmt(t.total)} ${C}${!t.free && !t.zone ? " + الشحن" : ""}`);
  if (t.savings > 0) lines.push(`إجمالي التوفير: ${fmt(t.savings)} ${C}`);
  const name = s.name.trim(), address = s.address.trim();
  if (name || address) lines.push("");
  if (name) lines.push(`الاسم: ${name}`);
  if (address) lines.push(`العنوان: ${address}`);
  return lines.join("\n");
}
