import { useId } from "react";
import { fmt, priceInfo } from "../../domain/pricing";
import { assetUrl } from "../../services/assets";
import { useStore } from "../../state/StoreProvider";
import type { Product, SizeMl } from "../../types/catalog";
import { Icon } from "../ui/Icon";

export function ProductChips({ p }: { p: Product }) {
  const { settings, labels } = useStore();
  const best = settings.bestSellers.includes(p.id);
  return (
    <span className="chips">
      <span className="chip chip--solid">{labels.audience[p.tags.audience]}</span>
      {best && <span className="chip chip--gold">الأكثر طلبًا</span>}
      {p.isNew && <span className="chip">جديد</span>}
      {p.label && <span className="chip">{p.label}</span>}
    </span>
  );
}

export function ScentList({ p }: { p: Product }) {
  const { labels } = useStore();
  return (
    <p className="scent-list">
      {p.tags.scents.map((s) => labels.scents[s]?.label).filter(Boolean).join(" · ")}
    </p>
  );
}

export function SizeSelector({ p, value, onChange }: { p: Product; value: SizeMl; onChange: (s: SizeMl) => void }) {
  const { settings } = useStore();
  const name = useId();
  return (
    <div className="sizes" role="radiogroup" aria-label="اختر الحجم">
      {settings.sizes.map((s) => {
        const { base, final, discounted } = priceInfo(p, s, settings);
        return (
          <label key={s} className="size">
            <input type="radio" name={name} value={s} checked={value === s} onChange={() => onChange(s)} />
            <span className="size-pill">
              {discounted && <span className="size-off" dir="ltr">-{settings.sizeDiscount.percent}%</span>}
              <span className="size-ml">{s} مل</span>
              <span className="size-price">{fmt(final)} <small>{settings.currency}</small></span>
              {discounted && <s className="size-was">{fmt(base)}</s>}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export function NotesList({ p, icons = false }: { p: Product; icons?: boolean }) {
  const n = p.notes;
  const rows: [string, string | undefined, string][] = n.all
    ? [["المكوّنات", n.all, "heart"]]
    : [["الافتتاحية", n.top, "top"], ["القلب", n.heart, "heart"], ["القاعدة", n.base, "base"]];
  return (
    <dl className={`notes${icons ? " notes--icons" : ""}`}>
      {rows.filter(([, v]) => v).map(([label, v, ico]) => (
        <div key={label}>
          {icons && <span className="note-ico"><Icon name={ico} /></span>}
          <dt>{label}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function metaText(p: Product): string {
  return [p.year ? `صدر الأصلي عام ${p.year}` : "", p.perfumer ? `بتوقيع ${p.perfumer}` : ""].filter(Boolean).join(" ");
}

export function ProductImage({ p, className = "", eager = false }: { p: Product; className?: string; eager?: boolean }) {
  return (
    <img
      className={className}
      src={assetUrl(p.image)}
      alt={`${p.name} — ${p.nameEn}`}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      width={600}
      height={750}
    />
  );
}

export function startingPrice(p: Product, settings: Parameters<typeof priceInfo>[2] & { sizes: SizeMl[] }) {
  return priceInfo(p, settings.sizes[0], settings).final;
}
