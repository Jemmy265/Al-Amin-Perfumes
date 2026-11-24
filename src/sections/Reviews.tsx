import { useRef } from "react";
import { Icon } from "../components/ui/Icon";
import { SectionHead } from "../components/ui/SectionHead";
import { useStore } from "../state/StoreProvider";
import { gsap, prefersReducedMotion, useGSAP } from "../motion/gsap";

const SOURCE_LABEL = { facebook: "توصية على فيسبوك", whatsapp: "رسالة على واتساب", message: "رسالة من عميل" } as const;

export function Reviews() {
  const { content } = useStore();
  const track = useRef<HTMLDivElement>(null);

  // Cards rise in one after another when the carousel enters the viewport.
  useGSAP(() => {
    if (prefersReducedMotion() || !track.current) return;
    gsap.from(track.current.children, {
      y: 50, autoAlpha: 0, duration: 1, stagger: 0.12, ease: "power3.out",
      scrollTrigger: { trigger: track.current, start: "top 85%", once: true },
    });
  }, { scope: track });
  const step = () => (track.current?.firstElementChild?.getBoundingClientRect().width ?? 300) + 20;
  // RTL: scrolling "forward" is a negative scrollLeft.
  const go = (dir: 1 | -1) => track.current?.scrollBy({ left: -dir * step(), behavior: "smooth" });

  return (
    <section className="section reviews" id="reviews" aria-labelledby="reviews-title">
      <div className="container">
        <SectionHead
          head={content.reviews}
          id="reviews-title"
          aside={
            <div className="carousel-nav">
              <button type="button" onClick={() => go(-1)} aria-label="السابق"><Icon name="arrowRight" /></button>
              <button type="button" onClick={() => go(1)} aria-label="التالي"><Icon name="arrowLeft" /></button>
            </div>
          }
        />
        <div className="reviews-track" ref={track} tabIndex={0} aria-label="آراء العملاء">
          {content.reviewItems.map((r, i) => (
            <figure key={i} className="review-card">
              <span className="review-stars" aria-label="تقييم ٥ نجوم">★★★★★</span>
              <blockquote>{r.text}</blockquote>
              <figcaption>{r.name && <><b>{r.name}</b> · </>}{SOURCE_LABEL[r.source]}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
