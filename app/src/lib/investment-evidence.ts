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
    disclosed: evidence.fields.filter((field) => field.status === "disclosed").length,
    partial: evidence.fields.filter((field) => field.status === "partial").length,
    missing: evidence.fields.filter((field) => field.status === "not-disclosed").length,
    total: evidence.fields.length,
    risksDisclosed: evidence.risks.filter((risk) => risk.status === "disclosed").length,
    risksPartial: evidence.risks.filter((risk) => risk.status === "partial").length,
    risksMissing: evidence.risks.filter((risk) => risk.status === "not-disclosed").length,
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
    "Comicordia proposes staged mechanisation of gold and diamond activity near Luiza and Musefu. The folder supports a historical geological case and an operating concept, but current title, resource, mine life, feasibility, environmental approvals and transaction authority still require verification.",
  "comicordia-agri":
    "The sponsor proposes an integrated smallholder and processing platform. The case depends on evidence for land access, farmer participation, yields, offtake, operating performance and the allocation of programme-level capital.",
  "manioc-plant":
    "The sponsor proposes a cassava-leaf processing facility supported by a local sourcing and distribution network. The case depends on validated unit economics, site rights, equipment quotations, demand and working-capital requirements.",
  "phardesco-mbuji-mayi":
    "The sponsor proposes an integrated pharmacy, diagnostics, water and health-education hub. The case depends on licensing, demand evidence, procurement and cold-chain capability, operating forecasts and the path to breakeven.",
  "waterdesco-grand-kasai":
    "The sponsor proposes a clean-water network for Grand Kasaï, but its 2026 decks describe two different configurations: 300 decentralized solar WASH hubs or 12 treatment stations with 500 km of network. The case depends on reconciling the technical scope and validating water sources, demand, affordability, permits, capital cost, operating cost and maintenance capacity.",
  "tilu-pepm-8252":
    "The supplied historical geochemical study identifies copper and cobalt anomalies at PEPM 8252 but does not establish a mineral resource. The case depends on current title verification, modern exploration, independent technical review, environmental and social baseline work, and a disclosed funding plan.",
  "sciress-kolwezi-12423":
    "Scires Mining proposes to acquire and advance PE 12423 through drilling, resource definition, feasibility work and pre-production engineering. The opportunity remains pre-resource: permit transfer, title, historical data, metallurgy, environmental approvals, development costs and transaction terms require independent diligence.",
};

const PROJECT_EVIDENCE: Record<
  string,
  Pick<InvestmentEvidence, "fields" | "risks" | "provenance">
