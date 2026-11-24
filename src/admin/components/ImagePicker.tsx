/* Phone-friendly photo picker: gallery or camera, preview at once, compress,
   upload with progress, retry on failure, replace or remove. */
import { useEffect, useRef, useState } from "react";
import { Icon } from "../../components/ui/Icon";
import { ApiError, uploadImage } from "../lib/api";
import { prepareImage } from "../lib/image";

type State =
  | { s: "idle" }
  | { s: "working"; preview: string; pct: number }
  | { s: "failed"; preview: string; error: string; blob?: Blob };

export function ImagePicker({ url, onUploaded, onRemove, error }: {
  url: string | null; onUploaded: (key: string, url: string) => void; onRemove: () => void; error?: string;
}) {
  const [st, setSt] = useState<State>({ s: "idle" });
  const gallery = useRef<HTMLInputElement>(null);
  const camera = useRef<HTMLInputElement>(null);
  const abort = useRef<() => void>(() => {});

  const previewUrl = useRef<string | null>(null);
  // Free the local preview only when it is replaced or the picker goes away.
  useEffect(() => () => { abort.current(); if (previewUrl.current) URL.revokeObjectURL(previewUrl.current); }, []);

  const send = async (blob: Blob, preview: string) => {
    setSt({ s: "working", preview, pct: 0 });
    const up = uploadImage(blob, (pct) => setSt({ s: "working", preview, pct }));
    abort.current = up.abort;
    try {
      const r = await up.promise;
      onUploaded(r.key, r.url);
      setSt({ s: "idle" });
    } catch (e) {
      setSt({ s: "failed", preview, blob, error: e instanceof ApiError ? e.message : "رفع الصورة فشل" });
    }
  };

  const pick = async (file: File | undefined) => {
    if (!file) return;
    abort.current();
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    const preview = URL.createObjectURL(file);
    previewUrl.current = preview;
    setSt({ s: "working", preview, pct: 0 });
    try { await send(await prepareImage(file), preview); }
    catch (e) { setSt({ s: "failed", preview, error: e instanceof Error ? e.message : "تعذّر تجهيز الصورة" }); }
  };

  const shown = st.s === "idle" ? url : st.preview;
  return (
    <div className={`a-image${error ? " has-error" : ""}`}>
      <div className="a-image-frame">
        {shown ? <img src={shown} alt="صورة العطر" /> : (
          <button type="button" className="a-image-empty" onClick={() => gallery.current?.click()}>
            <Icon name="image" size={34} /><b>أضف صورة العطر</b><small>من الجاليري أو بالكاميرا</small>
          </button>
        )}
        {st.s === "working" && (
          <div className="a-image-overlay" role="status">
            <span>جاري الرفع… {st.pct}%</span>
            <span className="a-progress"><i style={{ width: `${st.pct}%` }} /></span>
          </div>
        )}
      </div>

      {st.s === "failed" && (
        <div className="a-image-failed" role="alert">
          <p><Icon name="alert" />{st.error}</p>
          {st.blob && <button type="button" className="a-btn a-btn--primary" onClick={() => send(st.blob!, st.preview)}>إعادة المحاولة</button>}
        </div>
      )}

      <div className="a-image-actions">
        <button type="button" className="a-btn a-btn--outline" onClick={() => gallery.current?.click()} disabled={st.s === "working"}>
          <Icon name="image" />{url ? "تغيير الصورة" : "اختر من الجاليري"}
        </button>
        <button type="button" className="a-btn a-btn--outline" onClick={() => camera.current?.click()} disabled={st.s === "working"}>
          <Icon name="camera" />صوّر بالكاميرا
        </button>
        {url && st.s === "idle" && (
          <button type="button" className="a-btn a-btn--ghost a-btn--danger-text" onClick={onRemove}><Icon name="trash" />إزالة الصورة</button>
        )}
      </div>
      {error && <p className="a-field-error">{error}</p>}
      <input ref={gallery} type="file" accept="image/*" hidden onChange={(e) => { void pick(e.target.files?.[0]); e.target.value = ""; }} />
      <input ref={camera} type="file" accept="image/*" capture="environment" hidden onChange={(e) => { void pick(e.target.files?.[0]); e.target.value = ""; }} />
    </div>
  );
}
