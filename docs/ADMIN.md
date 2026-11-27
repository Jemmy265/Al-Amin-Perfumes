# Al-Amin Perfumes — Architecture, Admin, Development & Deployment

**Production:** https://alamin-perfumes.the-curious-atlas.workers.dev (admin: `/admin/`) · Worker `alamin-perfumes` · D1 `alamin-db` · R2 `alamin-images`

The owner manages the store from a phone at **`/admin/`**: add/edit/delete perfumes, upload photos, sizes & prices, quiz tags, draft/publish, the display order of the catalog and of «الأكثر طلبًا», and the **site content** (homepage texts, offers bar, section order/visibility, reviews, FAQ, contact/footer, hero & About photos) plus **sales settings** (WhatsApp number, shipping fees, phone, email, social links), and **discounts & free shipping** («الخصومات والشحن»: percentage rules by store / category / products / sizes / product+size, on/off, optional dates; highest rule wins, no stacking).

## Architecture — one Worker

```
Browser ──► Cloudflare Worker "alamin-perfumes" (wrangler.jsonc)
   │
   ├─ Static Assets (dist/) — served by Cloudflare WITHOUT running Worker code
   │    /                 storefront (React)
   │    /admin/           admin dashboard (React)
   │    /static/*         fingerprinted JS/CSS
   │    /assets/*         logo, icons, the 23 original product photos
   │
   └─ Worker code (Hono) — only for run_worker_first paths
        /api/*            REST API ──► D1  alamin-db
        /images/*         uploaded photos ──► R2  alamin-images
```

- **One application, one origin, one deployment.** Storefront, admin and API share the domain, so the admin cookie is first-party (`HttpOnly; Secure; SameSite=Strict`) and no CORS is needed.
- **Which requests run the Worker (count toward the 100k/day free requests):** `GET /api/catalog` once per storefront visit; `GET /images/<uploaded>` once per browser per uploaded photo (then cached for a year); admin API calls. **Everything else** — HTML, JS, CSS, fonts' CSS, logo, the original photos — is a static asset: free, unlimited, never invokes the Worker.
- **Shared code, no duplicated business rules.**
  - `src/types` — domain types used by storefront, admin and Worker.
  - `src/shared/product.ts` — product validation (Zod) used by **both** the admin form and the API, plus the admin → storefront mapping.
  - `src/shared/content.ts` — site content & settings validation, used by the content editor and the API.
  - `src/domain/quiz.ts` — the original quiz questions & scoring.
- **Storefront data.** Built with `VITE_DATA_SOURCE=api` (`npm run build:cf`), the storefront makes **one** request, `GET /api/catalog`, for products + settings + content (retries once; falls back to the bundled catalog only if the API is unreachable).

## Caching & invalidation

| What | Served by | Cache-Control | Notes |
|---|---|---|---|
| `/static/*` (hashed JS/CSS) | Static Assets | `public, max-age=31536000, immutable` | new deploy = new file names, never stale |
| `/assets/*` (original photos, logo) | Static Assets | `public, max-age=86400, stale-while-revalidate=604800` | not fingerprinted |
| HTML (`/`, `/admin/`) | Static Assets | `public, max-age=0, must-revalidate` + ETag | deploys visible immediately; unchanged → 304 |
| `GET /api/catalog` | Worker (+ edge Cache API) | browser: `public, max-age=0, must-revalidate` + ETag; edge: 10 s fresh + 20 s stale-while-revalidate | unchanged → 304; logged-in admin: `private, no-store`, read straight from D1 |
| `GET /images/<key>` (uploads) | Worker + R2 | `public, max-age=31536000, immutable` + ETag | keys are random UUIDs, never reused |
| `/api/admin/*`, `/api/auth/*` | Worker | `private, no-store` / `no-store` | never cached anywhere |

**Catalog snapshot.** Building the storefront payload reads ~200 rows, so it is built once and stored as one JSON row (`site_kv` key `catalog`). `GET /api/catalog` returns that text as-is (1 row read, no JSON work).

**Invalidation.** A middleware on `/api/admin/*` rebuilds the snapshot after **every successful write** (create, edit, delete, reorder, featured order, tags, content, settings). The snapshot's `updated_at` is the ETag, so:
- the owner's browser is refreshed immediately (the admin re-fetches `/api/catalog` with `cache: "reload"` after each save);
- the edge copy in the admin's own data center is dropped right away;
- customers see the change on their next page load — within **30 s** at worst (10 s fresh + 20 s stale-while-revalidate at the edge; browsers always revalidate).

**Edge cache.** On a custom domain (`alamin.win`) the Worker keeps a copy of the snapshot in the Cloudflare Cache API, per data center. It is a no-op on `*.workers.dev`, where every request reads the one D1 row (no delay). There is no purge call. Discount start/end dates are evaluated by the storefront at runtime (Egypt time), so caching never delays a scheduled discount.


