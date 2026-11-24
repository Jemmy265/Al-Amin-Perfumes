/* Admin product list cache shared by all pages. */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { AdminProduct } from "../../shared/product";
import { api, ApiError } from "./api";

interface Store {
  products: AdminProduct[] | null;
  error: string | null;
  reload: () => Promise<void>;
  upsert: (p: AdminProduct) => void;
  remove: (id: string) => void;
}
const Ctx = createContext<Store | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<AdminProduct[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try { setError(null); setProducts(await api.products()); }
    catch (e) { setError(e instanceof ApiError ? e.message : "تعذّر تحميل العطور"); }
  }, []);
  useEffect(() => { void reload(); }, [reload]);

  const upsert = useCallback((p: AdminProduct) => setProducts((list) => {
    if (!list) return [p];
    const i = list.findIndex((x) => x.id === p.id);
    const next = i < 0 ? [p, ...list] : list.map((x) => (x.id === p.id ? p : x));
    return next.sort((a, b) => a.sortOrder - b.sortOrder);
  }), []);
  const remove = useCallback((id: string) => setProducts((list) => list?.filter((x) => x.id !== id) ?? null), []);

  return <Ctx.Provider value={{ products, error, reload, upsert, remove }}>{children}</Ctx.Provider>;
}

export function useProducts() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useProducts outside ProductsProvider");
  return v;
}
