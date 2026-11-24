import type { Product } from "../types/catalog";

/** "عطور ممكن تعجبك كمان" — original rule, unchanged. */
export function similarTo(p: Product, products: Product[], bestSellers: string[]): Product[] {
  const a = p.tags;
  return products
    .filter((x) => x.id !== p.id && (x.tags.audience === a.audience || x.tags.audience === "unisex" || a.audience === "unisex"))
    .map((x) => ({
      x,
      s: x.tags.scents.filter((s) => a.scents.includes(s)).length * 2 + (x.tags.intensity === a.intensity ? 1 : 0) + (bestSellers.includes(x.id) ? 0.5 : 0),
    }))
    .filter((o) => o.s >= 2)
    .sort((m, n) => n.s - m.s)
    .slice(0, 4)
    .map((o) => o.x);
}
