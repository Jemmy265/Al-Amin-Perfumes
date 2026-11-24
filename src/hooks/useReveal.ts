import { useEffect } from "react";

/** Subtle scroll-reveal for elements with [data-reveal]. Respects reduced motion. */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    document.documentElement.classList.add("js-reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    const safety = window.setTimeout(() => els.forEach((el) => el.classList.add("is-in")), 2500);
    return () => { io.disconnect(); window.clearTimeout(safety); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
