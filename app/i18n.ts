export type SiteLocale = "ja" | "en";

export function localizedPath(locale: SiteLocale, path: string) {
  if (locale === "ja") return path;
  return path === "/" ? "/en" : `/en${path}`;
}

export function localeAlternates(path: string, locale: SiteLocale = "ja") {
  return {
    canonical: localizedPath(locale, path),
    languages: {
      ja: path,
      en: path === "/" ? "/en" : `/en${path}`,
    },
  };
}
