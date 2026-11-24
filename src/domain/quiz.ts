/* "اكتشف عطرك" — questions, options and scoring are the original site's,
   unchanged. Matching runs against each product's tags (ProductTags). */
import type { Audience, Intensity, Occasion, Product, ScentFamily } from "../types/catalog";

export type QuizAnswers = {
  who: Audience | "any";
  use: Occasion;
  scent: ScentFamily;
  strength: Intensity;
};
export type QuizKey = keyof QuizAnswers;

export interface QuizOption { v: string; label: string; icon: string }
export interface QuizQuestion { key: QuizKey; q: string; options: QuizOption[] }

export const QUIZ: QuizQuestion[] = [
  { key: "who", q: "العطر ده لمين؟", options: [
    { v: "men", label: "لراجل", icon: "man" },
    { v: "women", label: "لست", icon: "woman" },
    { v: "any", label: "هدية / مش فارقة", icon: "gift" },
  ]},
  { key: "use", q: "هتستخدمه إمتى؟", options: [
    { v: "daily", label: "يومي وشغل", icon: "sun" },
    { v: "evening", label: "خروجات وسهرات", icon: "moon" },
    { v: "occasion", label: "مناسبات", icon: "sparkle" },
  ]},
  { key: "scent", q: "بتحب الريحة تبقى…", options: [
    { v: "fresh", label: "فريش ومنعشة", icon: "wave" },
    { v: "sweet", label: "حلوة وفانيليا", icon: "vanilla" },
    { v: "woody", label: "خشبية وعود", icon: "tree" },
    { v: "fruity", label: "فواكه وورد", icon: "flower" },
  ]},
  { key: "strength", q: "عايزها تبقى…", options: [
    { v: "light", label: "هادية", icon: "leaf" },
    { v: "medium", label: "متوسطة", icon: "halfMoon" },
    { v: "strong", label: "قوية وفوّاحة", icon: "flame" },
  ]},
];

export const QUIZ_RESULT_COUNT = 3;
const LEVEL: Record<Intensity, number> = { light: 1, medium: 2, strong: 3 };

/** Score breakdown (original weights):
 *  audience  — hard filter (unisex always passes; "any" passes all), +1 exact match
 *  scent     — +5 if it is the product's primary family, +4 if secondary
 *  occasion  — +2
 *  intensity — +2 exact, +1 one level away
 *  best seller — +0.5 tie-breaker
 *  Ties keep catalog order (stable sort). */
export function scoreProduct(p: Product, a: QuizAnswers, bestSellers: string[]): number {
  const t = p.tags;
  let s = 0;
  if (t.scents.includes(a.scent)) s += t.scents[0] === a.scent ? 5 : 4;
  if (t.occasions.includes(a.use)) s += 2;
  const d = Math.abs((LEVEL[t.intensity] || 2) - (LEVEL[a.strength] || 2));
  s += d === 0 ? 2 : d === 1 ? 1 : 0;
  if (a.who !== "any" && t.audience === a.who) s += 1;
  if (bestSellers.includes(p.id)) s += 0.5;
  return s;
}

export function quizResults(products: Product[], a: QuizAnswers, bestSellers: string[], count = QUIZ_RESULT_COUNT): Product[] {
  return products
    .filter((p) => a.who === "any" || p.tags.audience === a.who || p.tags.audience === "unisex")
    .map((p) => ({ p, s: scoreProduct(p, a, bestSellers) }))
    .sort((x, y) => y.s - x.s)
    .slice(0, count)
    .map((o) => o.p);
}
