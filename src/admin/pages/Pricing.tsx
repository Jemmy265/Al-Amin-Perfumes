/* «الخصومات والشحن»: discount rules and the free-shipping threshold.
   Built for a non-technical owner on a phone: one rule at a time, plain
   Arabic, a live preview in words, and a quick on/off switch per rule.
   Every number shown here comes from domain/pricing (same as the storefront). */
import { useEffect, useMemo, useState } from "react";
import { Icon } from "../../components/ui/Icon";
import {
  bestRule, discountedPrice, fmt, productSizes, ruleStatus, scopeMatches, type RuleStatus,
} from "../../domain/pricing";
import { normalize } from "../../domain/search";
import { discountRuleInputSchema, freeShippingSchema, MAX_DISCOUNT_RULES, type DiscountRuleInput } from "../../shared/pricing";
import { AUDIENCES, fieldErrors, toStorefrontProduct, type AdminProduct } from "../../shared/product";
import type { Audience, Product } from "../../types/catalog";
import type { DiscountRule, DiscountScope, FreeShipping, PricingSettings } from "../../types/content";
import { useFeedback } from "../components/feedback";
import { ProductThumb } from "../components/ProductThumb";
import { api, ApiError } from "../lib/api";
import { categoryLabel, displayName, LABELS, money } from "../lib/format";
import { href, setLeaveGuard } from "../lib/router";
import { ADMIN_SIZE_OPTIONS } from "../lib/sizes";
import { usePricing, useProducts } from "../lib/store";
import { LoadError } from "./Products";

const SAVED = "اتحفظ ✓ — هيظهر للزوار خلال أقل من دقيقة";
const STORE_LINK = { label: "عرض في المتجر", href: "../" };

type Kind = DiscountScope["kind"];
const KINDS: { kind: Kind; label: string; hint: string }[] = [
  { kind: "all", label: "كل المنتجات وكل الأحجام", hint: "خصم على المتجر كله" },
  { kind: "category", label: "تصنيف معين", hint: "رجالي أو نسائي أو للجنسين" },
  { kind: "products", label: "منتجات معينة", hint: "عطور تختارها، بكل أحجامها" },
  { kind: "sizes", label: "أحجام معينة", hint: "مثلًا كل زجاجات 110 مل في كل العطور" },
  { kind: "variant", label: "منتج معين بحجم معين", hint: "عطر واحد وحجم (أو أحجام) منه" },
];

const STATUS: Record<RuleStatus, { label: string; cls: string }> = {
  active: { label: "شغال", cls: "a-pill--published" },
  off: { label: "متوقف", cls: "a-pill--muted" },
  scheduled: { label: "مجدول", cls: "a-pill--gold" },
  ended: { label: "منتهي", cls: "a-pill--draft" },
};

const dayFmt = new Intl.DateTimeFormat("ar-EG-u-nu-latn", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const dayText = (d: string) => dayFmt.format(new Date(`${d}T00:00:00Z`));
const digits = (v: string) => v.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).replace(/[^\d]/g, "");

/* ------------------------------ Form state ------------------------------ */

interface Draft {
  name: string; percent: string; kind: Kind | ""; category: Audience | ""; productIds: string[];
  productId: string; sizes: number[]; enabled: boolean; startDate: string; endDate: string;
}
const emptyDraft = (): Draft => ({ name: "", percent: "", kind: "", category: "", productIds: [], productId: "", sizes: [], enabled: true, startDate: "", endDate: "" });

function fromRule(r: DiscountRule): Draft {
  const d = { ...emptyDraft(), name: r.name, percent: String(r.percent), kind: r.scope.kind, enabled: r.enabled, startDate: r.startDate ?? "", endDate: r.endDate ?? "" };
  const s = r.scope;
  if (s.kind === "category") d.category = s.category;
  if (s.kind === "products") d.productIds = s.productIds;
  if (s.kind === "sizes") d.sizes = s.sizes;
  if (s.kind === "variant") { d.productId = s.productId; d.sizes = s.sizes; }
  return d;
}

