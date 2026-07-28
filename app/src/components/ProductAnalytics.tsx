"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function trackProductEvent(
  event: string,
  context: Record<string, string | number | boolean> = {},
) {
  void fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, path: window.location.pathname, context }),
    keepalive: true,
  }).catch(() => undefined);
}

export default function ProductAnalytics() {
  const pathname = usePathname();
  useEffect(() => {
    trackProductEvent("page_view");
  }, [pathname]);
  return null;
}
