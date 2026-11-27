import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { dataSource, type StoreData } from "../services";
import type { Product } from "../types/catalog";
import { storeDay } from "../domain/pricing";

interface StoreCtx extends StoreData {
  byId: (id: string) => Product | undefined;
  /** Today in Egypt (YYYY-MM-DD). Changes at midnight so scheduled discounts start/end on time. */
  today: string;
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const [data, setData] = useState<StoreData | null>(null);
  useEffect(() => {
    let alive = true;
    dataSource.load().then((d) => alive && setData(d));
    return () => { alive = false; };
  }, []);

  // Discount dates are evaluated at render time; re-render everything when the day changes.
  const [today, setToday] = useState(() => storeDay());
  useEffect(() => {
    const t = window.setInterval(() => setToday(storeDay()), 60_000);
    return () => window.clearInterval(t);
  }, []);

  const value = useMemo<StoreCtx | null>(() => {
    if (!data) return null;
    const map = new Map(data.products.map((p) => [p.id, p]));
    return { ...data, byId: (id) => map.get(id), today };
  }, [data, today]);

  if (!value) return <>{fallback ?? null}</>;
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): StoreCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside <StoreProvider>");
  return v;
}