## Data model (D1) — `worker/migrations`

| Table | Purpose |
|---|---|
| `products` | Stable slug `id` (used in `#perfume/<id>` links), names, house (brand), label, `category` (= quiz audience), `intensity`, `status` (`published`/`draft`), notes (= the description), `sort_order` (catalog order), `featured_rank` (order in «الأكثر طلبًا», `NULL` = not featured), timestamps |
| `product_variants` | `(product_id, size_ml)` → `price` (EGP, before the 110 ml discount) |
| `product_images` | R2 `object_key` + alt text + order (binaries live in R2 only) |
| `product_tags` | Quiz tags: `scent` (ordered — position 0 is the primary family, weighted higher by the quiz) and `occasion` |
| `site_kv` | JSON documents `settings`, `content`, `labels` — edited from «محتوى الموقع». `content.sections` holds homepage section order & visibility |
| `admin_sessions` | SHA-256 of session tokens, expiry |
| `login_attempts` | Failed-login counter per IP |

**Two display orders.** The storefront already had two: the catalog order and the separate ranking of «الأكثر طلبًا» (Madawi, Erba Pura, Burberry Her, Bianco Latte). Both are persisted (`sort_order`, `featured_rank`) and edited on the «ترتيب العرض» page. Reorder requests must contain every product exactly once and are applied in a single D1 transaction; otherwise the API answers `409` and the admin reloads.

`0002_seed.sql` is generated from the real catalog (`npm run db:seed-sql`) — same 23 products, order, prices, tags and best-seller ranks.

## API

Public (read-only): **`GET /api/catalog`** (products + settings + content + labels — what the storefront uses) · `GET /api/products` · `GET /api/site` (older split views of the same snapshot) · `GET /images/<key>` · `GET /api/health`

Auth: `POST /api/auth/login` `{username,password}` · `POST /api/auth/logout` · `GET /api/auth/me`

Admin (session required on every route, checked by the Worker):

| Method | Path | |
|---|---|---|
| GET | `/api/admin/products` | all products incl. drafts |
| POST | `/api/admin/products` | create (added at the top of the catalog) |
| GET / PATCH / DELETE | `/api/admin/products/:id` | read / partial update (merged, then fully validated) / delete (+ R2 photo) |
| PATCH | `/api/admin/products/reorder` | `{ids}` — full catalog order |
| PATCH | `/api/admin/products/featured-order` | `{ids}` — order of «الأكثر طلبًا» |
| PATCH | `/api/admin/products/:id/tags` | `{category, scents, occasions, intensity}` |
| GET | `/api/admin/tags` | quiz taxonomy (from the storefront quiz) |
| POST | `/api/admin/uploads` | multipart `file` → R2 (`?kind=site` for hero/About photos); returns `{key, url}` |
| GET | `/api/admin/content` | settings / content / labels |
| PUT | `/api/admin/content` | whole content document (validated); deletes replaced `site/` photos from R2 |
| PUT | `/api/admin/settings` | editable settings; `bestSellers`, `sizes`, `currency`, `siteUrl` are kept server-side |
| GET | `/api/admin/pricing` | discount rules + free shipping (`site_kv` key `pricing`) |
| POST | `/api/admin/discounts` | new rule `{name?, percent 1–90, scope, enabled?, startDate?, endDate?}` |
| PUT / PATCH / DELETE | `/api/admin/discounts/:id` | update (merged, then fully validated; e.g. `{enabled:false}`) / delete |
| PUT | `/api/admin/free-shipping` | `{enabled, min}` — threshold on the subtotal after discounts |

Errors are JSON `{error, fields?}` with Arabic messages (`422` validation, `401` no session, `403` bad origin, `409` stale order, `413/415` upload size/type, `429` too many logins).

## Security

- Password: PBKDF2-SHA256 (100,000 iterations, random salt) stored as the Worker secret `ADMIN_PASSWORD_HASH`. Never in Git or frontend code.
- Session: 256-bit random token in an `HttpOnly; Secure; SameSite=Strict` cookie (`__Host-` prefix in production); D1 stores only its SHA-256; 14-day expiry; logout deletes it.
- Every `/api/admin/*` route is authorized on the server. The admin UI only asks `/api/auth/me` — there is no client-side "guard" to bypass.
- CSRF: SameSite=Strict + `Origin` check on every non-GET API request.
- Login rate limit: 8 failed attempts per IP per 15 minutes → `429`.
- Uploads: admin-only, ≤ 6 MB, type detected from the file bytes (JPEG/PNG/WebP only), random object keys. Photos are resized on the phone (max 1600 px, WebP/JPEG) before upload.
- `/admin/*` is `noindex` and cannot be framed (`public/_headers`).

## Local development

