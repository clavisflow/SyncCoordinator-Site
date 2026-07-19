import type { Metadata } from "next";
import { DocsShell } from "../docs-shell";
import { productManualMarkdown } from "../generated/product-manual";
import { localeAlternates } from "../i18n";
import { ManualMarkdown } from "./manual-markdown";

export const metadata: Metadata = {
  title: "操作マニュアル | SyncCoordinator Documentation",
  description: "SyncCoordinator管理画面を使った同期設定と日常運用の操作手順です。",
  alternates: localeAlternates("/manual"),
};

export default function ManualPage() {
  return (
    <DocsShell activeSection="manual">
      <article className="manualPage">
        <header className="manualHeader">
          <p className="eyebrow">DOCUMENTATION / MANUAL</p>
          <p>
            製品リポジトリの操作マニュアルから生成しています。製品に同梱されるヘルプと同じ内容を、ログインせずに確認できます。
          </p>
        </header>
        <ManualMarkdown markdown={productManualMarkdown} />
      </article>
    </DocsShell>
  );
}
