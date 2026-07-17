import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SyncCoordinator Documentation | ClavisFlow",
  description:
    "SyncCoordinator detects changes, resolves conflicts, and synchronizes data safely across enterprise systems.",
};

const sections = [
  {
    id: "overview",
    icon: "book",
    title: "Overview",
    description: "SyncCoordinator の概要、主要な機能、ユースケースを説明します。",
  },
  {
    id: "architecture",
    icon: "cube",
    title: "Architecture",
    description: "システム構成、コンポーネント、データフローを説明します。",
  },
  {
    id: "workflow",
    icon: "flow",
    title: "Workflow",
    description: "変更検知から競合解決、同期完了までの流れを説明します。",
  },
  {
    id: "getting-started",
    icon: "arrow",
    title: "Getting Started",
    description: "インストール、初期設定、最初の同期を順に案内します。",
  },
  {
    id: "examples",
    icon: "code",
    title: "Examples",
    description: "代表的な同期シナリオと実践的な設定例を紹介します。",
  },
  {
    id: "github",
    icon: "github",
    title: "GitHub",
    description: "ソースコード、Issue、最新のリリース情報を確認できます。",
  },
] as const;

function Mark({ small = false }: { small?: boolean }) {
  return (
    <span className={small ? "mark markSmall" : "mark"} aria-hidden="true">
      <span className="markCore" />
    </span>
  );
}

function LineIcon({ name }: { name: (typeof sections)[number]["icon"] }) {
  return <span className={`lineIcon icon-${name}`} aria-hidden="true" />;
}

function ArchitectureDiagram() {
  return (
    <div className="architectureDiagram" aria-label="SyncCoordinator connects enterprise data systems">
      <span className="connector connectorA" />
      <span className="connector connectorB" />
      <span className="connector connectorC" />
      <span className="connector connectorD" />

      <div className="diagramNode databaseNode" aria-hidden="true">
        <span />
      </div>
      <div className="diagramNode cloudNode" aria-hidden="true">
        <i />
      </div>
      <div className="diagramNode serverNode" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="diagramNode fileNode" aria-hidden="true">
        <span />
      </div>

      <div className="coordinatorNode">
        <Mark small />
      </div>
      <p className="diagramCaption">Detect · Resolve · Synchronize</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="siteShell">
      <header className="topHeader">
        <a className="brand" href="#overview" aria-label="ClavisFlow documentation home">
          <Mark />
          <span className="brandName">ClavisFlow</span>
          <span className="brandDivider" />
          <span className="productLabel">SyncCoordinator Documentation</span>
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
          <button type="submit" aria-label="Search">⌕</button>
        </form>
      </header>

      <aside className="sideNav">
        <nav aria-label="Documentation sections">
          {sections.map((section, index) => (
            <a className={index === 0 ? "selected" : ""} href={`#${section.id}`} key={section.id}>
              <LineIcon name={section.icon} />
              <span>{section.title}</span>
            </a>
          ))}
        </nav>
        <a className="pdfLink" href="#overview">
          <span className="documentIcon" aria-hidden="true" />
          PDF Version
        </a>
      </aside>

      <main className="mainContent">
        <section className="hero" id="overview">
          <div className="heroCopy">
            <p className="eyebrow">CLAVISFLOW DOCUMENTATION</p>
            <h1>SyncCoordinator</h1>
            <p className="tagline" lang="ja">データを、正しくつなぐ。</p>
            <p className="description" lang="ja">
              SyncCoordinator は、複数システム間のデータ変更を検知し、競合を安全に解決して、信頼できる状態で同期するエンタープライズ向けデータ同期基盤です。
            </p>
            <div className="heroActions">
              <a className="primaryButton" href="#getting-started">
                <LineIcon name="arrow" />
                Get Started
              </a>
              <a className="secondaryButton" href="#architecture">
                <LineIcon name="flow" />
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
            {sections.map((section) => (
              <a className="docCard" href={`#${section.id}`} id={section.id} key={section.id}>
                <span className="cardIcon"><LineIcon name={section.icon} /></span>
                <span className="cardText">
                  <strong>{section.title}</strong>
                  <span>{section.description}</span>
                </span>
                <span className="cardArrow" aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        </section>

        <footer>
          <span className="footerBrand"><Mark small />ClavisFlow</span>
          <span>© 2026 ClavisFlow. All rights reserved.</span>
          <a href="https://github.com/" rel="noreferrer">GitHub ↗</a>
        </footer>
      </main>
    </div>
  );
}
