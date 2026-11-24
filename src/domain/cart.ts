/* Cart rules — identical to the original site (totals, free shipping,
   size discount, WhatsApp order message). Pure functions; React state lives
   in state/CartProvider. A future checkout endpoint can reuse these. */
import type { Product, SizeMl } from "../types/catalog";
import type { ShippingZone, StoreSettings } from "../types/content";
import { fmt, priceInfo } from "./pricing";

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
}

export function totals(s: CartState, byId: (id: string) => Product | undefined, settings: StoreSettings): CartTotals {
  let subtotal = 0, original = 0, count = 0;
  for (const it of s.items) {
    const p = byId(it.id);
    if (!p) continue;
    const { base, final } = priceInfo(p, it.size, settings);
    subtotal += final * it.qty;
    original += base * it.qty;
    count += it.qty;
  }
  const zone = settings.shippingZones.find((z) => z.id === s.zone);
  const free = subtotal >= settings.freeShippingMin;
  const shipping = !count ? 0 : free ? 0 : zone ? zone.fee : null;
  return { subtotal, original, savings: original - subtotal, count, zone, free, shipping, total: subtotal + (shipping || 0) };
}

export function orderMessage(s: CartState, byId: (id: string) => Product | undefined, settings: StoreSettings): string {
  const t = totals(s, byId, settings);
  const C = settings.currency;
  const lines = ["مرحبًا، أرغب في طلب الآتي من الأمين للعطور:", ""];
  s.items.forEach((it, i) => {
    const p = byId(it.id);
    if (!p) return;
    const { final } = priceInfo(p, it.size, settings);
    lines.push(`${i + 1}) ${p.name} (${p.nameEn}) — ${it.size} مل × ${it.qty} = ${fmt(final * it.qty)} ${C}`);
  });
  lines.push("");
  if (t.savings > 0) lines.push(`الخصم: ${fmt(t.savings)} ${C}`);
  lines.push(`المجموع: ${fmt(t.subtotal)} ${C}`);
  if (t.free) lines.push("الشحن: مجاني 🎉");
  else if (t.zone) lines.push(`الشحن (${t.zone.label}): ${fmt(t.shipping ?? 0)} ${C}`);
  else lines.push("الشحن: حسب المحافظة");
  lines.push(`الإجمالي: ${fmt(t.total)} ${C}${!t.free && !t.zone ? " + الشحن" : ""}`);
  const name = s.name.trim(), address = s.address.trim();
  if (name || address) lines.push("");
  if (name) lines.push(`الاسم: ${name}`);
  if (address) lines.push(`العنوان: ${address}`);
  return lines.join("\n");
}
