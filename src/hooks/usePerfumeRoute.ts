import { useCallback, useEffect, useState } from "react";

/** Keeps the original shareable links working: …/#perfume/<id> opens that
    perfume's page. (These links are already used in posts and chats.) */
const RE = /^#perfume\/([\w-]+)/;
const read = () => location.hash.match(RE)?.[1] ?? null;

export function usePerfumeRoute() {
  const [id, setId] = useState<string | null>(read);
  useEffect(() => {
    const on = () => setId(read());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  const close = useCallback(() => {
    if (RE.test(location.hash)) history.replaceState(null, "", location.pathname + location.search + "#products");
    setId(null);
  }, []);
  return { id, close };
}