```bash
npm install
cp .dev.vars.example .dev.vars
ADMIN_PASSWORD='choose-a-local-password' node scripts/hash-password.mjs   # paste into .dev.vars
npm run db:migrate:local          # D1 schema + real catalog (local SQLite in .wrangler/)
echo "VITE_DATA_SOURCE=api" > .env.local

npm run dev:api                   # builds dist/ and runs the Worker (assets + API) on :8787
npm run dev                       # Vite with hot reload on :5173 (proxies /api and /images to :8787)
```

http://localhost:8787 is a production-identical run (same Worker, same static assets);
http://localhost:5173 is for UI work with hot reload. `npm run db:reset:local` restores the seed (stop `dev:api` first).

Checks: `npm run typecheck` · `npm test` (includes parity tests proving the quiz behaves exactly like the original site).


## Environment & configuration

| Name | Where | Value |
|---|---|---|
| `ADMIN_USERNAME` | `wrangler.jsonc` → `vars` | owner login name (`admin`) |
| `ADMIN_PASSWORD_HASH` | Worker **secret** (production) / `.dev.vars` (local) | output of `scripts/hash-password.mjs` |
| `COOKIE_SECURE` | `.dev.vars` only | `false` for local http |
| `ALLOWED_ORIGINS` | `.dev.vars` only | `http://localhost:5173` |
| `VITE_DATA_SOURCE` | build time (`npm run build:cf` sets it) | `api` |

Bindings (wrangler.jsonc): `DB` (D1 alamin-db), `IMAGES` (R2 alamin-images), `ASSETS` (static assets).


## Deploying

Production is live. For every future release:

```bash
npx wrangler login            # once per machine
npm run deploy                # typecheck + tests + build (API mode) + wrangler deploy
```

Database schema changes: add `worker/migrations/000N_*.sql`, then `npm run db:migrate:remote` **before** `npm run deploy`.

Change the owner password:
```bash
node scripts/hash-password.mjs | npx wrangler secret put ADMIN_PASSWORD_HASH
```
(prompts for the new password; existing sessions stay valid until logout/expiry — to force everyone out run
`npx wrangler d1 execute alamin-db --remote --command "DELETE FROM admin_sessions"`).

Roll back a bad release: `npx wrangler rollback` (code only; the database is not rolled back).

First-time setup (already done for production — kept for reference):
`npx wrangler d1 create alamin-db` → put the id in `wrangler.jsonc` → `npx wrangler r2 bucket create alamin-images` →
`npm run db:migrate:remote` → `npm run deploy` → set `ADMIN_PASSWORD_HASH`.

### Production checklist (verified on the live deployment)

- [x] D1 migrations applied remotely; 23 products, variants, tags and best-seller order present
- [x] Original photos served as static assets; uploads stored in R2
- [x] `ADMIN_PASSWORD_HASH` secret set; no secrets in `dist/` or Git
- [x] `/api/admin/*` without login → 401; foreign Origin → 403
- [x] Login, add (with photo), edit, draft/publish, reorder, tags, delete — reflected on the storefront
- [x] Cache headers and ETag/304 behaviour as in the table above
- [ ] Optional: custom domain


## Free plan & limits

Everything runs on the Workers Free plan (no paid features enabled):

| Resource | Free allowance | This app |
|---|---|---|
| Worker requests | 100,000 / day | ≈ 1 per storefront visit + uploaded-photo first views + admin use |
| Worker CPU | 10 ms / request | catalog read returns stored text; heaviest is login (PBKDF2) |
| Static asset requests | unlimited, free | all pages, JS/CSS, original photos |
| D1 | 5M rows read / day, 100k written, 5 GB | 1 row per catalog request; ~200 rows per admin save |
| R2 | 10 GB, 1M writes, 10M reads / month, no egress fees | only photos uploaded from the dashboard |

Potential costs only if traffic grows well beyond ~100k visits/day (Workers Paid is $5/month) or R2 exceeds its free tier.

## Known limitations / next steps

- **Login CPU.** PBKDF2 with 100,000 iterations is above the free plan's 10 ms CPU guideline per request. The free plan tolerates occasional bursts, and login happens rarely, but if logins start failing with "exceeded CPU" the options are the Workers Paid plan or lowering the iteration count (weaker hashing).
- **No edge cache for the API on workers.dev.** The edge cache only works on the custom domain.
- A photo uploaded but never saved (form abandoned) stays in R2. Cheap to keep; a cleanup could delete `products/` keys not present in `product_images`.
- Content text supports `**bold**`, `{{quiz|text}}` and, in the offers bar, `{freeMin}` / `{discount}`.
- The page `<title>`, meta description and social preview image in `index.html` are static.
- The GitHub Pages workflow (`.github/workflows/deploy.yml`) still targets GitHub Pages; Cloudflare is the production host.
