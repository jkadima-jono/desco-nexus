// Single lifecycle spanning discovery through close/drop — investor-side
// actions (Discovered/Saved/Interested/Information Requested/Data-Room
// Requested) auto-advance a deal via /api/match; sponsor/admin-side stages
// (Data-Room Granted onward) advance via the authorized /api/deals/[id]
// PATCH endpoint. One Deal record, one history log — not two parallel
// pipelines.
export const STAGES = [
  "Discovered",
  "Saved",
  "Interested",
  "Information Requested",
  "Data-Room Requested",
  "Data-Room Granted",
  "Due Diligence",
  "IC Review",
  "Term Sheet",
  "Negotiation",
  "Closed",
  "Passed or Withdrawn",
] as const;
export type Stage = (typeof STAGES)[number];

// Configurable stage probabilities used by the weighted forecast.
export const STAGE_PROBABILITY: Record<Stage, number> = {
  Discovered: 2,
  Saved: 5,
  Interested: 10,
  "Information Requested": 15,
  "Data-Room Requested": 20,
  "Data-Room Granted": 30,
  "Due Diligence": 45,
  "IC Review": 65,
  "Term Sheet": 80,
  Negotiation: 90,
  Closed: 100,
  "Passed or Withdrawn": 0,
};

// Entry requirements shown to users and enforced on transition.
export const STAGE_REQUIREMENTS: Record<Stage, string> = {
  Discovered: "None — the opportunity has appeared in an investor's feed.",
  Saved: "Investor saved the opportunity.",
  Interested: "Investor marked interested.",
  "Information Requested": "Investor requested further information.",
  "Data-Room Requested": "Investor requested data-room access.",
  "Data-Room Granted": "Sponsor or admin granted data-room access.",
  "Due Diligence": "Data-room access granted and diligence underway.",
  "IC Review": "Required diligence checklist items complete.",
  "Term Sheet": "Investment-committee approval recorded.",
  Negotiation: "Term sheet issued; commercial terms under negotiation.",
  Closed: "Negotiation concluded with an executed agreement.",
  "Passed or Withdrawn": "Investor or sponsor ended the process — reason recorded.",
};

const TERMINAL_DROP: Stage = "Passed or Withdrawn";

export function isValidTransition(from: Stage, to: Stage): boolean {
  const fi = STAGES.indexOf(from);
  const ti = STAGES.indexOf(to);
  if (fi < 0 || ti < 0 || fi === ti) return false;
  if (to === TERMINAL_DROP) {
    // Droppable from any active stage except before a deal exists or after
    // it's already terminal (Closed or already Passed/Withdrawn).
    return from !== "Closed" && from !== TERMINAL_DROP;
  }
  if (from === TERMINAL_DROP) {
    // Reopening a dropped deal is a rollback into the active pipeline —
    // reason required, enforced by the API route's backward check.
    return ti < fi;
  }
  // forward: one stage at a time; backward: any (rollback)
  return ti === fi + 1 || ti < fi;
}

export function requiresReason(from: Stage, to: Stage): boolean {
  const fi = STAGES.indexOf(from);
  const ti = STAGES.indexOf(to);
  return to === TERMINAL_DROP || ti < fi;
}

export function amountUsd(amount: string): number {
  return (parseInt(amount.replace(/[^0-9]/g, ""), 10) || 0) * 1_000_000;
}
