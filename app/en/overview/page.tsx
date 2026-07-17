import type { Metadata } from "next";
import { Box, Database, GitFork, Network, Server, Workflow } from "lucide-react";
import { DocsShell, ProductMark } from "../../docs-shell";
import { ExpandableImage } from "../../expandable-image";
import { localeAlternates, sitePath } from "../../i18n";

export const metadata: Metadata = {
  title: "Overview | SyncCoordinator Documentation",
  description:
    "What SyncCoordinator does, the problems it solves, and the systems it is designed to connect.",
  alternates: localeAlternates("/overview", "en"),
};

const capabilities = [
  {
    icon: Database,
    title: "No business application changes",
    text: "Build integrations through the management console without changing existing business code or business tables.",
  },
  {
    icon: Workflow,
    title: "Map database differences",
    text: "Define table, column, type, and code-value differences as mappings instead of writing system-specific integration code.",
  },
  {
    icon: Network,
    title: "Handle bidirectional updates safely",
    text: "Detect concurrent edits to the same data and route each field to automatic merge or manual resolution.",
  },
  {
    icon: Server,
    title: "Notify and support operations",
    text: "Monitor synchronization, conflicts, and events that need attention, then retry or pause processing from one console.",
  },
] as const;

const useCases = [
  {
    title: "Connect departmental systems",
    text: "Synchronize selected order, inventory, or customer data while keeping the existing systems in place.",
  },
  {
    title: "Run old and new systems in parallel",
    text: "Keep operations running during migration by synchronizing the data required by both systems.",
  },
  {
    title: "Support customer-specific schemas",
    text: "Let system integrators and software vendors manage customer-specific database schemas and code sets as mappings.",
  },
] as const;

export default function EnglishOverviewPage() {
  return (
    <DocsShell activeSection="overview" locale="en">
      <article className="overviewPage">
        <header className="overviewHero">
          <p className="eyebrow">DOCUMENTATION / OVERVIEW</p>
          <div className="overviewTitle">
            <ProductMark variant="hero" />
            <div>
              <h1>What is SyncCoordinator?</h1>
              <p className="overviewLead">
                SyncCoordinator is a self-hosted platform for building and operating data synchronization across SQL Server, MySQL, and PostgreSQL without changing existing business applications or business tables.
              </p>
            </div>
          </div>
        </header>

        <section className="overviewSection overviewFoundation" aria-labelledby="overview-foundation">
          <div className="overviewSectionHeading">
            <p className="eyebrow">FOUNDATION</p>
            <h2 id="overview-foundation">Connect data without changing business systems.</h2>
          </div>
          <p className="overviewBody">
            Instead of adding integration code to each business application, configure database connections, table and column mappings, and synchronization rules in the management console. Existing business tables remain unchanged.
          </p>
          <p className="overviewBody overviewNote">
            SyncCoordinator deploys helper tables and change-detection triggers beside the business tables. It does not modify existing business columns or application code.
          </p>
          <figure className="syncDiagram">
            <div className="syncDiagramSystem syncDiagramSystem-left">
              <span className="syncDiagramStatus">Unchanged</span>
              <Database aria-hidden="true" />
              <strong>Existing business system</strong>
              <span>Business application</span>
              <span>Existing business tables</span>
            </div>
            <div className="syncDiagramFlow syncDiagramFlow-left" aria-hidden="true" />
            <div className="syncDiagramCore">
              <ProductMark variant="diagram" />
              <strong>SynCo</strong>
              <span>Configure · Sync · Operate</span>
            </div>
            <div className="syncDiagramFlow syncDiagramFlow-right" aria-hidden="true" />
            <div className="syncDiagramSystem syncDiagramSystem-right">
              <span className="syncDiagramStatus">Unchanged</span>
              <Database aria-hidden="true" />
              <strong>Existing business system</strong>
              <span>Business application</span>
              <span>Existing business tables</span>
            </div>
            <figcaption>
              Configure connections and mappings to synchronize changes safely between existing systems.
            </figcaption>
          </figure>
        </section>

        <section className="overviewSection" aria-labelledby="overview-capabilities">
          <div className="overviewSectionHeading">
            <p className="eyebrow">CORE CAPABILITIES</p>
            <h2 id="overview-capabilities">Core capabilities</h2>
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
            <h2 id="overview-usecases">Use cases</h2>
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
              <h2 id="overview-console">See synchronization status in one place.</h2>
            </div>
            <p>Review routes, processing state, and recent conflicts, then retry or pause work when necessary.</p>
          </div>
          <figure className="overviewConsolePreview">
            <ExpandableImage
              src={sitePath("/management-ui/dashboard.jpg")}
              alt="SyncCoordinator management dashboard showing synchronization routes, processing status, and recent conflicts"
              expandLabel="Expand the management dashboard image"
              closeLabel="Close expanded image"
              hintLabel="Expand"
            />
          </figure>
        </section>

        <section className="overviewNext" aria-labelledby="overview-next">
          <p className="eyebrow">NEXT</p>
          <h2 id="overview-next">Read next</h2>
          <div>
            <a href={sitePath("/en/architecture")}><GitFork aria-hidden="true" />Architecture</a>
            <a href={sitePath("/en/workflow")}><Workflow aria-hidden="true" />Workflow</a>
          </div>
        </section>
      </article>
    </DocsShell>
  );
}
