// Shared completeness/validation logic for project-owner submissions —
// used by both the submission API route and the owner-facing form, so
// "percent complete" and "ready to submit" never drift between them.

export type SubmissionDraft = {
  orgName: string;
  ownershipStatement: string;
  title: string;
  country: string;
  region: string;
  sector: string;
  stage: string;
  raiseUsd: number | null;
  fundingSecuredUsd: number | null;
  sponsorContributionUsd: number | null;
  instrument: string;
  useOfFunds: string;
  revenueModel: string;
  financialSummary: string;
  permitsStatus: string;
  landRights: string;
  governmentInvolvement: string;
  governmentBacked: boolean;
  esgSummary: string;
  keyRisks: string;
  managementTeam: string;
  advisors: string;
  documentsNote: string;
  timetable: string;
};

// All fields that count toward the completeness percentage shown to the
// owner. Order matches the intake form's section order.
const COMPLETENESS_FIELDS: (keyof SubmissionDraft)[] = [
  "orgName", "title", "ownershipStatement", "country", "sector", "stage",
  "raiseUsd", "instrument", "useOfFunds", "revenueModel", "financialSummary",
  "permitsStatus", "landRights", "governmentInvolvement", "esgSummary",
  "keyRisks", "managementTeam", "advisors", "timetable", "documentsNote",
];

// Minimum bar to move a draft to "submitted" — narrower than full
// completeness so an owner isn't blocked from getting into the review
// queue by optional detail fields (advisors, documentsNote).
const REQUIRED_TO_SUBMIT: (keyof SubmissionDraft)[] = [
  "orgName", "title", "ownershipStatement", "country", "sector", "stage",
  "raiseUsd", "instrument", "useOfFunds", "keyRisks", "managementTeam",
];

function isFilled(v: string | number | null): boolean {
  if (v === null) return false;
  if (typeof v === "number") return v > 0;
  return v.trim().length > 0;
}

export function computeCompleteness(d: SubmissionDraft): number {
  const filled = COMPLETENESS_FIELDS.filter((f) => isFilled(d[f] as string | number | null)).length;
  return Math.round((filled / COMPLETENESS_FIELDS.length) * 100);
}

export function missingRequiredFields(d: SubmissionDraft): string[] {
  return REQUIRED_TO_SUBMIT.filter((f) => !isFilled(d[f] as string | number | null));
}

export function canSubmitForReview(d: SubmissionDraft): boolean {
  return missingRequiredFields(d).length === 0;
}

export const SECTORS = ["Agriculture", "Infrastructure", "Mining", "Healthcare", "Water"];
export const INSTRUMENTS = ["equity", "debt", "blended", "spv", "other"];

export const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted — awaiting review",
  under_review: "Under review",
  changes_requested: "Changes requested",
  approved: "Approved — published",
  rejected: "Rejected",
};
