import { ProductImage, StartingPrice } from "../components/product/parts";
import { SectionHead } from "../components/ui/SectionHead";
import { Icon } from "../components/ui/Icon";
import { useStore } from "../state/StoreProvider";
import { Reveal } from "../motion";

export function BestSellers() {
  const { content, settings, byId } = useStore();
  const items = settings.bestSellers.map(byId).filter((p) => !!p);
  if (!items.length) return null;
  return (
    <section className="section best" id="best" aria-labelledby="best-title">
      <div className="container">
        <SectionHead
          head={content.bestSellers}
          id="best-title"
          aside={<a className="text-link" href="#products">عرض التشكيلة كاملة <Icon name="arrowLeft" /></a>}
        />
        <Reveal className="best-grid" stagger={0.12} distance={50}>
          {items.map((p, i) => (
            <a key={p.id} className="best-card" href={`#perfume/${p.id}`}>
              <span className="best-media">
                <ProductImage p={p} />
                <span className="best-rank">{String(i + 1).padStart(2, "0")}</span>
              </span>
              <span className="best-info">
                <span className="product-house">مستوحى من <bdi dir="ltr">{p.house}</bdi></span>
                <span className="best-name">{p.name}</span>
                <span className="best-en" dir="ltr">{p.nameEn}</span>
                <StartingPrice p={p} className="best-price" />
              </span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
