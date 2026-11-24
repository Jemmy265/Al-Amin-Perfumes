/* Forwards /images/* (product photos stored in R2) to the alamin-api Worker. */
interface Env { API: Fetcher }
export const onRequest: PagesFunction<Env> = ({ request, env }) => env.API.fetch(request);
