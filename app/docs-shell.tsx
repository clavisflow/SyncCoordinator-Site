import type { ReactNode } from "react";
import { documentationSections, getDocumentationSections } from "./documentation-sections";
import { DocsSearch } from "./docs-search";
import { localizedPath, type SiteLocale } from "./i18n";
import { MobileNavigation } from "./mobile-navigation";

export { documentationSections } from "./documentation-sections";
export type { DocumentationSection } from "./documentation-sections";

function BrandSignature() {
  return (
    <span className="brandSignature brandSignature-footer" aria-label="ClavisFlow">
      <span className="signatureMark" aria-hidden="true">
        <img src="/clavisflow-brand-icon.png" alt="" />
      </span>
      <img className="signatureWordmark" src="/clavisflow-wordmark.png" alt="" />
    </span>
  );
}

export function ProductMark({ variant }: { variant: "header" | "hero" | "diagram" }) {
  return (
    <img
      className={`productMark productMark-${variant}`}
      src="/sync-brand-mark.png"
      alt=""
      aria-hidden="true"
    />
  );
}

export function DocsShell({
  activeSection,
  children,
  locale = "ja",
}: {
  activeSection?: string;
  children: ReactNode;
  locale?: SiteLocale;
}) {
  const sections = getDocumentationSections(locale);
  const currentPath = activeSection ? `/${activeSection}` : "/";
  const jaHref = currentPath;
  const enHref = localizedPath("en", currentPath);

  return (
    <div className="siteShell" lang={locale}>
      <header className="topHeader">
        <a className="brand" href={localizedPath(locale, "/")} aria-label="SyncCoordinator documentation home">
          <ProductMark variant="header" />
          <span className="headerProductName">SyncCoordinator</span>
          <span className="brandDivider" />
          <span className="productLabel">Documentation</span>
        </a>

        <div className="headerTools">
          <DocsSearch locale={locale} />
          <nav className="languageSwitcher" aria-label={locale === "ja" ? "言語を選択" : "Select language"}>
            <a className={locale === "ja" ? "selected" : ""} href={jaHref} lang="ja" aria-current={locale === "ja" ? "page" : undefined}>JA</a>
            <span aria-hidden="true">/</span>
            <a className={locale === "en" ? "selected" : ""} href={enHref} lang="en" aria-current={locale === "en" ? "page" : undefined}>EN</a>
          </nav>
        </div>

        <MobileNavigation activeSection={activeSection} locale={locale} />
      </header>

      <aside className="sideNav">
        <nav aria-label="Documentation sections">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <a className={activeSection === section.id ? "selected" : ""} href={section.href} key={section.id}>
                <Icon className="navIcon" aria-hidden="true" />
                <span>{section.title}</span>
              </a>
            );
          })}
        </nav>
      </aside>

      <main className="mainContent">
        {children}
        <footer>
          <a
            className="footerBrandLink"
            href="https://clavisflow.net/"
            target="_blank"
            rel="noreferrer"
            aria-label="ClavisFlow website"
          >
            <BrandSignature />
          </a>
        </footer>
      </main>
    </div>
  );
}
