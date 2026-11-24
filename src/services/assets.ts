/** Resolve an image path: absolute URLs (R2/CDN) pass through; relative
    paths are bundled public assets resolved against Vite's base. */
export function assetUrl(path: string): string {
  // Absolute URLs (R2/CDN) and site-absolute paths (/images/… served by the API) pass through.
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:") || path.startsWith("/")) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
