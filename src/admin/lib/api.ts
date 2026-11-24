/* Admin API client. Same-origin requests (cookies are HttpOnly; the browser
   sends them automatically). Every failure becomes an ApiError with an
   Arabic message the UI can show as-is. */
import type { AdminProduct, ProductInput } from "../../shared/product";
import type { EditableSettings } from "../../shared/content";
import type { SiteContent, StoreSettings } from "../../types/content";

export class ApiError extends Error {
  constructor(message: string, readonly status: number, readonly fields: Record<string, string> = {}) {
    super(message);
  }
}

/** Fired on 401 so the app can return to the login screen. */
export const SESSION_EXPIRED = "alamin:session-expired";

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      method,
      credentials: "same-origin",
      headers: body instanceof FormData || body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body instanceof FormData ? body : body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("مفيش اتصال بالإنترنت أو الخادم مش متاح. اتأكد من الاتصال وحاول تاني.", 0);
  }
  let data: { error?: string; fields?: Record<string, string> } & Record<string, unknown> = {};
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) {
    if (res.status === 401 && !path.startsWith("/auth/")) window.dispatchEvent(new Event(SESSION_EXPIRED));
    throw new ApiError(data.error ?? `حصلت مشكلة (${res.status}). حاول تاني.`, res.status, data.fields ?? {});
  }
  return data as T;
}

export interface TagsPayload { category: AdminProduct["category"]; scents: AdminProduct["scents"]; occasions: AdminProduct["occasions"]; intensity: AdminProduct["intensity"] }

export const api = {
  me: () => request<{ authenticated: boolean }>("GET", "/auth/me"),
  login: (username: string, password: string) => request<{ ok: true }>("POST", "/auth/login", { username, password }),
  logout: () => request<{ ok: true }>("POST", "/auth/logout"),

  products: () => request<AdminProduct[]>("GET", "/admin/products"),
  product: (id: string) => request<AdminProduct>("GET", `/admin/products/${encodeURIComponent(id)}`),
  createProduct: (p: ProductInput) => request<AdminProduct>("POST", "/admin/products", p),
  updateProduct: (id: string, p: Partial<ProductInput>) => request<AdminProduct>("PATCH", `/admin/products/${encodeURIComponent(id)}`, p),
  deleteProduct: (id: string) => request<{ ok: true }>("DELETE", `/admin/products/${encodeURIComponent(id)}`),
  updateTags: (id: string, t: TagsPayload) => request<AdminProduct>("PATCH", `/admin/products/${encodeURIComponent(id)}/tags`, t),
  reorder: (ids: string[]) => request<{ ok: true }>("PATCH", "/admin/products/reorder", { ids }),
  reorderFeatured: (ids: string[]) => request<{ ok: true }>("PATCH", "/admin/products/featured-order", { ids }),
  content: () => request<{ content: SiteContent; settings: StoreSettings }>("GET", "/admin/content"),
  saveContent: (content: SiteContent) => request<{ ok: true; content: SiteContent }>("PUT", "/admin/content", content),
  saveSettings: (settings: EditableSettings) => request<{ ok: true; settings: StoreSettings }>("PUT", "/admin/settings", settings),
};

/** Upload with progress (XHR — fetch has no upload progress). */
export function uploadImage(blob: Blob, onProgress: (pct: number) => void, kind: "products" | "site" = "products"): { promise: Promise<{ key: string; url: string }>; abort: () => void } {
  const xhr = new XMLHttpRequest();
  const promise = new Promise<{ key: string; url: string }>((resolve, reject) => {
    const form = new FormData();
    const ext = blob.type === "image/webp" ? "webp" : blob.type === "image/png" ? "png" : "jpg";
    form.append("file", blob, `photo.${ext}`);
    xhr.open("POST", kind === "site" ? "/api/admin/uploads?kind=site" : "/api/admin/uploads");
    xhr.withCredentials = true;
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      let data: { key?: string; url?: string; error?: string } = {};
      try { data = JSON.parse(xhr.responseText); } catch { /* ignore */ }
      if (xhr.status === 401) window.dispatchEvent(new Event(SESSION_EXPIRED));
      if (xhr.status >= 200 && xhr.status < 300 && data.key) resolve({ key: data.key, url: data.url! });
      else reject(new ApiError(data.error ?? "رفع الصورة فشل. حاول تاني.", xhr.status));
    };
    xhr.onerror = () => reject(new ApiError("رفع الصورة فشل — اتأكد من الإنترنت وحاول تاني.", 0));
    xhr.onabort = () => reject(new ApiError("اتلغى الرفع", 0));
    xhr.send(form);
  });
  return { promise, abort: () => xhr.abort() };
}
