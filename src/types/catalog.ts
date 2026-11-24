/* Domain types shared by the storefront, the data layer and (later) the
   Hono API + admin dashboard. Field names map 1:1 to future D1 columns. */

export type Audience = "men" | "women" | "unisex";
export type ScentFamily = "fresh" | "sweet" | "woody" | "fruity";
export type Occasion = "daily" | "evening" | "occasion";
export type Intensity = "light" | "medium" | "strong";
export type SizeMl = number;

/** Tags the perfume-discovery quiz matches against. Managed from the admin. */
export interface ProductTags {
  audience: Audience;
  /** Ordered: the first family is the product's primary family (weighted higher by the quiz). */
  scents: ScentFamily[];
  occasions: Occasion[];
  intensity: Intensity;
}

export interface ProductNotes {
  top?: string;
  heart?: string;
  base?: string;
  /** Used when the notes are not split into top / heart / base. */
  all?: string;
}

export interface Product {
  id: string;
  /** Arabic display name. */
  name: string;
  /** Latin name of the original fragrance. */
  nameEn: string;
  /** The original fragrance house the perfume is inspired by. */
  house: string;
  /** Optional category label shown as a chip (e.g. "نيش", "ديزاينر"). */
  label: string;
  isNew: boolean;
  tags: ProductTags;
  /** Olfactive family in Arabic (e.g. "شرقي - فانيليا"). */
  family: string;
  year: number | null;
  perfumer: string;
  notes: ProductNotes;
  /** Price per size in EGP, before any size discount. */
  prices: Record<SizeMl, number>;
  /** Relative path (bundled asset) or absolute URL (e.g. Cloudflare R2). */
  image: string;
  /** Display order in the catalog. Also the quiz tie-breaker. */
  sortOrder: number;
}
