import { describe, expect, it } from "vitest";
import { addItem, EMPTY_CART, orderMessage, setQty, totals } from "../cart";
import { SEED_PRODUCTS } from "../../data/seed/products";
import { SEED_SETTINGS } from "../../data/seed/content";

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
