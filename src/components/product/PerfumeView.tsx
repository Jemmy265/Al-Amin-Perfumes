import { useEffect, useState } from "react";
import { productSizes } from "../../domain/pricing";
import { similarTo } from "../../domain/similar";
import { perfumeUrl, shareMessage, singleOrderMessage, waLink } from "../../domain/whatsapp";
import { usePerfumeRoute } from "../../hooks/usePerfumeRoute";
import { useStore } from "../../state/StoreProvider";
import { useUI } from "../../state/UIProvider";
import type { Intensity, Product } from "../../types/catalog";
import { Icon } from "../ui/Icon";
import { Sheet } from "../ui/Sheet";
import { metaText, NotesList, ProductChips, ProductImage, SelectedPrice, SizeSelector, StartingPrice } from "./parts";
import { useAddToCart } from "./useAddToCart";

const LEVEL: Record<Intensity, number> = { light: 1, medium: 2, strong: 3 };

/** The perfume page, opened by …/#perfume/<id> (original deep-link format). */
export function PerfumeView() {
  const { id, close } = usePerfumeRoute();
  const { byId } = useStore();
  const p = id ? byId(id) : undefined;
  const [shown, setShown] = useState<Product | undefined>(p);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (p) {
      if (!shown) setScrollY(window.scrollY);
      setShown(p);
      document.title = `${p.name} (${p.nameEn}) | الأمين للعطور`;
      document.querySelector(".sheet--page")?.scrollTo({ top: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p]);

  const onClose = () => {
    close();
    document.title = BASE_TITLE;
    window.setTimeout(() => { setShown(undefined); window.scrollTo({ top: scrollY, behavior: "instant" }); }, 220);
  };

  return (
    <Sheet open={!!p} onClose={onClose} variant="page" labelledBy="pv-title">
      <header className="sheet-head">
        <button type="button" className="sheet-back" onClick={onClose}><Icon name="arrowRight" /> رجوع للتشكيلة</button>
        <button type="button" className="sheet-close" onClick={onClose} aria-label="إغلاق"><Icon name="close" /></button>
      </header>
      <div className="sheet-body">{shown && <PerfumeDetails key={shown.id} p={shown} />}</div>
    </Sheet>
  );
}

const BASE_TITLE = document.title;

function PerfumeDetails({ p }: { p: Product }) {
  const { settings, labels, products } = useStore();
  const { showToast } = useUI();
  const [size, setSize] = useState(() => productSizes(p)[0]);
  const addToCart = useAddToCart();
  const sim = similarTo(p, products, settings.bestSellers);
  const lvl = LEVEL[p.tags.intensity] ?? 2;
  const meta = metaText(p);
  const url = perfumeUrl(p, settings);

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); showToast("اتنسخ اللينك"); }
    catch { window.prompt("انسخ اللينك:", url); }
  };

  return (
    <>
      <div className="pv-grid">
        <div className="pv-media">
          <ProductImage p={p} eager />
          <ProductChips p={p} />
        </div>
        <div className="pv-info">
          <p className="product-house">مستوحى من <bdi dir="ltr">{p.house}</bdi></p>
          <h2 id="pv-title" className="pv-title">{p.name}</h2>
          <p className="pv-en" dir="ltr">{p.nameEn}</p>
          {p.family && <p className="pv-family">{p.family}</p>}

          <dl className="pv-facts">
            <div><dt>نوع الريحة</dt><dd>{p.tags.scents.map((s) => labels.scents[s]?.label).join("، ")}</dd></div>
            <div>
              <dt>القوة</dt>
              <dd className={`strength s${lvl}`}><span className="strength-bar"><i /><i /><i /></span>{labels.intensity[p.tags.intensity]}</dd>
            </div>
            <div><dt>مناسب لـ</dt><dd>{p.tags.occasions.map((u) => labels.occasions[u]).join("، ")}</dd></div>
            <div><dt>لمين</dt><dd>{labels.audience[p.tags.audience]}</dd></div>
          </dl>

          <NotesList p={p} icons />
          {meta && <p className="product-meta">{meta}</p>}

          <SizeSelector p={p} value={size} onChange={setSize} />
          <SelectedPrice p={p} size={size} />
          <div className="card-actions">
            <button type="button" className="btn btn-navy add-btn" onClick={() => addToCart(p, size)}>
              <Icon name="bag" /><span>أضف للسلة</span>
            </button>
            <a className="btn btn-icon" target="_blank" rel="noopener"
              href={waLink(settings.whatsappNumber, singleOrderMessage(p, size, settings))}
              aria-label="اطلب مباشرة عبر واتساب" title="اطلب مباشرة عبر واتساب"><Icon name="wa" /></a>
          </div>

          <div className="pv-share">
            <span>شارك العطر:</span>
            <a className="share-btn" target="_blank" rel="noopener" href={`https://wa.me/?text=${encodeURIComponent(shareMessage(p, settings))}`}>
              <Icon name="wa" /><span>واتساب</span>
            </a>
            <button type="button" className="share-btn" onClick={copy}><Icon name="link" /><span>نسخ اللينك</span></button>
          </div>
        </div>
      </div>

      {sim.length > 0 && (
        <section className="pv-similar">
          <h3>عطور ممكن تعجبك كمان</h3>
          <div className="mini-grid">
            {sim.map((x) => (
              <a key={x.id} className="mini-card" href={`#perfume/${x.id}`}>
                <ProductImage p={x} />
                <span className="mini-name">{x.name}</span>
                <span className="mini-en" dir="ltr">{x.nameEn}</span>
                <StartingPrice p={x} className="mini-price" />
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
