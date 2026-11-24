/* Tiny hash router: #/products, #/products/new, #/products/<id>, #/order, #/tags, #/content.
   Pages can register a "leave guard" (unsaved changes) that every navigation respects. */
import { useEffect, useState } from "react";

export type Route =
  | { name: "overview" } | { name: "products" } | { name: "new" } | { name: "edit"; id: string }
  | { name: "order" } | { name: "tags" } | { name: "content" };

export function parse(hash: string): Route {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
  if (parts[0] === "products" && parts[1] === "new") return { name: "new" };
  if (parts[0] === "products" && parts[1]) return { name: "edit", id: parts[1] };
  if (parts[0] === "products") return { name: "products" };
  if (parts[0] === "order") return { name: "order" };
  if (parts[0] === "tags") return { name: "tags" };
  if (parts[0] === "content") return { name: "content" };
  return { name: "overview" };
}

export const href = (r: Route) =>
  r.name === "overview" ? "#/" : r.name === "new" ? "#/products/new" : r.name === "edit" ? `#/products/${encodeURIComponent(r.id)}` : `#/${r.name}`;

let guard: (() => boolean) | null = null;
/** Returns true when navigation may proceed. */
export const setLeaveGuard = (g: (() => boolean) | null) => { guard = g; };
const LEAVE_MSG = "عندك تغييرات لسه ما اتحفظتش. تخرج من غير حفظ؟";
export const confirmLeave = () => !guard || guard() || window.confirm(LEAVE_MSG);

export function navigate(r: Route | string) {
  const h = typeof r === "string" ? r : href(r);
  if (h === location.hash) return;
  if (!confirmLeave()) return;
  guard = null;
  location.hash = h;
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parse(location.hash));
  useEffect(() => {
    let last = location.hash;
    const on = () => {
      // Back button / typed URL: respect the leave guard by restoring the old hash.
      if (guard && !guard() && !window.confirm(LEAVE_MSG)) { history.replaceState(null, "", last); return; }
      guard = null;
      last = location.hash;
      setRoute(parse(location.hash));
      window.scrollTo({ top: 0 });
    };
    const beforeUnload = (e: BeforeUnloadEvent) => { if (guard && !guard()) e.preventDefault(); };
    window.addEventListener("hashchange", on);
    window.addEventListener("beforeunload", beforeUnload);
    return () => { window.removeEventListener("hashchange", on); window.removeEventListener("beforeunload", beforeUnload); };
  }, []);
  return route;
}
