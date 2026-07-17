"use client";

import { useEffect, useState } from "react";
import type { SiteLocale } from "./i18n";

const latestReleaseEndpoint = "https://api.github.com/repos/clavisflow/SyncCoordinator/releases/latest";
let latestReleaseRequest: Promise<string | null> | null = null;

function requestLatestReleaseTag() {
  if (!latestReleaseRequest) {
    latestReleaseRequest = fetch(latestReleaseEndpoint, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then(async (response) => {
        if (!response.ok) return null;

        const release: unknown = await response.json();
        if (
          typeof release === "object" &&
          release !== null &&
          "tag_name" in release &&
          typeof release.tag_name === "string" &&
          release.tag_name.trim()
        ) {
          return release.tag_name.trim();
        }

        return null;
      })
      .catch(() => null);
  }

  return latestReleaseRequest;
}

export function useLatestReleaseTag() {
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void requestLatestReleaseTag().then((tag) => {
      if (active) setVersion(tag);
    });

    return () => {
      active = false;
    };
  }, []);

  return version;
}

export function ProductVersion({ locale }: { locale: SiteLocale }) {
  const version = useLatestReleaseTag();

  if (!version) return null;

  const ariaLabel = locale === "ja" ? `SyncCoordinatorの最新リリース ${version}` : `Latest SyncCoordinator release ${version}`;

  return (
    <>
      <span className="brandDivider" aria-hidden="true" />
      <span className="productVersionHeader" aria-label={ariaLabel}>{version}</span>
    </>
  );
}
