/* Add / edit a perfume — one guided page, numbered steps, sticky save bar. */
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Icon } from "../../components/ui/Icon";
import { crossFieldErrors, fieldErrors, productInputSchema, type AdminProduct, type ProductInput } from "../../shared/product";
import { useFeedback } from "../components/feedback";
import { ImagePicker } from "../components/ImagePicker";
import { newRow, SizeRows, type SizeRow } from "../components/SizeRows";
import { TagEditor, type TagValue } from "../components/TagEditor";
import { api, ApiError } from "../lib/api";
import { displayName } from "../lib/format";
import { navigate, setLeaveGuard } from "../lib/router";
import { useProducts } from "../lib/store";

interface Form {
  name: string; nameEn: string; house: string;
  category: TagValue["category"] | ""; scents: TagValue["scents"]; occasions: TagValue["occasions"]; intensity: TagValue["intensity"];
  rows: SizeRow[];
  imageKey: string | null; imageUrl: string | null;
  notes: { top: string; heart: string; base: string; all: string };
  family: string; label: string; isNew: boolean; year: string; perfumer: string;
  isFeatured: boolean;
}

const DRAFT_KEY = "alamin-admin:new-product";

const empty = (): Form => ({
  name: "", nameEn: "", house: "", category: "", scents: [], occasions: [], intensity: "medium",
  rows: [newRow("35"), newRow("55"), newRow("110")], imageKey: null, imageUrl: null,
  notes: { top: "", heart: "", base: "", all: "" }, family: "", label: "", isNew: true, year: "", perfumer: "", isFeatured: false,
});

const fromProduct = (p: AdminProduct): Form => ({
  name: p.name, nameEn: p.nameEn, house: p.house, category: p.category, scents: p.scents, occasions: p.occasions, intensity: p.intensity,
  rows: p.variants.map((v) => newRow(String(v.sizeMl), String(v.price))), imageKey: p.imageKey, imageUrl: p.imageUrl,
  notes: { ...p.notes }, family: p.family, label: p.label, isNew: p.isNew, year: p.year ? String(p.year) : "", perfumer: p.perfumer, isFeatured: p.isFeatured,
});

function toInput(f: Form, status: ProductInput["status"]): ProductInput {
  return {
    name: f.name, nameEn: f.nameEn, house: f.house, category: (f.category || undefined) as ProductInput["category"],
    status, isFeatured: f.isFeatured, label: f.label, isNew: f.isNew, family: f.family,
    year: f.year ? Number(f.year) : null, perfumer: f.perfumer, notes: f.notes,
    variants: f.rows.filter((r) => r.sizeMl || r.price).map((r) => ({ sizeMl: r.sizeMl as unknown as number, price: r.price as unknown as number })),
    scents: f.scents, occasions: f.occasions, intensity: f.intensity, imageKey: f.imageKey,
  };
}

/** Comparable snapshot (row keys excluded) for unsaved-change detection. */
const snapshot = (f: Form) => JSON.stringify({ ...f, rows: f.rows.map((r) => [r.sizeMl, r.price]) });

/** Maps "variants.0.price" etc. to the field the UI shows errors on. */
function normalizeErrors(e: Record<string, string>) {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(e)) {
    const key = k.startsWith("variants") ? "variants" : k.startsWith("notes") ? "notes" : k;
    if (!(key in out)) out[key] = v;
  }
  return out;
}

const SECTION_OF: Record<string, string> = {
  name: "s-name", nameEn: "s-name", house: "s-name", imageKey: "s-image", variants: "s-sizes",
  category: "s-tags", scents: "s-tags", occasions: "s-tags", intensity: "s-tags", notes: "s-desc", year: "s-desc",
};

