import type { AdminProduct } from "../../shared/product";
import { displayName } from "../lib/format";

export function ProductThumb({ p, size = 52 }: { p: AdminProduct; size?: number }) {
  return (
    <span className="a-thumb" style={{ width: size, height: Math.round(size * 1.15) }}>
      {p.imageUrl ? <img src={p.imageUrl} alt="" loading="lazy" /> : <span aria-hidden="true">{displayName(p).slice(0, 1)}</span>}
    </span>
  );
}

export function StatusPill({ p }: { p: AdminProduct }) {
  return <span className={`a-pill a-pill--${p.status}`}>{p.status === "published" ? "منشور" : "مسودة"}</span>;
}
