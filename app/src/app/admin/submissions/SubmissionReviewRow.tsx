"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { computeCompleteness } from "@/lib/submissions";

type Submission = {
  id: string;
  title: string;
  orgName: string;
  sector: string;
  country: string;
  stage: string;
  raiseUsd: number | null;
  instrument: string;
  ownershipStatement: string;
  useOfFunds: string;
  keyRisks: string;
  managementTeam: string;
  governmentBacked: boolean;
  owner: { fullName: string; email: string };
  [key: string]: unknown;
};

export default function SubmissionReviewRow({ submission }: { submission: Submission }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [reason, setReason] = useState("");
  const [showReason, setShowReason] = useState<"reject" | "request_changes" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const act = async (action: "approve" | "reject" | "request_changes") => {
    if ((action === "reject" || action === "request_changes") && showReason !== action) {
      setShowReason(action);
      return;
    }
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/admin/submissions/${submission.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reason }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setError(data.error ?? "Action failed."); return; }
    setShowReason(null);
    setReason("");
    router.refresh();
  };

  // completeness computed from a partial shape is fine — fields present on
  // the submission are what count toward the percentage.
  const completeness = computeCompleteness(submission as never);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-display font-bold">{submission.title}</div>
          <div className="text-xs text-wgray mt-1">
            {submission.orgName} · {submission.sector} · {submission.country} · {submission.stage}
          </div>
          <div className="text-xs text-wgray mt-1">
            Submitted by {submission.owner.fullName} ({submission.owner.email}) · {completeness}% complete
          </div>
        </div>
        <div className="text-right shrink-0 text-sm font-display font-bold text-gold">
          {submission.raiseUsd ? "$" + Math.round(submission.raiseUsd / 1e6) + "M" : "—"}
        </div>
      </div>

      <dl className="grid sm:grid-cols-2 gap-3 mt-4 text-xs">
        <div><dt className="font-bold text-wgray uppercase tracking-wider mb-1">Ownership</dt><dd className="text-charcoal/80">{submission.ownershipStatement || "Not provided"}</dd></div>
        <div><dt className="font-bold text-wgray uppercase tracking-wider mb-1">Use of funds</dt><dd className="text-charcoal/80">{submission.useOfFunds || "Not provided"}</dd></div>
        <div><dt className="font-bold text-wgray uppercase tracking-wider mb-1">Key risks</dt><dd className="text-charcoal/80">{submission.keyRisks || "Not provided"}</dd></div>
        <div><dt className="font-bold text-wgray uppercase tracking-wider mb-1">Management</dt><dd className="text-charcoal/80">{submission.managementTeam || "Not provided"}</dd></div>
      </dl>

      {error && <div role="alert" className="text-xs text-brandred bg-brandred/10 rounded-lg px-3 py-2 mt-3">{error}</div>}

      {showReason && (
        <div className="mt-3">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">
            Reason ({showReason === "reject" ? "rejection" : "requested changes"}) — required
          </label>
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-mist rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold resize-none"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-3 text-xs font-semibold">
        <button disabled={busy} onClick={() => act("approve")} className="px-3 py-1.5 rounded-lg bg-gold text-ink disabled:opacity-50">Approve & publish</button>
        <button disabled={busy} onClick={() => act("request_changes")} className="px-3 py-1.5 rounded-lg bg-mist hover:bg-gold-soft disabled:opacity-50">
          {showReason === "request_changes" ? "Confirm request" : "Request changes"}
        </button>
        <button disabled={busy} onClick={() => act("reject")} className="px-3 py-1.5 rounded-lg bg-brandred/10 text-brandred hover:bg-brandred/20 disabled:opacity-50">
          {showReason === "reject" ? "Confirm rejection" : "Reject"}
        </button>
      </div>
    </div>
  );
}