> = {
  "waterdesco-grand-kasai": {
    fields: [
      { label: "Legal project entity", value: "WaterDesco is presented as a Desco Global pillar; the project SPV and contracting entity are not disclosed", status: "partial", source: "Desco Global 2026 investor decks" },
      { label: "Ownership and development rights", value: NOT_DISCLOSED, status: "not-disclosed" },
      { label: "Technical evidence", value: "Two sponsor decks describe different network designs. No reconciled basis of design, site list, hydrogeological work, source-water tests or engineering study is public", status: "partial", source: "Desco Master Deck new visual identity; Executive Presentation DRC 2026" },
      { label: "Development plan", value: "Master deck proposes a 2026 rollout from 10 pilot hubs to 300 hubs. A separate deck places an active distribution network in Q2 2029", status: "partial", source: "Desco Global 2026 investor decks" },
      { label: "Revenue and offtake evidence", value: "Sponsor concepts include pay-per-use and subscriptions, but customer demand, affordability, tariff approval, collection and anchor-offtake evidence are not public", status: "partial", source: "Desco Master Deck new visual identity" },
      { label: "Implementation timetable", value: "Conflicting sponsor schedules require reconciliation before reliance", status: "partial", source: "Desco Global 2026 investor decks" },
    ],
    risks: [
      { label: "Development and construction", value: "Network configuration, sites, water sources, engineering design, procurement plan and cost estimates are not reconciled or independently reviewed", status: "partial", source: "Cross-deck review" },
      { label: "Commercial and offtake", value: "Affordability, willingness to pay, tariff approval, collection performance and subsidy requirements are not evidenced", status: "not-disclosed" },
      { label: "Legal, title and permitting", value: "Land access, abstraction rights, environmental approvals, water-quality permits and operating licences are not publicly disclosed", status: "not-disclosed" },
      { label: "Financial and currency", value: "The $12 million budget is a sponsor concept allocation; detailed CAPEX, contingencies, OPEX, FX exposure and financing terms are not public", status: "partial", source: "Desco Global 2026 investor decks" },
      { label: "Environmental and social", value: "Source sustainability, seasonal yield, waste-stream handling, community consent and inclusion safeguards require baseline studies", status: "not-disclosed" },
    ],
    provenance: {
      classification: "Confidential sponsor concepts and forward-looking targets",
      source: "Desco Master Deck new visual identity; Master updated deck; Executive Presentation DRC 2026",
      sourceDate: "2026 decks; retrieved from DESCO Global Investor Decks on 29 July 2026",
      reviewStatus: "DESCO source comparison recorded; independent technical, legal and financial verification not recorded",
    },
  },
  "comicordia-mining": {
    fields: [
      {
        label: "Legal project entity",
        value: "Comicordia/Luiza is described as a registered mining cooperative; legal documents remain subject to diligence",
        status: "partial",
        source: "Comicordia investment proposal, October 2024",
      },
      {
        label: "Ownership and development rights",
        value: "The proposal refers to an artisanal mining zone and a lease arrangement for PR 13343; the 2017 geological report concerns PR 13578. The relationship among these rights requires reconciliation",
        status: "partial",
        source: "Comicordia investment proposal and PR 13578 geological report",
      },
      {
        label: "Technical evidence",
        value: "Historical geological work indicates gold and diamond potential; no current internationally reportable mineral resource or reserve is disclosed",
        status: "partial",
        source: "PR 13578 geological report, October 2017",
      },
      {
        label: "Development plan",
        value: "A staged small-to-medium-scale open-cast concept is described. The source states that mine life is unconfirmed and cost estimates require site validation",
        status: "partial",
        source: "Musefu open-cast mining cost paper",
      },
      {
        label: "Revenue and offtake evidence",
        value: NOT_DISCLOSED,
        status: "not-disclosed",
      },
      {
        label: "Implementation timetable",
        value: NOT_DISCLOSED,
        status: "not-disclosed",
      },
    ],
    risks: [
      {
        label: "Legal, title and permitting",
        value: "Permit numbers and contractual rights differ across the supplied documents and require legal reconciliation",
        status: "partial",
        source: "Folder document review",
      },
      {
        label: "Geology and resource",
        value: "Historical indications have not been converted into a current independently reported resource or reserve",
        status: "partial",
        source: "PR 13578 geological report",
      },
      {
        label: "Development and construction",
        value: "The mine plan and costs are conceptual; site engineering, equipment quotations and mine scheduling are not disclosed",
        status: "partial",
        source: "Musefu open-cast mining cost paper",
      },
      {
        label: "Environmental and social",
        value: "Environmental baseline, impact assessment, closure plan and community agreements are not publicly disclosed",
        status: "not-disclosed",
      },
      {
        label: "Commercial and financial",
        value: "Public transaction terms, validated operating model, funding plan and offtake evidence are not disclosed",
        status: "not-disclosed",
      },
    ],
    provenance: {
      classification: "Historical technical material and sponsor proposal",
      source: "PR 13578 geological report; Comicordia investment proposal; Musefu operating-cost concept",
      sourceDate: "October 2017 to October 2024; one concept paper undated",
      reviewStatus: "DESCO folder review recorded; independent verification not recorded",
    },
  },
  "tilu-pepm-8252": {
    fields: [
      {
        label: "Legal project entity",
        value: "Tilu Mining SPRL is named in the supplied study",
        status: "partial",
        source: "Tilu preliminary technical geochemical study",
      },
      {
        label: "Ownership and development rights",
        value: "The study concerns PEPM 8252; current ownership, renewal and validity are not established by the public record",
        status: "partial",
        source: "Tilu preliminary technical geochemical study",
      },
      {
        label: "Technical evidence",
        value: "The study reports 933 soil samples over 24 survey lines and copper-cobalt anomalies; it does not report a mineral resource or reserve",
        status: "partial",
        source: "Tilu preliminary technical geochemical study",
      },
      {
        label: "Next technical work",
        value: "Structural mapping, trenching and exploration drilling are recommended",
        status: "partial",
        source: "Tilu preliminary technical geochemical study",
      },
      {
        label: "Revenue and offtake evidence",
        value: NOT_DISCLOSED,
        status: "not-disclosed",
      },
      {
        label: "Implementation timetable",
        value: NOT_DISCLOSED,
        status: "not-disclosed",
      },
    ],
    risks: [
      {
        label: "Legal, title and permitting",
        value: "Current permit status and chain of title require verification",
        status: "partial",
        source: "Historical study only",
      },
      {
        label: "Geology and resource",
        value: "Geochemical anomalies are exploration indicators and do not establish an economic deposit",
        status: "partial",
        source: "Tilu preliminary technical geochemical study",
      },
      {
        label: "Development and construction",
        value: "No mine plan, processing route, infrastructure plan or capital estimate is disclosed",
        status: "not-disclosed",
      },
      {
        label: "Environmental and social",
        value: "Baseline studies, impact assessment and community agreements are not publicly disclosed",
        status: "not-disclosed",
      },
      {
        label: "Commercial and financial",
        value: "Capital requirement, transaction structure, operating costs and offtake are not disclosed",
        status: "not-disclosed",
      },
    ],
    provenance: {
      classification: "Historical exploration study",
      source: "Tilu Mining preliminary technical geochemical study",
      sourceDate: "Study describes 2010 fieldwork; current title evidence not supplied",
      reviewStatus: "DESCO folder review recorded; independent verification not recorded",
    },
  },
  "sciress-kolwezi-12423": {
    fields: [
      {
        label: "Legal project entity",
        value: "Scires Mining is presented as the proposed project owner and operator following acquisition; the acquisition vehicle and executed transfer documents are not disclosed",
        status: "partial",
        source: "Sponsor investment deck, December 2025",
      },
      {
        label: "Ownership and development rights",
        value: "The supplied materials state that PE 12423 is to be acquired by Scires Mining. Current ownership, authority to sell, transfer conditions and beneficial ownership require legal verification",
        status: "partial",
        source: "CAMI extract and sponsor investment deck",
      },
      {
        label: "Permits and approvals",
        value: "The CAMI extract describes PE 12423 over six mining squares, granted 20 March 2018 with stated validity to 19 March 2048. Current standing, encumbrances and transfer approval have not been independently checked",
        status: "partial",
        source: "CAMI cadastral extract printed 21 April 2025",
      },
      {
        label: "Technical evidence",
        value: "The sponsor reports historical diamond and RC drilling, trenching and soil sampling with copper and cobalt indications. No compliant mineral resource or reserve is disclosed",
        status: "partial",
        source: "Sponsor investment deck, December 2025",
      },
      {
        label: "Development plan",
        value: "Sponsor target: acquisition, advanced exploration, resource definition, studies and pre-production work over approximately 30 months before commissioning",
        status: "partial",
        source: "Sponsor investment deck, December 2025",
      },
      {
        label: "Revenue and offtake evidence",
        value: "No executed offtake agreement or independently reviewed revenue case is disclosed",
        status: "not-disclosed",
      },
    ],
    risks: [
      {
        label: "Legal, title and permitting",
        value: "The proposed permit acquisition, authority to sell, title standing, encumbrances and regulatory transfer approvals require independent legal verification",
        status: "partial",
        source: "CAMI extract and sponsor investment deck",
      },
      {
        label: "Geology and resource",
        value: "Historical indications and anomalies do not establish grade continuity, tonnage, metallurgy or an economic resource",
        status: "partial",
        source: "Sponsor investment deck; no compliant resource disclosed",
      },
      {
        label: "Development and construction",
        value: "The processing route, mine design, infrastructure scope, schedule and costs remain conceptual pending resource definition and feasibility studies",
        status: "partial",
        source: "Sponsor investment deck, December 2025",
      },
      {
        label: "Environmental and social",
        value: "The sponsor budgets for ESIA and community work, but completed studies, approvals, baseline data and agreements are not disclosed",
        status: "not-disclosed",
      },
      {
        label: "Commercial and financial",
        value: "The $45 million capital plan and projected returns are sponsor illustrations pending resource definition, feasibility, final transaction terms and independent model review",
        status: "partial",
        source: "Sponsor investment deck, December 2025",
      },
    ],
    provenance: {
      classification: "Mining-cadastre extract and confidential sponsor investment presentation",
      source: "CAMI certificate extract for PE 12423; Scires Mining investment deck",
      sourceDate: "CAMI extract printed 21 April 2025; sponsor deck dated December 2025",
      reviewStatus: "DESCO source review recorded; independent legal, technical and financial verification not recorded",
    },
  },
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
  const projectEvidence = PROJECT_EVIDENCE[listing.id];
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
    ...(projectEvidence?.fields ?? COMMON_FIELDS),
  ];

  return {
    thesis: THESIS[listing.id] || listing.summary,
    fields,
    risks: projectEvidence?.risks ?? COMMON_RISKS,
    provenance: projectEvidence?.provenance ?? {
      classification: "Sponsor-provided project information and targets",
      source: "DESCO Global investor materials and project submissions",
      sourceDate: "Source date not disclosed on the public record",
      reviewStatus: "Independent verification not recorded",
    },
  };
}
