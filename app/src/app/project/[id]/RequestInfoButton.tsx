"use client";

import Button from "@/components/ui/Button";

import { useState } from "react";
import { trackProductEvent } from "@/components/ProductAnalytics";
import { RESTRICTED_ACCESS_NOTICE_VERSION } from "@/lib/restricted-access";

export default function RequestInfoButton({
  listingId,
  className,
  label,
  action = "info_requested",
  doneLabel = "✓ Requested",
  ariaLabel,
}: {
  listingId: string;
  className: string;
  label: string;
  action?: "info_requested" | "dataroom_requested" | "saved";
  doneLabel?: string;
  ariaLabel?: string;
}) {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");

  const send = async () => {
    const restrictedAction = action === "dataroom_requested" || action === "info_requested";
    if (
      restrictedAction &&
      !window.confirm(
        "This is a non-binding request for controlled information. It is not an offer, investment commitment or grant of access. Continue and record this acknowledgement?",
      )
    ) {
      return;
    }
    setState("busy");
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          action,
          requestKey: crypto.randomUUID(),
          ...(restrictedAction
            ? {
                acknowledgedRestrictedAccess: true,
                noticeVersion: RESTRICTED_ACCESS_NOTICE_VERSION,
              }
            : {}),
        }),
      });
      if (res.ok) {
        const event = action === "dataroom_requested"
          ? "data_room_requested"
          : action === "info_requested" ? "information_requested" : "comparison_started";
        trackProductEvent(event, { listingId });
      }
      setState(res.ok ? "done" : "idle");
    } catch {
      setState("idle");
    }
  };

  return (
    <Button onClick={send} disabled={state !== "idle"} aria-label={ariaLabel} className={className + " disabled:opacity-60"}>
      {state === "done" ? doneLabel : state === "busy" ? "Sending…" : label}
    </Button>
  );
}
