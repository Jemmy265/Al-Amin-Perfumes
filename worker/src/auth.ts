/* Owner authentication.
   - Password: PBKDF2-SHA256 hash kept in the ADMIN_PASSWORD_HASH secret.
   - Session: 256-bit random token in an HttpOnly cookie; D1 stores only its SHA-256.
   - Login rate limit: MAX_FAILS per IP per WINDOW.
   - CSRF: SameSite=Strict cookie + Origin check on every state-changing request. */
import type { Context, MiddlewareHandler } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { AppEnv, Env } from "./env";

const SESSION_TTL = 14 * 24 * 3600;          // seconds
const WINDOW = 15 * 60;                        // seconds
const MAX_FAILS = 8;

const enc = new TextEncoder();
const b64 = (buf: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const now = () => Math.floor(Date.now() / 1000);

export const cookieName = (env: Env) => (secure(env) ? "__Host-alamin_admin" : "alamin_admin");
const secure = (env: Env) => env.COOKIE_SECURE !== "false";

/** Constant-time comparison of two byte arrays. */
function equal(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, iterStr, saltB64, hashB64] = (stored || "").split("$");
  const iterations = Number(iterStr);
  if (algo !== "pbkdf2-sha256" || !iterations || !saltB64 || !hashB64) return false;
  const expected = unb64(hashB64);
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: unb64(saltB64), iterations }, key, expected.length * 8);
  return equal(new Uint8Array(bits), expected);
}

const sha256 = async (s: string) => b64(await crypto.subtle.digest("SHA-256", enc.encode(s)));
const clientIp = (c: Context<AppEnv>) => c.req.header("CF-Connecting-IP") ?? "local";

/** Returns seconds to wait if this IP is currently locked out, else 0. */
export async function lockedFor(c: Context<AppEnv>): Promise<number> {
  const row = await c.env.DB.prepare("SELECT window_start, count FROM login_attempts WHERE ip = ?")
    .bind(clientIp(c)).first<{ window_start: number; count: number }>();
  if (!row || row.count < MAX_FAILS) return 0;
  const left = row.window_start + WINDOW - now();
  return left > 0 ? left : 0;
}

export async function recordFailure(c: Context<AppEnv>) {
  const t = now();
  await c.env.DB.prepare(
    `INSERT INTO login_attempts (ip, window_start, count) VALUES (?1, ?2, 1)
     ON CONFLICT (ip) DO UPDATE SET
       count = CASE WHEN window_start + ?3 < ?2 THEN 1 ELSE count + 1 END,
       window_start = CASE WHEN window_start + ?3 < ?2 THEN ?2 ELSE window_start END`,
  ).bind(clientIp(c), t, WINDOW).run();
}

export async function startSession(c: Context<AppEnv>) {
  const token = b64(crypto.getRandomValues(new Uint8Array(32))).replace(/[+/=]/g, (m) => ({ "+": "-", "/": "_", "=": "" })[m]!);
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare("DELETE FROM login_attempts WHERE ip = ?").bind(clientIp(c)),
    c.env.DB.prepare("DELETE FROM admin_sessions WHERE expires_at < ?").bind(t),
    c.env.DB.prepare("INSERT INTO admin_sessions (token_hash, created_at, expires_at, user_agent) VALUES (?, ?, ?, ?)")
      .bind(await sha256(token), t, t + SESSION_TTL, (c.req.header("User-Agent") ?? "").slice(0, 200)),
  ]);
  setCookie(c, cookieName(c.env), token, {
    httpOnly: true, secure: secure(c.env), sameSite: "Strict", path: "/", maxAge: SESSION_TTL,
  });
}

export async function endSession(c: Context<AppEnv>) {
  const token = getCookie(c, cookieName(c.env));
  if (token) await c.env.DB.prepare("DELETE FROM admin_sessions WHERE token_hash = ?").bind(await sha256(token)).run();
  deleteCookie(c, cookieName(c.env), { path: "/", secure: secure(c.env) });
}

export async function hasSession(c: Context<AppEnv>): Promise<boolean> {
  const token = getCookie(c, cookieName(c.env));
  if (!token || token.length > 100) return false;
  const row = await c.env.DB.prepare("SELECT expires_at FROM admin_sessions WHERE token_hash = ?")
    .bind(await sha256(token)).first<{ expires_at: number }>();
  return !!row && row.expires_at > now();
}

/** Rejects state-changing requests whose Origin is not this site (CSRF defence in depth). */
export const sameOrigin: MiddlewareHandler<AppEnv> = async (c, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(c.req.method)) return next();
  const origin = c.req.header("Origin");
  const allowed = new Set([new URL(c.req.url).origin, ...(c.env.ALLOWED_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean)]);
  if (!origin || !allowed.has(origin)) return c.json({ error: "طلب غير مسموح" }, 403);
  return next();
};

/** Every /api/admin/* route requires a valid session — checked on the server. */
export const requireAdmin: MiddlewareHandler<AppEnv> = async (c, next) => {
  if (!(await hasSession(c))) return c.json({ error: "سجّل الدخول من جديد" }, 401);
  return next();
};
