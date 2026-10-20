import type { Locale } from "@/lib/i18n";

/** Internal link for the given language: Greek lives at the root, English under /en. */
export function localePath(locale: Locale, path: string) {
  if (locale !== "en") return path;
  if (path === "/") return "/en";
  if (path.startsWith("/#")) return `/en${path.slice(1)}`;
  return `/en${path}`;
}

/** The same page in the other language. */
export function switchLocalePath(pathname: string, to: Locale) {
  const isEn = pathname === "/en" || pathname === "/en/" || pathname.startsWith("/en/");
  const base = isEn ? pathname.replace(/^\/en/, "") || "/" : pathname;
  return to === "en" ? localePath("en", base) : base;
}

/** URL for a file in /public, including the GitHub Pages base path. */
export function asset(src: string) {
  if (!src.startsWith("/") || src.startsWith("//")) return src;
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}`;
}