export function ProductForm({ id }: { id?: string }) {
  const { products, upsert, remove } = useProducts();
  const { toast, confirm } = useFeedback();
  const editing = !!id;
  const [product, setProduct] = useState<AdminProduct | null>(() => (id ? products?.find((p) => p.id === id) ?? null : null));
  const [loadError, setLoadError] = useState("");
  const [form, setForm] = useState<Form | null>(() => {
    if (id) return product ? fromProduct(product) : null;
    try { const d = localStorage.getItem(DRAFT_KEY); if (d) return { ...empty(), ...JSON.parse(d) }; } catch { /* ignore */ }
    return empty();
  });
  const [restored] = useState(() => !id && !!localStorage.getItem(DRAFT_KEY));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<null | "draft" | "publish" | "delete">(null);
  const initial = useRef<string>(form ? snapshot(form) : "");

  // Load the product if it was not in the list cache (e.g. opened by link).
  useEffect(() => {
    if (!id || form) return;
    api.product(id).then((p) => { setProduct(p); const f = fromProduct(p); initial.current = snapshot(f); setForm(f); })
      .catch((e) => setLoadError(e instanceof ApiError ? e.message : "تعذّر تحميل العطر"));
  }, [id, form]);

  const dirty = useMemo(() => !!form && snapshot(form) !== initial.current, [form]);

  // Unsaved changes guard (in-app navigation, back button, closing the tab).
  useEffect(() => {
    setLeaveGuard(() => !dirty || saving !== null);
    return () => setLeaveGuard(null);
  }, [dirty, saving]);

  // New perfume: keep a copy on this device so nothing is lost if the page closes.
  useEffect(() => {
    if (editing || !form || !dirty) return;
    const t = window.setTimeout(() => {
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...form, rows: form.rows.map((r) => ({ ...r })) })); } catch { /* full */ }
    }, 400);
    return () => window.clearTimeout(t);
  }, [form, dirty, editing]);

  if (loadError) return <div className="a-empty"><Icon name="alert" /><p>{loadError}</p><button className="a-btn a-btn--outline" onClick={() => navigate({ name: "products" })}>رجوع للعطور</button></div>;
  if (!form) return <div className="a-loading" aria-busy="true">جاري التحميل…</div>;

  const set = (patch: Partial<Form>) => {
    setForm((f) => (f ? { ...f, ...patch } : f));
    if (Object.keys(errors).length) setErrors((e) => { const n = { ...e }; for (const k of Object.keys(patch)) delete n[k === "rows" ? "variants" : k]; return n; });
  };

  const currentStatus = product?.status ?? "draft";

  const save = async (status: ProductInput["status"]) => {
    const input = toInput(form, status);
    const parsed = productInputSchema.safeParse(input);
    if (!parsed.success) {
      // Show every problem at once: field errors + cross-field rules.
      const errs = normalizeErrors({ ...crossFieldErrors(input as Parameters<typeof crossFieldErrors>[0]), ...fieldErrors(parsed.error) });
      setErrors(errs);
      const first = Object.keys(errs)[0];
      document.getElementById(SECTION_OF[first] ?? "s-name")?.scrollIntoView({ behavior: "smooth", block: "start" });
      toast(status === "published" ? "فيه بيانات ناقصة قبل النشر — راجع الحقول المعلّمة" : "راجع الحقول المعلّمة", "error");
      return;
    }
    setSaving(status === "published" ? "publish" : "draft");
    try {
      const saved = editing ? await api.updateProduct(id!, input) : await api.createProduct(input);
      upsert(saved);
      initial.current = snapshot(form);
      if (!editing) localStorage.removeItem(DRAFT_KEY);
      setLeaveGuard(null);
      toast(
        status === "published" ? `تم حفظ «${displayName(saved)}» وهو ظاهر في المتجر` : `تم حفظ «${displayName(saved)}» كمسودة (مش ظاهر للعملاء)`,
        "success",
        status === "published" ? { label: "عرض في المتجر", href: `../#perfume/${saved.id}` } : undefined,
      );
      navigate({ name: "products" });
    } catch (e) {
      if (e instanceof ApiError && Object.keys(e.fields).length) setErrors(normalizeErrors(e.fields));
      toast(e instanceof ApiError ? e.message : "الحفظ فشل. حاول تاني.", "error");
    } finally {
      setSaving(null);
    }
  };

  const del = async () => {
    if (!product) return;
    const ok = await confirm({
      title: `حذف «${displayName(product)}»؟`,
      text: "العطر هيتشال من المتجر ومن لوحة التحكم نهائيًا، ومعاه صورته. الخطوة دي ما ينفعش ترجع فيها.",
      confirmLabel: "حذف نهائي", danger: true,
    });
    if (!ok) return;
    setSaving("delete");
    try {
      await api.deleteProduct(product.id);
      remove(product.id);
      setLeaveGuard(null);
      toast(`تم حذف «${displayName(product)}»`);
      navigate({ name: "products" });
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "الحذف فشل", "error");
      setSaving(null);
    }
  };

  const restart = () => { localStorage.removeItem(DRAFT_KEY); const f = empty(); initial.current = snapshot(f); setForm(f); setErrors({}); };

  return (
    <div className="a-form-page">
      <div className="a-page-head">
        <button type="button" className="a-back" onClick={() => navigate({ name: "products" })}><Icon name="arrowRight" />العطور</button>
        <h2 className="a-display">{editing ? displayName(product!) : "إضافة عطر جديد"}</h2>
        {editing && <span className={`a-pill a-pill--${currentStatus}`}>{currentStatus === "published" ? "منشور" : "مسودة"}</span>}
      </div>

      {restored && !editing && (
        <div className="a-notice">
          <Icon name="doc" />
          <p>رجّعنا بيانات العطر اللي كنت بتضيفه قبل كده.</p>
          <button type="button" className="a-btn a-btn--ghost" onClick={restart}>ابدأ من جديد</button>
        </div>
      )}

      <form className="a-form" onSubmit={(e) => { e.preventDefault(); void save(editing ? currentStatus : "published"); }} noValidate>
        <Section n={1} id="s-name" title="اسم العطر والماركة">
          <TextField label="اسم العطر بالعربي" value={form.name} onChange={(v) => set({ name: v })} error={errors.name} placeholder="مثال: مضاوي" />
          <TextField label="الاسم بالإنجليزي" value={form.nameEn} onChange={(v) => set({ nameEn: v })} error={errors.nameEn} placeholder="Madawi" dir="ltr"
            hint="اكتب الاسم بالعربي أو بالإنجليزي أو الاتنين." />
          <TextField label="الماركة (مستوحى من)" value={form.house} onChange={(v) => set({ house: v })} error={errors.house} placeholder="Arabian Oud" dir="ltr" required />
        </Section>

        <Section n={2} id="s-image" title="صورة العطر">
          <ImagePicker url={form.imageUrl} error={errors.imageKey}
            onUploaded={(key, url) => set({ imageKey: key, imageUrl: url })}
            onRemove={() => set({ imageKey: null, imageUrl: null })} />
        </Section>

        <Section n={3} id="s-sizes" title="الأحجام والأسعار">
          <SizeRows rows={form.rows} onChange={(rows) => set({ rows })} error={errors.variants} />
        </Section>

        <Section n={4} id="s-tags" title="التصنيف ووسوم اختبار العطر" hint="الاختيارات دي بتحدد إمتى العطر يظهر في ترشيحات «اكتشف عطرك».">
          <TagEditor
            value={{ category: form.category as TagValue["category"], scents: form.scents, occasions: form.occasions, intensity: form.intensity }}
            onChange={(t) => set(t)}
            errors={errors}
          />
          {errors.category && <p className="a-field-error">{errors.category}</p>}
        </Section>

        <Section n={5} id="s-desc" title="الوصف والمكوّنات" optional>
          <details className="a-more" open={!!(form.notes.top || form.notes.heart || form.notes.base || form.notes.all)}>
            <summary>المكوّنات (الافتتاحية، القلب، القاعدة)<Icon name="chevron" /></summary>
            <TextArea label="الافتتاحية" value={form.notes.top} onChange={(v) => set({ notes: { ...form.notes, top: v } })} />
            <TextArea label="القلب" value={form.notes.heart} onChange={(v) => set({ notes: { ...form.notes, heart: v } })} />
            <TextArea label="القاعدة" value={form.notes.base} onChange={(v) => set({ notes: { ...form.notes, base: v } })} />
            <TextArea label="أو المكوّنات كلها مرة واحدة" value={form.notes.all} onChange={(v) => set({ notes: { ...form.notes, all: v } })}
              hint="استخدمها لو المكوّنات مش متقسمة." />
            {errors.notes && <p className="a-field-error">{errors.notes}</p>}
          </details>
          <details className="a-more">
            <summary>تفاصيل أكتر<Icon name="chevron" /></summary>
            <TextField label="العائلة العطرية" value={form.family} onChange={(v) => set({ family: v })} placeholder="شرقي - فانيليا" />
            <TextField label="وسم يظهر على الصورة" value={form.label} onChange={(v) => set({ label: v })} placeholder="نيش / ديزاينر" />
            <div className="a-two">
              <TextField label="سنة صدور الأصلي" value={form.year} onChange={(v) => set({ year: v.replace(/[^\d]/g, "").slice(0, 4) })} inputMode="numeric" error={errors.year} />
              <TextField label="العطّار" value={form.perfumer} onChange={(v) => set({ perfumer: v })} dir="ltr" />
            </div>
            <Toggle label="عليه علامة «جديد»" checked={form.isNew} onChange={(v) => set({ isNew: v })} />
          </details>
        </Section>

        <Section n={6} id="s-publish" title="الظهور في المتجر">
          <Toggle label="يظهر في «الأكثر طلبًا»" hint="ترتيبه هناك بتغيّره من صفحة «ترتيب العرض»." checked={form.isFeatured} onChange={(v) => set({ isFeatured: v })} />
          <p className="a-muted a-small">اختار تحت: تنشره للعملاء دلوقتي، أو تحفظه كمسودة تكمّلها بعدين.</p>
        </Section>

        {editing && (
          <div className="a-danger-zone">
            <button type="button" className="a-btn a-btn--ghost a-btn--danger-text" onClick={del} disabled={saving !== null}>
              <Icon name="trash" />حذف العطر
            </button>
          </div>
        )}

        <div className="a-sticky-bar">
          <span className="a-sticky-status">{saving ? "جاري الحفظ…" : dirty ? "فيه تغييرات لسه ما اتحفظتش" : editing ? "مفيش تغييرات" : ""}</span>
          <button type="button" className="a-btn a-btn--outline" disabled={saving !== null} onClick={() => save("draft")}>
            {editing && currentStatus === "published" ? "إخفاء (مسودة)" : "حفظ كمسودة"}
          </button>
          <button type="button" className="a-btn a-btn--primary" disabled={saving !== null} onClick={() => save("published")}>
            {saving === "publish" ? "جاري الحفظ…" : editing && currentStatus === "published" ? "حفظ التغييرات" : "نشر في المتجر"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ n, id, title, hint, optional, children }: { n: number; id: string; title: string; hint?: string; optional?: boolean; children: ReactNode }) {
  return (
    <section className="a-section" id={id} aria-labelledby={`${id}-t`}>
      <h3 id={`${id}-t`}><span className="a-step">{n}</span>{title}{optional && <small>اختياري</small>}</h3>
      {hint && <p className="a-section-hint">{hint}</p>}
      {children}
    </section>
  );
}

function TextField({ label, value, onChange, error, hint, placeholder, dir, required, inputMode }: {
  label: string; value: string; onChange: (v: string) => void; error?: string; hint?: string; placeholder?: string;
  dir?: "ltr"; required?: boolean; inputMode?: "numeric";
}) {
  return (
    <label className={`a-field${error ? " has-error" : ""}`}>
      <span>{label}{required && <i aria-hidden="true"> *</i>}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} dir={dir} inputMode={inputMode}
        aria-invalid={!!error} required={required} />
      {hint && !error && <small>{hint}</small>}
      {error && <small className="a-field-error">{error}</small>}
    </label>
  );
}

function TextArea({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <label className="a-field">
      <span>{label}</span>
      <textarea rows={2} value={value} onChange={(e) => onChange(e.target.value)} />
      {hint && <small>{hint}</small>}
    </label>
  );
}

function Toggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="a-toggle">
      <span><b>{label}</b>{hint && <small>{hint}</small>}</span>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <i aria-hidden="true" />
    </label>
  );
}
