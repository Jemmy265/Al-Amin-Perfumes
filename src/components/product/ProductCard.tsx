import { useState } from "react";
import { waLink, singleOrderMessage } from "../../domain/whatsapp";
import { useStore } from "../../state/StoreProvider";
import type { Product } from "../../types/catalog";
import { Icon } from "../ui/Icon";
import { metaText, NotesList, ProductChips, ProductImage, ScentList, SizeSelector } from "./parts";
import { useAddToCart } from "./useAddToCart";

export function ProductCard({ p }: { p: Product }) {
  const { settings } = useStore();
  const [size, setSize] = useState(settings.sizes[0]);
  const [added, setAdded] = useState(false);
  const addToCart = useAddToCart();
  const meta = metaText(p);

  return (
    <article className="product-card" data-reveal>
      <a className="product-media" href={`#perfume/${p.id}`} aria-label={`تفاصيل ${p.name}`}>
        <ProductImage p={p} />
        <ProductChips p={p} />
        <span className="media-hint">عرض التفاصيل</span>
      </a>
      <div className="product-body">
        <p className="product-house">مستوحى من <bdi dir="ltr">{p.house}</bdi></p>
        <h3 className="product-name"><a href={`#perfume/${p.id}`}>{p.name}</a></h3>
        <p className="product-en" dir="ltr">{p.nameEn}</p>
        <ScentList p={p} />

        <details className="product-details">
          <summary><span>مكوّنات العطر</span><Icon name="chevron" className="chevron" /></summary>
          <NotesList p={p} />
          {meta && <p className="product-meta">{meta}</p>}
        </details>

        <SizeSelector p={p} value={size} onChange={setSize} />

        <div className="card-actions">
          <button
            type="button"
            className={`btn btn-navy add-btn${added ? " is-added" : ""}`}
            onClick={() => { addToCart(p, size); setAdded(true); window.setTimeout(() => setAdded(false), 900); }}
          >
            <Icon name={added ? "check" : "bag"} />
            <span>أضف للسلة</span>
          </button>
          <a
            className="btn btn-icon"
            target="_blank"
            rel="noopener"
            href={waLink(settings.whatsappNumber, singleOrderMessage(p, size, settings))}
            aria-label={`اطلب ${p.name} مباشرة عبر واتساب`}
            title="اطلب مباشرة عبر واتساب"
          >
            <Icon name="wa" />
          </a>
        </div>
      </div>
    </article>
  );
}
