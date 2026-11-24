import { useEffect, useRef, useState } from "react";
import { assetUrl } from "../../services/assets";
import { useCart } from "../../state/CartProvider";
import { useUI } from "../../state/UIProvider";
import { Icon } from "../ui/Icon";

const NAV = [
  { href: "#hero", label: "الرئيسية" },
  { href: "#products", label: "التشكيلة" },
  { quiz: true, label: "اكتشف عطرك" },
  { href: "#reviews", label: "آراء العملاء" },
  { href: "#faq", label: "أسئلة شائعة" },
  { href: "#contact", label: "تواصل معنا" },
] as const;

export function Header() {
  const { openCart, openQuiz } = useUI();
  const { totals, addedTick } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const badge = useRef<HTMLSpanElement>(null);

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
        <a href="#hero" className="brand" aria-label="الأمين للعطور — الرئيسية">
          <img src={assetUrl("assets/logo-light.png")} alt="الأمين للعطور" width={472} height={567} />
        </a>

        <nav className={`main-nav${open ? " is-open" : ""}`} id="main-nav" aria-label="القائمة الرئيسية">
          <ul>
            {NAV.map((n) => (
              <li key={n.label}>
                {"quiz" in n
                  ? <button type="button" className="nav-link nav-link--quiz" onClick={() => { setOpen(false); openQuiz(); }}>{n.label}</button>
                  : <a className="nav-link" href={n.href} onClick={() => setOpen(false)}>{n.label}</a>}
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
