import type { ReactNode } from "react";
import { Icon } from "../../components/ui/Icon";
import { api } from "../lib/api";
import { confirmLeave, href, navigate, type Route } from "../lib/router";
import { useProducts } from "../lib/store";
import { useFeedback } from "./feedback";

const LOGO = "../assets/logo-mark-light.png";

const NAV: { route: Route; label: string; icon: string; short: string }[] = [
  { route: { name: "overview" }, label: "نظرة عامة", short: "الرئيسية", icon: "home" },
  { route: { name: "products" }, label: "العطور", short: "العطور", icon: "grid" },
  { route: { name: "order" }, label: "ترتيب العرض", short: "الترتيب", icon: "sort" },
  { route: { name: "tags" }, label: "وسوم اختبار العطر", short: "الاختبار", icon: "tag" },
  { route: { name: "content" }, label: "محتوى الصفحة الرئيسية", short: "المحتوى", icon: "doc" },
];

const TITLES: Record<Route["name"], string> = {
  overview: "نظرة عامة", products: "العطور", new: "إضافة عطر", edit: "تعديل عطر",
  order: "ترتيب العرض", tags: "وسوم اختبار العطر", content: "محتوى الصفحة الرئيسية",
};

const active = (route: Route, item: Route) =>
  route.name === item.name || (item.name === "products" && (route.name === "edit" || route.name === "new"));

export function Shell({ route, onLogout, children }: { route: Route; onLogout: () => void; children: ReactNode }) {
  const { products } = useProducts();
  const { confirm } = useFeedback();

  const logout = async () => {
    if (!confirmLeave()) return;
    if (!(await confirm({ title: "تسجيل الخروج؟", confirmLabel: "خروج" }))) return;
    try { await api.logout(); } finally { onLogout(); }
  };

  const go = (r: Route) => (e: React.MouseEvent) => { e.preventDefault(); navigate(r); };

  return (
    <div className="a-shell">
      <aside className="a-sidebar" aria-label="القائمة">
        <div className="a-brand">
          <img src={LOGO} alt="" width={44} height={44} />
          <div><strong className="a-display">الأمين</strong><small>إدارة المتجر</small></div>
        </div>
        <a className="a-store-link" href="../" target="_blank" rel="noopener"><span className="a-dot" />عرض المتجر<Icon name="external" /></a>
        <nav className="a-side-nav">
          {NAV.map((n) => (
            <a key={n.label} href={href(n.route)} onClick={go(n.route)} className={active(route, n.route) ? "is-active" : ""} aria-current={active(route, n.route) ? "page" : undefined}>
              <Icon name={n.icon} />
              <span>{n.label}</span>
              {n.route.name === "products" && products && <b>{products.length}</b>}
            </a>
          ))}
        </nav>
        <button type="button" className="a-side-logout" onClick={logout}><Icon name="logout" />تسجيل الخروج</button>
      </aside>

      <div className="a-main">
        <header className="a-topbar">
          <img className="a-topbar-logo" src={LOGO} alt="" width={34} height={34} />
          <h1 className="a-display">{TITLES[route.name]}</h1>
          <div className="a-topbar-actions">
            <a className="a-icon-btn" href="../" target="_blank" rel="noopener" aria-label="عرض المتجر" title="عرض المتجر"><Icon name="eye" /></a>
            <a className="a-icon-btn a-only-mobile" href={href({ name: "content" })} onClick={go({ name: "content" })} aria-label="المحتوى" title="المحتوى"><Icon name="doc" /></a>
            <button type="button" className="a-icon-btn a-only-mobile" onClick={logout} aria-label="تسجيل الخروج" title="تسجيل الخروج"><Icon name="logout" /></button>
          </div>
        </header>
        <main className="a-content" id="main">{children}</main>
      </div>

      <nav className="a-bottom-nav" aria-label="التنقل">
        {NAV.slice(0, 2).map((n) => <BottomLink key={n.label} n={n} route={route} go={go} />)}
        <a href={href({ name: "new" })} onClick={go({ name: "new" })} className="a-bottom-add" aria-label="إضافة عطر جديد"><Icon name="plus" /></a>
        {NAV.slice(2, 4).map((n) => <BottomLink key={n.label} n={n} route={route} go={go} />)}
      </nav>
    </div>
  );
}

function BottomLink({ n, route, go }: { n: (typeof NAV)[number]; route: Route; go: (r: Route) => (e: React.MouseEvent) => void }) {
  const on = active(route, n.route);
  return (
    <a href={href(n.route)} onClick={go(n.route)} className={on ? "is-active" : ""} aria-current={on ? "page" : undefined}>
      <Icon name={n.icon} /><span>{n.short}</span>
    </a>
  );
}
