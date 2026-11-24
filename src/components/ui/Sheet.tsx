import { useEffect, useRef, useState, type ReactNode } from "react";

/** Native <dialog> modal: focus trap, Esc, backdrop click, scroll lock.
    variant: "drawer" (cart), "center" (quiz), "page" (perfume page). */
export function Sheet({
  open, onClose, variant, labelledBy, label, className = "", children,
}: {
  open: boolean; onClose: () => void; variant: "drawer" | "center" | "page";
  labelledBy?: string; label?: string; className?: string; children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      // Focus the panel itself (not the first button) so no control looks pre-selected;
      // Tab still moves straight into the dialog.
      d.querySelector<HTMLElement>(".sheet-panel")?.focus();
      document.documentElement.classList.add("no-scroll");
    } else if (!open && d.open) {
      setClosing(true);
      const t = window.setTimeout(() => {
        setClosing(false);
        d.close();
        if (!document.querySelector("dialog[open]")) document.documentElement.classList.remove("no-scroll");
      }, 200);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => () => {
    if (!document.querySelector("dialog[open]")) document.documentElement.classList.remove("no-scroll");
  }, []);

  return (
    <dialog
      ref={ref}
      data-lenis-prevent
      className={`sheet sheet--${variant}${closing ? " is-closing" : ""} ${className}`}
      aria-labelledby={labelledBy}
      aria-label={label}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="sheet-panel" tabIndex={-1}>{children}</div>
    </dialog>
  );
}
