import { assetUrl } from "../services/assets";
import { useStore } from "../state/StoreProvider";
import { useUI } from "../state/UIProvider";
import { Icon } from "../components/ui/Icon";

export function Hero() {
  const { content } = useStore();
  const { openQuiz } = useUI();
  const h = content.hero;
  return (
    <section className="hero" id="hero" aria-labelledby="hero-title">
      <div className="hero-ornament hero-ornament--a" aria-hidden="true" />
      <div className="hero-ornament hero-ornament--b" aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="hero-lockup hero-anim" style={{ ["--d" as string]: "0ms" }}>
            <img src={assetUrl("assets/logo-mark.png")} alt="" width={56} height={56} />
            <span>
              <b>الأمين للعطور</b>
              <small dir="ltr">ALAMIN PERFUMES</small>
            </span>
          </div>
          <p className="hero-slogan hero-anim" style={{ ["--d" as string]: "100ms" }}>{h.slogan}</p>
          <h1 id="hero-title" className="hero-title hero-anim" style={{ ["--d" as string]: "200ms" }}>
            {h.titleLine1}
            <em>{h.titleLine2}</em>
          </h1>
          <p className="hero-desc hero-anim" style={{ ["--d" as string]: "300ms" }}>{h.description}</p>
          <div className="hero-actions hero-anim" style={{ ["--d" as string]: "400ms" }}>
            <a href="#products" className="btn btn-navy btn-lg">{h.primaryCta} <Icon name="arrowLeft" /></a>
            <button type="button" className="btn btn-outline btn-lg" onClick={openQuiz}>{h.secondaryCta}</button>
          </div>
          <ul className="hero-stats hero-anim" style={{ ["--d" as string]: "500ms" }}>
            {h.stats.map((s) => <li key={s.label}><b>{s.value}</b><span>{s.label}</span></li>)}
          </ul>
        </div>

        <div className="hero-visual hero-anim" style={{ ["--d" as string]: "150ms" }}>
          <div className="hero-arch-back" aria-hidden="true" />
          <div className="hero-arch">
            <img src={assetUrl(h.image)} alt="عطر من تشكيلة الأمين للعطور" width={675} height={900} fetchPriority="high" />
          </div>
          <div className="hero-seal" aria-hidden="true">
            <img src={assetUrl("assets/logo-mark.png")} alt="" width={60} height={60} />
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
