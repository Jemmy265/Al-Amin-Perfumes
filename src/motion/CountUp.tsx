import { useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "./gsap";

/** Counts a stat like "+20" or "27" up from zero when it scrolls into view. */
export function CountUp({ value, delay = 0 }: { value: string; delay?: number }) {
  const ref = useRef<HTMLElement>(null);
  const m = value.match(/^(\D*)(\d+)(\D*)$/);

  useGSAP(() => {
    const el = ref.current;
    if (!el || !m || prefersReducedMotion()) return;
    const [, pre, num, post] = m;
    const obj = { n: 0 };
    el.textContent = `${pre}0${post}`;
    gsap.to(obj, {
      n: Number(num),
      duration: 1.6,
      delay,
      ease: "power2.out",
      snap: { n: 1 },
      onUpdate: () => { el.textContent = `${pre}${obj.n}${post}`; },
      scrollTrigger: { trigger: el, start: "top 95%", once: true },
    });
    return () => ScrollTrigger.getAll().forEach((st) => st.trigger === el && st.kill());
  }, { dependencies: [value] });

  return <b ref={ref}>{value}</b>;
}
