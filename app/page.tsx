import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  Box,
  Cloud,
  Database,
  FileSpreadsheet,
  FileText,
  GitFork,
  Network,
  Rocket,
  Search,
  Server,
  SquareTerminal,
  Workflow,
} from "lucide-react";

export const metadata: Metadata = {
  title: "SyncCoordinator Documentation | ClavisFlow",
  description:
    "SyncCoordinator detects changes, resolves conflicts, and synchronizes data safely across enterprise systems.",
};

type Section = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

const sections: Section[] = [
  {
    id: "overview",
    icon: BookOpen,
    title: "Overview",
    description: "SyncCoordinator の概要、主要な機能、ユースケースを説明します。",
  },
  {
    id: "architecture",
    icon: Box,
    title: "Architecture",
    description: "システム構成、コンポーネント、データフローを説明します。",
  },
  {
    id: "workflow",
    icon: Workflow,
    title: "Workflow",
    description: "変更検知から競合解決、同期完了までの流れを説明します。",
  },
  {
    id: "getting-started",
    icon: Rocket,
    title: "Getting Started",
    description: "インストール、初期設定、最初の同期を順に案内します。",
  },
  {
    id: "examples",
    icon: SquareTerminal,
    title: "Examples",
    description: "代表的な同期シナリオと実践的な設定例を紹介します。",
  },
  {
    id: "github",
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

function ProductMark({ variant }: { variant: "header" | "hero" | "diagram" }) {
  return (
    <img
      className={`productMark productMark-${variant}`}
      src="/sync-brand-mark.png"
      alt=""
      aria-hidden="true"
    />
  );
}

function ArchitectureDiagram() {
  return (
    <div className="architectureDiagram" aria-label="SyncCoordinator connects enterprise data systems">
      <span className="connector connectorA" />
      <span className="connector connectorB" />
      <span className="connector connectorC" />
      <span className="connector connectorD" />

      <div className="diagramNode databaseNode" aria-hidden="true">
        <Database />
      </div>
      <div className="diagramNode cloudNode" aria-hidden="true">
        <Cloud />
      </div>
      <div className="diagramNode serverNode" aria-hidden="true">
        <Server />
      </div>
      <div className="diagramNode fileNode" aria-hidden="true">
        <FileSpreadsheet />
      </div>

      <div className="coordinatorNode">
        <ProductMark variant="diagram" />
      </div>
      <p className="diagramCaption">Detect · Resolve · Synchronize</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="siteShell">
      <header className="topHeader">
        <a className="brand" href="#overview" aria-label="SyncCoordinator documentation home">
          <ProductMark variant="header" />
          <span className="headerProductName">SyncCoordinator</span>
          <span className="brandDivider" />
          <span className="productLabel">Documentation</span>
        </a>

        <nav className="headerNav" aria-label="Primary navigation">
          <a className="active" href="#overview">Docs</a>
          <a href="#getting-started">Download</a>
          <a href="https://github.com/" rel="noreferrer">GitHub</a>
        </nav>

        <form className="search" action="#overview" role="search">
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
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <a className={index === 0 ? "selected" : ""} href={`#${section.id}`} key={section.id}>
                <Icon className="navIcon" aria-hidden="true" />
                <span>{section.title}</span>
              </a>
            );
          })}
        </nav>
        <a className="pdfLink" href="#overview">
          <FileText aria-hidden="true" />
          PDF Version
        </a>
      </aside>

      <main className="mainContent">
        <section className="hero" id="overview">
          <div className="heroCopy">
            <p className="eyebrow">CLAVISFLOW DOCUMENTATION</p>
            <div className="heroTitle">
              <ProductMark variant="hero" />
              <h1>
                SyncCoordinator
                <span className="nickname">（SynCo）</span>
              </h1>
            </div>
            <p className="tagline" lang="ja">データを、正しくつなぐ。</p>
            <p className="description" lang="ja">
              SyncCoordinator は、複数システム間のデータ変更を検知し、競合を安全に解決して、信頼できる状態で同期するエンタープライズ向けデータ同期基盤です。
            </p>
            <div className="heroActions">
              <a className="primaryButton" href="#getting-started">
                <Rocket aria-hidden="true" />
                Get Started
              </a>
              <a className="secondaryButton" href="#architecture">
                <Network aria-hidden="true" />
                Architecture
              </a>
            </div>
          </div>
          <ArchitectureDiagram />
        </section>

        <section className="docsSection" aria-labelledby="docs-heading">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">DOCUMENTATION</p>
              <h2 id="docs-heading">Explore the documentation</h2>
            </div>
            <p>設計思想から導入手順、実装例まで、必要な情報を順に確認できます。</p>
          </div>

          <div className="cardGrid">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <a className="docCard" href={`#${section.id}`} id={section.id} key={section.id}>
                  <span className="cardIcon"><Icon aria-hidden="true" /></span>
                  <span className="cardText">
                    <strong>{section.title}</strong>
                    <span>{section.description}</span>
                  </span>
                  <ArrowRight className="cardArrow" aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </section>

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
