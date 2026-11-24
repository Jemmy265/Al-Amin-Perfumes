/** Resolve an image path: absolute URLs (R2/CDN) pass through; relative
    paths are bundled public assets resolved against Vite's base. */
export function assetUrl(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
