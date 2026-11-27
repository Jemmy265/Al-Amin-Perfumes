import { describe, expect, it } from "vitest";
import { addItem, EMPTY_CART, orderMessage, setQty, totals } from "../cart";
import { LEGACY_PRODUCTS as SEED_PRODUCTS, LEGACY_SETTINGS as SEED_SETTINGS } from "../__fixtures__/legacy-data";

const byId = (id: string) => SEED_PRODUCTS.find((p) => p.id === id);

describe("cart rules (same as the original site)", () => {
  it("applies the 20% discount on 110 ml and charges zone shipping", () => {
    let s = addItem(EMPTY_CART, "madawi", 110);          // 650 → 520
    s = addItem(s, "nautica-voyage", 35, 2);             // 240 × 2
    s = { ...s, zone: "cairo" };
    const t = totals(s, byId, SEED_SETTINGS);
    expect(t.subtotal).toBe(520 + 480);
    expect(t.savings).toBe(130);
    expect(t.shipping).toBe(95);
    expect(t.total).toBe(1095);
  });

  it("gives free shipping from 1,500 EGP after discount", () => {
    let s = addItem(EMPTY_CART, "megamare", 110, 2);     // 640 × 2 = 1280
    s = addItem(s, "yara", 35);                           // 250 → 1530
    const t = totals(s, byId, SEED_SETTINGS);
    expect(t.free).toBe(true);
    expect(t.shipping).toBe(0);
    expect(orderMessage(s, byId, SEED_SETTINGS)).toContain("الشحن: مجاني");
  });

  it("removes an item when its quantity reaches zero", () => {
    const s = setQty(addItem(EMPTY_CART, "yara", 55), "yara", 55, 0);
    expect(s.items).toHaveLength(0);
  });
});

describe("per-product sizes", () => {
  it("drops cart items whose size the product no longer sells", async () => {
    const { sanitize } = await import("../cart");
    const s = sanitize({ ...EMPTY_CART, items: [{ id: "yara", size: 35, qty: 1 }, { id: "yara", size: 75, qty: 1 }, { id: "gone", size: 35, qty: 1 }] }, byId);
    expect(s.items).toEqual([{ id: "yara", size: 35, qty: 1 }]);
  });
  it("derives sizes and the starting price from each product", async () => {
    const { productSizes, startingPrice } = await import("../pricing");
    const p = { ...byId("madawi")!, prices: { 110: 650, 50: 300 } };
    expect(productSizes(p)).toEqual([50, 110]);
    expect(startingPrice(p, SEED_SETTINGS)).toBe(300);
  });
});
