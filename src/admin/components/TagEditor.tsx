/* Quiz tags, using the storefront quiz's own questions and labels.
   Audience = product category; scents are ordered (first = primary, weighted
   higher by the quiz); occasions multi-select; intensity single. */
import { Icon } from "../../components/ui/Icon";
import { QUIZ } from "../../domain/quiz";
import { AUDIENCES, INTENSITIES, OCCASIONS, SCENTS, type AdminProduct } from "../../shared/product";
import { LABELS } from "../lib/format";

export type TagValue = Pick<AdminProduct, "category" | "scents" | "occasions" | "intensity">;
const q = (key: string) => QUIZ.find((x) => x.key === key)!;

export function TagEditor({ value, onChange, errors = {}, showCategory = true }: {
  value: TagValue; onChange: (v: TagValue) => void; errors?: Record<string, string>; showCategory?: boolean;
}) {
  const set = (patch: Partial<TagValue>) => onChange({ ...value, ...patch });
  const toggle = <T extends string>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const makePrimary = (s: TagValue["scents"][number]) => set({ scents: [s, ...value.scents.filter((x) => x !== s)] });

  return (
    <div className="a-tags">
      {showCategory && (
        <fieldset className="a-fieldset">
          <legend>{q("who").q} <small>(التصنيف)</small></legend>
          <div className="a-segment">
            {AUDIENCES.map((a) => (
              <label key={a} className={value.category === a ? "is-on" : ""}>
                <input type="radio" name="category" value={a} checked={value.category === a} onChange={() => set({ category: a })} />
                {LABELS.audience[a]}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset className="a-fieldset" aria-describedby="scent-help">
        <legend>{q("scent").q} <small>(اختر واحد أو أكتر)</small></legend>
        <div className="a-chips">
          {SCENTS.map((s) => {
            const i = value.scents.indexOf(s);
            return (
              <button key={s} type="button" className={`a-chip${i >= 0 ? " is-on" : ""}`} aria-pressed={i >= 0} onClick={() => set({ scents: toggle(value.scents, s) })}>
                {i >= 0 && <Icon name="check" />}{LABELS.scents[s].label}
                {i === 0 && value.scents.length > 1 && <em>الأساسي</em>}
              </button>
            );
          })}
        </div>
        {value.scents.length > 1 && (
          <div className="a-primary-pick" id="scent-help">
            <p>النوع <b>الأساسي</b> بياخد أولوية أعلى في ترشيحات الاختبار:</p>
            <div className="a-chips">
              {value.scents.map((s, i) => (
                <button key={s} type="button" className={`a-chip a-chip--sm${i === 0 ? " is-primary" : ""}`} aria-pressed={i === 0} onClick={() => makePrimary(s)}>
                  {i === 0 ? <Icon name="star" /> : null}{LABELS.scents[s].label}
                </button>
              ))}
            </div>
          </div>
        )}
        {errors.scents && <p className="a-field-error">{errors.scents}</p>}
      </fieldset>

      <fieldset className="a-fieldset">
        <legend>{q("use").q} <small>(اختر واحد أو أكتر)</small></legend>
        <div className="a-chips">
          {OCCASIONS.map((o) => (
            <button key={o} type="button" className={`a-chip${value.occasions.includes(o) ? " is-on" : ""}`} aria-pressed={value.occasions.includes(o)} onClick={() => set({ occasions: toggle(value.occasions, o) })}>
              {value.occasions.includes(o) && <Icon name="check" />}{LABELS.occasions[o]}
            </button>
          ))}
        </div>
        {errors.occasions && <p className="a-field-error">{errors.occasions}</p>}
      </fieldset>

      <fieldset className="a-fieldset">
        <legend>{q("strength").q} <small>(قوة العطر)</small></legend>
        <div className="a-segment">
          {INTENSITIES.map((s) => (
            <label key={s} className={value.intensity === s ? "is-on" : ""}>
              <input type="radio" name="intensity" value={s} checked={value.intensity === s} onChange={() => set({ intensity: s })} />
              {LABELS.intensity[s]}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
