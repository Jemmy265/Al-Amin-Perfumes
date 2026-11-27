import { useEffect, useRef, useState } from "react";
import { assetUrl } from "../../services/assets";
import { useCart } from "../../state/CartProvider";
import { useUI } from "../../state/UIProvider";
import { useStore } from "../../state/StoreProvider";
import { normalizeSections } from "../../shared/content";
import { Icon } from "../ui/Icon";
import type { SectionId } from "../../types/content";
import { useActiveSection } from "../../hooks/useActiveSection";

/** One entry per homepage section that has a navbar link. `target` is the section's element id.
    The quiz entry sits at the position of the «اكتشف عطرك» section but opens the quiz. */
const NAV: Record<"hero" | SectionId, { label: string; target: string; quiz?: true } | undefined> = {
  hero: { label: "الرئيسية", target: "hero" },
  best: undefined, // part of «الرئيسية» (see below)
  catalog: { label: "التشكيلة", target: "products" },
  quizCta: { label: "اكتشف عطرك", target: "discover", quiz: true },
  reviews: { label: "آراء العملاء", target: "reviews" },
  about: undefined,
  faq: { label: "أسئلة شائعة", target: "faq" },
  contact: { label: "تواصل معنا", target: "contact" },
};

export function Header() {
  const { openCart, openQuiz } = useUI();
  const { totals, addedTick } = useCart();
  const { content } = useStore();
  // Same order as the sections on the page (set from the admin); hidden sections have no link.
  const order: ("hero" | SectionId)[] = ["hero", ...normalizeSections(content.sections).filter((s) => s.visible).map((s) => s.id)];
  const nav = order.flatMap((id) => (NAV[id] ? [NAV[id]] : []));
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const badge = useRef<HTMLSpanElement>(null);
  // «الرئيسية» covers the hero AND «الأكثر طلبًا» when that section comes right after it:
  // it stays highlighted until the end of the best sellers.
  const bestJoinsHome = order[1] === "best";
  // In page order (the hook treats the first id as the top of the page and the last as the bottom).
  const sectionIds = nav.flatMap((n) => (n.target === "hero" && bestJoinsHome ? ["hero", "best"] : [n.target]));
  const { active: spied, select } = useActiveSection(sectionIds);
  const active = spied === "best" ? "hero" : spied;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 10);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const el = badge.current;
    if (!el || !addedTick) return;
    el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump");
  }, [addedTick]);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="container header-inner">
        <a href="#hero" className="brand" aria-label="الأمين للعطور — الرئيسية" onClick={() => select("hero")}>
          <img src={assetUrl("assets/logo-light.png")} alt="الأمين للعطور" width={472} height={567} />
        </a>

        <nav className={`main-nav${open ? " is-open" : ""}`} id="main-nav" aria-label="القائمة الرئيسية">
          <ul>
            {nav.map((n) => {
              const on = active === n.target;
              const cls = `nav-link${on ? " is-active" : ""}`;
              return (
                <li key={n.target}>
                  {n.quiz
                    ? <button type="button" className={cls} aria-current={on ? "location" : undefined} onClick={() => { setOpen(false); openQuiz(); }}>{n.label}</button>
                    : <a className={cls} href={`#${n.target}`} aria-current={on ? "location" : undefined}
                        onClick={() => { setOpen(false); select(n.target); }}>{n.label}</a>}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="header-actions">
          <button type="button" className="cart-btn" onClick={openCart} aria-label="سلة المشتريات">
            <Icon name="bag" />
            <span className="cart-btn-label">السلة</span>
            {totals.count > 0 && <span ref={badge} className="cart-count">{totals.count}</span>}
          </button>
          <button
            type="button"
            className={`nav-toggle${open ? " is-open" : ""}`}
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={open}
            aria-controls="main-nav"
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
