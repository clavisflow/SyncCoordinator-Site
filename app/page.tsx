import type { Metadata } from "next";
import {
  ArrowRight,
  Cloud,
  Database,
  FileSpreadsheet,
  Server,
} from "lucide-react";
import { DocsShell, documentationSections, ProductMark } from "./docs-shell";
import { localeAlternates, sitePath } from "./i18n";

export const metadata: Metadata = {
  title: "SyncCoordinator Documentation | ClavisFlow",
  description:
    "SyncCoordinatorは、既存の業務システムを変更せず、競合を検知・解決しながらSQL Server、MySQL、PostgreSQL間のデータを安全に同期するセルフホスト型基盤です。",
  alternates: localeAlternates("/"),
};

// Set to false to restore the original lightweight architecture diagram.
const useDetailedHeroIllustration = true;

function ArchitectureDiagram() {
  return (
    <div className="architectureDiagram" aria-label="SyncCoordinator connects enterprise data systems">
      <span className="connector connectorA" />
      <span className="connector connectorB" />
      <span className="connector connectorC" />
      <span className="connector connectorD" />

      <div className="diagramNode databaseNode" aria-hidden="true"><Database /></div>
      <div className="diagramNode cloudNode" aria-hidden="true"><Cloud /></div>
      <div className="diagramNode serverNode" aria-hidden="true"><Server /></div>
      <div className="diagramNode fileNode" aria-hidden="true"><FileSpreadsheet /></div>

      <div className="coordinatorNode"><ProductMark variant="diagram" /></div>
      <p className="diagramCaption">Detect · Resolve · Synchronize</p>
    </div>
  );
}

function DetailedHeroIllustration() {
  return (
    <figure className="heroIllustration">
      <img
        src={sitePath("/hero-sync-flow.webp")}
        alt="業務システムのデータをSyncCoordinatorで同期し、競合を自動または手動で解決する流れ"
      />
    </figure>
  );
}

export default function Home() {
  return (
    <DocsShell>
      <section className={useDetailedHeroIllustration ? "hero heroWithIllustration" : "hero"} id="overview">
        <div className="heroCopy">
          <p className="eyebrow">CLAVISFLOW DOCUMENTATION</p>
          <div className="heroTitle">
            <ProductMark variant="hero" />
            <h1>
              SyncCoordinator
              <span className="nickname">（SynCo）</span>
            </h1>
          </div>
          <div className="heroDetailRow">
            <div>
              <p className="tagline" lang="ja">データを、正しくつなぐ。</p>
              <p className="description" lang="ja">
                既存の業務アプリケーション・業務テーブルを変更せずに、データ同期を構築・運用。<br />
                SyncCoordinatorは、システム間の競合を検知し、解決方法を選択して安全に同期します。
              </p>
              <p className="heroMetadata" aria-label="Supported environments">
                <span>Self-hosted</span>
                <span>SQL Server</span>
                <span>MySQL</span>
                <span>PostgreSQL</span>
              </p>
            </div>
            {useDetailedHeroIllustration ? <DetailedHeroIllustration /> : <ArchitectureDiagram />}
          </div>
        </div>
      </section>

      <section className="monitorSection" aria-labelledby="monitor-heading">
        <div className="monitorCard">
          <div className="monitorCopy">
            <p className="eyebrow">MONITOR PROGRAM</p>
            <h2 id="monitor-heading">SyncCoordinator導入モニター募集</h2>
            <p className="monitorLead">
              2つの業務システム間で、同期対象1〜3テーブルの初期導入を無償で支援します。
            </p>
            <p>
              対象は、導入後のフィードバックと導入事例の作成にご協力いただける企業です。
              導入事例の公開内容は、事前にご確認いただきます。
            </p>
            <p className="monitorScope">
              個別開発、インフラ構築、初期データ移行、対象範囲を超える追加設定は支援対象外です。
              必要な場合は別途お見積りします。
            </p>
          </div>
          <div className="monitorContact">
            <p>導入環境や同期したいデータについて、まずはご相談ください。</p>
            <a
              className="monitorButton"
              href="mailto:contact@clavisflow.net?subject=SyncCoordinator導入モニターについて"
            >
              <span>モニター導入について相談する</span>
              <ArrowRight aria-hidden="true" />
            </a>
            <a className="monitorEmail" href="mailto:contact@clavisflow.net">
              contact@clavisflow.net
            </a>
          </div>
        </div>
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
          {documentationSections.map((section) => {
            const Icon = section.icon;
            return (
              <a
                className="docCard"
                href={section.href}
                id={section.id === "overview" ? "overview-card" : section.id}
                key={section.id}
              >
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
    </DocsShell>
  );
}
