/* Sizes & prices: one row per size, quick-add for the store's usual sizes. */
import { Icon } from "../../components/ui/Icon";
import { SEED_SETTINGS } from "../../data/seed/content";
import { money } from "../lib/format";

export interface SizeRow { key: number; sizeMl: string; price: string }
let seq = 0;
export const newRow = (sizeMl = "", price = ""): SizeRow => ({ key: ++seq, sizeMl, price });

const COMMON = SEED_SETTINGS.sizes; // 35 / 55 / 110
const discount = SEED_SETTINGS.sizeDiscount;

export function SizeRows({ rows, onChange, error }: { rows: SizeRow[]; onChange: (r: SizeRow[]) => void; error?: string }) {
  const update = (key: number, patch: Partial<SizeRow>) => onChange(rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const used = new Set(rows.map((r) => Number(r.sizeMl)));
  const digits = (s: string) => s.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).replace(/[^\d]/g, "");

  return (
    <div className="a-sizes">
      {rows.map((r, i) => {
        const price = Number(r.price);
        const off = discount.percent && Number(r.sizeMl) === discount.size && price > 0;
        return (
          <div key={r.key} className="a-size-row">
            <label className="a-field a-field--compact">
              <span>الحجم {i + 1}</span>
              <span className="a-input-suffix">
                <input inputMode="numeric" value={r.sizeMl} onChange={(e) => update(r.key, { sizeMl: digits(e.target.value) })} placeholder="55" aria-label={`الحجم ${i + 1} بالمل`} />
                <em>مل</em>
              </span>
            </label>
            <label className="a-field a-field--compact">
              <span>السعر</span>
              <span className="a-input-suffix">
                <input inputMode="numeric" value={r.price} onChange={(e) => update(r.key, { price: digits(e.target.value) })} placeholder="450" aria-label={`سعر الحجم ${i + 1}`} />
                <em>ج.م</em>
              </span>
            </label>
            <button type="button" className="a-icon-btn a-icon-btn--danger" onClick={() => onChange(rows.filter((x) => x.key !== r.key))}
              disabled={rows.length === 1} aria-label={`حذف الحجم ${i + 1}`}><Icon name="trash" /></button>
            {off ? <p className="a-size-note">على الموقع بعد خصم {discount.percent}%: {money(Math.round(price * (100 - discount.percent) / 100))}</p> : null}
          </div>
        );
      })}
      {error && <p className="a-field-error">{error}</p>}
      <div className="a-size-add">
        {COMMON.filter((s) => !used.has(s)).map((s) => (
          <button key={s} type="button" className="a-chip" onClick={() => onChange([...rows.filter((r) => r.sizeMl || r.price), newRow(String(s))])}>
            <Icon name="plus" />{s} مل
          </button>
        ))}
        <button type="button" className="a-chip" onClick={() => onChange([...rows, newRow()])}><Icon name="plus" />حجم تاني</button>
      </div>
    </div>
  );
}
