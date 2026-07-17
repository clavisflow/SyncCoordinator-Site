"use client";

import { useEffect, useState } from "react";
import type { SiteLocale } from "./i18n";

const latestReleaseEndpoint = "https://api.github.com/repos/clavisflow/SyncCoordinator/releases/latest";

export function ProductVersion({ locale }: { locale: SiteLocale }) {
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadLatestVersion() {
      try {
        const response = await fetch(latestReleaseEndpoint, {
          headers: { Accept: "application/vnd.github+json" },
          signal: controller.signal,
        });
        if (!response.ok) return;

        const release: unknown = await response.json();
        if (
          typeof release === "object" &&
          release !== null &&
          "tag_name" in release &&
          typeof release.tag_name === "string" &&
          release.tag_name.trim()
        ) {
          setVersion(release.tag_name.trim());
        }
      } catch {
        // Keep the header uncluttered when the release endpoint is unavailable.
      }
    }

    void loadLatestVersion();
    return () => controller.abort();
  }, []);

  if (!version) return null;

  const ariaLabel = locale === "ja" ? `SyncCoordinatorの最新リリース ${version}` : `Latest SyncCoordinator release ${version}`;

  return (
    <>
      <span className="brandDivider" aria-hidden="true" />
      <span className="productVersionHeader" aria-label={ariaLabel}>{version}</span>
    </>
  );
}
