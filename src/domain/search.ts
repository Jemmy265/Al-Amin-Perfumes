import type { Product } from "../types/catalog";
import type { Labels } from "../types/content";

/** Arabic-aware normalisation (alef forms, ta marbuta, ڤ/چ, diacritics). */
export function normalize(str: string | null | undefined): string {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[ً-ٰٟـ]/g, "")
    .replace(/[إأآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
    .replace(/ڤ/g, "ف").replace(/چ/g, "ج")
    .replace(/[’'`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function searchText(p: Product, labels: Labels): string {
  const n = p.notes;
  const scents = p.tags.scents.map((s) => labels.scents[s]?.label).join(" ");
  return normalize(
    [p.name, p.nameEn, p.house, p.family, labels.audience[p.tags.audience], p.label, scents, n.top, n.heart, n.base, n.all].join(" "),
  );
}

export function matchesSearch(haystack: string, query: string): boolean {
  const terms = normalize(query).split(" ").filter(Boolean);
  return terms.every((t) => haystack.includes(t));
}
