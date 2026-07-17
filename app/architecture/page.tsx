import type { Metadata } from "next";
import { Box, Database, GitFork, Workflow } from "lucide-react";
import { DocsShell, ProductMark } from "../docs-shell";

export const metadata: Metadata = {
  title: "Architecture | SyncCoordinator Documentation",
  description:
    "The SyncCoordinator runtime topology, management boundary, and business database deployment model.",
};

const components = [
  {
    icon: Box,
    title: "Coordinator Web",
    text: "管理画面と管理者認証を提供します。接続先、同期ルール、マッピングの編集と、DB配備用SQLの生成・検証を行います。同期処理は実行しません。",
  },
  {
    icon: Workflow,
    title: "Coordinator Worker",
    text: "管理DBから設定を読み、変更の取得、競合判定、送信先への適用を繰り返します。Webhook配送と管理DBのクリーンアップも行います。",
  },
  {
    icon: Database,
    title: "Coordinator 管理DB",
    text: "接続情報、同期ルール、マッピングを保存します。Checkpoint、Inbox、Snapshot、競合履歴など、再開に必要な状態もここに残します。",
  },
] as const;

const deploymentObjects = [
  "SyncChangeQueue",
  "SyncAppliedMessage",
  "SyncEntityOrigin",
  "SyncDeleteTombstone",
  "SyncCoordinatorDeployment",
  "対象テーブルの変更検知Trigger",
] as const;

const contents = [
  ["topology", "全体構成"],
  ["sync-rules", "同期ルールとマッピング"],
  ["conflicts-notifications", "競合と通知"],
  ["deployment", "業務DBへの配備"],
  ["state-reliability", "状態管理と再実行"],
  ["implementation-details", "実装の詳細"],
] as const;

