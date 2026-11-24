import { Icon } from "./Icon";

/** Numbered pagination (RTL: "previous" points right, "next" points left). */
export function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  if (pages <= 1) return null;
  const nums = Array.from({ length: pages }, (_, i) => i + 1);
  return (
    <nav className="pagination" aria-label="صفحات التشكيلة">
      <button type="button" className="page-btn page-btn--step" onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="الصفحة السابقة">
        <Icon name="arrowRight" /><span>السابق</span>
      </button>
      <ol className="page-list">
        {nums.map((n) => (
          <li key={n}>
            <button
              type="button"
              className={`page-btn${n === page ? " is-current" : ""}`}
              aria-current={n === page ? "page" : undefined}
              aria-label={`صفحة ${n}`}
              onClick={() => onChange(n)}
            >
              {n}
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className="page-btn page-btn--step" onClick={() => onChange(page + 1)} disabled={page === pages} aria-label="الصفحة التالية">
        <span>التالي</span><Icon name="arrowLeft" />
      </button>
    </nav>
  );
}
