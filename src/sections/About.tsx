import { assetUrl } from "../services/assets";
import { useRef } from "react";
import { Reveal, RevealText } from "../motion";
import { gsap, prefersReducedMotion, useGSAP } from "../motion/gsap";
import { useStore } from "../state/StoreProvider";

export function About() {
  const { content } = useStore();
  const a = content.about;
  const root = useRef<HTMLElement>(null);

  // Layered parallax: each photo moves at its own speed, the arch unveils on entry.
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const q = gsap.utils.selector(root);
    const st = (end = "bottom top") => ({ trigger: q(".about-visual")[0], start: "top bottom", end, scrub: 1 });
    gsap.fromTo(q(".about-img--1"), { clipPath: "inset(100% 0 0 0 round 150px 150px 4px 4px)" },
      { clipPath: "inset(0% 0 0 0 round 150px 150px 4px 4px)", ease: "none", scrollTrigger: st("center center") });
    gsap.fromTo(q(".about-img--2"), { yPercent: 30 }, { yPercent: -25, ease: "none", scrollTrigger: st() });
    gsap.fromTo(q(".about-img--3"), { yPercent: 45 }, { yPercent: -10, ease: "none", scrollTrigger: st() });
  }, { scope: root });
  return (
    <section className="section about" id="about" aria-labelledby="about-title" ref={root}>
      <div className="container about-grid">
        <div className="about-visual" aria-hidden="true">
          {a.images.slice(0, 3).map((src, i) => (
            <img key={src} src={assetUrl(src)} alt="" className={`about-img about-img--${i + 1}`} loading="lazy" width={600} height={750} />
          ))}
        </div>
        <Reveal className="about-copy">
          <p className="kicker">{a.kicker}</p>
          <h2 id="about-title" className="display"><RevealText text={a.title} /></h2>
          <p>{a.text}</p>
          <p className="about-slogan display">{content.hero.slogan}</p>
          <a href="#products" className="btn btn-navy">{a.cta}</a>
        </Reveal>
      </div>
    </section>
  );
}