export default function ArchitecturePage() {
  return (
    <DocsShell activeSection="architecture">
      <article className="overviewPage architecturePage">
        <header className="overviewHero">
          <p className="eyebrow">DOCUMENTATION / ARCHITECTURE</p>
          <div className="overviewTitle">
            <ProductMark variant="hero" />
            <div>
              <h1>Architecture</h1>
              <p className="overviewLead">
                SyncCoordinatorは、Web、Worker、管理DBの3つで構成されます。Webで設定した内容をWorkerが読み取り、業務DB間を同期します。処理状態は管理DBに保存します。
              </p>
            </div>
          </div>
        </header>

        <nav className="architectureToc" aria-label="Architectureの目次">
          <p>このページの内容</p>
          <ol>
            {contents.map(([id, label], index) => (
              <li key={id}>
                <a href={`#${id}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section id="topology" className="architectureSection" aria-labelledby="topology-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">OVERVIEW</p>
            <h2 id="topology-title">全体構成</h2>
          </div>
          <p className="overviewBody">
            SyncCoordinatorは業務システムとは別に配置します。Webは設定と管理、Workerは同期処理、管理DBは設定と処理状態の保存を受け持ちます。
          </p>

          <figure className="architectureTopology">
            <div className="architectureBusinessNode">
              <Database aria-hidden="true" />
              <strong>業務システム A</strong>
              <span>SQL Server / MySQL / PostgreSQL</span>
              <small>既存の業務アプリ・テーブル</small>
            </div>
            <div className="architectureFlow" aria-hidden="true"><span>変更を検知</span></div>
            <div className="architectureCoordinator">
              <div className="architectureCoordinatorLabel">
                <ProductMark variant="diagram" />
                <strong>SyncCoordinator</strong>
              </div>
              <div className="architectureCoordinatorStack">
                <div><Box aria-hidden="true" /><strong>Web</strong><span>設定・管理</span></div>
                <div><Workflow aria-hidden="true" /><strong>Worker</strong><span>同期・通知</span></div>
                <div><Database aria-hidden="true" /><strong>管理DB</strong><span>設定・状態</span></div>
              </div>
            </div>
            <div className="architectureFlow" aria-hidden="true"><span>安全に適用</span></div>
            <div className="architectureBusinessNode">
              <Database aria-hidden="true" />
              <strong>業務システム B</strong>
              <span>SQL Server / MySQL / PostgreSQL</span>
              <small>既存の業務アプリ・テーブル</small>
            </div>
            <figcaption>
              Workerは業務DBの変更を読み取り、マッピングと競合ポリシーに従って送信先へ反映します。
            </figcaption>
          </figure>

          <h3 className="architectureSubheading">コンポーネントの役割</h3>
          <div className="architectureComponentGrid">
            {components.map((component) => {
              const Icon = component.icon;
              return (
                <article className="architectureComponent" key={component.title}>
                  <Icon aria-hidden="true" />
                  <h3>{component.title}</h3>
                  <p>{component.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="sync-rules" className="architectureSection" aria-labelledby="rules-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">SYNC RULES AND MAPPING</p>
            <h2 id="rules-title">同期ルールとマッピング</h2>
          </div>
          <p className="overviewBody">
            同期ルールには、送信元、送信先、方向、競合時の扱いを設定します。テーブルや列の違いは、ルールに紐づくマッピングで指定します。
          </p>
          <div className="architectureRuleGrid">
            <article>
              <p className="eyebrow">DIRECTION</p>
              <h3>片方向と双方向</h3>
              <ul>
                <li><strong>片方向</strong><span>送信元から送信先への変更だけを処理します。</span></li>
                <li><strong>双方向</strong><span>送信元から同期されたレコードが送信先で更新された場合、その変更を最初の送信元へ戻します。</span></li>
                <li><strong>ループ防止</strong><span>最初の発生元と適用済みMessage IDを記録し、SyncCoordinator自身が反映した変更を再送しません。</span></li>
              </ul>
            </article>
            <article>
              <p className="eyebrow">MAPPING</p>
              <h3>テーブル・列・値の対応</h3>
              <ul>
                <li><strong>テーブルとキー</strong><span>両端のschema、table、レコードを識別するキー列を指定します。</span></li>
                <li><strong>列と型</strong><span>列の対応、NULL可否、文字列長、数値のprecision／scaleを保存します。</span></li>
                <li><strong>値変換</strong><span>コード値の変換、日時の正規化、方向別の固定値を設定できます。</span></li>
              </ul>
            </article>
          </div>
        </section>

        <section id="conflicts-notifications" className="architectureSection" aria-labelledby="conflict-notification-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">CONFLICTS AND NOTIFICATIONS</p>
            <h2 id="conflict-notification-title">競合と通知</h2>
          </div>
          <p className="overviewBody">
            競合の処理と外部通知はWorkerが行います。判定結果と通知の配送状態は管理DBに保存され、管理画面から確認できます。
          </p>
          <div className="architectureConcernGrid">
            <article>
              <p className="eyebrow">CONFLICT</p>
              <h3>競合した場合</h3>
              <ol className="architectureConcernFlow">
                <li>
                  <strong>競合を検知</strong>
                  <span>前回のSnapshot、受信した値、送信先の現在値を比較します。両側で同じ項目が変更され、値が異なる場合を競合として扱います。</span>
                </li>
                <li>
                  <strong>ポリシーを適用</strong>
                  <span>同期ルールに従い、受信値を採用する、送信先の値を残す、保留する、マージする、のいずれかを選びます。</span>
                </li>
                <li>
                  <strong>必要なら管理画面で解決</strong>
                  <span>保留した競合は管理画面に表示します。選択後、Workerが送信先の値を確認し直してから反映します。</span>
                </li>
              </ol>
            </article>
            <article>
              <p className="eyebrow">NOTIFICATION</p>
              <h3>通知の流れ</h3>
              <ol className="architectureConcernFlow">
                <li>
                  <strong>イベントを保存</strong>
                  <span>競合検知や同期エラーが発生すると、通知イベントを管理DBのOutboxへ保存します。</span>
                </li>
                <li>
                  <strong>Webhookへ送信</strong>
                  <span>WorkerがOutboxを読み、登録済みのWebhookへ非同期で送信します。現在の通知先はWebhookです。</span>
                </li>
                <li>
                  <strong>失敗時は再試行</strong>
                  <span>Webhookの配送に失敗した場合は間隔を空けて再試行します。通知の失敗で同期処理は停止しません。</span>
                </li>
              </ol>
            </article>
          </div>
        </section>

        <section id="deployment" className="architectureSection" aria-labelledby="deployment-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">BUSINESS DATABASE BOUNDARY</p>
            <h2 id="deployment-title">業務DBへの配備</h2>
          </div>
          <p className="overviewBody">
            業務DBには、変更検知と重複適用防止に使う補助オブジェクトを追加します。既存のアプリケーションコード、業務テーブル、業務列は変更しません。
          </p>
          <div className="architectureDeployment">
            <div>
              <p className="eyebrow">DEPLOYED OBJECTS</p>
              <ul className="architectureObjectList">
                {deploymentObjects.map((object) => <li key={object}>{object}</li>)}
              </ul>
            </div>
            <div className="architectureUnchanged">
              <p className="eyebrow">UNCHANGED</p>
              <ul>
                <li>既存の業務アプリケーション</li>
                <li>既存の業務テーブル</li>
                <li>既存テーブルの業務列</li>
              </ul>
            </div>
          </div>
          <p className="architectureCallout">
            設定の保存時にはDDLを実行しません。生成されたSQLをDBAが確認・実行し、配備内容の検証が終わってから同期ルールを有効にします。
          </p>
          <p className="architectureInitialDataNote">
            <strong>初期データについて：</strong>
            SyncCoordinatorは配備後の変更を同期します。既存データの一括移行や全件比較は行わないため、同期を有効にする前に別の手段で初期データを揃えてください。
          </p>
        </section>

        <section id="state-reliability" className="architectureSection" aria-labelledby="state-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">STATE AND RELIABILITY</p>
            <h2 id="state-title">状態管理と再実行</h2>
          </div>
          <p className="overviewBody">
            業務データは各業務DBに残し、同期設定と処理状態はCoordinator管理DBに保存します。Worker自身は永続状態を持たないため、停止しても保存済みの位置から処理を再開できます。
          </p>
          <div className="architectureTableWrap">
            <table className="architectureTable">
              <thead>
                <tr>
                  <th>保存場所</th>
                  <th>主な状態</th>
                  <th>役割</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Coordinator管理DB</th>
                  <td>SystemDefinition、同期ルール、マッピング、Checkpoint、Inbox、Snapshot、競合・監査・運用履歴</td>
                  <td>設定と処理状態の正本です。Workerは再起動後、この状態を読み直して処理を再開します。</td>
                </tr>
                <tr>
                  <th>業務DB</th>
                  <td>業務レコード、変更Queue、適用済みMessage、Origin、削除Tombstone、配備ハッシュ</td>
                  <td>現在の業務データと、変更検知・重複適用防止に使う補助状態を保持します。</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="architectureSubheading">再起動と再送への対応</h3>
          <div className="architectureReliabilityGrid">
            <article>
              <strong>Checkpoint</strong>
              <p>送信元ごとに最後に処理したQueueIdを保存します。処理に失敗した場合、その送信元の位置は進めません。</p>
            </article>
            <article>
              <strong>Inbox・処理リース</strong>
              <p>配送状態をProcessing、Completed、Held、Failedで保存します。処理中に停止した場合は、リース失効後に同じ配送を取得し直します。</p>
            </article>
            <article>
              <strong>冪等な適用</strong>
              <p>配送ごとに同じIDを生成し、送信先のSyncAppliedMessageへ記録します。同じ配送が再実行されても二重に反映しません。</p>
            </article>
          </div>
          <p className="architectureCallout">
            SyncChangeQueueは変更後の値そのものではなく、「このレコードが変わった」という通知を保持します。再開時には対象レコードを読み直し、その時点の最新状態を同期します。
          </p>
        </section>

        <section id="implementation-details" className="architectureSection" aria-labelledby="implementation-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">IMPLEMENTATION DETAILS</p>
            <h2 id="implementation-title">実装の詳細</h2>
          </div>
          <p className="overviewBody">
            実装と本番配備に関係する補足です。必要な項目を開いて確認してください。
          </p>
          <div className="architectureDetailsList">
            <details>
              <summary>プロジェクトの依存方向</summary>
              <div className="architectureDetailsContent">
                <p>同期処理はCoreに置きます。Webは業務DB Connectorを直接実行しません。WorkerがCoreを呼び出して同期を進めます。</p>
                <pre aria-label="Project dependency direction"><code>{`Contracts ← Core ← Infrastructure ← Worker
                      ↑
                      └──────────── Web

ServiceDefaults ← Worker / Web
AppHost ─────────→ Worker / Web / demo resources`}</code></pre>
              </div>
            </details>
            <details>
              <summary>設定変更が反映されるタイミング</summary>
              <div className="architectureDetailsContent">
                <ol className="architectureSequence">
                  <li><strong>周期開始</strong><span>Workerが処理用のscopeを作ります。</span></li>
                  <li><strong>接続先を取得</strong><span>有効なシステム定義と接続情報を管理DBから読みます。</span></li>
                  <li><strong>同期を実行</strong><span>同じ周期の途中では接続先を切り替えません。</span></li>
                  <li><strong>次周期</strong><span>設定変更はWorkerを再起動せず、次の周期から反映されます。</span></li>
                </ol>
              </div>
            </details>
            <details>
              <summary>暗号鍵とDB権限</summary>
              <div className="architectureDetailsContent architectureSecurityGrid">
                <article>
                  <strong>接続情報の保護</strong>
                  <p>業務DBの接続文字列とWebhookの署名鍵は、Data Protectionで暗号化して管理DBへ保存します。</p>
                </article>
                <article>
                  <strong>共有Key Ring</strong>
                  <p>WebとWorkerを別ホストに置く場合は、両方から読める共有Key Ringを用意し、ACLで保護します。</p>
                </article>
                <article>
                  <strong>最小権限</strong>
                  <p>Workerが通常運用で使う読書き権限と、補助オブジェクトを作成するDDL権限は分けます。</p>
                </article>
              </div>
            </details>
          </div>
        </section>

        <section className="overviewNext" aria-labelledby="architecture-next">
          <p className="eyebrow">NEXT</p>
          <h2 id="architecture-next">次に読む</h2>
          <div>
            <a href="/overview"><GitFork aria-hidden="true" />Overview</a>
            <a href="/#workflow"><Workflow aria-hidden="true" />Workflow</a>
          </div>
        </section>
      </article>
    </DocsShell>
  );
}
