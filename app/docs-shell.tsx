import type { ReactNode } from "react";
import {
  FileText,
  Search,
} from "lucide-react";
import { documentationSections } from "./documentation-sections";
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
}: {
  activeSection?: string;
  children: ReactNode;
}) {
  return (
    <div className="siteShell">
      <header className="topHeader">
        <a className="brand" href="/" aria-label="SyncCoordinator documentation home">
          <ProductMark variant="header" />
          <span className="headerProductName">SyncCoordinator</span>
          <span className="brandDivider" />
          <span className="productLabel">Documentation</span>
        </a>

        <nav className="headerNav" aria-label="Primary navigation">
          <a className="active" href="/">Home</a>
          <a href="/getting-started">Download</a>
          <a href="https://github.com/" rel="noreferrer">GitHub</a>
        </nav>

        <form className="search" action="/" role="search">
          <label className="srOnly" htmlFor="docs-search">Search the documentation</label>
          <input id="docs-search" type="search" placeholder="Search the docs" />
          <kbd>⌘ K</kbd>
          <button type="submit" aria-label="Search">
            <Search aria-hidden="true" />
          </button>
        </form>

        <MobileNavigation activeSection={activeSection} />
      </header>

      <aside className="sideNav">
        <nav aria-label="Documentation sections">
          {documentationSections.map((section) => {
            const Icon = section.icon;
            return (
              <a className={activeSection === section.id ? "selected" : ""} href={section.href} key={section.id}>
                <Icon className="navIcon" aria-hidden="true" />
                <span>{section.title}</span>
              </a>
            );
          })}
        </nav>
        <a className="pdfLink" href="/">
          <FileText aria-hidden="true" />
          PDF Version
        </a>
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
