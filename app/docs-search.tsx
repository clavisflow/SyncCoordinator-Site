"use client";

import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Search } from "lucide-react";
import type { SiteLocale } from "./i18n";

type SearchEntry = {
  title: string;
  location: string;
  href: string;
  keywords: string;
};

const japaneseSearchEntries: SearchEntry[] = [
  { title: "Overview", location: "Overview", href: "/overview", keywords: "概要 主な機能 ユースケース 製品" },
  { title: "業務側を変えずに、データをつなぐ。", location: "Overview", href: "/overview#overview-foundation", keywords: "既存 業務アプリ 業務テーブル 変更なし データ同期" },
  { title: "主な機能", location: "Overview", href: "/overview#overview-capabilities", keywords: "変更検知 競合解決 再試行 通知 管理" },
  { title: "想定する利用シーン", location: "Overview", href: "/overview#overview-usecases", keywords: "利用シーン ユースケース システム連携" },
  { title: "管理画面", location: "Overview", href: "/overview#overview-console", keywords: "ダッシュボード 状況 監視 管理画面" },

  { title: "Architecture", location: "Architecture", href: "/architecture", keywords: "構成 Web Worker 管理DB 技術" },
  { title: "全体構成", location: "Architecture", href: "/architecture#topology", keywords: "Web Worker 管理DB 業務システム SynCo" },
  { title: "同期ルールとマッピング", location: "Architecture", href: "/architecture#sync-rules", keywords: "ルール テーブル 列 値変換 固定値" },
  { title: "競合と通知", location: "Architecture", href: "/architecture#conflicts-notifications", keywords: "競合 ポリシー Webhook 通知" },
  { title: "業務DBへの配備", location: "Architecture", href: "/architecture#deployment", keywords: "Trigger 補助テーブル SQL DBA 反映" },
  { title: "状態管理と再実行", location: "Architecture", href: "/architecture#state-reliability", keywords: "Inbox Checkpoint 再試行 冪等性 障害" },
  { title: "実装の詳細", location: "Architecture", href: "/architecture#implementation-details", keywords: "依存関係 設定反映 暗号鍵 DB権限" },

  { title: "Workflow", location: "Workflow", href: "/workflow", keywords: "処理 フロー 同期 競合 通知" },
  { title: "同期処理の流れ", location: "Workflow", href: "/workflow#processing-flow", keywords: "変更検知 Queue Worker 配送 適用" },
  { title: "最新状態への収束", location: "Workflow", href: "/workflow#latest-state", keywords: "更新 物理削除 論理削除 最新状態" },
  { title: "競合した場合", location: "Workflow", href: "/workflow#conflict-flow", keywords: "自動解決 手動解決 ポリシー 保留" },
  { title: "再試行と再開", location: "Workflow", href: "/workflow#retry-resume", keywords: "失敗 Retry Held 一時停止 再開" },
  { title: "通知の流れ", location: "Workflow", href: "/workflow#notification-flow", keywords: "Webhook 署名 再送 失敗通知" },
  { title: "管理画面での確認", location: "Workflow", href: "/workflow#operations", keywords: "処理状況 競合 通知 運用" },

  { title: "Getting Started", location: "Getting Started", href: "/getting-started", keywords: "開始 インストール デモ 初期設定 本番" },
  { title: "デモを起動する", location: "Getting Started", href: "/getting-started#run-demo", keywords: "Windows 11 dotnet Aspire Docker 起動" },
  { title: "初回ログイン", location: "Getting Started", href: "/getting-started#first-login", keywords: "admin パスワード account setup" },
  { title: "設定を確認・変更する", location: "Getting Started", href: "/getting-started#configure-demo", keywords: "システム DB接続 同期ルール マッピング デモ" },
  { title: "業務DBへ反映する", location: "Getting Started", href: "/getting-started#deploy-database", keywords: "SQL Trigger DB反映 検証 有効化" },
  { title: "同期を確認する", location: "Getting Started", href: "/getting-started#verify-demo", keywords: "動作確認 データ変更 競合 処理状況" },
  { title: "実環境で使う", location: "Getting Started", href: "/getting-started#production", keywords: "本番 Core 管理DB SQL Server migration HTTPS Key Ring 権限" },
];

