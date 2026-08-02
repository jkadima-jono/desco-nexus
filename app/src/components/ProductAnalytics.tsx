"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  CAMPAIGN_STORAGE_KEY,
  campaignAttributionFromSearch,
  hasCampaignAttribution,
  parseStoredCampaignAttribution,
} from "@/lib/marketing-attribution";

export function trackProductEvent(
  event: string,
  context: Record<string, string | number | boolean> = {},
) {
  const stored = parseStoredCampaignAttribution(window.sessionStorage.getItem(CAMPAIGN_STORAGE_KEY));
  const campaignContext = stored ? {
    campaignSource: stored.source ?? "",
    campaignMedium: stored.medium ?? "",
    campaignName: stored.campaign ?? "",
  } : {};
  void fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event,
      path: window.location.pathname,
      context: { locale: document.documentElement.lang || "en", ...campaignContext, ...context },
    }),
    keepalive: true,
  }).catch(() => undefined);
}

export default function ProductAnalytics() {
  const pathname = usePathname();
  useEffect(() => {
    const attribution = campaignAttributionFromSearch(window.location.search);
    if (hasCampaignAttribution(attribution)) {
      // Session storage keeps campaign context through the public journey
      // without creating a cross-session tracking identifier.
      window.sessionStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(attribution));
    }
    trackProductEvent("page_view");
  }, [pathname]);
  return null;
}
