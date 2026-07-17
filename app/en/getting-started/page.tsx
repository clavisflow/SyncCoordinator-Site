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
import { DocsShell, ProductMark } from "../../docs-shell";
import { localeAlternates } from "../../i18n";

export const metadata: Metadata = {
  title: "Getting Started | SyncCoordinator Documentation",
  description:
    "Run the SyncCoordinator demo, change its synchronization settings, and prepare an environment for actual business databases.",
  alternates: localeAlternates("/getting-started", "en"),
};

const contents = [
  ["run-demo", "Run the demo"],
  ["first-login", "First login"],
  ["configure-demo", "Review and change configuration"],
  ["deploy-database", "Deploy to business databases"],
  ["verify-demo", "Verify synchronization"],
  ["production", "Use real business databases"],
] as const;

const productionChecks = [
  { title: "Align initial data", text: "SyncCoordinator handles changes made after deployment. Align existing data by another method before enabling synchronization." },
  { title: "Use HTTPS", text: "Publish the management console through HTTPS to protect authentication cookies and administrative traffic." },
  { title: "Share and protect encryption keys", text: "When Web and Worker run separately, configure a Key Ring both can access, then protect and back it up." },
  { title: "Separate database permissions", text: "Separate Worker runtime permissions from the DDL permission used to deploy synchronization objects." },
] as const;

