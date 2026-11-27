/* Homepage content & store settings editor. Everything the storefront shows
   from site content is editable here; changes go live on save. */
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Icon } from "../../components/ui/Icon";
import {
  contentSchema, normalizeSections, SECTION_LABELS, settingsSchema, type EditableSettings,
} from "../../shared/content";
import { fieldErrors } from "../../shared/product";
import type { Review, SiteContent, StoreSettings } from "../../types/content";
import { useFeedback } from "../components/feedback";
import { ImagePicker } from "../components/ImagePicker";
import { api, ApiError } from "../lib/api";
import { href, setLeaveGuard } from "../lib/router";
import { LoadError } from "./Products";

type Errors = Record<string, string>;
const EDITABLE_SETTINGS = ["whatsappNumber", "generalWhatsappMessage", "shippingZones",
  "phone", "phoneDisplay", "email", "social"] as const;
const pickSettings = (s: StoreSettings): EditableSettings =>
  Object.fromEntries(EDITABLE_SETTINGS.map((k) => [k, s[k]])) as EditableSettings;

/** Admin is served from /admin/, bundled images live at /assets/…. */
const imgSrc = (p: string) => (p.startsWith("/") || /^https?:/.test(p) ? p : `../${p}`);

/** Which panel each error path lives in (to open it and scroll there). */
const PANEL_OF = (path: string) =>
  path.startsWith("hero") ? "p-hero" : path.startsWith("announcements") ? "p-offers" : path.startsWith("sections") ? "p-sections"
    : path.startsWith("benefit") ? "p-benefits" : /^(bestSellers|quizCta|catalog)/.test(path) ? "p-heads"
    : path.startsWith("review") ? "p-reviews" : path.startsWith("about") ? "p-about" : path.startsWith("faq") ? "p-faq"
    : /^(contact|footer)/.test(path) ? "p-contact" : "p-settings";

