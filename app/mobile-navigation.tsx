"use client";

import { useState, type KeyboardEvent } from "react";
import { Menu, X } from "lucide-react";
import { getDocumentationSections } from "./documentation-sections";
import { DocsSearch } from "./docs-search";
import { localizedPath, type SiteLocale } from "./i18n";

export function MobileNavigation({
  activeSection,
  currentPath = "/",
  locale = "ja",
}: {
  activeSection?: string;
  currentPath?: string;
  locale?: SiteLocale;
}) {
  const [open, setOpen] = useState(false);
  const documentationSections = getDocumentationSections(locale);
  const jaHref = localizedPath("ja", currentPath);
  const enHref = localizedPath("en", currentPath);

  const close = () => setOpen(false);
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      close();
    }
  };

  return (
    <div className="mobileNavControl" onKeyDown={handleKeyDown}>
      <button
        className="mobileMenuButton"
        type="button"
        aria-label={open ? (locale === "ja" ? "ドキュメントメニューを閉じる" : "Close documentation menu") : (locale === "ja" ? "ドキュメントメニューを開く" : "Open documentation menu")}
        aria-expanded={open}
        aria-controls="mobile-documentation-menu"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>

      <div
        className="mobileNavPanel"
        id="mobile-documentation-menu"
        hidden={!open}
      >
        <div className="mobileNavTools">
          <DocsSearch locale={locale} />
          <nav className="languageSwitcher" aria-label={locale === "ja" ? "言語を選択" : "Select language"}>
            <a className={locale === "ja" ? "selected" : ""} href={jaHref} lang="ja" aria-current={locale === "ja" ? "page" : undefined}>JA</a>
            <span aria-hidden="true">/</span>
            <a className={locale === "en" ? "selected" : ""} href={enHref} lang="en" aria-current={locale === "en" ? "page" : undefined}>EN</a>
          </nav>
        </div>
        <p className="mobileNavLabel">Documentation</p>
        <nav className="mobileNavLinks" aria-label="Mobile documentation sections">
          {documentationSections.map((section) => {
            const Icon = section.icon;
            return (
              <a
                className={activeSection === section.id ? "selected" : ""}
                href={section.href}
                key={section.id}
                onClick={close}
              >
                <Icon aria-hidden="true" />
                <span>{section.title}</span>
              </a>
            );
          })}
        </nav>
      </div>

      {open && (
        <button
          className="mobileNavBackdrop"
          type="button"
          aria-label={locale === "ja" ? "ドキュメントメニューを閉じる" : "Close documentation menu"}
          onClick={close}
        />
      )}
    </div>
  );
}
