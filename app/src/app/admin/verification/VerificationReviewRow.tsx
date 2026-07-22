"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GOV_MECHANISMS, MECHANISM_LABELS } from "@/lib/verification";

type Listing = {
  id: string;
  title: string;
  orgName: string;
  verified: boolean;
  verifiedBy: string | null;
  verifiedAt: string | null;
  verificationNote: string;
  governmentBacked: boolean;
  govMechanism: string | null;
};

export default function VerificationReviewRow({ listing }: { listing: Listing }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [pendingAction, setPendingAction] = useState<"verify" | "unverify" | null>(null);
  const [govOpen, setGovOpen] = useState(false);
  const [govBacked, setGovBacked] = useState(listing.governmentBacked);
  const [govMechanism, setGovMechanism] = useState(listing.govMechanism ?? GOV_MECHANISMS[0]);
  const [govNote, setGovNote] = useState("");

  const patch = async (body: Record<string, unknown>) => {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/listings/" + listing.id + "/verification", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setError(data.error ?? "Action failed."); return; }
    setPendingAction(null);
    setNoteDraft("");
    setGovOpen(false);
    setGovNote("");
    router.refresh();
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-display font-bold">{listing.title}</div>
          <div className="text-xs text-wgray mt-1">{listing.orgName}</div>
        </div>
        <span className={"text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shrink-0 " + (listing.verified ? "bg-emerald-p/10 text-emerald-p" : "bg-mist text-wgray")}>
          {listing.verified ? "Verified" : "Not verified"}
        </span>
      </div>

      {listing.verified && (
        <div className="text-xs text-wgray mt-2">
          By {listing.verifiedBy} · {listing.verifiedAt && new Date(listing.verifiedAt).toLocaleDateString()}
          {listing.verificationNote && <div className="mt-1 text-charcoal/80">{listing.verificationNote}</div>}
        </div>
      )}

      <div className="text-xs text-wgray mt-2">
        {listing.governmentBacked
          ? "Gov-backed: " + (MECHANISM_LABELS[listing.govMechanism ?? ""] ?? listing.govMechanism)
          : "Not marked government-backed"}
      </div>

      {error && <div role="alert" className="text-xs text-brandred bg-brandred/10 rounded-lg px-3 py-2 mt-3">{error}</div>}

      {pendingAction && (
        <div className="mt-3">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">
            {pendingAction === "verify" ? "Evidence reviewed (required)" : "Reason for unverifying (required)"}
          </label>
          <textarea
            rows={2}
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            className="w-full bg-mist rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold resize-none"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-3 text-xs font-semibold">
        {!listing.verified ? (
          <button
            disabled={busy}
            onClick={() => (pendingAction === "verify" ? patch({ action: "verify", note: noteDraft }) : setPendingAction("verify"))}
            className="px-3 py-1.5 rounded-lg bg-gold text-ink disabled:opacity-50"
          >
            {pendingAction === "verify" ? "Confirm verify" : "Verify"}
          </button>
        ) : (
          <button
            disabled={busy}
            onClick={() => (pendingAction === "unverify" ? patch({ action: "unverify", note: noteDraft }) : setPendingAction("unverify"))}
            className="px-3 py-1.5 rounded-lg bg-brandred/10 text-brandred hover:bg-brandred/20 disabled:opacity-50"
          >
            {pendingAction === "unverify" ? "Confirm unverify" : "Unverify"}
          </button>
        )}
        <button disabled={busy} onClick={() => setGovOpen((o) => !o)} className="px-3 py-1.5 rounded-lg bg-mist hover:bg-gold-soft disabled:opacity-50">
          {govOpen ? "Hide" : "Gov-backing classification"}
        </button>
      </div>

      {govOpen && (
        <div className="mt-3 space-y-2 border-t border-charcoal/10 pt-3">
          <label className="flex items-center gap-2 text-xs font-semibold">
            <input type="checkbox" checked={govBacked} onChange={(e) => setGovBacked(e.target.checked)} />
            Government-backed
          </label>
          {govBacked && (
            <select
              value={govMechanism}
              onChange={(e) => setGovMechanism(e.target.value)}
              className="w-full bg-mist rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-gold"
            >
              {GOV_MECHANISMS.map((m) => <option key={m} value={m}>{MECHANISM_LABELS[m]}</option>)}
            </select>
          )}
          <textarea
            rows={2}
            value={govNote}
            onChange={(e) => setGovNote(e.target.value)}
            placeholder="Note explaining this classification (required)"
            className="w-full bg-mist rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold resize-none"
          />
          <button
            disabled={busy}
            onClick={() => patch({ action: "set_gov_mechanism", governmentBacked: govBacked, govMechanism: govBacked ? govMechanism : null, note: govNote })}
            className="px-3 py-1.5 rounded-lg bg-charcoal text-white text-xs font-semibold disabled:opacity-50"
          >
            Save classification
          </button>
        </div>
      )}
    </div>
  );
}
