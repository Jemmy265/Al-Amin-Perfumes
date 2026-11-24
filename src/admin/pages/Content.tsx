/* Homepage content — read-only for now. The data already lives in D1
   (site_kv: settings / content / labels) and is served to the storefront by
   GET /api/site, so editing can be added without changing the structure. */
import { useEffect, useState } from "react";
import { Icon } from "../../components/ui/Icon";
import type { SiteContent, StoreSettings } from "../../types/content";
import { api, ApiError } from "../lib/api";
import { LoadError } from "./Products";

export function Content() {
  const [data, setData] = useState<{ content: SiteContent; settings: StoreSettings } | null>(null);
  const [error, setError] = useState("");
  const load = () => api.content().then((d) => setData(d as never)).catch((e) => setError(e instanceof ApiError ? e.message : "تعذّر التحميل"));
  useEffect(() => { void load(); }, []);

  if (error) return <LoadError text={error} retry={() => { setError(""); void load(); }} />;
  if (!data) return <div className="a-loading" aria-busy="true">جاري التحميل…</div>;
  const { content: c, settings: s } = data;

  return (
    <div>
      <div className="a-page-intro">
        <div>
          <h2 className="a-display">محتوى الصفحة الرئيسية</h2>
          <p className="a-muted">النصوص الحالية في المتجر.</p>
        </div>
      </div>
      <div className="a-notice"><Icon name="doc" /><p>تعديل النصوص من هنا هيتضاف في المرحلة الجاية. حاليًا تقدر تشوف المحتوى الموجود.</p></div>

      <section className="a-panel">
        <h3>الواجهة الرئيسية</h3>
        <Item label="الشعار" value={c.hero.slogan} display />
        <Item label="سطر تحت الصورة" value={c.hero.tagline} />
        <Item label="العنوان" value={`${c.hero.titleLine1} — ${c.hero.titleLine2}`} />
        <Item label="النص التعريفي" value={c.hero.description} />
      </section>
      <section className="a-panel">
        <h3>شريط العروض</h3>
        {c.announcements.map((a, i) => <Item key={i} label={`عرض ${i + 1}`} value={a.replace(/\*\*/g, "").replace("{freeMin}", s.freeShippingMin.toLocaleString("en-US")).replace("{discount}", String(s.sizeDiscount.percent))} />)}
      </section>
      <section className="a-panel">
        <h3>إعدادات البيع</h3>
        <Item label="رقم الواتساب" value={s.whatsappNumber} ltr />
        <Item label="توصيل مجاني من" value={`${s.freeShippingMin.toLocaleString("en-US")} ج.م`} />
        <Item label="خصم الحجم" value={`${s.sizeDiscount.percent}% على ${s.sizeDiscount.size} مل`} />
        <Item label="الشحن" value={s.shippingZones.map((z) => `${z.label}: ${z.fee} ج.م`).join(" · ")} />
      </section>
    </div>
  );
}

function Item({ label, value, display, ltr }: { label: string; value: string; display?: boolean; ltr?: boolean }) {
  return (
    <div className="a-item">
      <span>{label}</span>
      <p className={display ? "a-display" : ""} dir={ltr ? "ltr" : undefined}>{value}</p>
    </div>
  );
}