function toInput(d: Draft): DiscountRuleInput {
  const scope =
    d.kind === "category" ? { kind: "category", category: d.category || undefined }
    : d.kind === "products" ? { kind: "products", productIds: d.productIds }
    : d.kind === "sizes" ? { kind: "sizes", sizes: d.sizes }
    : d.kind === "variant" ? { kind: "variant", productId: d.productId || undefined, sizes: d.sizes }
    : d.kind === "all" ? { kind: "all" } : undefined;
  return {
    name: d.name, percent: d.percent === "" ? (undefined as unknown as number) : Number(d.percent),
    scope: scope as DiscountRuleInput["scope"], enabled: d.enabled, startDate: d.startDate || null, endDate: d.endDate || null,
  };
}

/** The rule as it would be saved, or null while the form is incomplete. */
function draftRule(d: Draft, id: string): DiscountRule | null {
  const r = discountRuleInputSchema.safeParse(toInput(d));
  return r.success ? { id, ...r.data } : null;
}

/* ------------------------------- Wording -------------------------------- */

function scopeText(scope: DiscountScope, byId: (id: string) => AdminProduct | undefined): string {
  const nameOf = (id: string) => { const p = byId(id); return p ? `«${displayName(p)}»` : "عطر اتمسح"; };
  switch (scope.kind) {
    case "all": return "كل العطور وكل الأحجام";
    case "category": return `كل عطور «${categoryLabel(scope.category)}» بكل أحجامها`;
    case "products": return scope.productIds.length === 1 ? `${nameOf(scope.productIds[0])} بكل أحجامه` : `${scope.productIds.length} عطور بكل أحجامها`;
    case "sizes": return `كل زجاجات ${scope.sizes.join(" و")} مل في كل العطور`;
    case "variant": return `${nameOf(scope.productId)} حجم ${scope.sizes.join(" و")} مل`;
  }
}

const ruleTitle = (r: DiscountRule) => r.name || `خصم ${r.percent}%`;

function datesText(r: Pick<DiscountRule, "startDate" | "endDate">): string {
  if (r.startDate && r.endDate) return `من ${dayText(r.startDate)} لحد ${dayText(r.endDate)}`;
  if (r.startDate) return `يبدأ ${dayText(r.startDate)} ويفضل شغال لحد ما تقفله`;
  if (r.endDate) return `لحد ${dayText(r.endDate)}`;
  return "شغال لحد ما تقفله";
}

/* --------------------------------- Page --------------------------------- */

