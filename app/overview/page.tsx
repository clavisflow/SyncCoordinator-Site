import type { Metadata } from "next";
import { Box, Database, GitFork, Network, Server, Workflow } from "lucide-react";
import { DocsShell, ProductMark } from "../docs-shell";

export const metadata: Metadata = {
  title: "Overview | SyncCoordinator Documentation",
  description:
    "What SyncCoordinator does, the problems it solves, and the systems it is designed to connect.",
};

const capabilities = [
  {
    icon: Database,
    title: "業務アプリを改修しない",
    text: "既存の業務コードや業務テーブルに手を入れず、管理画面の設定で連携を構築します。",
  },
  {
    icon: Workflow,
    title: "DBごとの差を設定で吸収",
    text: "テーブル、列、型、コード値の違いをマッピングとして定義し、個別実装を減らします。",
  },
  {
    icon: Network,
    title: "双方向更新を安全に扱う",
    text: "同じデータへの更新を検知し、項目単位の自動マージまたは手動解決へつなげます。",
  },
  {
    icon: Server,
    title: "状況を通知し、運用を支える",
    text: "同期の状態や競合、対応が必要な事象を通知し、再試行や停止を一つの管理画面で操作できます。",
  },
] as const;

const useCases = [
  {
    title: "部門ごとのシステムをつなぐ",
    text: "受発注、在庫、顧客データなどを、既存システムを残したまま必要な範囲で同期するケース。",
  },
  {
    title: "新旧システムを併用する",
    text: "移行期間も業務を止めず、旧システムと新システムの間で必要なデータを同期するケース。",
  },
  {
    title: "顧客ごとの構成に対応する",
    text: "SI・パッケージ提供者が、顧客ごとのDB構成やコード体系をマッピングとして管理するケース。",
  },
] as const;

export default function OverviewPage() {
  return (
    <DocsShell activeSection="overview">
      <article className="overviewPage">
        <header className="overviewHero">
          <p className="eyebrow">DOCUMENTATION / OVERVIEW</p>
          <div className="overviewTitle">
            <ProductMark variant="hero" />
            <div>
              <h1>SyncCoordinatorとは</h1>
              <p className="overviewLead">
                既存の業務アプリケーションや業務テーブルを変更せずに、SQL Server、MySQL、PostgreSQL間のデータ同期を構築・運用するためのセルフホスト型基盤です。
              </p>
            </div>
          </div>
        </header>

        <section className="overviewSection overviewFoundation" aria-labelledby="overview-foundation">
          <div className="overviewSectionHeading">
            <p className="eyebrow">FOUNDATION</p>
            <h2 id="overview-foundation">業務側を変えずに、データをつなぐ。</h2>
          </div>
          <p className="overviewBody">
            既存の業務アプリケーションに個別の連携コードを追加する代わりに、接続先、テーブル・列の対応、同期ルールを管理画面で設定します。業務DBの既存テーブルは変更しません。
          </p>
          <p className="overviewBody overviewNote">
            同期には補助テーブルと変更検知Triggerを配備しますが、いずれも既存の業務テーブルやアプリケーションコードを変更せずに追加します。
          </p>
          <figure className="syncDiagram">
            <div className="syncDiagramSystem syncDiagramSystem-left">
              <span className="syncDiagramStatus">変更なし</span>
              <Database aria-hidden="true" />
              <strong>既存の業務システム</strong>
              <span>業務アプリケーション</span>
              <span>既存の業務テーブル</span>
            </div>
            <div className="syncDiagramFlow syncDiagramFlow-left" aria-hidden="true" />
            <div className="syncDiagramCore">
              <ProductMark variant="diagram" />
              <strong>SynCo</strong>
              <span>設定・同期・運用</span>
            </div>
            <div className="syncDiagramFlow syncDiagramFlow-right" aria-hidden="true" />
            <div className="syncDiagramSystem syncDiagramSystem-right">
              <span className="syncDiagramStatus">変更なし</span>
              <Database aria-hidden="true" />
              <strong>既存の業務システム</strong>
              <span>業務アプリケーション</span>
              <span>既存の業務テーブル</span>
            </div>
            <figcaption>
              接続先とマッピングを設定するだけで、既存システム間の変更を安全に同期します。
            </figcaption>
          </figure>
        </section>

        <section className="overviewSection" aria-labelledby="overview-capabilities">
          <div className="overviewSectionHeading">
            <p className="eyebrow">CORE CAPABILITIES</p>
            <h2 id="overview-capabilities">主な機能</h2>
          </div>
          <div className="overviewFeatureGrid">
            {capabilities.map((capability) => {
              const Icon = capability.icon;
              return (
                <div className="overviewFeature" key={capability.title}>
                  <Icon aria-hidden="true" />
                  <h3>{capability.title}</h3>
                  <p>{capability.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="overviewSection" aria-labelledby="overview-usecases">
          <div className="overviewSectionHeading">
            <p className="eyebrow">USE CASES</p>
            <h2 id="overview-usecases">想定する利用シーン</h2>
          </div>
          <div className="overviewUseCaseGrid">
            {useCases.map((useCase) => (
              <div className="overviewUseCase" key={useCase.title}>
                <Box aria-hidden="true" />
                <h3>{useCase.title}</h3>
                <p>{useCase.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="overviewConsole" aria-labelledby="overview-console">
          <div className="overviewConsoleHeading">
            <div>
              <p className="eyebrow">MANAGEMENT CONSOLE</p>
              <h2 id="overview-console">同期の状況を、一つの画面で把握する。</h2>
            </div>
            <p>
              同期経路、処理状況、最近の競合を確認し、必要に応じて再試行や停止を操作できます。
            </p>
          </div>
          <figure className="overviewConsolePreview">
            <img
              src="/management-ui/dashboard.jpg"
              alt="SyncCoordinator管理画面のダッシュボード。同期経路、処理状況、最近の競合を表示している。"
            />
          </figure>
        </section>

        <section className="overviewNext" aria-labelledby="overview-next">
          <p className="eyebrow">NEXT</p>
          <h2 id="overview-next">次に読む</h2>
          <div>
            <a href="/architecture"><GitFork aria-hidden="true" />Architecture</a>
            <a href="/workflow"><Workflow aria-hidden="true" />Workflow</a>
          </div>
        </section>
      </article>
    </DocsShell>
  );
}
