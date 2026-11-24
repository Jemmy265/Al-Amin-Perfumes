import { Icon } from "../components/ui/Icon";
import { assetUrl } from "../services/assets";
import { useStore } from "../state/StoreProvider";
import { useUI } from "../state/UIProvider";

export function QuizCta() {
  const { content } = useStore();
  const { openQuiz } = useUI();
  const c = content.quizCta;
  return (
    <section className="discover" aria-labelledby="discover-title">
      <div className="container discover-grid">
        <div className="discover-art" aria-hidden="true">
          <span className="ring ring--1" /><span className="ring ring--2" /><span className="ring ring--3" />
          <img src={assetUrl("assets/logo-mark-light.png")} alt="" width={180} height={180} loading="lazy" />
        </div>
        <div className="discover-copy" data-reveal>
          <p className="kicker kicker--light">{c.kicker}</p>
          <h2 id="discover-title" className="display">{c.title}</h2>
          <p>{c.text}</p>
          <button type="button" className="btn btn-gold btn-lg" onClick={openQuiz}>{c.button} <Icon name="arrowLeft" /></button>
        </div>
      </div>
    </section>
  );
}
