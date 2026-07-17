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
import { DocsShell, ProductMark } from "../../docs-shell";
import { ExpandableImage } from "../../expandable-image";
import { localeAlternates, sitePath } from "../../i18n";

export const metadata: Metadata = {
  title: "Workflow | SyncCoordinator Documentation",
  description:
    "How SyncCoordinator detects changes, resolves conflicts, applies data, sends notifications, and resumes after failures.",
  alternates: localeAlternates("/workflow", "en"),
};

const contents = [
  ["processing-flow", "Synchronization flow"],
  ["latest-state", "Latest-state convergence"],
  ["conflict-flow", "When a conflict occurs"],
  ["retry-resume", "Retry and resume"],
  ["notification-flow", "Notification flow"],
  ["operations", "Checking operations"],
] as const;

const processingSteps = [
  { icon: Database, title: "Detect a change", text: "A trigger in the business database records which row changed in its local Queue." },
  { icon: ListFilter, title: "Coalesce notices", text: "Worker reads new notices and combines multiple notices for the same record." },
  { icon: RefreshCw, title: "Read the current value", text: "It reads the current business row instead of replaying the value from each old notice." },
  { icon: Route, title: "Select routes", text: "It identifies the origin and resolves enabled rules and mappings." },
  { icon: ShieldAlert, title: "Check for conflicts", text: "It compares the previous values with both current states and validates converted values." },
  { icon: CheckCircle2, title: "Apply safely", text: "It verifies the delivery was not already applied, writes the result, and saves processing state." },
] as const;

const convergenceCases = [
  { before: "Update → Update", after: "Apply the last current value" },
  { before: "Update → Delete", after: "Apply the deleted state" },
  { before: "Delete → Recreate", after: "Apply the recreated current value" },
] as const;

