import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "./gsap";

type ScrollTo = (target: string | HTMLElement | number, opts?: { immediate?: boolean }) => void;
const Ctx = createContext<ScrollTo>(() => {});

/** Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
 *  - In-page links (#products, #faq…) glide with Lenis; #perfume/<id> links are left to the router.
 *  - Lenis pauses while a dialog (cart / quiz / perfume page) has locked the page.
 *  - Disabled for users who prefer reduced motion (native scrolling is used). */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: false });
    lenisRef.current = lenis;
    document.documentElement.style.scrollBehavior = "auto";

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Stop smooth scrolling while a modal sheet locks the page.
    const html = document.documentElement;
    const mo = new MutationObserver(() => (html.classList.contains("no-scroll") ? lenis.stop() : lenis.start()));
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => {
      mo.disconnect();
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  const scrollTo = useCallback<ScrollTo>((target, opts) => {
    const lenis = lenisRef.current;
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (el == null) return;
    if (lenis) {
      // No offset: Lenis already honours the CSS scroll-padding-top that clears the sticky header.
      lenis.scrollTo(el as HTMLElement | number, { immediate: opts?.immediate });
    } else if (typeof el === "number") {
      window.scrollTo({ top: el });
    } else {
      el.scrollIntoView({ behavior: opts?.immediate ? "auto" : "smooth" });
    }
  }, []);

  // Smooth in-page anchor links (but not the #perfume/<id> product routes).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute("href")!;
      if (hash.length < 2 || hash.startsWith("#perfume/")) return;
      const el = document.querySelector<HTMLElement>(hash);
      if (!el) return;
      e.preventDefault();
      history.pushState(null, "", hash);
      // If a dialog is closing, let it unlock the page first.
      window.setTimeout(() => scrollTo(el), document.documentElement.classList.contains("no-scroll") ? 240 : 0);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [scrollTo]);

  return <Ctx.Provider value={scrollTo}>{children}</Ctx.Provider>;
}

export const useScrollTo = () => useContext(Ctx);
