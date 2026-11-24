import { Icon } from "../../components/ui/Icon";
import { ProductThumb, StatusPill } from "../components/ProductThumb";
import { displayName, money, minPrice } from "../lib/format";
import { href, navigate, type Route } from "../lib/router";
import { useProducts } from "../lib/store";
import { LoadError } from "./Products";

export function Overview() {
  const { products, error, reload } = useProducts();
  if (error) return <LoadError text={error} retry={reload} />;
  if (!products) return <div className="a-loading" aria-busy="true">جاري التحميل…</div>;

  const published = products.filter((p) => p.status === "published").length;
  const drafts = products.filter((p) => p.status === "draft");
  const featured = products.filter((p) => p.isFeatured).length;
  const recent = [...products].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);
  const go = (r: Route) => (e: React.MouseEvent) => { e.preventDefault(); navigate(r); };

  return (
    <div className="a-overview">
      <div className="a-page-intro">
        <div>
          <p className="a-eyebrow">أهلًا بيك</p>
          <h2 className="a-display">عندما تدمن العطور</h2>
        </div>
        <a className="a-btn a-btn--primary a-btn--lg" href={href({ name: "new" })} onClick={go({ name: "new" })}><Icon name="plus" />إضافة عطر جديد</a>
      </div>

      <dl className="a-stats">
        <div><dt>كل العطور</dt><dd>{products.length}</dd></div>
        <div><dt>منشور</dt><dd>{published}</dd></div>
        <div><dt>مسودة</dt><dd>{drafts.length}</dd></div>
        <div><dt>الأكثر طلبًا</dt><dd>{featured}</dd></div>
      </dl>

      {drafts.length > 0 && (
        <section className="a-panel">
          <h3>مسودات محتاجة تكملة</h3>
          <ul className="a-list a-list--plain">
            {drafts.slice(0, 5).map((p) => (
              <li key={p.id}><a className="a-row" href={href({ name: "edit", id: p.id })} onClick={go({ name: "edit", id: p.id })}>
                <ProductThumb p={p} size={44} /><span className="a-row-main"><b>{displayName(p)}</b><small>{p.house}</small></span>
                <span className="a-row-end"><StatusPill p={p} /><Icon name="arrowLeft" /></span>
              </a></li>
            ))}
          </ul>
        </section>
      )}

      <div className="a-grid-2">
        <section className="a-panel">
          <h3>اختصارات</h3>
          <div className="a-shortcuts">
            <a href={href({ name: "order" })} onClick={go({ name: "order" })}><Icon name="sort" /><span><b>ترتيب العطور</b><small>غيّر ترتيب ظهورها في المتجر</small></span><Icon name="arrowLeft" /></a>
            <a href={href({ name: "tags" })} onClick={go({ name: "tags" })}><Icon name="tag" /><span><b>وسوم اختبار العطر</b><small>حدد العطور المناسبة لكل إجابة</small></span><Icon name="arrowLeft" /></a>
            <a href={href({ name: "products" })} onClick={go({ name: "products" })}><Icon name="grid" /><span><b>كل العطور</b><small>تعديل الأسعار والصور والأحجام</small></span><Icon name="arrowLeft" /></a>
          </div>
        </section>
        <section className="a-panel">
          <h3>آخر التعديلات</h3>
          <ul className="a-list a-list--plain">
            {recent.map((p) => (
              <li key={p.id}><a className="a-row" href={href({ name: "edit", id: p.id })} onClick={go({ name: "edit", id: p.id })}>
                <ProductThumb p={p} size={44} />
                <span className="a-row-main"><b>{displayName(p)}</b><small>من {money(minPrice(p))}</small></span>
                <span className="a-row-end"><StatusPill p={p} /></span>
              </a></li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
