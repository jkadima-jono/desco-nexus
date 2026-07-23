"use client";

import { useState } from "react";
import { MECHANISM_LABELS } from "@/lib/verification";

type Claim = {
  label: string;
  claim: string;
  verificationType: string;
  source: string;
  verifiedBy: string;
  checked: string;
  limitations: string;
};

export default function TrustBadges({
  verified,
  verifiedBy,
  verifiedAt,
  verificationNote,
  governmentBacked,
  govMechanism,
  sponsor,
  stage,
}: {
  verified: boolean;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  verificationNote?: string;
  governmentBacked: boolean;
  govMechanism: string | null;
  sponsor: string;
  stage: string;
}) {
  const [open, setOpen] = useState<Claim | null>(null);

  const claims: Claim[] = [];
  if (verified) {
    claims.push({
      label: "✓ Verified",
      claim: verificationNote || "Sponsor identity and company registration reviewed",
      verificationType: "Identity & company verification",
      source: verifiedBy
        ? "Reviewed by Nexus admin — no external eKYC/registry vendor connected in this build"
        : "Demo seed fixture — no verification vendor connected in this build",
      verifiedBy: verifiedBy ? verifiedBy + (verifiedAt ? " on " + new Date(verifiedAt).toLocaleDateString() : "") : "Not independently verified",
      checked: verifiedBy ? "Reviewed by admin" : "Self-reported (demo data)",
      limitations:
        "This platform has no connected eKYC/registry vendor. \"Verified\" means a Nexus admin recorded reviewing the stated evidence, not an independent third-party check.",
    });
  }
  if (governmentBacked) {
    claims.push({
      label: "◆ Government involvement",
      claim:
        "Type of involvement: " +
        (MECHANISM_LABELS[govMechanism ?? ""] ?? "mechanism not specified"),
      verificationType: "Support-mechanism classification",
      source: "Sponsor-declared in listing (demo data)",
      verifiedBy: "Not independently verified",
      checked: "Self-reported (demo data)",
      limitations:
        "Production requires the executed support instrument in the data room before this badge displays.",
    });
  }
  claims.push({
    label: stage,
    claim: "Development stage: " + stage,
    verificationType: "Stage self-assessment",
    source: "Sponsor-declared in listing (demo data)",
    verifiedBy: "Not independently verified",
    checked: "Self-reported (demo data)",
    limitations: "Stage claims are sponsor statements until evidenced by permits and contracts in the data room.",
  });

  return (
    <>
      {claims.map((c) => (
        <button
          key={c.label}
          onClick={() => setOpen(c)}
          className="text-gold underline decoration-dotted underline-offset-2 hover:text-white focus-visible:ring-2 focus-visible:ring-gold rounded"
          aria-haspopup="dialog"
          title="View verification evidence"
        >
          {c.label}
        </button>
      ))}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={"Verification details: " + open.label}
          className="fixed inset-0 z-50 bg-ink/70 flex items-center justify-center p-6 normal-case tracking-normal"
          onClick={() => setOpen(null)}
        >
          <div
            className="bg-white text-charcoal rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <h2 className="font-display font-bold text-lg">{open.label}</h2>
              <button onClick={() => setOpen(null)} aria-label="Close" className="text-wgray hover:text-charcoal text-xl leading-none">×</button>
            </div>
            <dl className="space-y-2 text-sm font-normal normal-case">
              {[
                ["Claim", open.claim],
                ["Verification type", open.verificationType],
                ["Source", open.source],
                ["Verified by", open.verifiedBy],
                ["Status", open.checked],
                ["Limitations", open.limitations],
                ["Sponsor", sponsor],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-wgray">{k}</dt>
                  <dd className="leading-relaxed">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </>
  );
}
