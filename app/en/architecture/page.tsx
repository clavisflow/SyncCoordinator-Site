import type { Metadata } from "next";
import { Box, Database, GitFork, Workflow } from "lucide-react";
import { DocsShell, ProductMark } from "../../docs-shell";
import { localeAlternates, sitePath } from "../../i18n";

export const metadata: Metadata = {
  title: "Architecture | SyncCoordinator Documentation",
  description:
    "The SyncCoordinator runtime topology, management boundary, and business database deployment model.",
  alternates: localeAlternates("/architecture", "en"),
};

const components = [
  {
    icon: Box,
    title: "Coordinator Web",
    text: "Provides the management console and administrator authentication. It edits connections, rules, and mappings, and generates and verifies database deployment SQL. It does not execute synchronization.",
  },
  {
    icon: Workflow,
    title: "Coordinator Worker",
    text: "Loads configuration from the management database, reads changes, evaluates conflicts, and applies results. It also delivers webhooks and cleans retained management data.",
  },
  {
    icon: Database,
    title: "Coordinator management database",
    text: "Stores connections, rules, mappings, Checkpoints, Inbox state, Snapshots, conflict history, and the other state required to resume processing.",
  },
] as const;

const deploymentObjects = [
  "SyncChangeQueue",
  "SyncAppliedMessage",
  "SyncEntityOrigin",
  "SyncDeleteTombstone",
  "SyncCoordinatorDeployment",
  "Change-detection triggers for mapped tables",
] as const;

const contents = [
  ["topology", "System topology"],
  ["supported-databases", "Supported databases"],
  ["sync-rules", "Rules and mappings"],
  ["conflicts-notifications", "Conflicts and notifications"],
  ["deployment", "Business database deployment"],
  ["state-reliability", "State and reliable execution"],
  ["security", "Security and operational access"],
  ["implementation-details", "Implementation details"],
] as const;

