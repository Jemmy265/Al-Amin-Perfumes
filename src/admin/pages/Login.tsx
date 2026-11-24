import { useState, type FormEvent } from "react";
import { Icon } from "../../components/ui/Icon";
import { api, ApiError } from "../lib/api";

export function Login({ onDone }: { onDone: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) { setError("اكتب اسم المستخدم وكلمة المرور"); return; }
    setBusy(true); setError("");
    try { await api.login(username.trim(), password); onDone(); }
    catch (err) { setError(err instanceof ApiError ? err.message : "حصلت مشكلة. حاول تاني."); setPassword(""); }
    finally { setBusy(false); }
  };

  return (
    <div className="a-center-screen a-login">
      <form className="a-login-card" onSubmit={submit} noValidate>
        <img src="../assets/logo-transparent.png" alt="الأمين للعطور" className="a-login-logo" width={472} height={567} />
        <h1 className="a-display">إدارة المتجر</h1>
        <p className="a-muted">سجّل الدخول لإدارة عطور الأمين</p>
        <label className="a-field">
          <span>اسم المستخدم</span>
          <input type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} dir="ltr"
            value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label className="a-field">
          <span>كلمة المرور</span>
          <span className="a-input-with-btn">
            <input type={show ? "text" : "password"} autoComplete="current-password" dir="ltr"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}><Icon name="eye" /></button>
          </span>
        </label>
        {error && <p className="a-form-error" role="alert"><Icon name="alert" />{error}</p>}
        <button type="submit" className="a-btn a-btn--primary a-btn--block a-btn--lg" disabled={busy}>
          {busy ? "جاري الدخول…" : "دخول"}
        </button>
      </form>
    </div>
  );
}
