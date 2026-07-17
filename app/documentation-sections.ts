import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Box,
  GitFork,
  Rocket,
  SquareTerminal,
  Workflow,
} from "lucide-react";

export type DocumentationSection = {
  id: string;
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

export const documentationSections: DocumentationSection[] = [
  {
    id: "overview",
    href: "/overview",
    icon: BookOpen,
    title: "Overview",
    description: "SyncCoordinator の概要、主要な機能、ユースケースを説明します。",
  },
  {
    id: "architecture",
    href: "/architecture",
    icon: Box,
    title: "Architecture",
    description: "システム構成、コンポーネント、データフローを説明します。",
  },
  {
    id: "workflow",
    href: "/#workflow",
    icon: Workflow,
    title: "Workflow",
    description: "変更検知から競合解決、同期完了までの流れを説明します。",
  },
  {
    id: "getting-started",
    href: "/#getting-started",
    icon: Rocket,
    title: "Getting Started",
    description: "インストール、初期設定、最初の同期を順に案内します。",
  },
  {
    id: "examples",
    href: "/#examples",
    icon: SquareTerminal,
    title: "Examples",
    description: "代表的な同期シナリオと実践的な設定例を紹介します。",
  },
  {
    id: "github",
    href: "/#github",
    icon: GitFork,
    title: "GitHub",
    description: "ソースコード、Issue、最新のリリース情報を確認できます。",
  },
];
