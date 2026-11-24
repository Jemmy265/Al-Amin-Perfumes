import { useCart } from "../../state/CartProvider";
import { useUI } from "../../state/UIProvider";
import type { Product, SizeMl } from "../../types/catalog";
import { createElement, Fragment } from "react";

export function useAddToCart() {
  const { add } = useCart();
  const { showToast, openCart } = useUI();
  return (p: Product, size: SizeMl) => {
    add(p.id, size);
    showToast(
      createElement(Fragment, null, "اتضاف ", createElement("b", null, p.name), ` (${size} مل) للسلة`),
      { label: "عرض السلة", onClick: openCart },
    );
  };
}
