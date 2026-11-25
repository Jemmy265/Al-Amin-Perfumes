/* Single place where GSAP plugins are registered. */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);
gsap.defaults({ ease: "power3.out", duration: 0.9 });

// ScrollTrigger measures trigger positions once, when each animation is created.
// When the page height changes later (a shorter catalog page, web fonts swapping
// in, lazy images), every trigger below is left at the wrong scroll offset and
// those sections never reveal. Re-measure whenever the page height changes;
// width changes already refresh through the window resize event.
if (typeof window !== "undefined" && typeof ResizeObserver !== "undefined") {
  let lastHeight = 0;
  let timer = 0;
  new ResizeObserver(([entry]) => {
    const height = Math.round(entry.contentRect.height);
    if (height === lastHeight) return;
    lastHeight = height;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
  }).observe(document.body);
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, useGSAP };
