import { Icon } from "../components/ui/Icon";
import { RichText } from "../components/ui/RichText";
import { useStore } from "../state/StoreProvider";

export function Faq() {
  const { content } = useStore();
  return (
    <section className="section faq" id="faq" aria-labelledby="faq-title">
      <div className="container faq-grid">
        <div className="faq-head" data-reveal>
          <p className="kicker">{content.faq.kicker}</p>
          <h2 id="faq-title" className="display">{content.faq.title}</h2>
        </div>
        <div className="faq-list" data-reveal>
          {content.faqItems.map((f) => (
            <details key={f.q} className="faq-item">
              <summary>{f.q}<span className="faq-toggle"><Icon name="plus" /></span></summary>
              <p><RichText text={f.a} /></p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
