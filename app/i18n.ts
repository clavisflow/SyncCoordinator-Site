export type SiteLocale = "ja" | "en";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const siteOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN
  ?.replace(/^http:\/\//i, "https://")
  .replace(/\/+$/, "");

export function sitePath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return `${basePath}${path}`;
}

export function localizedPath(locale: SiteLocale, path: string) {
  if (locale === "ja") return sitePath(path);
  return sitePath(path === "/" ? "/en" : `/en${path}`);
}

export function localeAlternates(path: string, locale: SiteLocale = "ja") {
  if (!siteOrigin) return undefined;

  return {
    canonical: `${siteOrigin}${localizedPath(locale, path)}`,
    languages: {
      ja: `${siteOrigin}${localizedPath("ja", path)}`,
      en: `${siteOrigin}${localizedPath("en", path)}`,
    },
  };
}
