"use client";

import { useEffect } from "react";
import { trackProductEvent } from "@/components/ProductAnalytics";

export default function OpportunityViewTracker({ listingId, sector }: { listingId: string; sector: string }) {
  useEffect(() => {
    trackProductEvent("opportunity_viewed", { listingId, sector });
  }, [listingId, sector]);
  return null;
}
