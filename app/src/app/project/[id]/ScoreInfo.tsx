"use client";

import { useState } from "react";

const ROWS = [
  ["Mandate fit", "Deterministic comparison between disclosed listing fields and the signed-in mandate profile.", "Higher = more stated criteria matched"],
  ["Readiness", "Completeness of materials: financials, legal, permits, governance.", "Higher = more complete"],
  ["ESG indicators", "Illustrative score derived from sponsor-declared indicators; not an independent ESG assessment.", "Higher = more declared indicators"],
  ["Risk indicators", "Illustrative rule-based signal using available financial, political, currency and execution fields.", "Higher number = higher indicated risk"],
];

export default function ScoreInfo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3 pt-3 border-t border-charcoal/10">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="text-[11px] font-bold text-wgray hover:text-charcoal focus-visible:ring-2 focus-visible:ring-gold rounded"
      >
        ⓘ About these scores {open ? "▲" : "▼"}
      </button>
      {open && (
        <div className="mt-2 space-y-2 text-xs leading-relaxed">
          {ROWS.map(([name, def, dir]) => (
            <div key={name}>
              <span className="font-bold">{name}.</span> {def}{" "}
              <span className="text-wgray">({dir})</span>
            </div>
          ))}
          <p className="text-wgray pt-1 border-t border-charcoal/10">
            Method: deterministic demo ruleset v1 · calculated at listing seed
            time · confidence: illustrative only — demo fixture data, no manual
            overrides, not investment advice. Production scores cite data-room
            evidence per factor.
          </p>
        </div>
      )}
    </div>
  );
}
