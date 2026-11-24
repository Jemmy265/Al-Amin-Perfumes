import { useEffect, useRef, useState } from "react";
import { fmt, priceInfo } from "../../domain/pricing";
import { QUIZ, quizResults, type QuizAnswers, type QuizKey } from "../../domain/quiz";
import { assetUrl } from "../../services/assets";
import { useStore } from "../../state/StoreProvider";
import { useUI } from "../../state/UIProvider";
import { ProductImage } from "../product/parts";
import { useAddToCart } from "../product/useAddToCart";
import { Icon } from "../ui/Icon";
import { Sheet } from "../ui/Sheet";

/** "اكتشف عطرك": original 4 questions + scoring, presented in the
    prototype's branded modal (progress bar, option tiles, back/next footer). */
export function QuizModal() {
  const { quizOpen, closeQuiz } = useUI();
  const { products, settings, labels } = useStore();
  const addToCart = useAddToCart();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const advanceTimer = useRef<number | undefined>(undefined);
  const bodyRef = useRef<HTMLDivElement>(null);
  const navigated = useRef(false);

  useEffect(() => {
    if (quizOpen) { setStep(0); setAnswers({}); navigated.current = false; }
    return () => window.clearTimeout(advanceTimer.current);
  }, [quizOpen]);

  // After moving between questions, keep keyboard focus inside the step content.
  useEffect(() => {
    if (!navigated.current) return;
    bodyRef.current?.querySelector<HTMLElement>(".quiz-option.is-selected, .quiz-option, .quiz-result a")?.focus({ preventScroll: true });
  }, [step]);

  const done = step >= QUIZ.length;
  const q = QUIZ[Math.min(step, QUIZ.length - 1)];
  const results = done ? quizResults(products, answers as QuizAnswers, settings.bestSellers) : [];
  const progress = done ? 100 : ((step + (answers[q.key] ? 1 : 0)) / QUIZ.length) * 100;

  const pick = (key: QuizKey, v: string) => {
    setAnswers((a) => ({ ...a, [key]: v }));
    // Original behaviour: choosing an answer moves straight to the next question.
    window.clearTimeout(advanceTimer.current);
    navigated.current = true;
    advanceTimer.current = window.setTimeout(() => setStep((s) => s + 1), 220);
  };
  const restart = () => { setStep(0); setAnswers({}); };

  return (
    <Sheet open={quizOpen} onClose={closeQuiz} variant="center" labelledBy="quiz-title" className="quiz">
      <header className="quiz-header">
        <div className="quiz-brand">
          <img src={assetUrl("assets/logo-mark.png")} alt="" width={44} height={44} />
          <div>
            <strong id="quiz-title">اكتشف عطرك</strong>
            <small>{done ? "النتيجة" : `سؤال ${step + 1} من ${QUIZ.length}`}</small>
          </div>
        </div>
        <button type="button" className="sheet-close" onClick={closeQuiz} aria-label="إغلاق"><Icon name="close" /></button>
      </header>
      <div className="quiz-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>

      <div className="quiz-body" ref={bodyRef}>
        {!done ? (
          <div key={step} className="quiz-step">
            <p className="kicker">سؤال {step + 1} من {QUIZ.length}</p>
            <h3 className="quiz-question display">{q.q}</h3>
            <div className={`quiz-options quiz-options--${q.options.length}`} role="radiogroup" aria-label={q.q}>
              {q.options.map((o) => (
                <button
                  key={o.v}
                  type="button"
                  role="radio"
                  aria-checked={answers[q.key] === o.v}
                  className={`quiz-option${answers[q.key] === o.v ? " is-selected" : ""}`}
                  onClick={() => pick(q.key, o.v)}
                >
                  <Icon name={o.icon} size={30} />
                  <span>{o.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="quiz-step quiz-results">
            <p className="kicker">النتيجة</p>
            <h3 className="quiz-question display">أنسب {results.length} عطور ليك</h3>
            <ol className="quiz-result-list">
              {results.map((p, i) => (
                <li key={p.id} className="quiz-result">
                  <span className="quiz-rank" aria-label={`الترشيح رقم ${i + 1}`}>{i + 1}</span>
                  <ProductImage p={p} />
                  <div className="quiz-result-info">
                    <small dir="ltr">{p.house}</small>
                    <b>{p.name}</b>
                    <span className="quiz-result-en" dir="ltr">{p.nameEn}</span>
                    <span className="quiz-result-scents">{p.tags.scents.map((s) => labels.scents[s]?.label).join(" · ")}</span>
                    <span className="quiz-price">يبدأ من {fmt(priceInfo(p, settings.sizes[0], settings).final)} {settings.currency}</span>
                  </div>
                  <div className="quiz-result-actions">
                    <a className="btn btn-outline btn-sm" href={`#perfume/${p.id}`} onClick={closeQuiz}>التفاصيل</a>
                    <button type="button" className="btn btn-navy btn-sm" onClick={() => addToCart(p, settings.sizes[0])}>
                      <Icon name="bag" /><span>أضف {settings.sizes[0]} مل</span>
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <footer className="quiz-footer">
        {!done ? (
          <>
            <button type="button" className="btn btn-ghost btn-sm" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
              <Icon name="arrowRight" /> السؤال اللي فات
            </button>
            <span className="quiz-footer-note">ترشيحات مبنية على خصائص كل عطر</span>
            <button type="button" className="btn btn-navy btn-sm" disabled={!answers[q.key]} onClick={() => setStep((s) => s + 1)}>
              {step === QUIZ.length - 1 ? "اعرض ترشيحاتي" : "التالي"} <Icon name="arrowLeft" />
            </button>
          </>
        ) : (
          <>
            <button type="button" className="btn btn-ghost btn-sm" onClick={restart}><Icon name="refresh" /> جرّب تاني</button>
            <a className="btn btn-navy btn-sm" href="#products" onClick={closeQuiz}>تصفّح كل العطور <Icon name="arrowLeft" /></a>
          </>
        )}
      </footer>
    </Sheet>
  );
}