const englishSearchEntries: SearchEntry[] = [
  { title: "Overview", location: "Overview", href: "/en/overview", keywords: "summary capabilities use cases product" },
  { title: "Connect data without changing business systems", location: "Overview", href: "/en/overview#overview-foundation", keywords: "existing applications tables no changes data synchronization" },
  { title: "Core capabilities", location: "Overview", href: "/en/overview#overview-capabilities", keywords: "change detection conflict resolution retry notification management" },
  { title: "Use cases", location: "Overview", href: "/en/overview#overview-usecases", keywords: "integration use cases enterprise systems" },
  { title: "Management console", location: "Overview", href: "/en/overview#overview-console", keywords: "dashboard status monitoring operations" },

  { title: "Architecture", location: "Architecture", href: "/en/architecture", keywords: "topology Web Worker management database technical" },
  { title: "System topology", location: "Architecture", href: "/en/architecture#topology", keywords: "Web Worker management database business systems SynCo" },
  { title: "Synchronization rules and mappings", location: "Architecture", href: "/en/architecture#sync-rules", keywords: "rules tables columns conversion fixed values" },
  { title: "Conflicts and notifications", location: "Architecture", href: "/en/architecture#conflicts-notifications", keywords: "conflict policy Webhook notification" },
  { title: "Business database deployment", location: "Architecture", href: "/en/architecture#deployment", keywords: "Trigger helper tables SQL DBA deployment" },
  { title: "State and reliable execution", location: "Architecture", href: "/en/architecture#state-reliability", keywords: "Inbox Checkpoint retry idempotency failure" },
  { title: "Implementation details", location: "Architecture", href: "/en/architecture#implementation-details", keywords: "dependencies configuration encryption keys database permissions" },

  { title: "Workflow", location: "Workflow", href: "/en/workflow", keywords: "processing flow synchronization conflict notification" },
  { title: "Synchronization flow", location: "Workflow", href: "/en/workflow#processing-flow", keywords: "change detection Queue Worker delivery apply" },
  { title: "Converging on the latest state", location: "Workflow", href: "/en/workflow#latest-state", keywords: "update physical delete logical delete latest state" },
  { title: "When a conflict occurs", location: "Workflow", href: "/en/workflow#conflict-flow", keywords: "automatic manual resolution policy held" },
  { title: "Retry and resume", location: "Workflow", href: "/en/workflow#retry-resume", keywords: "failure Retry Held pause resume" },
  { title: "Notification flow", location: "Workflow", href: "/en/workflow#notification-flow", keywords: "Webhook signature redelivery failure notification" },
  { title: "Checking operations", location: "Workflow", href: "/en/workflow#operations", keywords: "operations conflicts notifications monitoring" },

  { title: "Getting Started", location: "Getting Started", href: "/en/getting-started", keywords: "install demo initial setup production" },
  { title: "Run the demo", location: "Getting Started", href: "/en/getting-started#run-demo", keywords: "Windows 11 dotnet Aspire Docker start" },
  { title: "First login", location: "Getting Started", href: "/en/getting-started#first-login", keywords: "admin password account setup" },
  { title: "Review and change the configuration", location: "Getting Started", href: "/en/getting-started#configure-demo", keywords: "systems database connection rules mappings demo" },
  { title: "Deploy to business databases", location: "Getting Started", href: "/en/getting-started#deploy-database", keywords: "SQL Trigger deploy verify enable" },
  { title: "Verify synchronization", location: "Getting Started", href: "/en/getting-started#verify-demo", keywords: "test data change conflicts operations" },
  { title: "Use real business databases", location: "Getting Started", href: "/en/getting-started#production", keywords: "production Core management database SQL Server migration HTTPS Key Ring permissions" },
];

function normalize(value: string) {
  return value.toLocaleLowerCase().replace(/\s+/g, "");
}

export function DocsSearch({ locale = "ja" }: { locale?: SiteLocale }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const results = useMemo(() => {
    const searchEntries = locale === "en" ? englishSearchEntries : japaneseSearchEntries;
    const terms = query.trim().split(/\s+/).filter(Boolean).map(normalize);
    if (terms.length === 0) return [];

    return searchEntries
      .filter((entry) => {
        const searchable = normalize(`${entry.title} ${entry.location} ${entry.keywords}`);
        return terms.every((term) => searchable.includes(term));
      })
      .slice(0, 8);
  }, [locale, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    function handleShortcut(event: globalThis.KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    }

    function handleOutsidePointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleShortcut);
    document.addEventListener("mousedown", handleOutsidePointer);
    return () => {
      window.removeEventListener("keydown", handleShortcut);
      document.removeEventListener("mousedown", handleOutsidePointer);
    };
  }, []);

  function navigateTo(entry: SearchEntry) {
    setOpen(false);
    window.location.assign(entry.href);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (results.length > 0) navigateTo(results[activeIndex] ?? results[0]);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => (current + 1) % results.length);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => (current - 1 + results.length) % results.length);
    }
  }

  const showResults = open && query.trim().length > 0;

  return (
    <div className="searchControl" ref={rootRef}>
      <form className="search" role="search" onSubmit={handleSubmit}>
        <label className="srOnly" htmlFor="docs-search">{locale === "ja" ? "ドキュメントを検索" : "Search the documentation"}</label>
        <input
          ref={inputRef}
          id="docs-search"
          type="search"
          placeholder={locale === "ja" ? "ドキュメント検索" : "Search docs"}
          value={query}
          role="combobox"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={showResults}
          aria-activedescendant={showResults && results.length > 0 ? `${listboxId}-${activeIndex}` : undefined}
          autoComplete="off"
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        <kbd>Ctrl K</kbd>
        <button type="submit" aria-label={locale === "ja" ? "検索" : "Search"}>
          <Search aria-hidden="true" />
        </button>
      </form>

      {showResults && (
        <div className="searchResults" id={listboxId} role="listbox" aria-label={locale === "ja" ? "検索結果" : "Search results"}>
          {results.length > 0 ? results.map((entry, index) => (
            <a
              id={`${listboxId}-${index}`}
              key={entry.href}
              className={index === activeIndex ? "searchResult selected" : "searchResult"}
              href={entry.href}
              role="option"
              aria-selected={index === activeIndex}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => setOpen(false)}
            >
              <span className="searchResultTitle">{entry.title}</span>
              <span className="searchResultLocation">{entry.location}</span>
            </a>
          )) : (
            <p className="searchNoResults">{locale === "ja" ? "該当するページや見出しはありません。" : "No matching page or heading."}</p>
          )}
        </div>
      )}
    </div>
  );
}