export function Content() {
  const { toast } = useFeedback();
  const [base, setBase] = useState<{ content: SiteContent; settings: EditableSettings } | null>(null);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [settings, setSettings] = useState<EditableSettings | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState<Set<string>>(new Set(["p-hero"]));

  const load = () => api.content().then((d) => {
    const c = { ...d.content, sections: normalizeSections(d.content.sections) };
    const s = pickSettings(d.settings);
    setBase({ content: c, settings: s }); setContent(c); setSettings(s); setErrors({});
  }).catch((e) => setLoadError(e instanceof ApiError ? e.message : "تعذّر التحميل"));
  useEffect(() => { void load(); }, []);

  const contentDirty = useMemo(() => !!base && JSON.stringify(content) !== JSON.stringify(base.content), [content, base]);
  const settingsDirty = useMemo(() => !!base && JSON.stringify(settings) !== JSON.stringify(base.settings), [settings, base]);
  const dirty = contentDirty || settingsDirty;
  useEffect(() => { setLeaveGuard(() => !dirty || saving); return () => setLeaveGuard(null); }, [dirty, saving]);

  if (loadError) return <LoadError text={loadError} retry={() => { setLoadError(""); void load(); }} />;
  if (!content || !settings || !base) return <div className="a-loading" aria-busy="true">جاري التحميل…</div>;

  const c = content, s = settings;
  const setC = (patch: Partial<SiteContent>) => setContent({ ...c, ...patch });
  const setS = (patch: Partial<EditableSettings>) => setSettings({ ...s, ...patch });
  const err = (p: string) => errors[p];
  const toggle = (id: string) => setOpen((o) => { const n = new Set(o); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  const save = async () => {
    const rc = contentSchema.safeParse(c);
    const rs = settingsSchema.safeParse(s);
    const errs: Errors = { ...(rc.success ? {} : fieldErrors(rc.error)), ...(rs.success ? {} : prefix(fieldErrors(rs.error), "settings.")) };
    if (Object.keys(errs).length) {
      setErrors(errs);
      const first = Object.keys(errs)[0];
      const panel = PANEL_OF(first);
      setOpen((o) => new Set(o).add(panel));
      window.setTimeout(() => document.getElementById(panel)?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
      toast(`راجع الحقول المعلّمة: ${Object.values(errs)[0]}`, "error");
      return;
    }
    setSaving(true);
    try {
      let nc = base.content, ns = base.settings;
      if (contentDirty) nc = { ...(await api.saveContent(rc.data!)).content };
      if (settingsDirty) ns = pickSettings((await api.saveSettings(rs.data!)).settings);
      setBase({ content: nc, settings: ns }); setContent(nc); setSettings(ns); setErrors({});
      toast("تم الحفظ — التغييرات ظاهرة في المتجر دلوقتي", "success", { label: "عرض في المتجر", href: "../" });
    } catch (e) {
      if (e instanceof ApiError && Object.keys(e.fields).length) setErrors(e.fields);
      toast(e instanceof ApiError ? e.message : "الحفظ فشل. حاول تاني.", "error");
    } finally {
      setSaving(false);
    }
  };

  /** Props for a collapsible panel (Panel itself is defined outside so inputs keep focus). */
  const pp = (id: string) => ({ id, isOpen: open.has(id), hasError: Object.keys(errors).some((k) => PANEL_OF(k) === id), onToggle: () => toggle(id) });

  const heads = (key: "bestSellers" | "quizCta" | "catalog" | "reviews" | "about" | "faq" | "contact", label: string, withText = true) => (
    <>
      <Field label={`${label} — العنوان الصغير`} value={c[key].kicker} onChange={(v) => setC({ [key]: { ...c[key], kicker: v } } as Partial<SiteContent>)} error={err(`${key}.kicker`)} />
      <Field label={`${label} — العنوان`} value={c[key].title} onChange={(v) => setC({ [key]: { ...c[key], title: v } } as Partial<SiteContent>)} error={err(`${key}.title`)} display />
      {withText && <Field label={`${label} — نص تحت العنوان`} value={c[key].text ?? ""} multiline onChange={(v) => setC({ [key]: { ...c[key], text: v || undefined } } as Partial<SiteContent>)} error={err(`${key}.text`)} hint="اختياري" />}
    </>
  );

  return (
    <div className="a-content-editor">
      <div className="a-page-intro">
        <div>
          <h2 className="a-display">محتوى الموقع</h2>
          <p className="a-muted">عدّل نصوص الصفحة الرئيسية وإعدادات البيع. التغييرات بتظهر للعملاء أول ما تحفظ.</p>
        </div>
        <a className="a-btn a-btn--outline" href="../" target="_blank" rel="noopener"><Icon name="eye" />عرض المتجر</a>
      </div>

      <Panel {...pp("p-hero")} title="الواجهة الرئيسية" hint="الشعار والعنوان والصورة">
        <Field label="الشعار" value={c.hero.slogan} onChange={(v) => setC({ hero: { ...c.hero, slogan: v } })} error={err("hero.slogan")} display />
        <Field label="العنوان الرئيسي" value={c.hero.titleLine1} onChange={(v) => setC({ hero: { ...c.hero, titleLine1: v } })} error={err("hero.titleLine1")} display />
        <Field label="السطر التاني للعنوان" value={c.hero.titleLine2} onChange={(v) => setC({ hero: { ...c.hero, titleLine2: v } })} error={err("hero.titleLine2")} hint="اختياري — بيظهر باللون الذهبي" />
        <Field label="النص التعريفي" value={c.hero.description} multiline onChange={(v) => setC({ hero: { ...c.hero, description: v } })} error={err("hero.description")} />
        <Field label="سطر جنب الصورة" value={c.hero.tagline} onChange={(v) => setC({ hero: { ...c.hero, tagline: v } })} error={err("hero.tagline")} />
        <div className="a-two">
          <Field label="زرار التصفح" value={c.hero.primaryCta} onChange={(v) => setC({ hero: { ...c.hero, primaryCta: v } })} error={err("hero.primaryCta")} />
          <Field label="زرار الاختبار" value={c.hero.secondaryCta} onChange={(v) => setC({ hero: { ...c.hero, secondaryCta: v } })} error={err("hero.secondaryCta")} />
        </div>
        <SubTitle>الأرقام تحت الأزرار</SubTitle>
        <ListEditor
          items={c.hero.stats} max={4} addLabel="رقم جديد" itemLabel={(i) => `رقم ${i + 1}`}
          newItem={() => ({ value: "", label: "" })}
          onChange={(stats) => setC({ hero: { ...c.hero, stats } })}
          render={(st, i, up) => (
            <div className="a-two">
              <Field label="الرقم" value={st.value} onChange={(v) => up({ ...st, value: v })} error={err(`hero.stats.${i}.value`)} hint="مثال: +20" />
              <Field label="الوصف" value={st.label} onChange={(v) => up({ ...st, label: v })} error={err(`hero.stats.${i}.label`)} />
            </div>
          )}
        />
        <SubTitle>صورة الواجهة</SubTitle>
        <ImagePicker kind="site" compact url={imgSrc(c.hero.image)} error={err("hero.image")}
          onUploaded={(_k, url) => setC({ hero: { ...c.hero, image: url } })} />
      </Panel>

      <Panel {...pp("p-offers")} title="شريط العروض" hint="الشريط اللي فوق الصفحة">
        <RichHint vars />
        <ListEditor
          items={c.announcements} max={6} addLabel="عرض جديد" itemLabel={(i) => `عرض ${i + 1}`} newItem={() => ""}
          onChange={(announcements) => setC({ announcements })}
          render={(a, i, up) => <Field label="نص العرض" value={a} onChange={up} error={err(`announcements.${i}`)} />}
        />
        {err("announcements") && <p className="a-field-error">{err("announcements")}</p>}
      </Panel>

      <Panel {...pp("p-sections")} title="ترتيب وإظهار الأقسام" hint="رتّب أقسام الصفحة أو اخفي أي قسم">
        <p className="a-muted a-small">الواجهة الرئيسية دايمًا في الأول. القسم المخفي بيختفي من الصفحة ومن القائمة.</p>
        <ol className="a-sections-list">
          {c.sections!.map((sec, i) => (
            <li key={sec.id} className={sec.visible ? "" : "is-hidden"}>
              <span className="a-pos a-pos--static">{i + 1}</span>
              <label className="a-toggle a-toggle--inline">
                <span><b>{SECTION_LABELS[sec.id]}</b><small>{sec.visible ? "ظاهر" : "مخفي"}</small></span>
                <input type="checkbox" role="switch" checked={sec.visible}
                  onChange={(e) => setC({ sections: c.sections!.map((x) => (x.id === sec.id ? { ...x, visible: e.target.checked } : x)) })} />
                <i aria-hidden="true" />
              </label>
              <span className="a-arrows">
                <button type="button" disabled={i === 0} onClick={() => setC({ sections: move(c.sections!, i, i - 1) })} aria-label={`تقديم ${SECTION_LABELS[sec.id]}`}><Icon name="arrowUp" /></button>
                <button type="button" disabled={i === c.sections!.length - 1} onClick={() => setC({ sections: move(c.sections!, i, i + 1) })} aria-label={`تأخير ${SECTION_LABELS[sec.id]}`}><Icon name="arrowDown" /></button>
              </span>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel {...pp("p-benefits")} title="مميزات المتجر" hint="الأربع نقط تحت الواجهة">
        {c.benefits.map((b, i) => (
          <div key={i} className="a-subcard">
            <p className="a-subcard-title">ميزة {i + 1}</p>
            <Field label="العنوان" value={b.title} onChange={(v) => setC({ benefits: c.benefits.map((x, k) => (k === i ? { ...x, title: v } : x)) })} error={err(`benefits.${i}.title`)} />
            <Field label="الوصف" value={b.text} onChange={(v) => setC({ benefits: c.benefits.map((x, k) => (k === i ? { ...x, text: v } : x)) })} error={err(`benefits.${i}.text`)} />
          </div>
        ))}
      </Panel>

      <Panel {...pp("p-heads")} title="عناوين الأقسام" hint="الأكثر طلبًا، اكتشف عطرك، التشكيلة">
        <SubTitle>الأكثر طلبًا</SubTitle>
        {heads("bestSellers", "الأكثر طلبًا")}
        <SubTitle>اكتشف عطرك</SubTitle>
        {heads("quizCta", "اكتشف عطرك")}
        <Field label="نص زرار الاختبار" value={c.quizCta.button} onChange={(v) => setC({ quizCta: { ...c.quizCta, button: v } })} error={err("quizCta.button")} />
        <SubTitle>التشكيلة</SubTitle>
        {heads("catalog", "التشكيلة")}
        <Field label="النص داخل خانة البحث" value={c.catalog.searchPlaceholder} onChange={(v) => setC({ catalog: { ...c.catalog, searchPlaceholder: v } })} error={err("catalog.searchPlaceholder")} />
        <Field label="رسالة لما البحث ما يلاقيش نتايج" value={c.catalog.noResults} onChange={(v) => setC({ catalog: { ...c.catalog, noResults: v } })} error={err("catalog.noResults")} />
      </Panel>

      <Panel {...pp("p-reviews")} title="آراء العملاء" hint={`${c.reviewItems.length} رأي`}>
        {heads("reviews", "آراء العملاء")}
        <SubTitle>الآراء</SubTitle>
        <ListEditor
          items={c.reviewItems} max={60} addLabel="رأي جديد" itemLabel={(i) => `رأي ${i + 1}`}
          newItem={(): Review => ({ text: "", name: "", source: "whatsapp" })} addAtTop
          onChange={(reviewItems) => setC({ reviewItems })}
          render={(r, i, up) => (
            <>
              <Field label="نص الرأي" value={r.text} multiline onChange={(v) => up({ ...r, text: v })} error={err(`reviewItems.${i}.text`)} />
              <div className="a-two">
                <Field label="اسم العميل" value={r.name} onChange={(v) => up({ ...r, name: v })} error={err(`reviewItems.${i}.name`)} hint="اختياري" />
                <label className="a-field">
                  <span>المصدر</span>
                  <select value={r.source} onChange={(e) => up({ ...r, source: e.target.value as Review["source"] })}>
                    <option value="facebook">توصية على فيسبوك</option>
                    <option value="whatsapp">رسالة على واتساب</option>
                    <option value="message">رسالة من عميل</option>
                  </select>
                </label>
              </div>
            </>
          )}
        />
      </Panel>

      <Panel {...pp("p-about")} title="من نحن" hint="النص والصور">
        {heads("about", "من نحن", false)}
        <Field label="النص" value={c.about.text ?? ""} multiline rows={5} onChange={(v) => setC({ about: { ...c.about, text: v } })} error={err("about.text")} />
        <Field label="نص الزرار" value={c.about.cta} onChange={(v) => setC({ about: { ...c.about, cta: v } })} error={err("about.cta")} />
        <SubTitle>الصور (3)</SubTitle>
        <div className="a-about-images">
          {c.about.images.map((img, i) => (
            <div key={i}>
              <p className="a-small a-muted">{["الصورة الكبيرة", "الصورة الصغيرة فوق", "الصورة الصغيرة تحت"][i]}</p>
              <ImagePicker kind="site" compact url={imgSrc(img)} error={err(`about.images.${i}`)}
                onUploaded={(_k, url) => setC({ about: { ...c.about, images: c.about.images.map((x, k) => (k === i ? url : x)) } })} />
            </div>
          ))}
        </div>
      </Panel>

      <Panel {...pp("p-faq")} title="الأسئلة الشائعة" hint={`${c.faqItems.length} سؤال`}>
        {heads("faq", "الأسئلة الشائعة", false)}
        <RichHint quiz />
        <ListEditor
          items={c.faqItems} max={40} addLabel="سؤال جديد" itemLabel={(i) => `سؤال ${i + 1}`}
          newItem={() => ({ q: "", a: "" })}
          onChange={(faqItems) => setC({ faqItems })}
          render={(f, i, up) => (
            <>
              <Field label="السؤال" value={f.q} onChange={(v) => up({ ...f, q: v })} error={err(`faqItems.${i}.q`)} />
              <Field label="الإجابة" value={f.a} multiline rows={3} onChange={(v) => up({ ...f, a: v })} error={err(`faqItems.${i}.a`)} />
            </>
          )}
        />
      </Panel>

      <Panel {...pp("p-contact")} title="تواصل معنا والفوتر">
        {heads("contact", "تواصل معنا")}
        <Field label="زرار واتساب" value={c.contact.whatsappCta} onChange={(v) => setC({ contact: { ...c.contact, whatsappCta: v } })} error={err("contact.whatsappCta")} />
        <Field label="ملاحظة التوصيل" value={c.contact.deliveryNote} onChange={(v) => setC({ contact: { ...c.contact, deliveryNote: v } })} error={err("contact.deliveryNote")} />
        <SubTitle>الفوتر</SubTitle>
        <Field label="اسم المتجر" value={c.footer.brandName} onChange={(v) => setC({ footer: { ...c.footer, brandName: v } })} error={err("footer.brandName")} />
        <Field label="جملة الفوتر" value={c.footer.tagline} onChange={(v) => setC({ footer: { ...c.footer, tagline: v } })} error={err("footer.tagline")} />
        <Field label="نص الحقوق" value={c.footer.copyright} multiline onChange={(v) => setC({ footer: { ...c.footer, copyright: v } })} error={err("footer.copyright")} />
        <SubTitle>عنوان المميزات (لقارئ الشاشة)</SubTitle>
        <Field label="عنوان قسم المميزات" value={c.benefitsTitle} onChange={(v) => setC({ benefitsTitle: v })} error={err("benefitsTitle")} />
      </Panel>

      <Panel {...pp("p-settings")} title="إعدادات البيع والتواصل" hint="الواتساب، أسعار الشحن، السوشيال">
        <Field label="رقم الواتساب (للطلبات)" value={s.whatsappNumber} dir="ltr" inputMode="numeric" onChange={(v) => setS({ whatsappNumber: v.replace(/[^\d]/g, "") })} error={err("settings.whatsappNumber")}
          hint="بالصيغة الدولية بدون + وبدون الصفر الأول — مثال: 201006747034" />
        <Field label="رسالة واتساب العامة" value={s.generalWhatsappMessage} multiline onChange={(v) => setS({ generalWhatsappMessage: v })} error={err("settings.generalWhatsappMessage")} />
        <div className="a-notice">
          <Icon name="gift" />
          <p>الخصومات والشحن المجاني اتنقلوا لصفحة <a href={href({ name: "pricing" })}><b>الخصومات والشحن</b></a>.</p>
        </div>
        <SubTitle>أسعار الشحن</SubTitle>
        <ListEditor
          items={s.shippingZones} max={12} min={1} addLabel="منطقة جديدة" itemLabel={(i) => `منطقة ${i + 1}`}
          newItem={() => ({ id: `zone-${Math.random().toString(36).slice(2, 8)}`, label: "", fee: 0 })}
          onChange={(shippingZones) => setS({ shippingZones })}
          render={(z, i, up) => (
            <div className="a-two">
              <Field label="المنطقة" value={z.label} onChange={(v) => up({ ...z, label: v })} error={err(`settings.shippingZones.${i}.label`)} />
              <Field label="سعر الشحن (ج.م)" value={String(z.fee)} inputMode="numeric" onChange={(v) => up({ ...z, fee: num(v) })} error={err(`settings.shippingZones.${i}.fee`)} />
            </div>
          )}
        />
        <SubTitle>التواصل</SubTitle>
        <div className="a-two">
          <Field label="رقم التليفون (للاتصال)" value={s.phone} dir="ltr" onChange={(v) => setS({ phone: v })} error={err("settings.phone")} hint="مثال: +201006747034" />
          <Field label="الرقم كما يظهر" value={s.phoneDisplay} dir="ltr" onChange={(v) => setS({ phoneDisplay: v })} error={err("settings.phoneDisplay")} />
        </div>
        <Field label="البريد الإلكتروني" value={s.email} dir="ltr" onChange={(v) => setS({ email: v })} error={err("settings.email")} />
        <Field label="إنستجرام" value={s.social.instagram} dir="ltr" onChange={(v) => setS({ social: { ...s.social, instagram: v } })} error={err("settings.social.instagram")} />
        <Field label="فيسبوك" value={s.social.facebook} dir="ltr" onChange={(v) => setS({ social: { ...s.social, facebook: v } })} error={err("settings.social.facebook")} />
        <Field label="تيك توك" value={s.social.tiktok} dir="ltr" onChange={(v) => setS({ social: { ...s.social, tiktok: v } })} error={err("settings.social.tiktok")} />
      </Panel>

      <div className={`a-sticky-bar${dirty ? " is-dirty" : ""}`}>
        <span className="a-sticky-status">{saving ? "جاري الحفظ…" : dirty ? "فيه تغييرات لسه ما اتحفظتش" : "كل التغييرات محفوظة"}</span>
        <button type="button" className="a-btn a-btn--outline" disabled={!dirty || saving}
          onClick={() => { setContent(base.content); setSettings(base.settings); setErrors({}); }}>تراجع</button>
        <button type="button" className="a-btn a-btn--primary" disabled={!dirty || saving} onClick={save}>{saving ? "جاري الحفظ…" : "حفظ التغييرات"}</button>
      </div>
    </div>
  );
}

/* ------------------------------ Helpers ------------------------------ */

function Panel({ id, title, hint, isOpen, hasError, onToggle, children }: {
  id: string; title: string; hint?: string; isOpen: boolean; hasError: boolean; onToggle: () => void; children: ReactNode;
}) {
  return (
    <section className={`a-cpanel${isOpen ? " is-open" : ""}${hasError ? " has-error" : ""}`} id={id}>
      <button type="button" className="a-cpanel-head" onClick={onToggle} aria-expanded={isOpen}>
        <span><b>{title}</b>{hint && <small>{hint}</small>}</span>
        {hasError && <Icon name="alert" />}
        <Icon name="chevron" />
      </button>
      {isOpen && <div className="a-cpanel-body">{children}</div>}
    </section>
  );
}

const num = (v: string) => Number(v.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).replace(/[^\d]/g, "") || 0);
const prefix = (e: Errors, p: string) => Object.fromEntries(Object.entries(e).map(([k, v]) => [p + k, v]));
function move<T>(list: T[], from: number, to: number): T[] {
  const n = [...list]; const [x] = n.splice(from, 1); n.splice(to, 0, x); return n;
}

function Field({ label, value, onChange, error, hint, multiline, rows = 2, dir, inputMode, display }: {
  label: string; value: string; onChange: (v: string) => void; error?: string; hint?: string;
  multiline?: boolean; rows?: number; dir?: "ltr"; inputMode?: "numeric"; display?: boolean;
}) {
  return (
    <label className={`a-field${error ? " has-error" : ""}`}>
      <span>{label}</span>
      {multiline
        ? <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} dir={dir} aria-invalid={!!error} />
        : <input value={value} onChange={(e) => onChange(e.target.value)} dir={dir} inputMode={inputMode} aria-invalid={!!error} className={display ? "a-input-display" : undefined} />}
      {hint && !error && <small>{hint}</small>}
      {error && <small className="a-field-error">{error}</small>}
    </label>
  );
}

const SubTitle = ({ children }: { children: ReactNode }) => <p className="a-subtitle">{children}</p>;

function RichHint({ vars, quiz }: { vars?: boolean; quiz?: boolean }) {
  return (
    <div className="a-rich-hint">
      <p>عشان كلمة تظهر <b>بخط عريض</b> حطها بين نجمتين: <code dir="ltr">**مجاني**</code></p>
      {vars && <p><code dir="ltr">{"{freeMin}"}</code> = مبلغ التوصيل المجاني، <code dir="ltr">{"{discount}"}</code> = أعلى نسبة خصم شغالة دلوقتي — بيتحدّثوا لوحدهم من «الخصومات والشحن». السطر اللي فيه <code dir="ltr">{"{discount}"}</code> بيختفي لو مفيش خصم شغال، واللي فيه <code dir="ltr">{"{freeMin}"}</code> بيختفي لو الشحن المجاني مقفول.</p>}
      {quiz && <p>عشان تحط زرار يفتح الاختبار: <code dir="ltr">{"{{quiz|اكتشف عطرك}}"}</code></p>}
    </div>
  );
}

/** Add / remove / reorder items with big touch controls. */
function ListEditor<T>({ items, onChange, render, newItem, addLabel, itemLabel, max, min = 0, addAtTop }: {
  items: T[]; onChange: (items: T[]) => void; render: (item: T, i: number, update: (v: T) => void) => ReactNode;
  newItem: () => T; addLabel: string; itemLabel: (i: number) => string; max: number; min?: number; addAtTop?: boolean;
}) {
  const { confirm } = useFeedback();
  const lastAdded = useRef<number | null>(null);
  useEffect(() => {
    if (lastAdded.current === null) return;
    document.querySelector<HTMLElement>(`[data-item="${lastAdded.current}"] input, [data-item="${lastAdded.current}"] textarea`)?.focus();
    lastAdded.current = null;
  });
  const add = () => { const next = addAtTop ? [newItem(), ...items] : [...items, newItem()]; lastAdded.current = addAtTop ? 0 : items.length; onChange(next); };
  const remove = async (i: number) => {
    if (!(await confirm({ title: `حذف ${itemLabel(i)}؟`, text: "هيتشال من الموقع بعد ما تحفظ.", confirmLabel: "حذف", danger: true }))) return;
    onChange(items.filter((_, k) => k !== i));
  };
  const addBtn = items.length < max && (
    <button type="button" className="a-btn a-btn--outline a-btn--block" onClick={add}><Icon name="plus" />{addLabel}</button>
  );
  return (
    <div className="a-list-editor">
      {addAtTop && addBtn}
      {items.map((item, i) => (
        <div key={i} className="a-subcard" data-item={i}>
          <div className="a-subcard-head">
            <p className="a-subcard-title">{itemLabel(i)}</p>
            <span className="a-arrows a-arrows--row">
              <button type="button" disabled={i === 0} onClick={() => onChange(move(items, i, i - 1))} aria-label={`تقديم ${itemLabel(i)}`}><Icon name="arrowUp" /></button>
              <button type="button" disabled={i === items.length - 1} onClick={() => onChange(move(items, i, i + 1))} aria-label={`تأخير ${itemLabel(i)}`}><Icon name="arrowDown" /></button>
              <button type="button" className="a-del" disabled={items.length <= min} onClick={() => void remove(i)} aria-label={`حذف ${itemLabel(i)}`}><Icon name="trash" /></button>
            </span>
          </div>
          {render(item, i, (v) => onChange(items.map((x, k) => (k === i ? v : x))))}
        </div>
      ))}
      {!addAtTop && addBtn}
    </div>
  );
}
