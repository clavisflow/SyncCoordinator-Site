import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { DocsShell, ProductMark } from "../docs-shell";
import { getDocumentationSections } from "../documentation-sections";
import { localeAlternates, sitePath } from "../i18n";

export const metadata: Metadata = {
  title: "SyncCoordinator Documentation | ClavisFlow",
  description:
    "Official documentation for ClavisFlow SyncCoordinator, a self-hosted enterprise data synchronization platform.",
  alternates: localeAlternates("/", "en"),
};

const documentationSections = getDocumentationSections("en");

export default function EnglishHome() {
  return (
    <DocsShell locale="en">
      <section className="hero heroWithIllustration" id="overview">
        <div className="heroCopy">
          <p className="eyebrow">CLAVISFLOW DOCUMENTATION</p>
          <div className="heroTitle">
            <ProductMark variant="hero" />
            <h1>
              SyncCoordinator
              <span className="nickname">(SynCo)</span>
            </h1>
          </div>
          <div className="heroDetailRow">
            <div>
              <p className="tagline">Connect data correctly.</p>
              <p className="description">
                Build and operate data synchronization without changing existing business applications or business tables.<br />
                SyncCoordinator detects conflicts between systems, applies the selected resolution policy, and synchronizes data safely.
              </p>
              <p className="heroMetadata" aria-label="Supported environments">
                <span>Self-hosted</span>
                <span>SQL Server</span>
                <span>MySQL</span>
                <span>PostgreSQL</span>
              </p>
            </div>
            <figure className="heroIllustration">
              <img
                src={sitePath("/hero-sync-flow.webp")}
                alt="SynCo synchronizes data across business systems and resolves conflicts automatically or manually"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="docsSection" aria-labelledby="docs-heading">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">DOCUMENTATION</p>
            <h2 id="docs-heading">Explore the documentation</h2>
          </div>
          <p>Start with the product overview, then move through architecture, workflow, and setup.</p>
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
