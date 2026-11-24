/* Manual display order. Two lists, because the storefront has two orders:
   the full catalog, and the "الأكثر طلبًا" strip on the homepage.
   Touch: big up/down buttons + tap the number to type a position.
   Desktop: drag the handle. Nothing is saved until "حفظ الترتيب". */
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "../../components/ui/Icon";
import type { AdminProduct } from "../../shared/product";
import { useFeedback } from "../components/feedback";
import { ProductThumb, StatusPill } from "../components/ProductThumb";
import { api, ApiError } from "../lib/api";
import { categoryLabel, displayName } from "../lib/format";
import { setLeaveGuard } from "../lib/router";
import { useProducts } from "../lib/store";
import { LoadError } from "./Products";

type Tab = "catalog" | "featured";

const baseOrder = (list: AdminProduct[], tab: Tab) =>
  tab === "catalog"
    ? [...list].sort((a, b) => a.sortOrder - b.sortOrder).map((p) => p.id)
    : list.filter((p) => p.isFeatured).sort((a, b) => a.featuredRank! - b.featuredRank!).map((p) => p.id);

export function Order() {
  const { products, error, reload } = useProducts();
  const { toast } = useFeedback();
  const [tab, setTab] = useState<Tab>("catalog");
  const [ids, setIds] = useState<string[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [moved, setMoved] = useState<string | null>(null);
  const [editingPos, setEditingPos] = useState<string | null>(null);
  const dragId = useRef<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const saved = useMemo(() => (products ? baseOrder(products, tab) : []), [products, tab]);
  useEffect(() => { if (products) setIds(baseOrder(products, tab)); }, [products, tab]);

  const dirty = !!ids && ids.join() !== saved.join();
  useEffect(() => { setLeaveGuard(() => !dirty); return () => setLeaveGuard(null); }, [dirty]);

  // Keep the moved row in view so it doesn't slide off-screen on a phone.
  useEffect(() => {
    if (!moved) return;
    document.querySelector(`[data-row="${CSS.escape(moved)}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    const t = window.setTimeout(() => setMoved(null), 900);
    return () => window.clearTimeout(t);
  }, [moved, ids]);

  if (error) return <LoadError text={error} retry={reload} />;
  if (!products || !ids) return <div className="a-loading" aria-busy="true">جاري التحميل…</div>;

  const byId = new Map(products.map((p) => [p.id, p]));
  const moveTo = (id: string, to: number) => {
    setIds((list) => {
      if (!list) return list;
      const from = list.indexOf(id);
      const target = Math.max(0, Math.min(list.length - 1, to));
      if (from < 0 || from === target) return list;
      const next = [...list];
      next.splice(from, 1);
      next.splice(target, 0, id);
      return next;
    });
    setMoved(id);
  };

  const switchTab = (t: Tab) => {
    if (t === tab) return;
    if (dirty && !window.confirm("عندك ترتيب لسه ما اتحفظش. تسيبه؟")) return;
    setTab(t);
  };

  const save = async () => {
    setSaving(true);
    try {
      if (tab === "catalog") await api.reorder(ids); else await api.reorderFeatured(ids);
      await reload();
      toast(tab === "catalog" ? "تم حفظ ترتيب العطور — المتجر بيعرضها بالترتيب ده دلوقتي" : "تم حفظ ترتيب «الأكثر طلبًا»", "success",
        { label: "عرض في المتجر", href: tab === "catalog" ? "../#products" : "../#best" });
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "الحفظ فشل. حاول تاني.", "error");
      if (e instanceof ApiError && e.status === 409) await reload();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="a-order">
      <div className="a-page-intro">
        <div>
          <h2 className="a-display">ترتيب ظهور العطور</h2>
          <p className="a-muted">العطر اللي فوق بيظهر الأول في المتجر.</p>
        </div>
      </div>

      <div className="a-tabs" role="tablist" aria-label="أي ترتيب">
        <button role="tab" aria-selected={tab === "catalog"} className={tab === "catalog" ? "is-on" : ""} onClick={() => switchTab("catalog")}>
          كل العطور <small>({products.length})</small>
        </button>
        <button role="tab" aria-selected={tab === "featured"} className={tab === "featured" ? "is-on" : ""} onClick={() => switchTab("featured")}>
          الأكثر طلبًا <small>({products.filter((p) => p.isFeatured).length})</small>
        </button>
      </div>

      <p className="a-hint">
        <Icon name="sort" />
        <span className="a-only-mobile">استخدم الأسهم، أو اضغط على الرقم واكتب المكان الجديد.</span>
        <span className="a-only-desktop">اسحب العطر من المقبض، أو استخدم الأسهم، أو اضغط على الرقم واكتب المكان الجديد.</span>
      </p>

      {ids.length === 0 ? (
        <div className="a-empty"><Icon name="star" /><p>مفيش عطور في «الأكثر طلبًا». فعّلها من صفحة تعديل العطر.</p></div>
      ) : (
        <ol className="a-order-list">
          {ids.map((id, i) => {
            const p = byId.get(id);
            if (!p) return null;
            return (
              <li
                key={id}
                data-row={id}
                className={`a-order-row${moved === id ? " is-moved" : ""}${dragOver === id ? " is-over" : ""}`}
                onDragOver={(e) => { if (dragId.current) { e.preventDefault(); setDragOver(id); } }}
                onDragLeave={() => setDragOver((d) => (d === id ? null : d))}
                onDrop={(e) => { e.preventDefault(); if (dragId.current) moveTo(dragId.current, i); dragId.current = null; setDragOver(null); }}
              >
                <span
                  className="a-drag"
                  draggable
                  onDragStart={(e) => { dragId.current = id; e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", id); }}
                  onDragEnd={() => { dragId.current = null; setDragOver(null); }}
                  aria-hidden="true"
                  title="اسحب لتغيير الترتيب"
                ><Icon name="grip" /></span>

                {editingPos === id ? (
                  <PositionInput current={i + 1} max={ids.length} onDone={(n) => { setEditingPos(null); if (n) moveTo(id, n - 1); }} />
                ) : (
                  <button type="button" className="a-pos" onClick={() => setEditingPos(id)} aria-label={`الترتيب ${i + 1} — اضغط لكتابة مكان جديد`}>{i + 1}</button>
                )}

                <ProductThumb p={p} size={44} />
                <span className="a-row-main">
                  <b>{displayName(p)}</b>
                  <small>{p.house} · {categoryLabel(p.category)}</small>
                  {p.status === "draft" && <StatusPill p={p} />}
                </span>
                <span className="a-arrows">
                  <button type="button" onClick={() => moveTo(id, i - 1)} disabled={i === 0} aria-label={`تقديم ${displayName(p)}`}><Icon name="arrowUp" /></button>
                  <button type="button" onClick={() => moveTo(id, i + 1)} disabled={i === ids.length - 1} aria-label={`تأخير ${displayName(p)}`}><Icon name="arrowDown" /></button>
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <div className={`a-sticky-bar${dirty ? " is-dirty" : ""}`}>
        <span className="a-sticky-status">{saving ? "جاري الحفظ…" : dirty ? "ترتيب جديد لسه ما اتحفظش" : "ده الترتيب الحالي في المتجر"}</span>
        <button type="button" className="a-btn a-btn--outline" disabled={!dirty || saving} onClick={() => setIds(saved)}>تراجع</button>
        <button type="button" className="a-btn a-btn--primary" disabled={!dirty || saving} onClick={save}>{saving ? "جاري الحفظ…" : "حفظ الترتيب"}</button>
      </div>
    </div>
  );
}

function PositionInput({ current, max, onDone }: { current: number; max: number; onDone: (n: number | null) => void }) {
  const [v, setV] = useState(String(current));
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.select(); }, []);
  const commit = () => {
    const n = Number(v.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))));
    onDone(Number.isInteger(n) && n >= 1 && n <= max ? n : null);
  };
  return (
    <form className="a-pos-form" onSubmit={(e) => { e.preventDefault(); commit(); }}>
      <input ref={ref} inputMode="numeric" value={v} onChange={(e) => setV(e.target.value)} onBlur={commit}
        aria-label={`المكان الجديد من 1 إلى ${max}`} />
    </form>
  );
}
