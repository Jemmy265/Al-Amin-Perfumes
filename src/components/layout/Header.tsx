import { useEffect, useRef, useState } from "react";
import { assetUrl } from "../../services/assets";
import { useCart } from "../../state/CartProvider";
import { useUI } from "../../state/UIProvider";
import { useStore } from "../../state/StoreProvider";
import { normalizeSections } from "../../shared/content";
import { Icon } from "../ui/Icon";
import { useActiveSection } from "../../hooks/useActiveSection";

const NAV = [
  { href: "#hero", label: "الرئيسية" },
  { href: "#products", label: "التشكيلة", section: "catalog" },
  { quiz: true, label: "اكتشف عطرك" },
  { href: "#reviews", label: "آراء العملاء", section: "reviews" },
  { href: "#faq", label: "أسئلة شائعة", section: "faq" },
  { href: "#contact", label: "تواصل معنا", section: "contact" },
] as const;

export function Header() {
  const { openCart, openQuiz } = useUI();
  const { totals, addedTick } = useCart();
  const { content } = useStore();
  const hidden = new Set(normalizeSections(content.sections).filter((s) => !s.visible).map((s) => s.id));
  const nav = NAV.filter((n) => !("section" in n) || !hidden.has(n.section));
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const badge = useRef<HTMLSpanElement>(null);
  const sectionIds = nav.flatMap((n) => ("href" in n ? [n.href.slice(1)] : []));
  const { active, select } = useActiveSection(sectionIds);

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
            {nav.map((n) => (
              <li key={n.label}>
                {"quiz" in n
                  ? <button type="button" className="nav-link" onClick={() => { setOpen(false); openQuiz(); }}>{n.label}</button>
                  : <a
                      className={`nav-link${active === n.href.slice(1) ? " is-active" : ""}`}
                      href={n.href}
                      aria-current={active === n.href.slice(1) ? "location" : undefined}
                      onClick={() => { setOpen(false); select(n.href.slice(1)); }}
                    >{n.label}</a>}
              </li>
            ))}
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
