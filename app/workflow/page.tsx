import type { Metadata } from "next";
import {
  Activity,
  Bell,
  CheckCircle2,
  Database,
  FileMinus2,
  GitFork,
  History,
  ListFilter,
  RefreshCw,
  Route,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Workflow as WorkflowIcon,
} from "lucide-react";
import { DocsShell, ProductMark } from "../docs-shell";

export const metadata: Metadata = {
  title: "Workflow | SyncCoordinator Documentation",
  description:
    "How SyncCoordinator detects changes, resolves conflicts, applies data, sends notifications, and resumes after failures.",
};

const contents = [
  ["processing-flow", "同期処理の流れ"],
  ["latest-state", "最新状態への収束"],
  ["conflict-flow", "競合した場合"],
  ["retry-resume", "再試行と再開"],
  ["notification-flow", "通知の流れ"],
  ["operations", "管理画面での確認"],
] as const;

const processingSteps = [
  {
    icon: Database,
    title: "変更に気づく",
    text: "業務DBのTriggerが、変更されたレコードをQueueへ知らせます。",
  },
  {
    icon: ListFilter,
    title: "同じ変更をまとめる",
    text: "Workerが新しい通知を取り出し、同じレコードの通知をひとつにまとめます。",
  },
  {
    icon: RefreshCw,
    title: "いまの値を確認する",
    text: "通知された時点の値ではなく、業務DBにある現在の値を読み直します。",
  },
  {
    icon: Route,
    title: "同期先を決める",
    text: "どこで起きた変更かを確認し、同期ルールとマッピングを選びます。",
  },
  {
    icon: ShieldAlert,
    title: "競合がないか確かめる",
    text: "前回の値と両システムの現在値を比べ、変換後の値も確認します。",
  },
  {
    icon: CheckCircle2,
    title: "同期先へ反映する",
    text: "同じ変更を二重に書かないよう確認してから反映し、処理結果を保存します。",
  },
] as const;

const convergenceCases = [
  { before: "更新 → 更新", after: "最後に更新された値を反映" },
  { before: "更新 → 削除", after: "削除された状態を反映" },
  { before: "削除 → 再作成", after: "作り直された現在の値を反映" },
] as const;

