export const STAGES = ["Screening", "NDA", "Diligence", "IC Review", "Term Sheet"] as const;
export type Stage = (typeof STAGES)[number];

// Configurable stage probabilities used by the weighted forecast.
export const STAGE_PROBABILITY: Record<Stage, number> = {
  Screening: 10,
  NDA: 25,
  Diligence: 45,
  "IC Review": 65,
  "Term Sheet": 85,
};

// Entry requirements shown to users and enforced on transition.
export const STAGE_REQUIREMENTS: Record<Stage, string> = {
  Screening: "None — initial review.",
  NDA: "Mutual interest recorded.",
  Diligence: "Executed NDA and approved data-room access.",
  "IC Review": "Required diligence checklist items complete.",
  "Term Sheet": "Investment-committee approval recorded.",
};

export function isValidTransition(from: Stage, to: Stage): boolean {
  const fi = STAGES.indexOf(from);
  const ti = STAGES.indexOf(to);
  if (fi < 0 || ti < 0 || fi === ti) return false;
  // forward: one stage at a time; backward: any (rollback), reason mandatory
  return ti === fi + 1 || ti < fi;
}

export function amountUsd(amount: string): number {
  return (parseInt(amount.replace(/[^0-9]/g, ""), 10) || 0) * 1_000_000;
}
