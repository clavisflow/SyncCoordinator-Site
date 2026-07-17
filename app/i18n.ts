export type SiteLocale = "ja" | "en";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function sitePath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return `${basePath}${path}`;
}

export function localizedPath(locale: SiteLocale, path: string) {
  if (locale === "ja") return sitePath(path);
  return sitePath(path === "/" ? "/en" : `/en${path}`);
}

export function localeAlternates(path: string, locale: SiteLocale = "ja") {
  return {
    canonical: localizedPath(locale, path),
    languages: {
      ja: localizedPath("ja", path),
      en: localizedPath("en", path),
    },
  };
}