export default function EnglishWorkflowPage() {
  return (
    <DocsShell activeSection="workflow" locale="en">
      <article className="overviewPage workflowPage">
        <header className="overviewHero">
          <p className="eyebrow">DOCUMENTATION / WORKFLOW</p>
          <div className="overviewTitle">
            <ProductMark variant="hero" />
            <div>
              <h1>Workflow</h1>
              <p className="overviewLead">
                When a business database changes, SyncCoordinator reads the current value and applies it to the destination when safe. If processing stops, it resumes without applying completed work twice.
              </p>
            </div>
          </div>
        </header>

        <nav className="architectureToc" aria-label="Workflow table of contents">
          <p>On this page</p>
          <ol>
            {contents.map(([id, label], index) => (
              <li key={id}><a href={"#" + id}><span>{String(index + 1).padStart(2, "0")}</span>{label}</a></li>
            ))}
          </ol>
        </nav>

        <section id="processing-flow" className="architectureSection" aria-labelledby="processing-flow-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">PROCESSING FLOW</p>
            <h2 id="processing-flow-title">Synchronization flow</h2>
          </div>
          <p className="overviewBody">
            Worker checks for changes at a configured interval and processes each source separately. Configuration saved in Web is loaded at the next cycle, so a connection never changes in the middle of a cycle.
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
            Checkpoint advances only after every rule in the batch is settled. A transient failure keeps the current position so the next cycle retries from the same place.
          </p>
        </section>

        <section id="latest-state" className="architectureSection" aria-labelledby="latest-state-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">LATEST STATE</p>
            <h2 id="latest-state-title">Converging on the latest state</h2>
          </div>
          <p className="overviewBody">
            A Queue entry says that a record changed. It does not contain a full historical event. Worker reads the current record when it processes the notice and converges the destination on that state.
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

          <h3 className="architectureSubheading">When a record is deleted</h3>
          <div className="workflowRecoveryNotes">
            <article><Trash2 aria-hidden="true" /><strong>Physical delete</strong><p>Detect that the source row was deleted and delete the corresponding destination row.</p></article>
            <article><FileMinus2 aria-hidden="true" /><strong>Logical delete</strong><p>Detect the configured deleted value and apply the equivalent state at the destination.</p></article>
          </div>
          <p className="architectureCallout">
            If the destination changed after the previous synchronization, SynCo does not silently delete it. Deletion is handled as a record-level conflict: keep or delete the record.
          </p>
          <p className="workflowBoundaryNote">
            SyncCoordinator is designed to converge the current state of data. Use an event-preserving integration method for approvals, stock movements, journal entries, and other data where every intermediate action matters.
          </p>
        </section>

        <section id="conflict-flow" className="architectureSection" aria-labelledby="conflict-flow-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">CONFLICT FLOW</p>
            <h2 id="conflict-flow-title">When a conflict occurs</h2>
          </div>
          <p className="overviewBody">
            A conflict exists when both systems changed the same field from the previous saved value and produced different results. If only one side changed, that value is applied automatically.
          </p>
          <div className="workflowOutcomeGrid">
            <article><p className="eyebrow">NO CONFLICT</p><h3>Apply automatically</h3><p>Validate conversion and the destination contract, then apply the value.</p></article>
            <article><p className="eyebrow">POLICY</p><h3>Follow the rule</h3><p>Use the incoming value or keep the destination according to the configured policy, and record the decision.</p></article>
            <article><p className="eyebrow">HOLD</p><h3>Wait for a person</h3><p>Leave the destination unchanged and expose the conflict for review while other records continue.</p></article>
          </div>
          <h3 className="architectureSubheading">Manual resolution</h3>
          <ol className="workflowResolutionFlow">
            <li><strong>Compare values</strong><span>Review incoming and current destination values side by side.</span></li>
            <li><strong>Select the result</strong><span>Choose either value or enter a value for each conflicting field.</span></li>
            <li><strong>Request resolution</strong><span>Web stores a resolution request instead of writing directly to the business database.</span></li>
            <li><strong>Verify and apply</strong><span>Worker reads the destination again and applies only if it has not changed. The decision remains in history, and later changes synchronize normally.</span></li>
          </ol>
          <p className="architectureCallout">
            If the destination changes while the conflict screen is open, Worker does not overwrite it. The console shows the latest value and asks for a new decision.
          </p>
        </section>

        <section id="retry-resume" className="architectureSection" aria-labelledby="retry-resume-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">RETRY AND RESUME</p>
            <h2 id="retry-resume-title">Retry and resume</h2>
          </div>
          <p className="overviewBody">
            Worker stores read position and delivery state in databases. After shutdown or failure, it resumes remaining work without applying completed deliveries twice.
          </p>
          <div className="architectureTableWrap">
            <table className="architectureTable workflowStateTable">
              <thead><tr><th>State</th><th>Meaning</th><th>Next action</th></tr></thead>
              <tbody>
                <tr><th>Completed</th><td>Finished successfully or no apply was required</td><td>Do not process it again; continue from the next position.</td></tr>
                <tr><th>Failed</th><td>The attempt failed for a transient reason such as connectivity</td><td>Keep the Checkpoint and retry automatically in a later cycle.</td></tr>
                <tr><th>Held</th><td>A conflict or invalid value requires attention</td><td>Keep it visible for review while continuing other records.</td></tr>
                <tr><th>Processing</th><td>A Worker currently owns the delivery</td><td>Another cycle may acquire it after the five-minute lease expires.</td></tr>
              </tbody>
            </table>
          </div>
          <p className="workflowBoundaryNote">
            <strong>Held:</strong> Conflict holds can be resolved from the console. For validation or conversion holds, correct the configuration or data and make an operational decision; manual rerun from the console is not currently available.
          </p>
          <h3 className="architectureSubheading">What happens during a failure</h3>
          <div className="workflowRecoveryNotes">
            <article><RefreshCw aria-hidden="true" /><strong>When a connection is unavailable</strong><p>On a connection failure, Worker leaves the Checkpoint in place and retries automatically in a later cycle. It resumes from that position after connectivity returns.</p></article>
            <article><GitFork aria-hidden="true" /><strong>Interrupted work or redelivery</strong><p>Each delivery reuses its deterministic ID and checks the destination apply record. Reacquiring interrupted work does not apply the same change twice.</p></article>
          </div>
          <h3 className="architectureSubheading">Pause and resume</h3>
          <p className="overviewBody">
            While paused, neither the Queue nor Checkpoint moves. After resume, Worker reads current values for notices that accumulated and catches up to the latest state.
          </p>
          <p className="architectureCallout">
            Pause is an operational action intended for later resume. Disabling a system or rule removes it from synchronization configuration and is a different operation.
          </p>
        </section>

        <section id="notification-flow" className="architectureSection" aria-labelledby="notification-flow-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">NOTIFICATIONS</p>
            <h2 id="notification-flow-title">Notification flow</h2>
          </div>
          <p className="overviewBody">
            Synchronization should continue when a notification endpoint is temporarily unavailable. Worker first saves events to the management database, then a separate delivery loop sends webhooks.
          </p>
          <div className="workflowNotificationFlow" aria-label="Webhook notification flow">
            <div><Activity aria-hidden="true" /><strong>Event occurs</strong><span>Sync, delete, conflict, failure, pause, resume</span></div>
            <span aria-hidden="true">→</span>
            <div><Database aria-hidden="true" /><strong>Save to Outbox</strong><span>Persist pending delivery in the management DB</span></div>
            <span aria-hidden="true">→</span>
            <div><Bell aria-hidden="true" /><strong>Deliver webhook</strong><span>HMAC signature, history, progressive retry</span></div>
          </div>
          <p className="architectureCallout">
            Webhook failure does not stop synchronization. Delivery is attempted up to seven times, including the first attempt, with delays of 1 minute, 5 minutes, 30 minutes, 2 hours, 6 hours, and 12 hours. Receivers can deduplicate with Event ID.
          </p>
        </section>

        <section id="operations" className="architectureSection" aria-labelledby="operations-title">
          <div className="overviewSectionHeading">
            <p className="eyebrow">OPERATIONS</p>
            <h2 id="operations-title">Checking operations</h2>
          </div>
          <p className="overviewBody">
            Use the management console to verify progress, find failures or held work, and manage webhook endpoints and delivery history.
          </p>
          <div className="workflowConsoleGrid">
            <figure className="workflowConsolePrimary">
              <ExpandableImage src={sitePath("/management-ui/operations.jpg")} alt="Operations page showing Queue Checkpoints and synchronization history" expandLabel="Expand the Operations page image" closeLabel="Close expanded image" hintLabel="Expand" />
              <figcaption><strong>Operations</strong><span>Review Checkpoints, results, attempts, and errors.</span></figcaption>
            </figure>
            <figure>
              <ExpandableImage src={sitePath("/management-ui/conflicts.jpg")} alt="Conflict history page listing conflicts that need attention" expandLabel="Expand the conflict history image" closeLabel="Close expanded image" hintLabel="Expand" />
              <figcaption><strong>Conflicts</strong><span>Review held conflicts and their resolution state.</span></figcaption>
            </figure>
            <figure>
              <ExpandableImage src={sitePath("/management-ui/notifications.jpg")} alt="Notification settings page for webhook endpoints and events" expandLabel="Expand the notification settings image" closeLabel="Close expanded image" hintLabel="Expand" />
              <figcaption><strong>Notifications</strong><span>Manage endpoints, event selection, and signing configuration.</span></figcaption>
            </figure>
          </div>
        </section>

        <section className="overviewNext" aria-labelledby="workflow-next">
          <p className="eyebrow">NEXT</p>
          <h2 id="workflow-next">Read next</h2>
          <div>
            <a href={sitePath("/en/architecture")}><ShieldCheck aria-hidden="true" />Architecture</a>
            <a href={sitePath("/en/getting-started")}><WorkflowIcon aria-hidden="true" />Getting Started</a>
          </div>
        </section>
      </article>
    </DocsShell>
  );
}
