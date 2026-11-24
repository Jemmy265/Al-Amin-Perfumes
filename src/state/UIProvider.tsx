import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

export interface ToastMsg { id: number; text: ReactNode; action?: { label: string; onClick: () => void } }

interface UICtx {
  cartOpen: boolean;
  quizOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  openQuiz: () => void;
  closeQuiz: () => void;
  toast: ToastMsg | null;
  showToast: (text: ReactNode, action?: ToastMsg["action"]) => void;
}

const Ctx = createContext<UICtx | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [toast, setToast] = useState<ToastMsg | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const showToast = useCallback((text: ReactNode, action?: ToastMsg["action"]) => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), text, action });
    timer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const value = useMemo<UICtx>(() => ({
    cartOpen, quizOpen, toast, showToast,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
    openQuiz: () => setQuizOpen(true),
    closeQuiz: () => setQuizOpen(false),
  }), [cartOpen, quizOpen, toast, showToast]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUI(): UICtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useUI must be used inside <UIProvider>");
  return v;
}
