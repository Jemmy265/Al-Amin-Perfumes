import { useUI } from "../../state/UIProvider";
import { Icon } from "./Icon";

export function Toast() {
  const { toast } = useUI();
  return (
    <div className={`toast${toast ? " is-shown" : ""}`} role="status" aria-live="polite">
      {toast && (
        <>
          <Icon name="check" />
          <span>{toast.text}</span>
          {toast.action && <button type="button" className="toast-link" onClick={toast.action.onClick}>{toast.action.label}</button>}
        </>
      )}
    </div>
  );
}
