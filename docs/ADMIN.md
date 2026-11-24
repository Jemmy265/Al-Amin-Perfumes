# Al-Amin Admin Dashboard — Setup, Development & Deployment

The owner manages the store from a phone at **`/admin/`**: add/edit/delete perfumes, upload photos, sizes & prices, quiz tags, draft/publish, the display order of the catalog and of «الأكثر طلبًا», and the **site content** (homepage texts, offers bar, section order/visibility, reviews, FAQ, contact/footer, hero & About photos) plus **sales settings** (WhatsApp number, shipping fees, free-shipping threshold, size discount, phone, email, social links).

## Architecture

```
Browser ──► Cloudflare Pages (alamin-store)
              ├─ /            storefront (React)        ─┐
              ├─ /admin/      admin dashboard (React)    ├─ same origin
              └─ /api/*, /images/*  → Pages Function ────┘
                                        │ service binding "API"
                                        ▼
                         Worker alamin-api (Hono)
                           ├─ D1  alamin-db       products, variants, tags, images (keys), site content, sessions
                           └─ R2  alamin-images   product photos (products/<uuid>.webp|jpg|png)
```

- **One origin.** Pages forwards `/api` and `/images` to the Worker (`functions/`), so the admin cookie is first-party (`HttpOnly; Secure; SameSite=Strict`) and no CORS is needed. The Worker has `workers_dev: false` — it is not reachable directly.
- **Shared code, no duplicated business rules.**
  - `src/types` — domain types used by storefront, admin and Worker.
  - `src/shared/product.ts` — product validation (Zod) used by **both** the admin form and the API, plus the admin → storefront mapping.
  - `src/shared/content.ts` — site content & settings validation, section ids/labels, used by the content editor and the API.
  - `src/domain/quiz.ts` — the original quiz questions & scoring; the admin tag editor and the API taxonomy read from it.
- **Storefront data.** With `VITE_DATA_SOURCE=api` the storefront reads `GET /api/products` and `GET /api/site` (falls back to the bundled catalog if the API is down). Without it (e.g. GitHub Pages) it uses the bundled seed data.

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

Public (read-only): `GET /api/products` (published, in display order) · `GET /api/site` · `GET /images/<key>` · `GET /api/health`

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
cp worker/.dev.vars.example worker/.dev.vars
ADMIN_PASSWORD='choose-a-local-password' node scripts/hash-password.mjs   # paste into worker/.dev.vars
npm run db:migrate:local          # D1 schema + real catalog (local SQLite)
npm run images:seed:local         # original photos → local R2
echo "VITE_DATA_SOURCE=api" > .env.local   # storefront reads the local API too

npm run dev:api                   # Worker on :8787
npm run dev                       # Vite on :5173 (proxies /api and /images to :8787)
```

Open http://localhost:5173/admin/ (user `admin`) and http://localhost:5173/.
`npm run db:reset:local` restores the seed (stop `dev:api` first).

Checks: `npm run typecheck` · `npm test` (includes parity tests proving the quiz behaves exactly like the original site).

## Environment & configuration

| Name | Where | Value |
|---|---|---|
| `ADMIN_USERNAME` | `worker/wrangler.jsonc` → `vars` | owner login name (default `admin`) |
| `ADMIN_PASSWORD_HASH` | Worker **secret** | output of `scripts/hash-password.mjs` |
| `COOKIE_SECURE` | `worker/.dev.vars` only | `false` for local http |
| `ALLOWED_ORIGINS` | `worker/.dev.vars` only | `http://localhost:5173` |
| `VITE_DATA_SOURCE` | Pages **build** env var | `api` |
| `VITE_API_BASE_URL` | optional | leave empty (same origin) |

## Deploying to Cloudflare (needs the owner's Cloudflare account — nothing here has been deployed)

1. `npx wrangler login`
2. Create resources and paste the D1 id into `worker/wrangler.jsonc`:
   ```bash
   npx wrangler d1 create alamin-db
   npx wrangler r2 bucket create alamin-images
   ```
3. Database & photos:
   ```bash
   npm run db:migrate:remote
   npm run images:seed:remote
   ```
4. Owner password (min. 12 characters):
   ```bash
   node scripts/hash-password.mjs      # prints the hash
   cd worker && npx wrangler secret put ADMIN_PASSWORD_HASH   # paste it
   ```
5. Deploy the API: `npm run deploy:api`
6. Pages project `alamin-store` (Dashboard → Workers & Pages → Create → Pages → connect this GitHub repo):
   - Build command `npm run build`, output `dist`, env var `VITE_DATA_SOURCE=api`.
   - The service binding `API → alamin-api` comes from the root `wrangler.jsonc` (or add it under Settings → Bindings).
7. Open `https://<project>.pages.dev/admin/`, log in, and check the checklist below.

### Production checklist

- [ ] D1 id filled in `worker/wrangler.jsonc`; both migrations applied remotely
- [ ] 23 photos uploaded to R2; storefront shows images from `/images/...`
- [ ] `ADMIN_PASSWORD_HASH` secret set (strong password, not reused); `ADMIN_USERNAME` changed if desired
- [ ] `worker/.dev.vars` is **not** committed (it is git-ignored)
- [ ] Pages build env `VITE_DATA_SOURCE=api`; binding `API` present
- [ ] `/api/admin/products` without login → `401`
- [ ] Login works on the owner's phone; logout works
- [ ] Add a test perfume as **draft** → not visible on the store → delete it
- [ ] Reorder two perfumes → order visible on the storefront
- [ ] Custom domain (optional) attached to the Pages project
- [ ] Old GitHub Pages site retired or left on the static catalog

## Known limitations / next steps

- Content text supports `**bold**`, `{{quiz|text}}` (button that opens the quiz) and, in the offers bar, `{freeMin}` / `{discount}` placeholders filled from the settings.
- The page `<title>`, meta description and social preview image in `index.html` are static (not edited from the dashboard).
- A photo uploaded but never saved (form abandoned) stays in R2. Cheap to keep; a periodic cleanup can delete `products/` keys not present in `product_images`.
- GitHub Pages (static) also publishes `/admin/`, but it cannot work there (no API) and shows «تعذّر الاتصال». Use the Cloudflare Pages URL.