export function Pricing() {
  const { pricing, error, reload, set } = usePricing();
  const { products, error: productsError, reload: reloadProducts } = useProducts();
  const { toast, confirm } = useFeedback();
  /** "new", a rule id being edited, or null. */
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const byId = useMemo(() => { const m = new Map((products ?? []).map((p) => [p.id, p])); return (id: string) => m.get(id); }, [products]);

  if (error) return <LoadError text={error} retry={reload} />;
  if (productsError) return <LoadError text={productsError} retry={reloadProducts} />;
  if (!pricing || !products) return <div className="a-loading" aria-busy="true">جاري التحميل…</div>;

  const rules = pricing.discounts;
  const now = new Date();

  const toggle = async (r: DiscountRule) => {
    setBusy(r.id);
    try {
      const res = await api.updateDiscount(r.id, { enabled: !r.enabled });
      set(res.pricing);
      toast(`${r.enabled ? "اتقفل" : "اتشغّل"} «${ruleTitle(r)}» ✓ — هيظهر للزوار خلال أقل من دقيقة`, "success", STORE_LINK);
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "التغيير ما اتحفظش. حاول تاني.", "error");
    } finally { setBusy(null); }
  };

  const remove = async (r: DiscountRule) => {
    const ok = await confirm({ title: `حذف «${ruleTitle(r)}»؟`, text: "الخصم هيتشال من الموقع ومش هتقدر ترجّعه. لو عايز توقفه مؤقتًا، اقفله بس.", confirmLabel: "حذف الخصم", danger: true });
    if (!ok) return;
    setBusy(r.id);
    try {
      const res = await api.deleteDiscount(r.id);
      set(res.pricing);
      if (editing === r.id) setEditing(null);
      toast("اتمسح الخصم ✓ — هيختفي من الموقع خلال أقل من دقيقة", "success");
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "الحذف فشل. حاول تاني.", "error");
    } finally { setBusy(null); }
  };

  const canAdd = rules.length < MAX_DISCOUNT_RULES;
  const startNew = () => setEditing("new");

  return (
    <div className="a-pricing">
      <div className="a-page-intro">
        <div>
          <h2 className="a-display">الخصومات والشحن</h2>
          <p className="a-muted">اعمل خصومات وحدد الشحن المجاني بنفسك. التغييرات بتظهر للزوار خلال أقل من دقيقة.</p>
        </div>
        <a className="a-btn a-btn--outline" href="../" target="_blank" rel="noopener"><Icon name="eye" />عرض المتجر</a>
      </div>

      <section className="a-section" aria-labelledby="discounts-title">
        <h3 id="discounts-title"><Icon name="gift" />الخصومات<small>{rules.length ? `${rules.length} خصم` : ""}</small></h3>
        <p className="a-section-hint">لو أكتر من خصم بيتطبق على نفس الزجاجة، الأعلى بس هو اللي بيتحسب (الخصومات مش بتتجمع).</p>

        {editing === "new" && (
          <RuleEditor key="new" products={products} byId={byId} others={rules}
            onCancel={() => setEditing(null)}
            onSaved={(p) => { set(p); setEditing(null); }} />
        )}

        {rules.length === 0 && editing !== "new" ? (
          <div className="a-empty">
            <Icon name="gift" />
            <p>مفيش خصومات لسه.</p>
            <button type="button" className="a-btn a-btn--primary" onClick={startNew}><Icon name="plus" />اعمل أول خصم</button>
          </div>
        ) : (
          <ul className="a-list a-rules" aria-label="الخصومات">
            {rules.map((r) => {
              const st = STATUS[ruleStatus(r, now)];
              const open = editing === r.id;
              return (
                <li key={r.id} className={open ? "is-open" : ""}>
                  <div className="a-rule">
                    <span className="a-rule-pct" dir="ltr">-{r.percent}%</span>
                    <span className="a-row-main">
                      <b>{ruleTitle(r)}</b>
                      <small className="a-wrap">{scopeText(r.scope, byId)}</small>
                      <small className="a-wrap">{datesText(r)}</small>
                    </span>
                    <span className={`a-pill ${st.cls}`}>{st.label}</span>
                  </div>
                  <div className="a-rule-actions">
                    <label className="a-toggle a-toggle--inline">
                      <span><b>{r.enabled ? "شغال" : "مقفول"}</b><small>{r.enabled ? "اقفله من هنا" : "شغّله من هنا"}</small></span>
                      <input type="checkbox" role="switch" checked={r.enabled} disabled={busy === r.id} onChange={() => void toggle(r)} aria-label={`تشغيل «${ruleTitle(r)}»`} />
                      <i aria-hidden="true" />
                    </label>
                    <button type="button" className="a-btn a-btn--outline" onClick={() => setEditing(open ? null : r.id)} aria-expanded={open}>
                      <Icon name="edit" />{open ? "إغلاق" : "تعديل"}
                    </button>
                    <button type="button" className="a-icon-btn a-icon-btn--danger" disabled={busy === r.id} onClick={() => void remove(r)} aria-label={`حذف «${ruleTitle(r)}»`}><Icon name="trash" /></button>
                  </div>
                  {open && (
                    <div className="a-row-editor">
                      <RuleEditor key={r.id} rule={r} products={products} byId={byId} others={rules.filter((x) => x.id !== r.id)}
                        onCancel={() => setEditing(null)}
                        onSaved={(p) => { set(p); setEditing(null); }} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {editing !== "new" && rules.length > 0 && (
          canAdd
            ? <button type="button" className="a-btn a-btn--primary a-btn--block a-rules-add" onClick={startNew}><Icon name="plus" />خصم جديد</button>
            : <p className="a-muted a-small">وصلت للحد الأقصى ({MAX_DISCOUNT_RULES} خصم). امسح خصومات قديمة عشان تضيف جديد.</p>
        )}
      </section>

      <FreeShippingCard value={pricing.freeShipping} onSaved={set} />
    </div>
  );
}

/* ------------------------------ Rule editor ----------------------------- */

function RuleEditor({ rule, products, byId, others, onCancel, onSaved }: {
  rule?: DiscountRule; products: AdminProduct[]; byId: (id: string) => AdminProduct | undefined; others: DiscountRule[];
  onCancel: () => void; onSaved: (p: PricingSettings) => void;
}) {
  const { toast } = useFeedback();
  const initial = useMemo(() => (rule ? fromRule(rule) : emptyDraft()), [rule]);
  const [d, setD] = useState<Draft>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(d) !== JSON.stringify(initial);
  useEffect(() => { setLeaveGuard(() => !dirty || saving); return () => setLeaveGuard(null); }, [dirty, saving]);

  const set = (patch: Partial<Draft>) => { setD((x) => ({ ...x, ...patch })); setErrors({}); };
  const err = (k: string) => errors[k];

  // The store's usual sizes (same quick-add list as the product form) plus any other size a perfume sells.
  const allSizes = useMemo(() => [...new Set([...ADMIN_SIZE_OPTIONS, ...products.flatMap((p) => p.variants.map((v) => v.sizeMl))])].sort((a, b) => a - b), [products]);
  const variantProduct = d.productId ? byId(d.productId) : undefined;
  const variantSizes = variantProduct ? [...variantProduct.variants].map((v) => v.sizeMl).sort((a, b) => a - b) : [];

  const save = async () => {
    const r = discountRuleInputSchema.safeParse(toInput(d));
    if (!r.success) {
      const f = fieldErrors(r.error);
      setErrors(f);
      toast(`راجع الحقول المعلّمة: ${Object.values(f)[0]}`, "error");
      return;
    }
    setSaving(true);
    try {
      const res = rule ? await api.updateDiscount(rule.id, r.data) : await api.createDiscount(r.data);
      setLeaveGuard(null);
      onSaved(res.pricing);
      toast(SAVED, "success", STORE_LINK);
    } catch (e) {
      if (e instanceof ApiError && Object.keys(e.fields).length) setErrors(e.fields);
      toast(e instanceof ApiError ? e.message : "الحفظ فشل. حاول تاني.", "error");
    } finally { setSaving(false); }
  };

  const cancel = () => {
    if (dirty && !window.confirm("عندك تغييرات لسه ما اتحفظتش. تقفل من غير حفظ؟")) return;
    setLeaveGuard(null);
    onCancel();
  };

  return (
    <div className={`a-rule-editor${rule ? "" : " a-subcard"}`}>
      {!rule && <p className="a-subcard-title">خصم جديد</p>}

      <div className="a-two">
        <label className={`a-field${err("percent") ? " has-error" : ""}`}>
          <span>نسبة الخصم <i>*</i></span>
          <span className="a-input-suffix">
            <input inputMode="numeric" value={d.percent} placeholder="20" onChange={(e) => set({ percent: digits(e.target.value).slice(0, 2) })} aria-invalid={!!err("percent")} />
            <em>%</em>
          </span>
          {err("percent") ? <small className="a-field-error">{err("percent")}</small> : <small>من 1 لـ 90</small>}
        </label>
        <label className={`a-field${err("name") ? " has-error" : ""}`}>
          <span>اسم الخصم</span>
          <input value={d.name} maxLength={40} placeholder="خصم الافتتاح" onChange={(e) => set({ name: e.target.value })} aria-invalid={!!err("name")} />
          {err("name") ? <small className="a-field-error">{err("name")}</small> : <small>اختياري — بيظهر للعميل جنب السعر</small>}
        </label>
      </div>

      <fieldset className="a-fieldset">
        <legend>الخصم هيتطبق على إيه؟ <i className="a-req">*</i></legend>
        <div className="a-choices">
          {KINDS.map((k) => (
            <label key={k.kind} className={`a-choice${d.kind === k.kind ? " is-on" : ""}`}>
              <input type="radio" name="scope-kind" checked={d.kind === k.kind}
                onChange={() => set({ kind: k.kind, sizes: k.kind === d.kind ? d.sizes : [] })} />
              <span><b>{k.label}</b><small>{k.hint}</small></span>
            </label>
          ))}
        </div>
        {err("scope") && <p className="a-field-error">{err("scope")}</p>}
      </fieldset>

      {d.kind === "category" && (
        <fieldset className="a-fieldset">
          <legend>التصنيف</legend>
          <div className="a-segment">
            {AUDIENCES.map((a) => (
              <label key={a} className={d.category === a ? "is-on" : ""}>
                <input type="radio" name="rule-category" checked={d.category === a} onChange={() => set({ category: a })} />
                {LABELS.audience[a]}
              </label>
            ))}
          </div>
          {err("scope.category") && <p className="a-field-error">{err("scope.category")}</p>}
        </fieldset>
      )}

      {d.kind === "products" && (
        <fieldset className="a-fieldset">
          <legend>اختار العطور <small>({d.productIds.length} مختار)</small></legend>
          <ProductPicker products={products} multiple selected={d.productIds} onChange={(productIds) => set({ productIds })} />
          {err("scope.productIds") && <p className="a-field-error">{err("scope.productIds")}</p>}
        </fieldset>
      )}

      {d.kind === "sizes" && (
        <fieldset className="a-fieldset">
          <legend>اختار الأحجام</legend>
          <SizeChips sizes={allSizes} selected={d.sizes} onChange={(sizes) => set({ sizes })} />
          {err("scope.sizes") && <p className="a-field-error">{err("scope.sizes")}</p>}
        </fieldset>
      )}

      {d.kind === "variant" && (
        <>
          <fieldset className="a-fieldset">
            <legend>اختار العطر</legend>
            <ProductPicker products={products} selected={d.productId ? [d.productId] : []}
              onChange={(ids) => set({ productId: ids[0] ?? "", sizes: [] })} />
            {err("scope.productId") && <p className="a-field-error">{err("scope.productId")}</p>}
          </fieldset>
          {variantProduct && (
            <fieldset className="a-fieldset">
              <legend>الحجم من «{displayName(variantProduct)}»</legend>
              <SizeChips sizes={variantSizes} selected={d.sizes} onChange={(sizes) => set({ sizes })} />
              {err("scope.sizes") && <p className="a-field-error">{err("scope.sizes")}</p>}
            </fieldset>
          )}
        </>
      )}

      <fieldset className="a-fieldset">
        <legend>المدة <small>(اختياري — بتوقيت مصر)</small></legend>
        <div className="a-two">
          <label className={`a-field${err("startDate") ? " has-error" : ""}`}>
            <span>يبدأ يوم</span>
            <input type="date" value={d.startDate} onChange={(e) => set({ startDate: e.target.value })} aria-invalid={!!err("startDate")} />
            {err("startDate") ? <small className="a-field-error">{err("startDate")}</small> : <small>فاضي = يبدأ على طول</small>}
          </label>
          <label className={`a-field${err("endDate") ? " has-error" : ""}`}>
            <span>آخر يوم</span>
            <input type="date" value={d.endDate} min={d.startDate || undefined} onChange={(e) => set({ endDate: e.target.value })} aria-invalid={!!err("endDate")} />
            {err("endDate") ? <small className="a-field-error">{err("endDate")}</small> : <small>فاضي = لحد ما تقفله</small>}
          </label>
        </div>
      </fieldset>

      <label className="a-toggle">
        <span><b>الخصم شغال</b><small>{d.enabled ? "هيتطبق في المدة اللي فوق" : "متوقف — مش هيتطبق لحد ما تشغّله"}</small></span>
        <input type="checkbox" role="switch" checked={d.enabled} onChange={(e) => set({ enabled: e.target.checked })} />
        <i aria-hidden="true" />
      </label>

      <RulePreview draft={d} id={rule?.id ?? "new"} products={products} byId={byId} others={others} />

      <div className="a-row-editor-actions">
        <button type="button" className="a-btn a-btn--ghost" onClick={cancel} disabled={saving}>إلغاء</button>
        <button type="button" className="a-btn a-btn--primary" onClick={() => void save()} disabled={saving || (!!rule && !dirty)}>
          {saving ? "جاري الحفظ…" : rule ? "حفظ التعديل" : "حفظ الخصم"}
        </button>
      </div>
    </div>
  );
}

/** Live preview in plain words, computed with the storefront's pricing functions. */
function RulePreview({ draft, id, products, byId, others }: {
  draft: Draft; id: string; products: AdminProduct[]; byId: (id: string) => AdminProduct | undefined; others: DiscountRule[];
}) {
  const rule = draftRule(draft, id);
  if (!rule) {
    return <div className="a-preview a-preview--empty"><Icon name="eye" /><p>اكتب النسبة واختار الخصم على إيه، وهتشوف هنا هيتطبق إزاي.</p></div>;
  }
  const now = new Date();
  const status = ruleStatus(rule, now);
  const store: Product[] = products.filter((p) => p.status === "published").map(toStorefrontProduct);
  const hits: { p: Product; size: number; base: number }[] = [];
  for (const p of store) for (const s of productSizes(p)) if (scopeMatches(rule.scope, p, s)) hits.push({ p, size: s, base: p.prices[s] });
  const productCount = new Set(hits.map((h) => h.p.id)).size;
  // Bottles where another active rule gives more (no stacking: the highest wins).
  const beaten = hits.filter((h) => {
    const other = bestRule(h.p, h.size, { discounts: others }, now);
    return other && other.percent > rule.percent;
  });
  const sample = hits[0];

  return (
    <div className="a-preview" aria-live="polite">
      <Icon name="eye" />
      <div>
        <p>
          <b>هيتطبق خصم {rule.percent}% على {scopeText(rule.scope, byId)}</b>
          {" — "}زجاجة {money(1000)} هتبقى {money(discountedPrice(1000, rule.percent))}.
        </p>
        {sample && (
          <p>مثال من المتجر: {sample.p.name} {sample.size} مل: <s>{fmt(sample.base)}</s> ← <b>{money(discountedPrice(sample.base, rule.percent))}</b></p>
        )}
        <p className="a-muted">
          {hits.length ? `بيشمل ${productCount} عطر منشور (${hits.length} زجاجة).` : "مفيش ولا عطر منشور بيطابق الاختيار ده دلوقتي."}
          {" "}{datesText(rule)}.
          {rule.name && <> بيظهر للعميل: <b>{rule.name} <bdi dir="ltr">-{rule.percent}%</bdi></b>.</>}
        </p>
        {status !== "active" && (
          <p className="a-preview-warn">
            {status === "off" && "الخصم مقفول — مش هيظهر للعملاء لحد ما تشغّله."}
            {status === "scheduled" && `لسه ما بدأش — هيبدأ يوم ${dayText(rule.startDate!)}.`}
            {status === "ended" && "المدة خلصت — الخصم مش ظاهر للعملاء."}
          </p>
        )}
        {beaten.length > 0 && (
          <p className="a-preview-warn">على {beaten.length} زجاجة فيه خصم تاني أعلى، وهو اللي هيتطبق عليها.</p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------- Pickers -------------------------------- */

function ProductPicker({ products, selected, onChange, multiple = false }: {
  products: AdminProduct[]; selected: string[]; onChange: (ids: string[]) => void; multiple?: boolean;
}) {
  const [q, setQ] = useState("");
  const chosen = new Set(selected);
  const terms = normalize(q).split(" ").filter(Boolean);
  const list = products.filter((p) => terms.every((t) => normalize(`${p.name} ${p.nameEn} ${p.house}`).includes(t)));
  const pick = (id: string, on: boolean) => {
    if (!multiple) return onChange(on ? [id] : []);
    onChange(on ? [...selected, id] : selected.filter((x) => x !== id));
  };
  return (
    <div className="a-picker">
      <label className="a-search">
        <Icon name="search" />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث باسم العطر أو الماركة" aria-label="بحث عن عطر" />
      </label>
      {multiple && (
        <div className="a-picker-bar">
          <button type="button" className="a-chip a-chip--sm" onClick={() => onChange([...new Set([...selected, ...list.map((p) => p.id)])])}>اختار كل اللي ظاهر</button>
          {selected.length > 0 && <button type="button" className="a-chip a-chip--sm" onClick={() => onChange([])}>شيل الاختيار</button>}
        </div>
      )}
      <ul className="a-picker-list" role="list">
        {list.length === 0 && <li className="a-muted a-small">مفيش عطور مطابقة.</li>}
        {list.map((p) => (
          <li key={p.id}>
            <label className={chosen.has(p.id) ? "is-on" : ""}>
              <input type={multiple ? "checkbox" : "radio"} name={multiple ? undefined : "variant-product"} checked={chosen.has(p.id)} onChange={(e) => pick(p.id, e.target.checked)} />
              <ProductThumb p={p} size={40} />
              <span className="a-row-main">
                <b>{displayName(p)}</b>
                <small dir="auto">{p.house} · {categoryLabel(p.category)}{p.status === "draft" ? " · مسودة" : ""}</small>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SizeChips({ sizes, selected, onChange }: { sizes: number[]; selected: number[]; onChange: (s: number[]) => void }) {
  if (!sizes.length) return <p className="a-muted a-small">مفيش أحجام.</p>;
  return (
    <div className="a-chips">
      {sizes.map((s) => {
        const on = selected.includes(s);
        return (
          <button key={s} type="button" className={`a-chip${on ? " is-on" : ""}`} aria-pressed={on}
            onClick={() => onChange(on ? selected.filter((x) => x !== s) : [...selected, s].sort((a, b) => a - b))}>
            {on && <Icon name="check" />}{s} مل
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------- Free shipping ----------------------------- */

function FreeShippingCard({ value, onSaved }: { value: FreeShipping; onSaved: (p: PricingSettings) => void }) {
  const { toast } = useFeedback();
  const [enabled, setEnabled] = useState(value.enabled);
  const [min, setMin] = useState(String(value.min));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => { setEnabled(value.enabled); setMin(String(value.min)); }, [value]);
  const dirty = enabled !== value.enabled || Number(min || 0) !== value.min;
  const amount = Number(min || 0);
  const example = Math.round((amount * 0.8) / 10) * 10; // an order a bit under the threshold

  const save = async () => {
    const r = freeShippingSchema.safeParse({ enabled, min: min === "" ? undefined : min });
    if (!r.success) { const m = Object.values(fieldErrors(r.error))[0]; setError(m); toast(m, "error"); return; }
    setSaving(true);
    try {
      const res = await api.saveFreeShipping(r.data);
      onSaved(res.pricing);
      toast(SAVED, "success", STORE_LINK);
    } catch (e) {
      const m = e instanceof ApiError ? e.message : "الحفظ فشل. حاول تاني.";
      setError(e instanceof ApiError ? e.fields.min ?? "" : "");
      toast(m, "error");
    } finally { setSaving(false); }
  };

  return (
    <section className="a-section" aria-labelledby="ship-title">
      <h3 id="ship-title"><Icon name="truck" />الشحن المجاني</h3>
      <label className="a-toggle">
        <span><b>شحن مجاني فوق مبلغ معين</b><small>{enabled ? "شغال" : "مقفول — كل الطلبات بتدفع الشحن"}</small></span>
        <input type="checkbox" role="switch" checked={enabled} onChange={(e) => { setEnabled(e.target.checked); setError(""); }} />
        <i aria-hidden="true" />
      </label>
      {enabled && (
        <label className={`a-field${error ? " has-error" : ""}`}>
          <span>الشحن مجاني لما مجموع الطلب يوصل</span>
          <span className="a-input-suffix">
            <input inputMode="numeric" value={min} placeholder="1500" onChange={(e) => { setMin(digits(e.target.value).slice(0, 7)); setError(""); }} aria-invalid={!!error} />
            <em>ج.م</em>
          </span>
          {error ? <small className="a-field-error">{error}</small> : <small>بيتحسب على المجموع بعد الخصم</small>}
        </label>
      )}
      <div className="a-preview" aria-live="polite">
        <Icon name="eye" />
        <div>
          {enabled
            ? <p>أي طلب مجموعه <b>بعد الخصم</b> {money(amount)} أو أكتر، شحنه <b>مجاني</b>. لو أقل، العميل بيشوف في السلة: «باقي لك {money(amount - example)} وتاخد شحن مجاني» (مثال لطلب بـ {money(example)}).</p>
            : <p>الشحن المجاني مقفول — كل طلب بيدفع شحن حسب المحافظة.</p>}
        </div>
      </div>
      <p className="a-muted a-small">أسعار الشحن لكل محافظة بتتعدل من <a href={href({ name: "content" })}>محتوى الموقع ← إعدادات البيع والتواصل</a>.</p>
      <div className="a-row-editor-actions">
        <button type="button" className="a-btn a-btn--ghost" disabled={!dirty || saving} onClick={() => { setEnabled(value.enabled); setMin(String(value.min)); setError(""); }}>تراجع</button>
        <button type="button" className="a-btn a-btn--primary" disabled={!dirty || saving} onClick={() => void save()}>{saving ? "جاري الحفظ…" : "حفظ الشحن"}</button>
      </div>
    </section>
  );
}
