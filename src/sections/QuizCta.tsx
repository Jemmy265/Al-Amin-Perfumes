import { Icon } from "../components/ui/Icon";
import { assetUrl } from "../services/assets";
import { useRef } from "react";
import { Reveal, RevealText } from "../motion";
import { gsap, prefersReducedMotion, useGSAP } from "../motion/gsap";
import { useStore } from "../state/StoreProvider";
import { useUI } from "../state/UIProvider";

export function QuizCta() {
  const { content } = useStore();
  const { openQuiz } = useUI();
  const c = content.quizCta;
  const root = useRef<HTMLElement>(null);

  // Rings drift and the monogram rises as the section scrolls through.
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const q = gsap.utils.selector(root);
    const st = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 };
    gsap.fromTo(q(".ring--1"), { scale: 0.85 }, { scale: 1.08, ease: "none", scrollTrigger: st });
    gsap.fromTo(q(".ring--2"), { scale: 1.1 }, { scale: 0.92, ease: "none", scrollTrigger: st });
    gsap.fromTo(q(".ring--3"), { rotate: 0 }, { rotate: 90, ease: "none", scrollTrigger: st });
    gsap.fromTo(q(".discover-art img"), { yPercent: 18, autoAlpha: 0.4 }, { yPercent: -10, autoAlpha: 1, ease: "none", scrollTrigger: st });
  }, { scope: root });
  return (
    <section className="discover" aria-labelledby="discover-title" ref={root}>
      <div className="container discover-grid">
        <div className="discover-art" aria-hidden="true">
          <span className="ring ring--1" /><span className="ring ring--2" /><span className="ring ring--3" />
          <img src={assetUrl("assets/logo-mark-light.png")} alt="" width={180} height={180} loading="lazy" />
        </div>
        <Reveal className="discover-copy">
          <p className="kicker kicker--light">{c.kicker}</p>
          <h2 id="discover-title" className="display"><RevealText text={c.title} /></h2>
          <p>{c.text}</p>
          <button type="button" className="btn btn-gold btn-lg" onClick={openQuiz}>{c.button} <Icon name="arrowLeft" /></button>
        </Reveal>
      </div>
    </section>
  );
}
