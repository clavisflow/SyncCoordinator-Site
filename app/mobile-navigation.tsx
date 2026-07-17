"use client";

import { useState, type KeyboardEvent } from "react";
import { Menu, X } from "lucide-react";
import { getDocumentationSections } from "./documentation-sections";
import { localizedPath, type SiteLocale } from "./i18n";

export function MobileNavigation({
  activeSection,
  locale = "ja",
}: {
  activeSection?: string;
  locale?: SiteLocale;
}) {
  const [open, setOpen] = useState(false);
  const documentationSections = getDocumentationSections(locale);

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
        <nav className="mobileNavUtility" aria-label="Mobile primary navigation">
          <a href={localizedPath(locale, "/")} onClick={close}>Home</a>
          <a href="https://github.com/clavisflow/SyncCoordinator" rel="noreferrer" onClick={close}>GitHub</a>
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
