import { assetUrl } from "../services/assets";
import { useStore } from "../state/StoreProvider";

export function About() {
  const { content } = useStore();
  const a = content.about;
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="container about-grid">
        <div className="about-visual" aria-hidden="true" data-reveal>
          {a.images.slice(0, 3).map((src, i) => (
            <img key={src} src={assetUrl(src)} alt="" className={`about-img about-img--${i + 1}`} loading="lazy" width={600} height={750} />
          ))}
        </div>
        <div className="about-copy" data-reveal>
          <p className="kicker">{a.kicker}</p>
          <h2 id="about-title" className="display">{a.title}</h2>
          <p>{a.text}</p>
          <p className="about-slogan display">{content.hero.slogan}</p>
          <a href="#products" className="btn btn-navy">{a.cta}</a>
        </div>
      </div>
    </section>
  );
}
