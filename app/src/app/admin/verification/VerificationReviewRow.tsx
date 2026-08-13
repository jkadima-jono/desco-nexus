"use client";

import Button from "@/components/ui/Button";

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
  publicationStatus: string;
  publishedAt: string | null;
  sourceCount: number;
  hasRelatedPartyReview: boolean;
  governanceReady: boolean;
  relatedParty: boolean;
  relatedPartyType: string | null;
  relatedPartyDisclosure: string;
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
  const [publicationReason, setPublicationReason] = useState("");
  const [sponsorApprovalNote, setSponsorApprovalNote] = useState("");
  const [sponsorSignatoryName, setSponsorSignatoryName] = useState("");
  const [sponsorSignatoryCapacity, setSponsorSignatoryCapacity] = useState("");
  const [sponsorApprovalEvidenceRef, setSponsorApprovalEvidenceRef] = useState("");
  const [legalClearanceScope, setLegalClearanceScope] = useState("");
  const [legalCounselName, setLegalCounselName] = useState("");
  const [legalJurisdiction, setLegalJurisdiction] = useState("");
  const [legalApprovalEvidenceRef, setLegalApprovalEvidenceRef] = useState("");
  const [relatedPartyReviewerName, setRelatedPartyReviewerName] = useState("");
  const [relatedPartyReviewerIndependence, setRelatedPartyReviewerIndependence] = useState("");
  const [relatedParty, setRelatedParty] = useState(listing.relatedParty);
  const [relatedPartyType, setRelatedPartyType] = useState(listing.relatedPartyType ?? "");
  const [relatedPartyDisclosure, setRelatedPartyDisclosure] = useState(listing.relatedPartyDisclosure);

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

  const patchPublication = async (action: "record_clearance" | "publish" | "pause" | "withdraw" | "archive") => {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/listings/" + listing.id + "/publication", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        ...(action === "record_clearance" ? {
          sponsorApprovalNote,
          sponsorSignatoryName,
          sponsorSignatoryCapacity,
          sponsorApprovalEvidenceRef,
          legalClearanceScope,
          legalCounselName,
          legalJurisdiction,
          legalApprovalEvidenceRef,
          relatedPartyReviewerName,
          relatedPartyReviewerIndependence,
          relatedParty,
          relatedPartyType,
          relatedPartyDisclosure,
        } : {}),
        ...(action === "publish" ? {} : { reason: publicationReason }),
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setError(data.error ?? "Publication action failed."); return; }
    setPublicationReason("");
    router.refresh();
  };

  return (
    <div className="bg-white  p-5 ">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-display font-bold">{listing.title}</div>
          <div className="text-xs text-wgray mt-1">{listing.orgName}</div>
        </div>
        <span className={"text-[11px] font-bold uppercase tracking-wider px-2 py-1  shrink-0 " + (listing.verified ? "bg-emerald-p/10 text-emerald-p" : "bg-mist text-wgray")}>
          {listing.verified ? "Review recorded" : "Review not recorded"}
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
          ? "Government involvement: " + (MECHANISM_LABELS[listing.govMechanism ?? ""] ?? listing.govMechanism)
          : "No government involvement recorded"}
      </div>

      <div className="mt-4 border-t border-charcoal/10 pt-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-wgray">Publication</div>
            <div className="text-xs text-charcoal mt-1">
              {listing.publicationStatus.replaceAll("_", " ")} · {listing.sourceCount} indexed source{listing.sourceCount === 1 ? "" : "s"}
              {listing.publishedAt ? " · published " + new Date(listing.publishedAt).toLocaleDateString() : ""}
            </div>
          </div>
          <span className={"text-[11px] font-bold uppercase tracking-wider px-2 py-1  " +
            (listing.publicationStatus === "public_teaser" ? "bg-emerald-p/10 text-emerald-p" : "bg-amber-50 text-amber-800")}>
            {listing.publicationStatus === "public_teaser" ? "Public" : "Not public"}
          </span>
        </div>
        {listing.publicationStatus !== "public_teaser" ? (
          <div className="mt-3 space-y-3">
            {!listing.governanceReady && (
              <div className="space-y-2  bg-mist p-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-wgray">Sponsor consent</div>
                <input value={sponsorSignatoryName} onChange={(event) => setSponsorSignatoryName(event.target.value)} placeholder="Sponsor signatory name" className="w-full  border border-charcoal/10 bg-white px-3 py-2 text-xs" />
                <input value={sponsorSignatoryCapacity} onChange={(event) => setSponsorSignatoryCapacity(event.target.value)} placeholder="Signatory capacity or authority" className="w-full  border border-charcoal/10 bg-white px-3 py-2 text-xs" />
                <input value={sponsorApprovalEvidenceRef} onChange={(event) => setSponsorApprovalEvidenceRef(event.target.value)} placeholder="Approval evidence reference" className="w-full  border border-charcoal/10 bg-white px-3 py-2 text-xs" />
                <textarea rows={2} value={sponsorApprovalNote} onChange={(event) => setSponsorApprovalNote(event.target.value)} placeholder="Sponsor approval evidence and approved content version" className="w-full  border border-charcoal/10 bg-white px-3 py-2 text-xs" />
                <div className="text-[11px] font-bold uppercase tracking-wider text-wgray">Legal clearance</div>
                <input value={legalCounselName} onChange={(event) => setLegalCounselName(event.target.value)} placeholder="Reviewing counsel name" className="w-full  border border-charcoal/10 bg-white px-3 py-2 text-xs" />
                <input value={legalJurisdiction} onChange={(event) => setLegalJurisdiction(event.target.value)} placeholder="Jurisdiction reviewed" className="w-full  border border-charcoal/10 bg-white px-3 py-2 text-xs" />
                <input value={legalApprovalEvidenceRef} onChange={(event) => setLegalApprovalEvidenceRef(event.target.value)} placeholder="Legal opinion or approval reference" className="w-full  border border-charcoal/10 bg-white px-3 py-2 text-xs" />
                <textarea rows={2} value={legalClearanceScope} onChange={(event) => setLegalClearanceScope(event.target.value)} placeholder="Legal clearance scope and jurisdictions reviewed" className="w-full  border border-charcoal/10 bg-white px-3 py-2 text-xs" />
                <div className="text-[11px] font-bold uppercase tracking-wider text-wgray">Related-party review</div>
                <input value={relatedPartyReviewerName} onChange={(event) => setRelatedPartyReviewerName(event.target.value)} placeholder="Related-party reviewer name" className="w-full  border border-charcoal/10 bg-white px-3 py-2 text-xs" />
                <input value={relatedPartyReviewerIndependence} onChange={(event) => setRelatedPartyReviewerIndependence(event.target.value)} placeholder="Reviewer independence and conflicts statement" className="w-full  border border-charcoal/10 bg-white px-3 py-2 text-xs" />
                <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={relatedParty} onChange={(event) => setRelatedParty(event.target.checked)} />DESCO related party, mandate or advisory relationship</label>
                {relatedParty && <input value={relatedPartyType} onChange={(event) => setRelatedPartyType(event.target.value)} placeholder="Relationship type" className="w-full  border border-charcoal/10 bg-white px-3 py-2 text-xs" />}
                <textarea rows={2} value={relatedPartyDisclosure} onChange={(event) => setRelatedPartyDisclosure(event.target.value)} placeholder="Concluded public related-party disclosure, or explicit no-relationship conclusion" className="w-full  border border-charcoal/10 bg-white px-3 py-2 text-xs" />
                <Button disabled={busy} onClick={() => patchPublication("record_clearance")} className="px-3 py-1.5  border border-charcoal/20 bg-white text-xs font-semibold disabled:opacity-40">Record release clearances</Button>
              </div>
            )}
            <Button
              disabled={busy || listing.sourceCount === 0 || !listing.governanceReady}
              onClick={() => patchPublication("publish")}
              className="px-3 py-1.5  bg-charcoal text-white text-xs font-semibold disabled:opacity-40"
            >
              Publish reviewed teaser
            </Button>
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            <textarea
              rows={2}
              value={publicationReason}
              onChange={(e) => setPublicationReason(e.target.value)}
              placeholder="Reason for changing public availability (required)"
              className="w-full bg-mist  px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold resize-none"
            />
            <div className="flex flex-wrap gap-2">
              <Button disabled={busy} onClick={() => patchPublication("pause")} className="px-3 py-1.5  bg-amber-50 text-amber-900 text-xs font-semibold disabled:opacity-50">Pause</Button>
              <Button disabled={busy} onClick={() => patchPublication("withdraw")} className="px-3 py-1.5  bg-brandred/10 text-brandred text-xs font-semibold disabled:opacity-50">Withdraw</Button>
              <Button disabled={busy} onClick={() => patchPublication("archive")} className="px-3 py-1.5  bg-mist text-charcoal text-xs font-semibold disabled:opacity-50">Archive</Button>
            </div>
          </div>
        )}
        {(listing.sourceCount === 0 || !listing.governanceReady) && listing.publicationStatus !== "public_teaser" && (
          <p className="mt-2 text-xs text-wgray">
            Publication requires a reviewed source, current sponsor approval, legal clearance and a concluded related-party review.
          </p>
        )}
      </div>

      {error && <div role="alert" className="text-xs text-brandred bg-brandred/10  px-3 py-2 mt-3">{error}</div>}

      {pendingAction && (
        <div className="mt-3">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">
            {pendingAction === "verify" ? "Evidence reviewed and scope (required)" : "Reason for removing the review record (required)"}
          </label>
          <textarea
            rows={2}
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            className="w-full bg-mist  px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold resize-none"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-3 text-xs font-semibold">
        {!listing.verified ? (
          <Button
            disabled={busy}
            onClick={() => (pendingAction === "verify" ? patch({ action: "verify", note: noteDraft }) : setPendingAction("verify"))}
            className="px-3 py-1.5  bg-gold text-ink disabled:opacity-50"
          >
            {pendingAction === "verify" ? "Record evidence review" : "Review evidence"}
          </Button>
        ) : (
          <Button
            disabled={busy}
            onClick={() => (pendingAction === "unverify" ? patch({ action: "unverify", note: noteDraft }) : setPendingAction("unverify"))}
            className="px-3 py-1.5  bg-brandred/10 text-brandred hover:bg-brandred/20 disabled:opacity-50"
          >
            {pendingAction === "unverify" ? "Remove review record" : "Remove review"}
          </Button>
        )}
        <Button disabled={busy} onClick={() => setGovOpen((o) => !o)} className="px-3 py-1.5  bg-mist hover:bg-gold-soft disabled:opacity-50">
          {govOpen ? "Hide" : "Government involvement classification"}
        </Button>
      </div>

      {govOpen && (
        <div className="mt-3 space-y-2 border-t border-charcoal/10 pt-3">
          <label className="flex items-center gap-2 text-xs font-semibold">
            <input type="checkbox" checked={govBacked} onChange={(e) => setGovBacked(e.target.checked)} />
            Government involvement
          </label>
          {govBacked && (
            <select
              value={govMechanism}
              onChange={(e) => setGovMechanism(e.target.value)}
              className="w-full bg-mist  px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-gold"
            >
              {GOV_MECHANISMS.map((m) => <option key={m} value={m}>{MECHANISM_LABELS[m]}</option>)}
            </select>
          )}
          <textarea
            rows={2}
            value={govNote}
            onChange={(e) => setGovNote(e.target.value)}
            placeholder="Note explaining this classification (required)"
            className="w-full bg-mist  px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold resize-none"
          />
          <Button
            disabled={busy}
            onClick={() => patch({ action: "set_gov_mechanism", governmentBacked: govBacked, govMechanism: govBacked ? govMechanism : null, note: govNote })}
            className="px-3 py-1.5  bg-charcoal text-white text-xs font-semibold disabled:opacity-50"
          >
            Save classification
          </Button>
        </div>
      )}
    </div>
  );
}
