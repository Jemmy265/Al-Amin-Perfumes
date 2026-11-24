/* Cloudflare Pages Function: forwards /api/* to the alamin-api Worker through a
   service binding. Storefront, admin and API then share one origin, so the
   admin session cookie stays first-party (SameSite=Strict, no CORS). */
interface Env { API: Fetcher }
export const onRequest: PagesFunction<Env> = ({ request, env }) => env.API.fetch(request);
