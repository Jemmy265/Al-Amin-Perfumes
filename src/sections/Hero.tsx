import { useRef } from "react";
import { Icon } from "../components/ui/Icon";
import { CountUp, RevealText } from "../motion";
import { gsap, prefersReducedMotion, useGSAP } from "../motion/gsap";
import { assetUrl } from "../services/assets";
import { useStore } from "../state/StoreProvider";
import { useUI } from "../state/UIProvider";

export function Hero() {
  const { content } = useStore();
  const { openQuiz } = useUI();
  const h = content.hero;
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    if (prefersReducedMotion()) {
      gsap.set(q("[data-intro]"), { autoAlpha: 1 });
      return;
    }

    // Intro (on load)
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(q(".hero-arch-back"), { y: 40, autoAlpha: 0, duration: 1.2 }, 0)
      .fromTo(q(".hero-arch"), { clipPath: "inset(100% 0% 0% 0% round 190px 190px 4px 4px)" },
        { clipPath: "inset(0% 0% 0% 0% round 190px 190px 4px 4px)", duration: 1.4, ease: "expo.inOut" }, 0.1)
      .from(q(".hero-arch img"), { scale: 1.25, duration: 1.8, ease: "expo.out" }, 0.25)
      .fromTo(q(".hero-seal"), { autoAlpha: 0, scale: 0.6, rotate: -40 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 1.1, ease: "back.out(1.6)" }, 0.9)
      .fromTo(q(".hero-tagline"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 1.2)
      .fromTo(q(".hero-lockup"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.15)
      .fromTo(q(".hero-slogan"), { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 1 }, 0.3)
      .fromTo(q(".hero-desc, .hero-actions, .hero-stats"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.9)
      .fromTo(q(".benefit"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, 1.2);

    // Parallax while scrolling past the hero — desktop/tablet only. On phones the
    // photo and the navy panel stay in their designed positions (no drifting
    // panel over the text), and scrolling stays cheaper.
    const mm = gsap.matchMedia();
    mm.add("(min-width: 921px)", () => {
      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(q(".hero-arch img"), { yPercent: 10, ease: "none", scrollTrigger: st });
      gsap.to(q(".hero-arch-back"), { yPercent: -8, ease: "none", scrollTrigger: st });
      gsap.to(q(".hero-ornament--a"), { rotate: 25, ease: "none", scrollTrigger: st });
      gsap.to(q(".hero-ornament--b"), { rotate: -20, scale: 1.08, ease: "none", scrollTrigger: st });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section className="hero" id="hero" aria-labelledby="hero-title" ref={root}>
      <div className="hero-ornament hero-ornament--a" aria-hidden="true" />
      <div className="hero-ornament hero-ornament--b" aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="hero-lockup" data-intro>
            <img src={assetUrl("assets/logo-mark.png")} alt="" width={56} height={56} />
            <span>
              <b>الأمين للعطور</b>
              <small dir="ltr">ALAMIN PERFUMES</small>
            </span>
          </div>
          <p className="hero-slogan" data-intro>{h.slogan}</p>
          <h1 id="hero-title" className="hero-title">
            <span className="hero-title-line"><RevealText text={h.titleLine1} trigger="load" delay={110} /></span>
            <em><RevealText text={h.titleLine2} trigger="load" delay={110} /></em>
          </h1>
          <p className="hero-desc" data-intro>{h.description}</p>
          <div className="hero-actions" data-intro>
            <a href="#products" className="btn btn-navy btn-lg">{h.primaryCta} <Icon name="arrowLeft" /></a>
            <button type="button" className="btn btn-outline btn-lg" onClick={openQuiz}>{h.secondaryCta}</button>
          </div>
          <ul className="hero-stats" data-intro>
            {h.stats.map((s, i) => <li key={s.label}><CountUp value={s.value} delay={1.2 + i * 0.15} /><span>{s.label}</span></li>)}
          </ul>
        </div>

        <div className="hero-visual">
          {/* The figure is sized by the photo; the navy panel and seal are positioned
              relative to it, so nothing below can be overlapped (see sections.css). */}
          <div className="hero-figure">
            <div className="hero-arch-back" aria-hidden="true" />
            <div className="hero-arch">
              <img src={assetUrl(h.image)} alt="عطر من تشكيلة الأمين للعطور" width={675} height={900} fetchPriority="high" />
            </div>
            <div className="hero-seal" aria-hidden="true">
              <img src={assetUrl("assets/logo-mark.png")} alt="" width={60} height={60} />
            </div>
          </div>
          <p className="hero-tagline">{h.tagline}</p>
        </div>
      </div>

      <div className="container">
        <h2 className="visually-hidden">{content.benefitsTitle}</h2>
        <ul className="benefits">
          {content.benefits.map((b) => (
            <li key={b.title} className="benefit">
              <span className="benefit-icon"><Icon name={b.icon} /></span>
              <span><b>{b.title}</b><small>{b.text}</small></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