export default function WorkflowPage() {
  return (
    <DocsShell activeSection="workflow">
      <article className="overviewPage workflowPage">
        <header className="overviewHero">
          <p className="eyebrow">DOCUMENTATION / WORKFLOW</p>
          <div className="overviewTitle">
            <ProductMark variant="hero" />
            <div>
              <h1>Workflow</h1>
              <p className="overviewLead">
                業務DBで変更が起きると、SyncCoordinatorが現在の値を読み直し、問題がなければ同期先へ反映します。途中で止まっても、続きから安全にやり直せます。
              </p>
            </div>
          </div>
        </header>

        <nav className="architectureToc" aria-label="Workflowの目次">
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

        <section id="processing-flow" className="architectureSection" aria-labelledby="processing-flow-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">PROCESSING FLOW</p>
            <h2 id="processing-flow-title">同期処理の流れ</h2>
          </div>
          <p className="overviewBody">
            Workerは一定の間隔で変更を確認し、送信元ごとに処理します。管理画面で設定を変えた場合は次の処理から使われるため、実行中に接続先が切り替わることはありません。
          </p>
          <ol className="workflowPipeline">
            {processingSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title}>
                  <span className="workflowStepNumber">{String(index + 1).padStart(2, "0")}</span>
                  <Icon aria-hidden="true" />
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </li>
              );
            })}
          </ol>
          <p className="architectureCallout">
            1回分の処理がすべて片づいたときだけ、読み取り位置（Checkpoint）を進めます。途中で一時的なエラーが起きた場合は位置を変えず、次の処理で同じ場所からやり直します。
          </p>
        </section>

        <section id="latest-state" className="architectureSection" aria-labelledby="latest-state-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">LATEST STATE</p>
            <h2 id="latest-state-title">いちばん新しい状態を同期する</h2>
          </div>
          <p className="overviewBody">
            Queueに入るのは、「このレコードが変わった」という知らせです。古い変更をひとつずつ再現するのではなく、Workerが処理する時点の値を読み直します。
          </p>
          <div className="workflowConvergenceGrid">
            {convergenceCases.map((item) => (
              <article key={item.before}>
                <History aria-hidden="true" />
                <strong>{item.before}</strong>
                <span aria-hidden="true">→</span>
                <p>{item.after}</p>
              </article>
            ))}
          </div>

          <h3 className="architectureSubheading">削除された場合</h3>
          <div className="workflowRecoveryNotes">
            <article>
              <Trash2 aria-hidden="true" />
              <strong>物理削除</strong>
              <p>同期元からレコードが削除されたことを検知し、同期先のレコードも削除します。</p>
            </article>
            <article>
              <FileMinus2 aria-hidden="true" />
              <strong>論理削除</strong>
              <p>指定した列が削除状態の値になったことを検知し、同期先にも同じ状態を反映します。</p>
            </article>
          </div>
          <p className="architectureCallout">
            前回の同期後に同期先のレコードが変更されていた場合は、勝手に削除せず競合として扱います。削除は一部の項目だけに適用できないため、レコードを削除するか残すかを判断します。
          </p>
          <p className="workflowBoundaryNote">
            SyncCoordinatorが得意なのは、複数システムの「現在の状態」を揃えることです。承認、在庫移動、仕訳のように途中の操作にも意味があるデータは、イベントを省略しない別の連携方式が適しています。
          </p>
        </section>

        <section id="conflict-flow" className="architectureSection" aria-labelledby="conflict-flow-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">CONFLICT FLOW</p>
            <h2 id="conflict-flow-title">競合した場合</h2>
          </div>
          <p className="overviewBody">
            前回保存した値から両方のシステムが同じ項目を変更し、結果が違っている場合に競合と判断します。片方だけが変わっている場合は、そのまま自動で反映します。
          </p>
          <div className="workflowOutcomeGrid">
            <article>
              <p className="eyebrow">NO CONFLICT</p>
              <h3>競合なし</h3>
              <p>値の変換と書込み前の確認を行い、そのまま同期先へ反映します。</p>
            </article>
            <article>
              <p className="eyebrow">POLICY</p>
              <h3>ルールに従って決める</h3>
              <p>送られてきた値を使うか、同期先の値を残すかを設定済みのルールで決めます。結果は履歴に残します。</p>
            </article>
            <article>
              <p className="eyebrow">HOLD</p>
              <h3>人の判断を待つ</h3>
              <p>同期先の値を変えず、要対応として管理画面に残します。他のレコードの同期は続きます。</p>
            </article>
          </div>

          <h3 className="architectureSubheading">管理画面で解決する流れ</h3>
          <ol className="workflowResolutionFlow">
            <li><strong>違いを確認</strong><span>送られてきた値と、同期先にある現在の値を並べて確認します。</span></li>
            <li><strong>残す値を選ぶ</strong><span>項目ごとに、どちらの値を使うか、または手入力するかを選びます。</span></li>
            <li><strong>解決を依頼</strong><span>管理画面から直接書き込まず、管理DBに解決要求を保存します。</span></li>
            <li><strong>安全を確認して反映</strong><span>Workerが同期先をもう一度確認し、変わっていなければ反映します。</span></li>
          </ol>
          <p className="architectureCallout">
            画面を開いてから反映するまでに同期先の値が変わっていた場合は、上書きしません。最新の値を表示して、もう一度選び直せる状態に戻します。
          </p>
        </section>

        <section id="retry-resume" className="architectureSection" aria-labelledby="retry-resume-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">RETRY AND RESUME</p>
            <h2 id="retry-resume-title">再試行と再開</h2>
          </div>
          <p className="overviewBody">
            Workerは、どこまで読んだか、どの変更を処理中かをDBに保存します。停止やエラーが起きても、完了済みの変更を二重に反映せず、残っている処理から続けます。
          </p>
          <div className="architectureTableWrap">
            <table className="architectureTable workflowStateTable">
              <thead>
                <tr><th>状態</th><th>意味</th><th>次の動き</th></tr>
              </thead>
              <tbody>
                <tr><th>Completed</th><td>問題なく完了した、または反映する必要がなかった</td><td>同じ変更は処理せず、次の読取位置へ進みます。</td></tr>
                <tr><th>Failed</th><td>接続エラーなど、一時的な理由で今回の処理に失敗した</td><td>読取位置を進めず、次の周期で自動的にやり直します。</td></tr>
                <tr><th>Held</th><td>競合や値の問題があり、人の確認が必要になった</td><td>要対応として残し、ほかのレコードの同期を続けます。</td></tr>
                <tr><th>Processing</th><td>Workerが処理している途中</td><td>途中で停止した場合は、5分後に別の周期が取得し直します。</td></tr>
              </tbody>
            </table>
          </div>
          <p className="workflowBoundaryNote">
            <strong>Heldの扱い：</strong>
            競合によるHeldは管理画面から解決できます。値変換や列の検証でHeldになったデータを、管理画面から手動で再実行する機能は現在ありません。
          </p>
          <div className="workflowRecoveryNotes">
            <article><RefreshCw aria-hidden="true" /><strong>同じ変更は二重に書かない</strong><p>やり直すときも同じ配送IDを使います。同期先の適用済み記録を確認するため、二重反映を防げます。</p></article>
            <article><GitFork aria-hidden="true" /><strong>別の送信元は止めない</strong><p>ひとつの送信元でエラーが起きても、読取位置を別に持つほかの送信元は処理を続けます。</p></article>
          </div>

          <h3 className="architectureSubheading">一時停止した場合</h3>
          <p className="overviewBody">
            一時停止中はQueueも読み取り位置も動かしません。再開すると、停止中に残った通知から現在の値を読み直し、古い状態を順番に再生せず最新状態へ追いつきます。停止前に始まっていた処理は、そのまま完了する場合があります。
          </p>
          <p className="architectureCallout">
            一時停止は「あとで続きから再開する」ための運用操作です。システムや同期ルールの無効化は、同期対象から外すための設定であり、同じ意味ではありません。
          </p>
        </section>

        <section id="notification-flow" className="architectureSection" aria-labelledby="notification-flow-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">NOTIFICATIONS</p>
            <h2 id="notification-flow-title">通知の流れ</h2>
          </div>
          <p className="overviewBody">
            通知先が一時的に止まっていても、データ同期は続けたい。そのため、Workerは通知をすぐ送るのではなく、まず管理DBに保存し、別の処理でWebhookへ届けます。
          </p>
          <div className="workflowNotificationFlow" aria-label="Webhook notification flow">
            <div><Activity aria-hidden="true" /><strong>イベント発生</strong><span>同期、削除、競合、失敗、一時停止・再開</span></div>
            <span aria-hidden="true">→</span>
            <div><Database aria-hidden="true" /><strong>送信待ちとして保存</strong><span>管理DBのOutboxへ記録</span></div>
            <span aria-hidden="true">→</span>
            <div><Bell aria-hidden="true" /><strong>Webhook配送</strong><span>HMAC署名、配送履歴、段階的な再試行</span></div>
          </div>
          <p className="architectureCallout">
            Webhookへの送信に失敗しても、同期処理は止まりません。1分、5分、30分、2時間、6時間、12時間と間隔を空け、初回を含めて最大7回送ります。それでも届かなければ通知をFailedにします。同じ通知が届いた場合は、受信側でEvent IDを使って見分けられます。
          </p>
        </section>

        <section id="operations" className="architectureSection" aria-labelledby="operations-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">OPERATIONS</p>
            <h2 id="operations-title">管理画面での確認</h2>
          </div>
          <p className="overviewBody">
            ふだんの運用では、どこまで同期できているか、エラーや要対応が残っていないかを管理画面で確認します。Webhookの設定と送信履歴も同じ画面から管理できます。
          </p>
          <div className="workflowConsoleGrid">
            <figure className="workflowConsolePrimary">
              <img src="/management-ui/operations.jpg" alt="処理状況画面。システムごとのキュー読取位置と同期処理履歴を表示" />
              <figcaption><strong>処理状況</strong><span>Checkpoint、処理結果、試行回数、エラーを確認します。</span></figcaption>
            </figure>
            <figure>
              <img src="/management-ui/conflicts.jpg" alt="コンフリクト履歴画面。要対応の競合を一覧表示" />
              <figcaption><strong>コンフリクト</strong><span>要対応の競合と解決状態を確認します。</span></figcaption>
            </figure>
            <figure>
              <img src="/management-ui/notifications.jpg" alt="通知設定画面。Webhook通知先と対象イベントを設定" />
              <figcaption><strong>通知</strong><span>Webhook通知先、対象イベント、署名設定を管理します。</span></figcaption>
            </figure>
          </div>
        </section>

        <section className="overviewNext" aria-labelledby="workflow-next">
          <p className="eyebrow">NEXT</p>
          <h2 id="workflow-next">次に読む</h2>
          <div>
            <a href="/architecture"><ShieldCheck aria-hidden="true" />Architecture</a>
            <a href="/#getting-started"><WorkflowIcon aria-hidden="true" />Getting Started</a>
          </div>
        </section>
      </article>
    </DocsShell>
  );
}
