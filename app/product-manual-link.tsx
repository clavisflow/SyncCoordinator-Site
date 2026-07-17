"use client";

import { BookOpenCheck } from "lucide-react";
import type { SiteLocale } from "./i18n";
import { useLatestReleaseTag } from "./product-version";

const repositoryUrl = "https://github.com/clavisflow/SyncCoordinator";

export function ProductManualLink({ locale }: { locale: SiteLocale }) {
  const latestReleaseTag = useLatestReleaseTag();
  const sourceRef = latestReleaseTag ?? "master";
  const href = `${repositoryUrl}/blob/${encodeURIComponent(sourceRef)}/docs/user-guide.md`;
  const title = locale === "ja" ? "操作マニュアル" : "User Guide";
  const ariaLabel = latestReleaseTag
    ? `${title}（${latestReleaseTag}）`
    : `${title}（master）`;

  return (
    <a className="productManualLink" href={href} aria-label={ariaLabel}>
      <BookOpenCheck aria-hidden="true" />
      <span>{title}</span>
    </a>
  );
}
