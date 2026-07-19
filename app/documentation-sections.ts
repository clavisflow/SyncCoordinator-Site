import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  BookOpenCheck,
  Box,
  GitFork,
  Rocket,
  Workflow,
} from "lucide-react";
import { localizedPath, type SiteLocale } from "./i18n";

export type DocumentationSection = {
  id: string;
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

const sectionDefinitions = [
  {
    id: "overview",
    path: "/overview",
    icon: BookOpen,
    title: "Overview",
    description: {
      ja: "SyncCoordinator の概要、主要な機能、ユースケースを説明します。",
      en: "Learn what SyncCoordinator does, its core capabilities, and common use cases.",
    },
  },
  {
    id: "architecture",
    path: "/architecture",
    icon: Box,
    title: "Architecture",
    description: {
      ja: "システム構成、コンポーネント、データフローを説明します。",
      en: "Understand the system topology, components, data flow, and reliability model.",
    },
  },
  {
    id: "workflow",
    path: "/workflow",
    icon: Workflow,
    title: "Workflow",
    description: {
      ja: "変更検知から競合解決、同期完了までの流れを説明します。",
      en: "Follow change detection, conflict resolution, retries, and delivery to completion.",
    },
  },
  {
    id: "getting-started",
    path: "/getting-started",
    icon: Rocket,
    title: "Getting Started",
    description: {
      ja: "インストール、初期設定、最初の同期を順に案内します。",
      en: "Run the demo, review its configuration, and connect your first business databases.",
    },
  },
  {
    id: "manual",
    path: "/manual",
    icon: BookOpenCheck,
    title: "Manual",
    localizedTitle: {
      ja: "操作マニュアル",
      en: "User Guide",
    },
    description: {
      ja: "管理画面を使った同期設定と日常運用の手順を確認できます。",
      en: "Follow the management-console setup and day-to-day operating procedures.",
    },
  },
  {
    id: "github",
    path: "https://github.com/clavisflow/SyncCoordinator",
    icon: GitFork,
    title: "GitHub",
    description: {
      ja: "ソースコード、Issue、最新のリリース情報を確認できます。",
      en: "Browse the source code, issues, and the latest release information.",
    },
  },
] as const;

export function getDocumentationSections(locale: SiteLocale): DocumentationSection[] {
  return sectionDefinitions.map((section) => ({
    id: section.id,
    href: section.path.startsWith("http") ? section.path : localizedPath(locale, section.path),
    icon: section.icon,
    title: "localizedTitle" in section ? section.localizedTitle[locale] : section.title,
    description: section.description[locale],
  }));
}

export const documentationSections = getDocumentationSections("ja");
