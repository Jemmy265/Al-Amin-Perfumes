import { LABELS } from "../../data/seed/content";
import type { AdminProduct } from "../../shared/product";

export const money = (n: number) => `${Math.round(n).toLocaleString("en-US")} ج.م`;
export const displayName = (p: Pick<AdminProduct, "name" | "nameEn">) => p.name || p.nameEn;
export const minPrice = (p: AdminProduct) => (p.variants.length ? Math.min(...p.variants.map((v) => v.price)) : 0);
export const categoryLabel = (c: AdminProduct["category"]) => LABELS.audience[c];
export const sizesText = (p: AdminProduct) => [...p.variants].sort((a, b) => a.sizeMl - b.sizeMl).map((v) => `${v.sizeMl}`).join(" / ") + " مل";
export { LABELS };
