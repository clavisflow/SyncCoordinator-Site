import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Box,
  FileText,
  GitFork,
  Rocket,
  Search,
  SquareTerminal,
  Workflow,
} from "lucide-react";

export type DocumentationSection = {
  id: string;
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

export const documentationSections: DocumentationSection[] = [
  {
    id: "overview",
    href: "/overview",
    icon: BookOpen,
    title: "Overview",
    description: "SyncCoordinator の概要、主要な機能、ユースケースを説明します。",
  },
  {
    id: "architecture",
    href: "/#architecture",
    icon: Box,
    title: "Architecture",
    description: "システム構成、コンポーネント、データフローを説明します。",
  },
  {
    id: "workflow",
    href: "/#workflow",
    icon: Workflow,
    title: "Workflow",
    description: "変更検知から競合解決、同期完了までの流れを説明します。",
  },
  {
    id: "getting-started",
    href: "/#getting-started",
    icon: Rocket,
    title: "Getting Started",
    description: "インストール、初期設定、最初の同期を順に案内します。",
  },
  {
    id: "examples",
    href: "/#examples",
    icon: SquareTerminal,
    title: "Examples",
    description: "代表的な同期シナリオと実践的な設定例を紹介します。",
  },
  {
    id: "github",
    href: "/#github",
    icon: GitFork,
    title: "GitHub",
    description: "ソースコード、Issue、最新のリリース情報を確認できます。",
  },
];

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
          <a href="/#getting-started">Download</a>
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
