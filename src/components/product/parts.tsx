import { useId } from "react";
import { fmt, percentBadge, priceInfo, productBestDiscount, productSizes } from "../../domain/pricing";
import { assetUrl } from "../../services/assets";
import { useStore } from "../../state/StoreProvider";
import type { Product, SizeMl } from "../../types/catalog";
import { Icon } from "../ui/Icon";

export function ProductChips({ p }: { p: Product }) {
  const { settings, labels } = useStore();
  const best = settings.bestSellers.includes(p.id);
  const off = productBestDiscount(p, settings);
  return (
    <span className="chips">
      <span className="chip chip--solid">{labels.audience[p.tags.audience]}</span>
      {off && <span className="chip chip--gold">{off.rule?.name ? <>{off.rule.name} <bdi dir="ltr">{percentBadge(off.percent)}</bdi></> : <bdi dir="ltr">{percentBadge(off.percent)}</bdi>}</span>}
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
      {productSizes(p).map((s) => {
        const { base, final, discounted, percent } = priceInfo(p, s, settings);
        return (
          <label key={s} className="size">
            <input type="radio" name={name} value={s} checked={value === s} onChange={() => onChange(s)} />
            <span className="size-pill">
              {discounted && <span className="size-off" dir="ltr">{percentBadge(percent)}</span>}
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

/** Price of the selected size (product page): new price, old price crossed out, badge + rule name. */
export function SelectedPrice({ p, size }: { p: Product; size: SizeMl }) {
  const { settings } = useStore();
  const info = priceInfo(p, size, settings);
  const C = settings.currency;
  return (
    <p className="selected-price" aria-live="polite">
      <b>{fmt(info.final)} <small>{C}</small></b>
      {info.discounted && (
        <>
          <s aria-label={`بدل ${fmt(info.base)} ${C}`}>{fmt(info.base)} {C}</s>
          <span className="chip chip--gold"><bdi dir="ltr">{percentBadge(info.percent)}</bdi>{info.rule?.name ? ` ${info.rule.name}` : ""}</span>
        </>
      )}
    </p>
  );
}

/** "يبدأ من" price for small cards, with the old price crossed out when discounted. */
export function StartingPrice({ p, className }: { p: Product; className: string }) {
  const { settings } = useStore();
  const s = productSizes(p)[0];
  const info = s === undefined ? null : priceInfo(p, s, settings);
  return (
    <span className={className}>
      يبدأ من {fmt(info?.final ?? 0)} {settings.currency}
      {info?.discounted && <> <s className="price-was">{fmt(info.base)}</s></>}
    </span>
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

