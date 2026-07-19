import type { Metadata } from "next";
import { DocsShell } from "../../docs-shell";
import { productManualEnglishMarkdown } from "../../generated/product-manual";
import { localeAlternates } from "../../i18n";
import { ManualMarkdown } from "../../manual/manual-markdown";

export const metadata: Metadata = {
  title: "User Guide | SyncCoordinator Documentation",
  description: "Management-console setup and day-to-day operating procedures for SyncCoordinator.",
  alternates: localeAlternates("/manual", "en"),
};

export default function EnglishManualPage() {
  return (
    <DocsShell activeSection="manual" locale="en">
      <article className="manualPage">
        <header className="manualHeader">
          <p className="eyebrow">DOCUMENTATION / USER GUIDE</p>
          <p>
            This page is generated from the English user guide in the product repository and matches the help bundled with the English management UI.
          </p>
        </header>
        <ManualMarkdown markdown={productManualEnglishMarkdown} locale="en" />
      </article>
    </DocsShell>
  );
}