export default function EnglishGettingStartedPage() {
  return (
    <DocsShell activeSection="getting-started" locale="en">
      <article className="overviewPage gettingStartedPage">
        <header className="overviewHero">
          <p className="eyebrow">DOCUMENTATION / GETTING STARTED</p>
          <div className="overviewTitle">
            <ProductMark variant="hero" />
            <div>
              <h1>Getting Started</h1>
              <p className="overviewLead">
                Start the demo, review and change its prepared synchronization configuration, and learn the workflow. Then move to a Core-mode environment connected to your own business databases.
              </p>
            </div>
          </div>
        </header>

        <nav className="architectureToc" aria-label="Getting Started table of contents">
          <p>On this page</p>
          <ol>
            {contents.map(([id, label], index) => (
              <li key={id}><a href={"#" + id}><span>{String(index + 1).padStart(2, "0")}</span>{label}</a></li>
            ))}
          </ol>
        </nav>

        <section id="run-demo" className="architectureSection" aria-labelledby="run-demo-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">QUICK START</p>
            <h2 id="run-demo-title">Run the demo</h2>
          </div>
          <p className="overviewBody">
            The demo starts Customer Portal, CRM, Field Service, and three different business databases together. It uses the same synchronization path as a normal deployment.
          </p>
          <div className="gettingStartedPrerequisites">
            <strong>Required for this procedure</strong>
            <ul>
              <li>Windows 11 (win-x64)</li>
              <li>.NET SDK 10.0.301</li>
              <li>Aspire CLI 13.4.4</li>
              <li>Docker Desktop</li>
              <li>PowerShell or another terminal</li>
            </ul>
            <p>Visual Studio and VS Code are optional.</p>
          </div>
          <p className="overviewBody">Run these commands from the repository root.</p>
          <pre className="gettingStartedCode" aria-label="PowerShell commands to run the demo"><code>{`dotnet tool restore
dotnet restore SyncCoordinator.sln
dotnet build SyncCoordinator.sln --no-restore
dotnet test SyncCoordinator.sln --no-build
aspire run --apphost src/SyncCoordinator.AppHost/SyncCoordinator.AppHost.csproj`}</code></pre>
          <div className="gettingStartedExpected">
            <MonitorCog aria-hidden="true" />
            <div>
              <strong>What starts</strong>
              <p>Aspire Dashboard shows SyncCoordinator Web, Worker, three sample business applications, and their business databases.</p>
            </div>
          </div>
          <p className="architectureCallout">
            The demo seeds systems, database connections, disabled synchronization rules, and table and column mappings. Synchronization helper tables and triggers are not deployed yet.
          </p>
        </section>

        <section id="first-login" className="architectureSection" aria-labelledby="first-login-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">FIRST LOGIN</p>
            <h2 id="first-login-title">Set the administrator password</h2>
          </div>
          <p className="overviewBody">
            On first start, register the administrator password from a browser running on the Web server itself. The setup page is unavailable from a remote computer.
          </p>
          <ol className="gettingStartedInstructionList">
            <li><span>1</span><div><strong>Open the setup page</strong><p>On the Web server, open <code>http://localhost:&lt;Web port&gt;/account/setup</code>.</p></div></li>
            <li><span>2</span><div><strong>Register a password</strong><p>Set a password between 12 and 128 characters. The username is always <code>admin</code>.</p></div></li>
            <li><span>3</span><div><strong>Sign in</strong><p>Sign in with the password to open the dashboard.</p></div></li>
          </ol>
          <p className="workflowBoundaryNote">
            Initial setup and password reset are available only when both the client and requested host are localhost or a loopback address.
          </p>
        </section>

        <section id="configure-demo" className="architectureSection" aria-labelledby="configure-demo-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">DEMO CONFIGURATION</p>
            <h2 id="configure-demo-title">Review and change the demo configuration</h2>
          </div>
          <p className="overviewBody">
            Demo configuration is seeded into the management database. Review it first. The same management pages are used to change the demo and to create configuration for real systems.
          </p>
          <div className="gettingStartedSetupGrid">
            <article>
              <ServerCog aria-hidden="true" />
              <p className="eyebrow">SYSTEMS</p>
              <h3>Systems and database connections</h3>
              <p>Manage the provider, protected connection information, and enabled state for each source and destination. Test the connection before saving changes.</p>
              <dl><div><dt>Demo</dt><dd>Three systems are registered</dd></div></dl>
            </article>
            <article>
              <Workflow aria-hidden="true" />
              <p className="eyebrow">RULES</p>
              <h3>Synchronization rules</h3>
              <p>Choose source, destination, direction, and conflict behavior. Demo rules remain disabled until the required database objects are deployed.</p>
              <dl><div><dt>Demo</dt><dd>Rules are created and disabled</dd></div></dl>
            </article>
            <article>
              <Database aria-hidden="true" />
              <p className="eyebrow">MAPPINGS</p>
              <h3>Table and column mappings</h3>
              <p>Map tables, keys, and fields at both ends. Configure value conversion, fixed values, and deletion behavior here.</p>
              <dl><div><dt>Demo</dt><dd>Mappings are configured</dd></div></dl>
            </article>
          </div>
          <div className="workflowConsoleGrid gettingStartedScreens">
            <figure>
              <img src="/management-ui/systems.jpg" alt="Systems page for reviewing database connections and enabled state" />
              <figcaption><strong>Systems</strong><span>Manage database connections and enabled state.</span></figcaption>
            </figure>
            <figure>
              <img src="/management-ui/routes.jpg" alt="Synchronization rules page for source, destination, and direction" />
              <figcaption><strong>Rules</strong><span>Choose direction and conflict behavior.</span></figcaption>
            </figure>
            <figure className="workflowConsolePrimary">
              <img src="/management-ui/mapping.jpg" alt="Table mapping page for tables, columns, keys, and conversion" />
              <figcaption><strong>Mappings</strong><span>Configure tables, keys, fields, and value conversion.</span></figcaption>
            </figure>
          </div>
        </section>

        <section id="deploy-database" className="architectureSection" aria-labelledby="deploy-database-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">DATABASE SETUP</p>
            <h2 id="deploy-database-title">Deploy and enable the rule</h2>
          </div>
          <p className="overviewBody">
            This step is required for the demo as well. Open “Deploy to DB” for each rule, review the SQL, and deploy synchronization helper objects to both business databases.
          </p>
          <div className="gettingStartedDeployGrid">
            <ol className="gettingStartedInstructionList">
              <li><span>1</span><div><strong>Review changes and SQL</strong><p>Open the objects and generated SQL for both source and destination.</p></div></li>
              <li><span>2</span><div><strong>Deploy to the business databases</strong><p>The demo allows direct apply. In production, have a DBA review and run the SQL.</p></div></li>
              <li><span>3</span><div><strong>Verify every database</strong><p>Verify that helper tables and trigger definitions exist and match the generated deployment.</p></div></li>
              <li><span>4</span><div><strong>Enable the rule</strong><p>After both sides pass verification, enable synchronization in the rule settings.</p></div></li>
            </ol>
            <figure className="gettingStartedDeployPreview">
              <img src="/management-ui/database-setup.jpg" alt="Database deployment page for reviewing SQL, deploying objects, and verifying definitions" />
              <figcaption>Database deployment</figcaption>
            </figure>
          </div>
          <p className="architectureCallout">
            The deployment adds helper tables and triggers for detection and idempotency. It does not change existing applications, business tables, or business columns.
          </p>
        </section>

        <section id="verify-demo" className="architectureSection" aria-labelledby="verify-demo-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">VERIFY THE DEMO</p>
            <h2 id="verify-demo-title">Change data and verify synchronization</h2>
          </div>
          <p className="overviewBody">
            After enabling a rule, edit one sample record in Customer Portal or another source. Initial rows were created before trigger deployment, so update a row to begin the first synchronization.
          </p>
          <div className="gettingStartedVerifyGrid">
            <article><CheckCircle2 aria-hidden="true" /><strong>Check the destination</strong><p>Confirm that mapped fields and values appear in the destination application and database.</p></article>
            <article><ClipboardCheck aria-hidden="true" /><strong>Check operations</strong><p>Review Queue position, processing result, and attempt count on the Operations page.</p></article>
            <article><ShieldCheck aria-hidden="true" /><strong>Try a conflict</strong><p>Edit the same field on both sides and confirm the configured conflict policy.</p></article>
          </div>
        </section>

        <section id="production" className="architectureSection" aria-labelledby="production-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">USE WITH EXISTING SYSTEMS</p>
            <h2 id="production-title">Use real business databases</h2>
          </div>
          <p className="overviewBody">
            Do not promote demo databases to production. Start Web and Worker in Core mode, then register real business systems in the management console. Configuration and database deployment follow the same workflow you used in the demo.
          </p>

          <h3 className="architectureSubheading">1. Prepare the Coordinator management database</h3>
          <p className="overviewBody">
            The management database is a SQL Server database that stores SyncCoordinator configuration, processing state, and conflict history. It is separate from business databases.
          </p>
          <div className="gettingStartedPathGrid">
            <article>
              <Database aria-hidden="true" />
              <p className="eyebrow">EXTERNAL SQL SERVER</p>
              <h3>Use an existing SQL Server</h3>
              <p>Set <code>CoordinatorDatabase:UseContainer</code> to <code>false</code> and provide the management database connection string. Docker is not required.</p>
            </article>
            <article>
              <Container aria-hidden="true" />
              <p className="eyebrow">DOCKER</p>
              <h3>Start the management DB in a container</h3>
              <p>Set <code>CoordinatorDatabase:UseContainer</code> to <code>true</code>. Aspire manages the SQL Server container and connection string.</p>
            </article>
          </div>

          <h3 className="architectureSubheading">2. Select Core mode</h3>
          <p className="overviewBody">Apply this configuration in <code>src/SyncCoordinator.AppHost/appsettings.Development.json</code>. This example uses an external SQL Server.</p>
          <pre className="gettingStartedCode" aria-label="Core mode AppHost settings"><code>{`{
  "RunMode": "Core",
  "CoordinatorDatabase": {
    "UseContainer": false
  }
}`}</code></pre>

          <h3 className="architectureSubheading">3. Register the management DB connection</h3>
          <p className="overviewBody">
            For an external SQL Server, store <code>ConnectionStrings:coordinator-db</code> in AppHost User Secrets. Do not write the password to a settings file.
          </p>
          <pre className="gettingStartedCode" aria-label="PowerShell command to set the management database connection string"><code>{`dotnet user-secrets set --project src/SyncCoordinator.AppHost "ConnectionStrings:coordinator-db" "Server=localhost,1433;Database=SyncCoordinator;User ID=your-user;Password=your-password;Encrypt=True;TrustServerCertificate=True;MultipleActiveResultSets=true"`}</code></pre>
          <p className="workflowBoundaryNote">This connection-string step is unnecessary when AppHost starts the management database container.</p>

          <h3 className="architectureSubheading">4. Start and register business databases</h3>
          <pre className="gettingStartedCode" aria-label="PowerShell command to run Core mode"><code>{`aspire run --apphost src/SyncCoordinator.AppHost/SyncCoordinator.AppHost.csproj`}</code></pre>
          <p className="overviewBody">
            Core mode does not seed demo configuration. Sign in, register business databases under Systems, then create rules and mappings and deploy the generated database objects.
          </p>

          <div className="architectureDetailsList gettingStartedProductionDetails">
            <details>
              <summary>Management database migrations for production</summary>
              <div className="architectureDetailsContent">
                <p>Web applies management database migrations automatically in Development. Automatic migration is disabled in Production, so apply the latest migration before deployment.</p>
                <p>Set <code>SYNC_COORDINATOR_DESIGN_CONNECTION</code> explicitly. The migration command does not read AppHost User Secrets.</p>
                <pre aria-label="PowerShell command to migrate the management database"><code>{`$env:SYNC_COORDINATOR_DESIGN_CONNECTION = "Server=localhost,1433;Database=SyncCoordinator;User ID=your-user;Password=your-password;Encrypt=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
dotnet tool restore
dotnet tool run dotnet-ef database update --project src/SyncCoordinator.Infrastructure/SyncCoordinator.Infrastructure.csproj --startup-project src/SyncCoordinator.Worker/SyncCoordinator.Worker.csproj
Remove-Item Env:SYNC_COORDINATOR_DESIGN_CONNECTION`}</code></pre>
              </div>
            </details>
          </div>

          <h3 className="architectureSubheading">Before production operation</h3>
          <div className="gettingStartedChecklist">
            {productionChecks.map((item) => (
              <article key={item.title}><strong>{item.title}</strong><p>{item.text}</p></article>
            ))}
          </div>
        </section>

        <section className="overviewNext" aria-labelledby="getting-started-next">
          <p className="eyebrow">NEXT</p>
          <h2 id="getting-started-next">Read next</h2>
          <div><a href="/en/workflow"><Workflow aria-hidden="true" />Workflow</a></div>
        </section>
      </article>
    </DocsShell>
  );
}
