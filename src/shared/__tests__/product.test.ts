/* The same rules run in the admin form and in the Worker API. */
import { describe, expect, it } from "vitest";
import { LEGACY_PRODUCTS as SEED_PRODUCTS } from "../../domain/__fixtures__/legacy-data";
import { crossFieldErrors, fieldErrors, productInputSchema, slugify, toStorefrontProduct, type AdminProduct } from "../product";

const valid = {
  name: "عود", nameEn: "Oud", house: "House", category: "unisex", status: "published", intensity: "strong",
  variants: [{ sizeMl: 35, price: 300 }, { sizeMl: 110, price: 600 }],
  scents: ["woody"], occasions: ["evening"], imageKey: "products/abc.webp",
};

describe("product validation", () => {
  it("accepts a complete product and coerces numeric strings", () => {
    const r = productInputSchema.safeParse({ ...valid, variants: [{ sizeMl: "55", price: "450" }] });
    expect(r.success).toBe(true);
    expect(r.data!.variants[0]).toEqual({ sizeMl: 55, price: 450 });
  });

  it("requires image and quiz tags only when publishing", () => {
    const pub = productInputSchema.safeParse({ ...valid, imageKey: null, scents: [], occasions: [] });
    expect(Object.keys(fieldErrors(pub.error!)).sort()).toEqual(["imageKey", "occasions", "scents"]);
    const draft = productInputSchema.safeParse({ ...valid, status: "draft", imageKey: null, scents: [], occasions: [] });
    expect(draft.success).toBe(true);
  });

  it("rejects duplicate sizes, bad prices, unknown tags and foreign image keys — in Arabic", () => {
    const r = productInputSchema.safeParse({ ...valid, variants: [{ sizeMl: 35, price: 0 }], scents: ["floral"], imageKey: "../../etc/passwd" });
    const e = fieldErrors(r.error!);
    expect(e["variants.0.price"]).toMatch(/السعر/);
    expect(e["scents.0"]).toBe("نوع ريحة غير معروف");
    expect(e.imageKey).toBe("الصورة غير صالحة");
    expect(crossFieldErrors({ variants: [{ sizeMl: 35 }, { sizeMl: 35 }] }).variants).toMatch(/متكرر/);
  });

  it("needs at least one of the Arabic / English names", () => {
    expect(crossFieldErrors({ name: " ", nameEn: "" }).name).toBeDefined();
    expect(crossFieldErrors({ name: "", nameEn: "Oud" }).name).toBeUndefined();
  });
});

describe("storefront mapping", () => {
  it("turns an admin product back into the storefront's Product shape", () => {
    const seed = SEED_PRODUCTS.find((p) => p.id === "madawi")!;
    const admin: AdminProduct = {
      id: seed.id, name: seed.name, nameEn: seed.nameEn, house: seed.house, label: seed.label, isNew: seed.isNew,
      category: seed.tags.audience, status: "published", isFeatured: true, featuredRank: 1, sortOrder: seed.sortOrder,
      family: seed.family, year: seed.year, perfumer: seed.perfumer,
      notes: { top: seed.notes.top ?? "", heart: seed.notes.heart ?? "", base: seed.notes.base ?? "", all: "" },
      variants: Object.entries(seed.prices).map(([s, p]) => ({ sizeMl: Number(s), price: p })),
      scents: seed.tags.scents, occasions: seed.tags.occasions, intensity: seed.tags.intensity,
      imageKey: "products/madawi.jpg", imageUrl: "/images/products/madawi.jpg", createdAt: "", updatedAt: "",
    };
    expect(toStorefrontProduct(admin)).toEqual({ ...seed, image: "/images/products/madawi.jpg" });
  });

  it("makes readable, safe ids", () => {
    expect(slugify("Black XS L’Exces for Him")).toBe("black-xs-l-exces-for-him");
    expect(slugify("Matière Première")).toBe("matiere-premiere");
    expect(slugify("عود")).toBe("");
  });
});
