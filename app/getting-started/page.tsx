import type { Metadata } from "next";
import {
  CheckCircle2,
  ClipboardCheck,
  Container,
  Database,
  MonitorCog,
  ServerCog,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { DocsShell, ProductMark } from "../docs-shell";
import { ExpandableImage } from "../expandable-image";
import { localeAlternates, sitePath } from "../i18n";

export const metadata: Metadata = {
  title: "Getting Started | SyncCoordinator Documentation",
  description:
    "Run the SyncCoordinator demo, change its synchronization settings, and prepare an environment for actual business databases.",
  alternates: localeAlternates("/getting-started"),
};

const contents = [
  ["run-demo", "デモを起動する"],
  ["first-login", "初回ログイン"],
  ["configure-demo", "設定を確認・変更する"],
  ["deploy-database", "業務DBへ反映する"],
  ["verify-demo", "同期を確認する"],
  ["production", "実環境で使う"],
] as const;

const productionChecks = [
  {
    title: "初期データを揃える",
    text: "SyncCoordinatorは配備後の変更を同期します。既存データは同期開始前に別の手段で揃えます。",
  },
  {
    title: "HTTPSを使用する",
    text: "管理画面と認証Cookieを保護するため、本番ではHTTPSで公開します。",
  },
  {
    title: "暗号鍵を共有・保護する",
    text: "WebとWorkerを分ける場合は、両方が使えるKey Ringを用意し、アクセス制御とバックアップを行います。",
  },
  {
    title: "DB権限を分ける",
    text: "Workerの通常権限と、同期用オブジェクトを作成するDDL権限を分けます。",
  },
] as const;

export default function GettingStartedPage() {
  return (
    <DocsShell activeSection="getting-started">
      <article className="overviewPage gettingStartedPage">
        <header className="overviewHero">
          <p className="eyebrow">DOCUMENTATION / GETTING STARTED</p>
          <div className="overviewTitle">
            <ProductMark variant="hero" />
            <div>
              <h1>Getting Started</h1>
              <p className="overviewLead">
                まずデモを起動し、用意されている同期設定を確認・変更します。管理画面の操作と同期の流れをつかんだあと、実際の業務DBを使う構成へ進みます。
              </p>
            </div>
          </div>
        </header>

        <nav className="architectureToc" aria-label="Getting Startedの目次">
          <p>このページの内容</p>
          <ol>
            {contents.map(([id, label], index) => (
              <li key={id}>
                <a href={"#" + id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section id="run-demo" className="architectureSection" aria-labelledby="run-demo-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">QUICK START</p>
            <h2 id="run-demo-title">デモを起動する</h2>
          </div>
          <p className="overviewBody">
            デモでは、Customer Portal、CRM、Field Serviceと3種類の業務DBをまとめて起動します。実際の同期処理と同じ経路を使うため、製品の動きを一通り確認できます。
          </p>
          <div className="gettingStartedPrerequisites">
            <strong>この手順に必要なもの</strong>
            <ul>
              <li>Windows 10（win-x64、確認済み）</li>
              <li>.NET SDK 10.0.301</li>
              <li>Aspire CLI 13.4.4</li>
              <li>Docker Desktop</li>
              <li>PowerShellまたはターミナル</li>
            </ul>
            <p>Visual StudioとVS Codeは必須ではありません。</p>
          </div>
          <p className="overviewBody">リポジトリのルートで、次のコマンドを実行します。</p>
          <pre className="gettingStartedCode" aria-label="PowerShell commands to run the demo"><code>{`dotnet tool restore
dotnet restore SyncCoordinator.sln
dotnet build SyncCoordinator.sln --no-restore
dotnet test SyncCoordinator.sln --no-build
aspire run --apphost src/SyncCoordinator.AppHost/SyncCoordinator.AppHost.csproj`}</code></pre>
          <div className="gettingStartedExpected">
            <MonitorCog aria-hidden="true" />
            <div>
              <strong>起動後に確認できるもの</strong>
              <p>Aspire Dashboardに、SyncCoordinator Web、Worker、3つのサンプル業務アプリと業務DBが表示されます。</p>
            </div>
          </div>
          <p className="architectureCallout">
            デモでは、業務システムとDB接続、無効な同期ルール、テーブル／列マッピングまで用意されています。同期用テーブルとTriggerはまだ業務DBへ反映されていません。
          </p>
        </section>

        <section id="first-login" className="architectureSection" aria-labelledby="first-login-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">FIRST LOGIN</p>
            <h2 id="first-login-title">管理者を設定してログインする</h2>
          </div>
          <p className="overviewBody">
            初回起動時は、Webサーバー自身のブラウザーから管理者パスワードを登録します。初期設定画面は外部PCから開けません。
          </p>
          <ol className="gettingStartedInstructionList">
            <li><span>1</span><div><strong>初期設定画面を開く</strong><p>Webサーバー上で<code>http://localhost:&lt;Webのポート&gt;/account/setup</code>を開きます。</p></div></li>
            <li><span>2</span><div><strong>パスワードを登録する</strong><p>12文字以上128文字以下のパスワードを設定します。ユーザー名は<code>admin</code>固定です。</p></div></li>
            <li><span>3</span><div><strong>ログインする</strong><p>設定したパスワードでログインすると、ダッシュボードが表示されます。</p></div></li>
          </ol>
          <div className="workflowConsoleGrid gettingStartedScreens">
            <figure className="workflowConsolePrimary">
              <ExpandableImage src={sitePath("/management-ui/login.png")} alt="管理者ログイン画面。ユーザー名、パスワード、ログイン状態の保持を入力" expandLabel="管理者ログイン画面を拡大表示" closeLabel="拡大表示を閉じる" />
              <figcaption><strong>管理者ログイン</strong><span>初期設定で登録したパスワードを使ってログインします。</span></figcaption>
            </figure>
          </div>
          <p className="workflowBoundaryNote">
            初期設定とパスワード再設定は、接続元とアクセス先の両方がlocalhostまたはループバックIPの場合だけ利用できます。
          </p>
        </section>

        <section id="configure-demo" className="architectureSection" aria-labelledby="configure-demo-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">DEMO CONFIGURATION</p>
            <h2 id="configure-demo-title">デモの設定を確認・変更する</h2>
          </div>
          <p className="overviewBody">
            デモの設定は管理DBへ初期投入されています。まず内容を確認してください。設定を変更するときも、実環境で新しく作るときも同じ管理画面を使います。
          </p>
          <div className="gettingStartedSetupGrid">
            <article>
              <ServerCog aria-hidden="true" />
              <p className="eyebrow">SYSTEMS</p>
              <h3>システムとDB接続</h3>
              <p>同期元・同期先のDB種別、接続情報、有効状態を管理します。接続先を変えたら、保存前に接続テストを行います。</p>
              <dl>
                <div><dt>デモ</dt><dd>3システムを登録済み</dd></div>
              </dl>
            </article>
            <article>
              <Workflow aria-hidden="true" />
              <p className="eyebrow">RULES</p>
              <h3>同期ルール</h3>
              <p>送信元と送信先、片方向・双方向、競合時の扱いを決めます。デモのルールはDB反映前なので無効です。</p>
              <dl>
                <div><dt>デモ</dt><dd>ルールを作成済み・無効</dd></div>
              </dl>
            </article>
            <article>
              <Database aria-hidden="true" />
              <p className="eyebrow">MAPPINGS</p>
              <h3>テーブルと列の対応</h3>
              <p>両側のテーブル、キー列、同期列を対応付けます。値変換、固定値、削除方法もここで設定します。</p>
              <dl>
                <div><dt>デモ</dt><dd>マッピング設定済み</dd></div>
              </dl>
            </article>
          </div>
          <div className="workflowConsoleGrid gettingStartedScreens">
            <figure>
              <ExpandableImage src={sitePath("/management-ui/systems.png")} alt="システム管理画面。同期対象システムとDB接続情報を確認・変更" expandLabel="システム管理画面を拡大表示" closeLabel="拡大表示を閉じる" />
              <figcaption><strong>システム</strong><span>DB接続情報と有効状態を管理します。</span></figcaption>
            </figure>
            <figure>
              <ExpandableImage src={sitePath("/management-ui/routes.png")} alt="同期ルール管理画面。送信元、送信先、同期方向を確認・変更" expandLabel="同期ルール管理画面を拡大表示" closeLabel="拡大表示を閉じる" />
              <figcaption><strong>同期ルール</strong><span>同期方向と競合時の扱いを決めます。</span></figcaption>
            </figure>
            <figure className="workflowConsolePrimary">
              <ExpandableImage src={sitePath("/management-ui/mapping.png")} alt="テーブルマッピング画面。同期するテーブル、列、キーを確認・変更" expandLabel="テーブルマッピング画面を拡大表示" closeLabel="拡大表示を閉じる" />
              <figcaption><strong>テーブルマッピング</strong><span>テーブル、列、キー、値変換を設定します。</span></figcaption>
            </figure>
            <figure>
              <ExpandableImage src={sitePath("/management-ui/mapping-values.png")} alt="列マッピングの値変換設定。コード変換と変換プレビューを表示" expandLabel="値変換設定を拡大表示" closeLabel="拡大表示を閉じる" />
              <figcaption><strong>値変換</strong><span>コード値の対応と変換結果を確認します。</span></figcaption>
            </figure>
            <figure>
              <ExpandableImage src={sitePath("/management-ui/mapping-delete.png")} alt="削除同期設定。物理削除と論理削除の対応を設定" expandLabel="削除同期設定を拡大表示" closeLabel="拡大表示を閉じる" />
              <figcaption><strong>削除同期</strong><span>システムごとの物理削除・論理削除を対応付けます。</span></figcaption>
            </figure>
          </div>
        </section>

        <section id="deploy-database" className="architectureSection" aria-labelledby="deploy-database-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">DATABASE SETUP</p>
            <h2 id="deploy-database-title">業務DBへ反映して有効化する</h2>
          </div>
          <p className="overviewBody">
            デモでもこの操作は必要です。各ルールの「DBへ反映」でSQLを確認し、同期用オブジェクトを両側の業務DBへ反映します。
          </p>
          <div className="gettingStartedDeployGrid">
            <ol className="gettingStartedInstructionList">
              <li><span>1</span><div><strong>変更内容とSQLを確認する</strong><p>送信元・送信先それぞれの作成対象と実行SQLを開きます。</p></div></li>
              <li><span>2</span><div><strong>業務DBへ反映する</strong><p>デモでは管理画面から反映できます。本番ではDBAがSQLを確認して実行する方法を推奨します。</p></div></li>
              <li><span>3</span><div><strong>すべてのDBを確認する</strong><p>補助テーブルとTriggerの存在、定義が一致していることを管理画面から検証します。</p></div></li>
              <li><span>4</span><div><strong>ルールを有効にする</strong><p>両側のDBが検証済みになったら、基本設定から同期対象にします。</p></div></li>
            </ol>
            <figure className="gettingStartedDeployPreview">
              <ExpandableImage src={sitePath("/management-ui/database-setup.png")} alt="データベース反映画面。生成SQLの確認、反映、DB構成の検証を実行" expandLabel="データベース反映画面を拡大表示" closeLabel="拡大表示を閉じる" />
              <figcaption>データベース反映</figcaption>
            </figure>
          </div>
          <p className="architectureCallout">
            追加するのは変更検知と重複防止に必要な補助テーブルとTriggerです。既存の業務アプリケーション、業務テーブル、業務列は変更しません。
          </p>
        </section>

        <section id="verify-demo" className="architectureSection" aria-labelledby="verify-demo-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">VERIFY THE DEMO</p>
            <h2 id="verify-demo-title">データを変更して同期を確認する</h2>
          </div>
          <p className="overviewBody">
            ルールを有効にしたら、Customer Portalなど送信元のサンプルデータを1件変更します。初期データはTrigger反映前に作られているため、更新して最初の同期を開始します。
          </p>
          <div className="gettingStartedVerifyGrid">
            <article><CheckCircle2 aria-hidden="true" /><strong>同期先を確認</strong><p>対応付けた列と値が、同期先のアプリとDBへ反映されたことを確認します。</p></article>
            <article><ClipboardCheck aria-hidden="true" /><strong>処理状況を確認</strong><p>「処理状況」でQueueの読取位置、処理結果、試行回数を確認します。</p></article>
            <article><ShieldCheck aria-hidden="true" /><strong>競合を試す</strong><p>必要に応じて両側の同じ項目を変更し、設定した競合ポリシーの結果を確認します。</p></article>
          </div>
        </section>

        <section id="production" className="architectureSection" aria-labelledby="production-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">USE WITH EXISTING SYSTEMS</p>
            <h2 id="production-title">実際の業務DBで使う</h2>
          </div>
          <p className="overviewBody">
            デモ用DBを本番へ移すのではなく、CoreモードでWebとWorkerを起動し、実際の業務システムを管理画面から登録します。管理画面の操作とDB反映の流れは、デモで行った手順と同じです。
          </p>

          <div className="gettingStartedPrerequisites">
            <strong>現行のCoreモード手順で確認済みの実行環境</strong>
            <ul>
              <li>Windows 10（win-x64）</li>
              <li>.NET SDK 10.0.301</li>
              <li>Aspire CLI 13.4.4</li>
              <li>Aspire packages / templates 13.4.6</li>
            </ul>
            <p>管理DBに外部SQL Serverを使う場合、Docker Desktopは不要です。管理DBをコンテナで起動する場合だけ必要です。Windows Serverの対応範囲は、検証済み環境が確定してから掲載します。</p>
          </div>

          <h3 className="architectureSubheading">1. Coordinator管理DBを用意する</h3>
          <p className="overviewBody">
            管理DBはSyncCoordinatorの設定、処理状態、競合履歴を保存するSQL Serverです。業務データを保存するDBとは別です。
          </p>
          <div className="gettingStartedPathGrid">
            <article>
              <Database aria-hidden="true" />
              <p className="eyebrow">EXTERNAL SQL SERVER</p>
              <h3>用意済みのSQL Serverを使う</h3>
              <p><code>CoordinatorDatabase:UseContainer</code>を<code>false</code>にし、管理DBの接続文字列を設定します。Dockerは不要です。</p>
            </article>
            <article>
              <Container aria-hidden="true" />
              <p className="eyebrow">DOCKER</p>
              <h3>管理DBをコンテナで起動する</h3>
              <p><code>CoordinatorDatabase:UseContainer</code>を<code>true</code>にします。AspireがSQL Serverコンテナと接続文字列を管理します。</p>
            </article>
          </div>

          <h3 className="architectureSubheading">2. AppHostをCoreモードにする</h3>
          <p className="overviewBody">
            <code>src/SyncCoordinator.AppHost/appsettings.Development.json</code>へ次の設定を反映します。以下は外部SQL Serverを使う例です。
          </p>
          <pre className="gettingStartedCode" aria-label="Core mode AppHost settings"><code>{`{
  "RunMode": "Core",
  "CoordinatorDatabase": {
    "UseContainer": false
  }
}`}</code></pre>

          <h3 className="architectureSubheading">3. 管理DBの接続文字列を登録する</h3>
          <p className="overviewBody">
            外部SQL Serverを使う場合は、<code>ConnectionStrings:coordinator-db</code>をAppHostのUser Secretsへ登録します。パスワードを設定ファイルへ書かないでください。
          </p>
          <pre className="gettingStartedCode" aria-label="PowerShell command to set the management database connection string"><code>{`dotnet user-secrets set --project src/SyncCoordinator.AppHost "ConnectionStrings:coordinator-db" "Server=localhost,1433;Database=SyncCoordinator;User ID=your-user;Password=your-password;Encrypt=True;TrustServerCertificate=True;MultipleActiveResultSets=true"`}</code></pre>
          <p className="workflowBoundaryNote">管理DBをコンテナで起動する場合、この接続文字列の登録は不要です。</p>

          <h3 className="architectureSubheading">4. 起動して実際の業務DBを登録する</h3>
          <pre className="gettingStartedCode" aria-label="PowerShell command to run Core mode"><code>{`aspire run --apphost src/SyncCoordinator.AppHost/SyncCoordinator.AppHost.csproj`}</code></pre>
          <p className="overviewBody">
            Coreモードにはデモの初期設定がありません。初回ログイン後、「システム」で業務DBを登録し、デモで確認した手順と同じようにルール、マッピング、DB反映を進めます。
          </p>

          <div className="architectureDetailsList gettingStartedProductionDetails">
            <details>
              <summary>本番配備で必要になる管理DBマイグレーション</summary>
              <div className="architectureDetailsContent">
                <p>開発環境ではWebが起動時に管理DBを更新します。本番環境では自動更新が無効なので、配備前に最新マイグレーションを適用します。</p>
                <p>対象の管理DBは<code>SYNC_COORDINATOR_DESIGN_CONNECTION</code>で明示します。AppHostのUser Secretsはこのコマンドから参照されません。</p>
                <pre aria-label="PowerShell command to migrate the management database"><code>{`$env:SYNC_COORDINATOR_DESIGN_CONNECTION = "Server=localhost,1433;Database=SyncCoordinator;User ID=your-user;Password=your-password;Encrypt=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
dotnet tool restore
dotnet tool run dotnet-ef database update --project src/SyncCoordinator.Infrastructure/SyncCoordinator.Infrastructure.csproj --startup-project src/SyncCoordinator.Worker/SyncCoordinator.Worker.csproj
Remove-Item Env:SYNC_COORDINATOR_DESIGN_CONNECTION`}</code></pre>
              </div>
            </details>
          </div>

          <h3 className="architectureSubheading">本番運用前の確認</h3>
          <div className="gettingStartedChecklist">
            {productionChecks.map((item) => (
              <article key={item.title}><strong>{item.title}</strong><p>{item.text}</p></article>
            ))}
          </div>
        </section>

        <section className="overviewNext" aria-labelledby="getting-started-next">
          <p className="eyebrow">NEXT</p>
          <h2 id="getting-started-next">次に読む</h2>
          <div>
            <a href={sitePath("/workflow")}><Workflow aria-hidden="true" />Workflow</a>
          </div>
        </section>
      </article>
    </DocsShell>
  );
}
