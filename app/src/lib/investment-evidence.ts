export type EvidenceStatus = "disclosed" | "partial" | "not-disclosed";

export type EvidenceField = {
  label: string;
  value: string;
  status: EvidenceStatus;
  source?: string;
};

export type InvestmentEvidence = {
  thesis: string;
  fields: EvidenceField[];
  risks: EvidenceField[];
  provenance: {
    classification: string;
    source: string;
    sourceDate: string;
    reviewStatus: string;
  };
};

export function summarizeEvidence(evidence: InvestmentEvidence) {
  return {
    disclosed: evidence.fields.filter((field) => field.status !== "not-disclosed").length,
    total: evidence.fields.length,
    risksDisclosed: evidence.risks.filter((risk) => risk.status !== "not-disclosed").length,
    risksTotal: evidence.risks.length,
  };
}

const NOT_DISCLOSED = "Not publicly disclosed";

const COMMON_FIELDS: EvidenceField[] = [
  { label: "Legal project entity", value: NOT_DISCLOSED, status: "not-disclosed" },
  { label: "Ownership and development rights", value: NOT_DISCLOSED, status: "not-disclosed" },
  { label: "Permits and approvals", value: NOT_DISCLOSED, status: "not-disclosed" },
  { label: "Revenue and offtake evidence", value: NOT_DISCLOSED, status: "not-disclosed" },
  { label: "Implementation timetable", value: NOT_DISCLOSED, status: "not-disclosed" },
];

const COMMON_RISKS: EvidenceField[] = [
  { label: "Development and construction", value: NOT_DISCLOSED, status: "not-disclosed" },
  { label: "Commercial and offtake", value: NOT_DISCLOSED, status: "not-disclosed" },
  { label: "Legal, title and permitting", value: NOT_DISCLOSED, status: "not-disclosed" },
  { label: "Financial and currency", value: NOT_DISCLOSED, status: "not-disclosed" },
  { label: "Environmental and social", value: NOT_DISCLOSED, status: "not-disclosed" },
];

const THESIS: Record<string, string> = {
  "port-de-ndomba":
    "The sponsor proposes a Kasai River logistics gateway intended to connect regional production with Kinshasa and export markets. The public case depends on evidence of rights, permits, demand, construction cost, financing and phased delivery.",
  "port-de-kasenga":
    "The sponsor proposes a Lake Mweru cross-border trade hub. The investment case depends on documented corridor demand, border arrangements, operating rights, capital cost and commercial agreements.",
  "comicordia-mining":
    "The sponsor proposes modernising artisanal mining concessions through semi-mechanised production and responsible-sourcing controls. The case depends on verified concession rights, geology, production economics, traceability and environmental controls.",
  "comicordia-agri":
    "The sponsor proposes an integrated smallholder and processing platform. The case depends on evidence for land access, farmer participation, yields, offtake, operating performance and the allocation of programme-level capital.",
  "manioc-plant":
    "The sponsor proposes a cassava-leaf processing facility supported by a local sourcing and distribution network. The case depends on validated unit economics, site rights, equipment quotations, demand and working-capital requirements.",
  "phardesco-mbuji-mayi":
    "The sponsor proposes an integrated pharmacy, diagnostics, water and health-education hub. The case depends on licensing, demand evidence, procurement and cold-chain capability, operating forecasts and the path to breakeven.",
};

export function normalizeStage(stage: string): string {
  if (stage === "Active") return "Operating status reported by sponsor";
  if (stage === "Feasibility complete") return "Feasibility documentation reported";
  return stage;
}

export function normalizeHighlights(highlights: string[]): string[] {
  return highlights.map((item) => {
    if (item === "Feasibility study complete") return "Sponsor reports that feasibility documentation is available";
    if (item === "1,200 construction jobs + 450 permanent operational roles") return "Sponsor target: 1,200 construction roles and 450 permanent operational roles";
    if (item === "IFC Performance Standards, biodiversity plan, community compact") return "Sponsor-stated framework: IFC Performance Standards, biodiversity plan and community compact; evidence not public";
    if (item === "50,000+ farmers reached; 25,000 hectares revitalized") return "Sponsor-reported: 50,000+ farmers and 25,000 hectares; measurement evidence and reporting date not public";
    if (item === "40+ villages served; 45% income uplift for smallholders") return "Sponsor-reported: 40+ villages and 45% income uplift; methodology and reporting date not public";
    if (item === "10,000 women in direct employment") return "Sponsor-reported employment figure: 10,000 women; measurement evidence not public";
    if (item === "924+ sq km concession area") return "Sponsor-reported concession area: 924+ sq km; title evidence not public";
    if (item === "OECD Due Diligence Guidance alignment; mercury-free processing") return "Sponsor-stated OECD guidance alignment and mercury-free processing; evidence not public";
    return item;
  });
}

export function normalizeSummary(id: string, summary: string): string {
  if (id === "comicordia-mining") {
    return summary
      .replace("Investdesco has secured exclusive development rights", "Investdesco states that it has secured exclusive development rights")
      .replace("under an OECD-aligned, mercury-free responsible-sourcing framework", "under a proposed responsible-sourcing framework described by the sponsor as OECD-aligned and mercury-free");
  }
  if (id === "comicordia-agri") {
    return summary.replace("connecting farmers to guaranteed offtake at transparent prices", "intended to connect farmers with proposed offtake arrangements at transparent prices");
  }
  if (id === "phardesco-mbuji-mayi") {
    return summary.replace("where current provision is roughly", "where sponsor materials state that current provision is roughly");
  }
  return summary;
}

export function getInvestmentEvidence(listing: {
  id: string;
  summary: string;
  useOfFunds?: string | null;
  fundingSecuredUsd?: number | null;
  sponsorContributionUsd?: number | null;
}): InvestmentEvidence {
  const fields: EvidenceField[] = [
    {
      label: "Use of funds",
      value: listing.useOfFunds || NOT_DISCLOSED,
      status: listing.useOfFunds ? "disclosed" : "not-disclosed",
      source: listing.useOfFunds ? "Sponsor submission" : undefined,
    },
    {
      label: "Funding already secured",
      value: listing.fundingSecuredUsd != null ? `$${listing.fundingSecuredUsd.toLocaleString("en-US")}` : NOT_DISCLOSED,
      status: listing.fundingSecuredUsd != null ? "partial" : "not-disclosed",
      source: listing.fundingSecuredUsd != null ? "Sponsor submission; supporting evidence not public" : undefined,
    },
    {
      label: "Sponsor contribution",
      value: listing.sponsorContributionUsd != null ? `$${listing.sponsorContributionUsd.toLocaleString("en-US")}` : NOT_DISCLOSED,
      status: listing.sponsorContributionUsd != null ? "partial" : "not-disclosed",
      source: listing.sponsorContributionUsd != null ? "Sponsor submission; supporting evidence not public" : undefined,
    },
    ...COMMON_FIELDS,
  ];

  return {
    thesis: THESIS[listing.id] || listing.summary,
    fields,
    risks: COMMON_RISKS,
    provenance: {
      classification: "Sponsor-provided project information and targets",
      source: "DESCO Global investor materials and project submissions",
      sourceDate: "Source date not disclosed on the public record",
      reviewStatus: "Independent verification not recorded",
    },
  };
}
