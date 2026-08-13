"use client";

import Button from "@/components/ui/Button";

import { useState } from "react";

export default function MatchFeedback({ listingId, mandateId }: { listingId: string; mandateId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  if (sent) {
    return (
      <p className="text-[11px] text-emerald-p mt-3 pt-3 border-t border-charcoal/10">
        ✓ Thanks — this helps improve future ranking. Your mandate itself is unchanged.
      </p>
    );
  }

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        className="text-[11px] text-wgray underline decoration-dotted mt-3 pt-3 border-t border-charcoal/10 hover:text-charcoal"
      >
        Not a good fit? Tell us why
      </Button>
    );
  }

  const submit = async () => {
    if (!reason.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/match/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, mandateId, reason: reason.trim() }),
      });
      if (res.ok) setSent(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-charcoal/10">
      <label htmlFor="match-feedback" className="block text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">
        Why isn&rsquo;t this a good fit?
      </label>
      <textarea
        id="match-feedback"
        rows={2}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full bg-mist  px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-gold resize-none"
      />
      <div className="flex gap-2 mt-2">
        <Button disabled={busy || !reason.trim()} onClick={submit} className="text-[11px] font-bold bg-charcoal text-white px-3 py-1.5  disabled:opacity-50">
          {busy ? "Sending…" : "Send feedback"}
        </Button>
        <Button onClick={() => setOpen(false)} className="text-[11px] font-semibold text-wgray hover:text-charcoal">Cancel</Button>
      </div>
    </div>
  );
}
