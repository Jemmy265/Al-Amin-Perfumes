import { useCallback, useEffect, useRef, useState } from "react";

interface Options {
  /** The "reading band" of the viewport. The default is a thin strip ~40–45% down, well below the sticky header. */
  rootMargin?: string;
  /** How long a click keeps its section active while the page glides to it (Lenis takes ~1.15s). */
  lockMs?: number;
}

/** Scroll-spy: returns the id (from `ids`) of the section in the viewport's reading band.
 *  - Top of the page → the first id; bottom of the page → the last id (even if it's short).
 *  - When the band is over a section that isn't in `ids`, nothing is active.
 *  - `select(id)` marks a section active right away (e.g. on a nav click) and ignores the sections
 *    passed on the way there, until the scroll arrives, the user scrolls themselves, or `lockMs` passes. */
export function useActiveSection(ids: readonly string[], { rootMargin = "-40% 0px -55% 0px", lockMs = 1600 }: Options = {}) {
  const [active, setActive] = useState<string | null>(null);
  const lock = useRef<{ id: string; timer: number } | null>(null);
  const recompute = useRef<() => void>(() => {});
  const key = ids.join("|");

  useEffect(() => {
    const list = key ? key.split("|") : [];
    const els = list.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el != null);
    if (!els.length) return;

    const inBand = new Set<string>();
    let atTop = false;
    let atBottom = false;

    const pick = () => {
      if (atBottom) return els[els.length - 1].id;
      if (atTop) return els[0].id;
      return els.find((el) => inBand.has(el.id))?.id ?? null;
    };
    const update = () => {
      const next = pick();
      const l = lock.current;
      if (l) {
        if (next !== l.id) return; // still on the way to the clicked section
        release();
      }
      setActive(next);
    };
    const release = () => {
      if (!lock.current) return;
      window.clearTimeout(lock.current.timer);
      lock.current = null;
    };
    recompute.current = () => { release(); setActive(pick()); };

    // 1px markers at the very top and very bottom of the document (no effect on layout).
    const mark = (style: string) => {
      const m = document.createElement("div");
      m.setAttribute("aria-hidden", "true");
      m.style.cssText = `width:1px;height:1px;pointer-events:none;visibility:hidden;${style}`;
      return m;
    };
    const top = mark("position:absolute;top:0;left:0;");
    const bottom = mark("margin-top:-1px;");
    document.body.prepend(top);
    document.body.append(bottom);

    const band = new IntersectionObserver((entries) => {
      for (const e of entries) e.isIntersecting ? inBand.add(e.target.id) : inBand.delete(e.target.id);
      update();
    }, { rootMargin });
    els.forEach((el) => band.observe(el));

    const edges = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === top) atTop = e.isIntersecting;
        else atBottom = e.isIntersecting;
      }
      update();
    });
    edges.observe(top);
    edges.observe(bottom);

    // The user taking over the scroll cancels a click's lock.
    const takeOver = () => { if (lock.current) recompute.current(); };
    const opts = { passive: true } as const;
    window.addEventListener("wheel", takeOver, opts);
    window.addEventListener("touchstart", takeOver, opts);
    window.addEventListener("keydown", takeOver);

    return () => {
      band.disconnect();
      edges.disconnect();
      top.remove();
      bottom.remove();
      window.removeEventListener("wheel", takeOver);
      window.removeEventListener("touchstart", takeOver);
      window.removeEventListener("keydown", takeOver);
      release();
      recompute.current = () => {};
    };
  }, [key, rootMargin]);

  const select = useCallback((id: string) => {
    if (lock.current) window.clearTimeout(lock.current.timer);
    lock.current = { id, timer: window.setTimeout(() => recompute.current(), lockMs) };
    setActive(id);
  }, [lockMs]);

  return { active, select };
}
