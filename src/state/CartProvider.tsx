import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import * as cart from "../domain/cart";
import type { SizeMl } from "../types/catalog";
import { useStore } from "./StoreProvider";

/** Same storage key and shape as the original site, so existing carts survive the redesign. */
const KEY = "alamin-cart-v1";

interface CartCtx {
  state: cart.CartState;
  totals: cart.CartTotals;
  message: string;
  add: (id: string, size: SizeMl, qty?: number) => void;
  setQty: (id: string, size: SizeMl, qty: number) => void;
  clear: () => void;
  setField: (field: "zone" | "name" | "address", value: string) => void;
  /** Increments on every add — used for the badge bump animation. */
  addedTick: number;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { byId, settings } = useStore();
  const [state, setState] = useState<cart.CartState>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return cart.sanitize({ ...cart.EMPTY_CART, ...JSON.parse(raw) }, byId);
    } catch { /* storage unavailable — cart still works for this session */ }
    return cart.EMPTY_CART;
  });
  const [addedTick, setAddedTick] = useState(0);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  const add = useCallback((id: string, size: SizeMl, qty = 1) => {
    setState((s) => cart.addItem(s, id, Number(size), qty));
    setAddedTick((n) => n + 1);
  }, []);
  const setQty = useCallback((id: string, size: SizeMl, qty: number) => setState((s) => cart.setQty(s, id, size, qty)), []);
  const clear = useCallback(() => setState((s) => ({ ...s, items: [] })), []);
  const setField = useCallback((field: "zone" | "name" | "address", value: string) => setState((s) => ({ ...s, [field]: value })), []);

  const value = useMemo<CartCtx>(() => ({
    state,
    totals: cart.totals(state, byId, settings),
    message: cart.orderMessage(state, byId, settings),
    add, setQty, clear, setField, addedTick,
  }), [state, byId, settings, add, setQty, clear, setField, addedTick]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used inside <CartProvider>");
  return v;
}
