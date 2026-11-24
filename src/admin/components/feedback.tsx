/* Toasts (success / error) and a confirm dialog with large touch targets. */
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "../../components/ui/Icon";

type Tone = "success" | "error" | "info";
interface Toast { id: number; text: string; tone: Tone; action?: { label: string; href: string } }
interface ConfirmOpts { title: string; text?: string; confirmLabel: string; danger?: boolean }

const Ctx = createContext<{
  toast: (text: string, tone?: Tone, action?: Toast["action"]) => void;
  confirm: (o: ConfirmOpts) => Promise<boolean>;
} | null>(null);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const [ask, setAsk] = useState<(ConfirmOpts & { resolve: (v: boolean) => void }) | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const dlg = useRef<HTMLDialogElement>(null);

  const show = useCallback((text: string, tone: Tone = "success", action?: Toast["action"]) => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), text, tone, action });
    timer.current = window.setTimeout(() => setToast(null), tone === "error" ? 6000 : 3500);
  }, []);

  const confirm = useCallback((o: ConfirmOpts) => new Promise<boolean>((resolve) => setAsk({ ...o, resolve })), []);

  useEffect(() => {
    if (ask && dlg.current && !dlg.current.open) dlg.current.showModal();
  }, [ask]);

  const answer = (v: boolean) => { ask?.resolve(v); dlg.current?.close(); setAsk(null); };

  return (
    <Ctx.Provider value={{ toast: show, confirm }}>
      {children}
      <div className={`a-toast a-toast--${toast?.tone ?? "info"}${toast ? " is-shown" : ""}`} role={toast?.tone === "error" ? "alert" : "status"} aria-live="polite">
        {toast && (
          <>
            <Icon name={toast.tone === "error" ? "alert" : "check"} />
            <span>{toast.text}</span>
            {toast.action && <a href={toast.action.href} target="_blank" rel="noopener">{toast.action.label}</a>}
            <button type="button" onClick={() => setToast(null)} aria-label="إغلاق"><Icon name="close" /></button>
          </>
        )}
      </div>
      <dialog ref={dlg} className="a-confirm" onCancel={(e) => { e.preventDefault(); answer(false); }} aria-labelledby="confirm-title">
        {ask && (
          <div className="a-confirm-box">
            <h2 id="confirm-title">{ask.title}</h2>
            {ask.text && <p>{ask.text}</p>}
            <div className="a-confirm-actions">
              <button type="button" className={`a-btn ${ask.danger ? "a-btn--danger" : "a-btn--primary"}`} onClick={() => answer(true)}>{ask.confirmLabel}</button>
              <button type="button" className="a-btn a-btn--ghost" onClick={() => answer(false)} autoFocus>إلغاء</button>
            </div>
          </div>
        )}
      </dialog>
    </Ctx.Provider>
  );
}

export function useFeedback() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useFeedback outside FeedbackProvider");
  return v;
}
