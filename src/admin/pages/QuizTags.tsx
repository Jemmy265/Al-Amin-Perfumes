/* Quick editor for the quiz tags of each perfume. Changes apply to the
   storefront's "اكتشف عطرك" recommendations as soon as they are saved. */
import { useEffect, useMemo, useState } from "react";
import { Icon } from "../../components/ui/Icon";
import { normalize } from "../../domain/search";
import { fieldErrors, tagsInputSchema, type AdminProduct } from "../../shared/product";
import { useFeedback } from "../components/feedback";
import { ProductThumb } from "../components/ProductThumb";
import { TagEditor, type TagValue } from "../components/TagEditor";
import { api, ApiError } from "../lib/api";
import { displayName, LABELS } from "../lib/format";
import { setLeaveGuard } from "../lib/router";
import { useProducts } from "../lib/store";
import { LoadError } from "./Products";

const pick = (p: AdminProduct): TagValue => ({ category: p.category, scents: p.scents, occasions: p.occasions, intensity: p.intensity });
const summary = (t: TagValue) => [
  LABELS.audience[t.category],
  t.scents.map((s) => LABELS.scents[s].label).join("، ") || "— بدون نوع ريحة",
  t.occasions.map((o) => LABELS.occasions[o]).join("، ") || "— بدون استخدام",
  LABELS.intensity[t.intensity],
];

export function QuizTags() {
  const { products, error, reload, upsert } = useProducts();
  const { toast } = useFeedback();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [draft, setDraft] = useState<TagValue | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const list = useMemo(() => {
    const terms = normalize(q).split(" ").filter(Boolean);
    return (products ?? []).filter((p) => terms.every((t) => normalize(`${p.name} ${p.nameEn} ${p.house}`).includes(t)));
  }, [products, q]);

  const current = open ? products?.find((p) => p.id === open) : undefined;
  const dirty = !!(current && draft && JSON.stringify(draft) !== JSON.stringify(pick(current)));
  useEffect(() => { setLeaveGuard(() => !dirty); return () => setLeaveGuard(null); }, [dirty]);

  if (error) return <LoadError text={error} retry={reload} />;
  if (!products) return <div className="a-loading" aria-busy="true">جاري التحميل…</div>;

  const toggle = (p: AdminProduct) => {
    if (open === p.id) { if (!dirty || window.confirm("التغييرات دي مش هتتحفظ. تقفل؟")) { setOpen(null); setDraft(null); } return; }
    if (dirty && !window.confirm("التغييرات على العطر المفتوح مش هتتحفظ. تكمّل؟")) return;
    setOpen(p.id); setDraft(pick(p)); setErrors({});
  };

  const save = async () => {
    if (!current || !draft) return;
    const r = tagsInputSchema.safeParse(draft);
    if (!r.success) { setErrors(fieldErrors(r.error)); return; }
    setSaving(true);
    try {
      const saved = await api.updateTags(current.id, r.data);
      upsert(saved);
      setOpen(null); setDraft(null);
      toast(`تم حفظ وسوم «${displayName(saved)}» — الاختبار بيستخدمها دلوقتي`);
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "الحفظ فشل", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="a-page-intro">
        <div>
          <h2 className="a-display">وسوم اختبار العطر</h2>
          <p className="a-muted">لما العميل يجاوب على «اكتشف عطرك»، الموقع بيقارن إجاباته بالوسوم دي ويرشّح أقرب 3 عطور.</p>
        </div>
      </div>
      <label className="a-search a-search--solo">
        <Icon name="search" />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن عطر" aria-label="بحث" />
      </label>

      <ul className="a-list">
        {list.map((p) => {
          const isOpen = open === p.id;
          return (
            <li key={p.id} className={isOpen ? "is-open" : ""}>
              <button type="button" className="a-row" onClick={() => toggle(p)} aria-expanded={isOpen}>
                <ProductThumb p={p} size={44} />
                <span className="a-row-main">
                  <b>{displayName(p)}</b>
                  <span className="a-tag-summary">{summary(pick(p)).map((s, i) => <em key={i}>{s}</em>)}</span>
                </span>
                <span className="a-row-end"><Icon name={isOpen ? "close" : "edit"} /></span>
              </button>
              {isOpen && draft && (
                <div className="a-row-editor">
                  <TagEditor value={draft} onChange={(v) => { setDraft(v); setErrors({}); }} errors={errors} />
                  <div className="a-row-editor-actions">
                    <button type="button" className="a-btn a-btn--ghost" onClick={() => toggle(p)}>إلغاء</button>
                    <button type="button" className="a-btn a-btn--primary" onClick={save} disabled={saving || !dirty}>{saving ? "جاري الحفظ…" : "حفظ الوسوم"}</button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
