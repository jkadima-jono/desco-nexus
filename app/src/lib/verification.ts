// Shared between the admin verification workflow (server-side validation)
// and TrustBadges (client-side display) so the set of valid mechanisms
// never drifts between the two.
export const GOV_MECHANISMS = [
  "guarantee",
  "concession",
  "ppa",
  "grant",
  "letter",
  "first-loss",
  "tax",
  "other",
] as const;
export type GovMechanism = (typeof GOV_MECHANISMS)[number];

export const MECHANISM_LABELS: Record<string, string> = {
  guarantee: "Sovereign guarantee",
  concession: "PPP concession agreement",
  ppa: "Power purchase agreement (sovereign offtake)",
  grant: "Government grant",
  letter: "Letter of support",
  "first-loss": "DFI first-loss capital tranche",
  tax: "Tax incentive",
  other: "Other defined mechanism",
};
