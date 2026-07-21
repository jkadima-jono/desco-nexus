"use client";

import { useState } from "react";

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
    setState("busy");
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, action }),
      });
      setState(res.ok ? "done" : "idle");
    } catch {
      setState("idle");
    }
  };

  return (
    <button onClick={send} disabled={state !== "idle"} aria-label={ariaLabel} className={className + " disabled:opacity-60"}>
      {state === "done" ? doneLabel : state === "busy" ? "Sending…" : label}
    </button>
  );
}
