export interface Env {
  DB: D1Database;
  IMAGES: R2Bucket;
  /** Workers Static Assets (the built storefront + admin). */
  ASSETS: Fetcher;
  /** Owner login name (plain var). */
  ADMIN_USERNAME: string;
  /** Secret: pbkdf2-sha256$<iterations>$<salt b64>$<hash b64> — see scripts/hash-password.mjs */
  ADMIN_PASSWORD_HASH: string;
  /** Extra origins allowed to call admin write endpoints (comma separated), e.g. the local Vite dev server. */
  ALLOWED_ORIGINS?: string;
  /** "false" only for local http development. */
  COOKIE_SECURE?: string;
}

export type AppEnv = { Bindings: Env };