export default function EnglishArchitecturePage() {
  return (
    <DocsShell activeSection="architecture" locale="en">
      <article className="overviewPage architecturePage">
        <header className="overviewHero">
          <p className="eyebrow">DOCUMENTATION / ARCHITECTURE</p>
          <div className="overviewTitle">
            <ProductMark variant="hero" />
            <div>
              <h1>Architecture</h1>
              <p className="overviewLead">
                SyncCoordinator consists of Web, Worker, and a management database. Web manages configuration, Worker synchronizes business databases, and the management database keeps configuration and processing state.
              </p>
            </div>
          </div>
        </header>

        <nav className="architectureToc" aria-label="Architecture table of contents">
          <p>On this page</p>
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

        <section id="topology" className="architectureSection" aria-labelledby="topology-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">OVERVIEW</p>
            <h2 id="topology-title">System topology</h2>
          </div>
          <p className="overviewBody">
            Deploy SyncCoordinator separately from the business systems. Web manages configuration, Worker executes synchronization, and the management database stores configuration and processing state.
          </p>
          <figure className="architectureTopology">
            <div className="architectureBusinessNode">
              <Database aria-hidden="true" />
              <strong>Business system A</strong>
              <span>SQL Server / MySQL / PostgreSQL</span>
              <small>Existing application and tables</small>
            </div>
            <div className="architectureFlow" aria-hidden="true"><span>Detect changes</span></div>
            <div className="architectureCoordinator">
              <div className="architectureCoordinatorLabel">
                <ProductMark variant="diagram" />
                <strong>SynCo</strong>
              </div>
              <div className="architectureCoordinatorStack">
                <div><Box aria-hidden="true" /><strong>Web</strong><span>Configure · Manage</span></div>
                <div><Workflow aria-hidden="true" /><strong>Worker</strong><span>Sync · Notify</span></div>
                <div><Database aria-hidden="true" /><strong>Management DB</strong><span>Config · State</span></div>
              </div>
            </div>
            <div className="architectureFlow" aria-hidden="true"><span>Apply safely</span></div>
            <div className="architectureBusinessNode">
              <Database aria-hidden="true" />
              <strong>Business system B</strong>
              <span>SQL Server / MySQL / PostgreSQL</span>
              <small>Existing application and tables</small>
            </div>
            <figcaption>
              Worker reads business database changes and applies them according to mappings and conflict policies.
            </figcaption>
          </figure>

          <h3 className="architectureSubheading">Component responsibilities</h3>
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

        <section id="supported-databases" className="architectureSection" aria-labelledby="supported-databases-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">COMPATIBILITY</p>
            <h2 id="supported-databases-title">Supported databases</h2>
          </div>
          <p className="overviewBody">
            These versions apply to business databases synchronized by SyncCoordinator. Each database requires permissions to create and remove the synchronization support tables and change-detection triggers.
          </p>
          <div className="architectureTableWrap">
            <table className="architectureTable">
              <thead>
                <tr>
                  <th scope="col">Database</th>
                  <th scope="col">Supported version</th>
                  <th scope="col">Deployment requirement</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">SQL Server</th>
                  <td>2016 SP1 or later</td>
                  <td>Permissions to create triggers on the target table and create or remove synchronization support tables</td>
                </tr>
                <tr>
                  <th scope="row">MySQL</th>
                  <td>8.0 or later</td>
                  <td>The TRIGGER privilege and permissions to create or remove synchronization support tables</td>
                </tr>
                <tr>
                  <th scope="row">PostgreSQL</th>
                  <td>13 or later</td>
                  <td>The TRIGGER privilege on the target table and permissions to create or remove synchronization support objects</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="sync-rules" className="architectureSection" aria-labelledby="rules-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">SYNC RULES AND MAPPING</p>
            <h2 id="rules-title">Synchronization rules and mappings</h2>
          </div>
          <p className="overviewBody">
            A rule defines source, destination, direction, and conflict behavior. Mappings attached to the rule describe differences in tables, columns, and values.
          </p>
          <div className="architectureRuleGrid">
            <article>
              <p className="eyebrow">DIRECTION</p>
              <h3>One-way and bidirectional</h3>
              <ul>
                <li><strong>One-way</strong><span>Processes changes from the fixed source to the fixed destination.</span></li>
                <li><strong>Bidirectional</strong><span>Returns edits made at the destination to the original source for records first synchronized from that source.</span></li>
                <li><strong>Loop prevention</strong><span>Tracks the origin and applied message IDs so SynCo does not resend its own updates.</span></li>
              </ul>
            </article>
            <article>
              <p className="eyebrow">MAPPING</p>
              <h3>Tables, columns, and values</h3>
              <ul>
                <li><strong>Tables and keys</strong><span>Select the schema, table, and key columns that identify a record at each end.</span></li>
                <li><strong>Columns and types</strong><span>Store column pairs, nullability, string length, precision, and scale.</span></li>
                <li><strong>Value conversion</strong><span>Configure code mappings, UTC normalization, explicit rounding or truncation, and direction-specific fixed values.</span></li>
              </ul>
            </article>
          </div>
        </section>

        <section id="conflicts-notifications" className="architectureSection" aria-labelledby="conflict-notification-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">CONFLICTS AND NOTIFICATIONS</p>
            <h2 id="conflict-notification-title">Conflicts and notifications</h2>
          </div>
          <p className="overviewBody">
            Worker evaluates conflicts and delivers external notifications. Decisions and delivery state remain in the management database and are visible in the console.
          </p>
          <div className="architectureConcernGrid">
            <article>
              <p className="eyebrow">CONFLICT</p>
              <h3>When a conflict occurs</h3>
              <ol className="architectureConcernFlow">
                <li><strong>Detect</strong><span>Compare the previous Snapshot, incoming value, and current destination value. A conflict exists when both sides changed the same field to different values.</span></li>
                <li><strong>Apply policy</strong><span>Use the incoming value, keep the destination, hold for review, or invoke a configured merge policy.</span></li>
                <li><strong>Resolve when needed</strong><span>Held conflicts appear in the console. Worker verifies the destination again before applying a manual decision.</span></li>
              </ol>
            </article>
            <article>
              <p className="eyebrow">NOTIFICATION</p>
              <h3>Notification flow</h3>
              <ol className="architectureConcernFlow">
                <li><strong>Store the event</strong><span>Conflict and failure events are written to the management database Outbox.</span></li>
                <li><strong>Send a webhook</strong><span>Worker asynchronously delivers the event to configured webhook endpoints.</span></li>
                <li><strong>Retry failures</strong><span>Failed deliveries are retried with delay. Notification failure does not stop synchronization.</span></li>
              </ol>
            </article>
          </div>
        </section>

        <section id="deployment" className="architectureSection" aria-labelledby="deployment-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">BUSINESS DATABASE BOUNDARY</p>
            <h2 id="deployment-title">Business database deployment</h2>
          </div>
          <p className="overviewBody">
            Add helper objects for change detection and duplicate-apply prevention. Existing application code, business tables, and business columns remain unchanged.
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
                <li>Existing business applications</li>
                <li>Existing business tables</li>
                <li>Existing business columns</li>
              </ul>
            </div>
          </div>
          <p className="architectureCallout">
            Saving configuration does not execute DDL. A DBA can review and run generated SQL, then verify the deployed definitions before enabling the rule.
          </p>
          <p className="architectureInitialDataNote">
            <strong>Initial data:</strong> SyncCoordinator synchronizes changes made after deployment. Align existing data by another method before enabling synchronization.
          </p>
        </section>

        <section id="state-reliability" className="architectureSection" aria-labelledby="state-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">STATE AND RELIABILITY</p>
            <h2 id="state-title">State and reliable execution</h2>
          </div>
          <p className="overviewBody">
            Business data remains in each business database. Synchronization configuration and processing state live in the Coordinator management database. Worker keeps no durable local state and resumes from saved state after a restart.
          </p>
          <div className="architectureTableWrap">
            <table className="architectureTable">
              <thead><tr><th>Location</th><th>Main state</th><th>Purpose</th></tr></thead>
              <tbody>
                <tr>
                  <th>Coordinator management DB</th>
                  <td>Systems, rules, mappings, Checkpoints, Inbox, Snapshots, conflicts, audit, and operational history</td>
                  <td>The source of truth for configuration and processing state.</td>
                </tr>
                <tr>
                  <th>Business DB</th>
                  <td>Business rows, change Queue, applied messages, origin, delete tombstones, and deployment hash</td>
                  <td>Current business data plus the helper state used for detection and idempotency.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="architectureSubheading">Restart and redelivery</h3>
          <div className="architectureReliabilityGrid">
            <article><strong>Checkpoint</strong><p>Stores the last processed QueueId per source. A failed source does not advance.</p></article>
            <article><strong>Inbox and leases</strong><p>Tracks Processing, Completed, Held, and Failed. Work interrupted by shutdown can be acquired again after its lease expires.</p></article>
            <article><strong>Idempotent apply</strong><p>Records a deterministic delivery ID in SyncAppliedMessage so retrying the same delivery does not apply it twice.</p></article>
          </div>
          <p className="architectureCallout">
            SyncChangeQueue records that a row changed, not the changed value itself. On resume, Worker reads the row again and synchronizes its latest state.
          </p>
        </section>

        <section id="security" className="architectureSection" aria-labelledby="security-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">SECURITY AND OPERATIONS</p>
            <h2 id="security-title">Security and operational access</h2>
          </div>
          <p className="overviewBody">
            Coordinator management DB holds business-database connection data and synchronization configuration. In production, protect secrets, console access, and database privileges independently.
          </p>
          <div className="architectureSecurityGrid">
            <article>
              <strong>Connection data and signing secrets</strong>
              <p>Business database connection strings and webhook signing secrets are encrypted with ASP.NET Core Data Protection before they are stored in the management database.</p>
            </article>
            <article>
              <strong>Console and Key Ring</strong>
              <p>Publish the management console through HTTPS. When Web and Worker are separate, provide a protected, backed-up Key Ring both can read.</p>
            </article>
            <article>
              <strong>Restricted initial setup</strong>
              <p>Administrator setup and password reset are available only when both the client and requested host are localhost or a loopback address.</p>
            </article>
            <article>
              <strong>Least database privilege</strong>
              <p>Separate Worker read/write access from the DDL permission used to create helper tables and triggers. A DBA can review and run generated SQL.</p>
            </article>
          </div>
        </section>

        <section id="implementation-details" className="architectureSection" aria-labelledby="implementation-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">IMPLEMENTATION DETAILS</p>
            <h2 id="implementation-title">Implementation details</h2>
          </div>
          <p className="overviewBody">Open the details that are relevant to implementation and production deployment.</p>
          <div className="architectureDetailsList">
            <details>
              <summary>Project dependency direction</summary>
              <div className="architectureDetailsContent">
                <p>Synchronization logic lives in Core. Web does not execute business database connectors; Worker invokes Core and performs synchronization.</p>
                <pre aria-label="Project dependency direction"><code>{`Contracts ← Core ← Infrastructure ← Worker
                      ↑
                      └──────────── Web

ServiceDefaults ← Worker / Web
AppHost ─────────→ Worker / Web / demo resources`}</code></pre>
              </div>
            </details>
            <details>
              <summary>When configuration changes take effect</summary>
              <div className="architectureDetailsContent">
                <ol className="architectureSequence">
                  <li><strong>Start cycle</strong><span>Worker creates a processing scope.</span></li>
                  <li><strong>Load connections</strong><span>It reads enabled systems and protected connection data.</span></li>
                  <li><strong>Synchronize</strong><span>Connections stay stable for that cycle.</span></li>
                  <li><strong>Next cycle</strong><span>Saved changes take effect without restarting Worker.</span></li>
                </ol>
              </div>
            </details>
          </div>
        </section>

        <section className="overviewNext" aria-labelledby="architecture-next">
          <p className="eyebrow">NEXT</p>
          <h2 id="architecture-next">Read next</h2>
          <div>
            <a href={sitePath("/en/overview")}><GitFork aria-hidden="true" />Overview</a>
            <a href={sitePath("/en/workflow")}><Workflow aria-hidden="true" />Workflow</a>
          </div>
        </section>
      </article>
    </DocsShell>
  );
}
