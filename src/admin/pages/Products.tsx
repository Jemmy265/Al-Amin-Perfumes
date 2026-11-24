import { useMemo, useState } from "react";
import { Icon } from "../../components/ui/Icon";
import { normalize } from "../../domain/search";
import { ProductThumb, StatusPill } from "../components/ProductThumb";
import { categoryLabel, displayName, money, minPrice, sizesText } from "../lib/format";
import { href, navigate } from "../lib/router";
import { useProducts } from "../lib/store";

type StatusF = "all" | "published" | "draft";

export function Products() {
  const { products, error, reload } = useProducts();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<StatusF>("all");
  const [cat, setCat] = useState<"all" | "men" | "women" | "unisex">("all");

  const list = useMemo(() => {
    const terms = normalize(q).split(" ").filter(Boolean);
    return (products ?? []).filter((p) =>
      (status === "all" || p.status === status) && (cat === "all" || p.category === cat) &&
      terms.every((t) => normalize(`${p.name} ${p.nameEn} ${p.house}`).includes(t)));
  }, [products, q, status, cat]);

  if (error) return <LoadError text={error} retry={reload} />;
  if (!products) return <div className="a-loading" aria-busy="true">جاري تحميل العطور…</div>;
  const drafts = products.filter((p) => p.status === "draft").length;

  return (
    <div>
      <div className="a-page-intro">
        <div>
          <h2 className="a-display">إدارة العطور</h2>
          <p className="a-muted">{products.length} عطر · {products.length - drafts} منشور · {drafts} مسودة</p>
        </div>
        <a className="a-btn a-btn--primary a-only-desktop" href={href({ name: "new" })} onClick={(e) => { e.preventDefault(); navigate({ name: "new" }); }}>
          <Icon name="plus" />إضافة عطر
        </a>
      </div>

      <div className="a-toolbar">
        <label className="a-search">
          <Icon name="search" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث باسم العطر أو الماركة" aria-label="بحث" />
        </label>
        <div className="a-filter-row">
          <select value={status} onChange={(e) => setStatus(e.target.value as StatusF)} aria-label="الحالة">
            <option value="all">كل الحالات</option><option value="published">منشور</option><option value="draft">مسودة</option>
          </select>
          <select value={cat} onChange={(e) => setCat(e.target.value as typeof cat)} aria-label="التصنيف">
            <option value="all">كل التصنيفات</option><option value="men">رجالي</option><option value="women">نسائي</option><option value="unisex">للجنسين</option>
          </select>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="a-empty">
          <Icon name="search" />
          <p>{products.length ? "مفيش عطور مطابقة للبحث." : "لسه مفيش عطور. ابدأ بإضافة أول عطر."}</p>
          {products.length > 0 && <button type="button" className="a-btn a-btn--outline" onClick={() => { setQ(""); setStatus("all"); setCat("all"); }}>عرض الكل</button>}
        </div>
      ) : (
        <ul className="a-list" aria-label="العطور">
          {list.map((p) => (
            <li key={p.id}>
              <a className="a-row" href={href({ name: "edit", id: p.id })} onClick={(e) => { e.preventDefault(); navigate({ name: "edit", id: p.id }); }}>
                <ProductThumb p={p} />
                <span className="a-row-main">
                  <b>{displayName(p)}</b>
                  <small dir="auto">{p.house} · {categoryLabel(p.category)}</small>
                  <small>{p.variants.length ? `${sizesText(p)} · من ${money(minPrice(p))}` : "مفيش أحجام"}</small>
                </span>
                <span className="a-row-end">
                  <StatusPill p={p} />
                  {p.isFeatured && <span className="a-pill a-pill--gold">الأكثر طلبًا</span>}
                  <Icon name="arrowLeft" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function LoadError({ text, retry }: { text: string; retry: () => void }) {
  return (
    <div className="a-empty" role="alert">
      <Icon name="alert" /><p>{text}</p>
      <button type="button" className="a-btn a-btn--primary" onClick={retry}>حاول تاني</button>
    </div>
  );
}
