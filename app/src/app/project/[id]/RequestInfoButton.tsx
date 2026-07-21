"use client";

import { useState } from "react";

export default function RequestInfoButton({ listingId, className, label }: { listingId: string; className: string; label: string }) {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");

  const send = async () => {
    setState("busy");
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, action: "info_requested" }),
      });
      setState(res.ok ? "done" : "idle");
    } catch {
      setState("idle");
    }
  };

  return (
    <button onClick={send} disabled={state !== "idle"} className={className + " disabled:opacity-60"}>
      {state === "done" ? "✓ Requested" : state === "busy" ? "Sending…" : label}
    </button>
  );
}
