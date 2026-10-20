/**
 * Base path the site is served under: "" on Vercel, "/vaso" on GitHub Pages
 * (set at build time by the Pages workflow through PAGES_BASE_PATH).
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** URL for a file in /public (or an in-site path used outside <Link>), including the base path. */
export function asset(src: string) {
  if (!src.startsWith("/") || src.startsWith("//")) return src;
  return `${basePath}${src}`;
}
