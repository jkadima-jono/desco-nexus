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

export type SourceDatePresentation = {
  date: Date | null;
  label: string | null;
  ageMonths: number | null;
};

const SOURCE_MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

/** Uses the source-document portion only; folder review/retrieval dates are excluded. */
export function sourceDatePresentation(sourceDate: string, now = new Date()): SourceDatePresentation {
  if (/\bundated\b/i.test(sourceDate)) return { date: null, label: null, ageMonths: null };
  const sourceOnly = sourceDate.split(/;\s*(?:folder\s+)?(?:reviewed|retrieved)\b/i)[0];
  const namedDates = [...sourceOnly.matchAll(
    /(?:(\d{1,2})\s+)?(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/gi,
  )];
  const years = [...sourceOnly.matchAll(/\b(19|20)\d{2}\b/g)];
  let date: Date | null = null;
  let precision: "month" | "year" = "year";
  if (namedDates.length > 0) {
    const match = namedDates[namedDates.length - 1];
    date = new Date(Date.UTC(Number(match[3]), SOURCE_MONTHS[match[2].toLowerCase()], Number(match[1] ?? 1)));
    precision = "month";
  } else if (years.length > 0) {
    const year = Number(years[years.length - 1][0]);
    date = new Date(Date.UTC(year, 0, 1));
  }
  if (!date) return { date: null, label: null, ageMonths: null };
  const ageMonths = precision === "month"
    ? Math.max(0, (now.getUTCFullYear() - date.getUTCFullYear()) * 12 + now.getUTCMonth() - date.getUTCMonth())
    : null;
  const label = precision === "month"
    ? new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" }).format(date)
    : String(date.getUTCFullYear());
  return { date, label, ageMonths };
}

export function summarizeEvidence(evidence: InvestmentEvidence) {
  return {
    disclosed: evidence.fields.filter((field) => field.status === "disclosed").length,
    partial: evidence.fields.filter((field) => field.status === "partial").length,
    supported: evidence.fields.filter((field) => field.status !== "not-disclosed").length,
    missing: evidence.fields.filter((field) => field.status === "not-disclosed").length,
    total: evidence.fields.length,
    risksDisclosed: evidence.risks.filter((risk) => risk.status === "disclosed").length,
    risksPartial: evidence.risks.filter((risk) => risk.status === "partial").length,
    risksSupported: evidence.risks.filter((risk) => risk.status !== "not-disclosed").length,
    risksMissing: evidence.risks.filter((risk) => risk.status === "not-disclosed").length,
    risksTotal: evidence.risks.length,
  };
}

export type EvidenceDisclosureStatus = "insufficient" | "partial" | "minimum";

export function evidenceDisclosureStatus(
  summary: ReturnType<typeof summarizeEvidence>,
): EvidenceDisclosureStatus {
  if (summary.supported >= 7 && summary.risksSupported >= 4) return "minimum";
  if (summary.supported >= 4) return "partial";
  return "insufficient";
}

export type ScreeningReadinessGap = "entity" | "capital" | "rights" | "source" | "disclosure";

export function screeningReadiness(
  evidence: InvestmentEvidence,
  currentCapitalAskUsd: number | null | undefined,
  now = new Date(),
) {
  const summary = summarizeEvidence(evidence);
  const legalEntity = evidence.fields.find((field) => field.label === "Legal project entity");
  const rights = evidence.fields.find((field) => field.label === "Ownership and development rights");
  const source = sourceDatePresentation(evidence.provenance.sourceDate, now);
  const gaps: ScreeningReadinessGap[] = [];
  if (legalEntity?.status !== "disclosed") gaps.push("entity");
  if (!currentCapitalAskUsd || currentCapitalAskUsd <= 0) gaps.push("capital");
  if (!rights || rights.status === "not-disclosed") gaps.push("rights");
  if (source.ageMonths == null || source.ageMonths > 18) gaps.push("source");
  if (summary.supported < 7 || summary.risksSupported < 4) gaps.push("disclosure");
  return { ready: gaps.length === 0, gaps, source, summary };
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
    "Agridesco proposes a standalone smallholder and processing platform in Grand Kasaï. The case depends on evidence for project ownership, land access, farmer participation, yields, offtake, operating performance and the allocation of programme-level capital.",
  "manioc-plant":
    "The sponsor proposes a cassava-leaf processing facility supported by a local sourcing and distribution network. The case depends on validated unit economics, site rights, equipment quotations, demand and working-capital requirements.",
  "phardesco-mbuji-mayi":
    "The sponsor proposes an integrated pharmacy, diagnostics, water and health-education hub. The case depends on licensing, demand evidence, procurement and cold-chain capability, operating forecasts and the path to breakeven.",
  "waterdesco-grand-kasai":
    "The sponsor proposes a clean-water network for Grand Kasaï, but its 2026 decks describe two different configurations: 300 decentralized solar WASH hubs or 12 treatment stations with 500 km of network. The case depends on reconciling the technical scope and validating water sources, demand, affordability, permits, capital cost, operating cost and maintenance capacity.",
  "tilu-pepm-8252":
    "The supplied historical geochemical study identifies copper and cobalt anomalies under research permit 8252 and lists copper, cobalt and gold as target substances, but it does not establish a mineral resource. The case depends on renewal and current-title verification, modern exploration, independent technical review, environmental and social baseline work, and a disclosed funding plan.",
  "sciress-kolwezi-12423":
    "Scires Mining proposes to acquire and advance PE 12423 through drilling, resource definition, feasibility work and pre-production engineering. The opportunity remains pre-resource: permit transfer, title, historical data, metallurgy, environmental approvals, development costs and transaction terms require independent diligence.",
  "kasaji-kisenge-solar-50mw":
    "The 2023 proposal defines a 50 MW solar, storage and distribution project for Kasaji and Kisenge. The investment case depends on refreshing the design and prices, confirming sites and rights, documenting utility and customer arrangements, and independently reviewing demand, grid integration, safeguards and financing.",
  "ldc-integrated-housing-drc":
    "LDC proposes a multi-site housing and urban-infrastructure programme. Before capital formation, the sponsor needs one controlled scope, a phased pilot, confirmed land and planning rights, household demand and affordability evidence, bank participation, cost validation and a deliverable procurement plan.",
  "energulf-lotshi-block":
    "Lotshi is an onshore exploration opportunity in Kongo Central Province, Democratic Republic of the Congo, with historical seismic coverage and seven prospects described in the available project material. The investment case depends on confirming current title and ownership, reviewing the underlying technical data and independent certification, and defining a financeable drilling, safeguards and appraisal programme.",
};

const PROJECT_EVIDENCE: Record<
  string,
  Pick<InvestmentEvidence, "fields" | "risks" | "provenance">
> = {
  "kasaji-kisenge-solar-50mw": {
    fields: [
      { label: "Legal project entity", value: "DIPC Group is named as designer and proposed implementer; the project SPV is not disclosed", status: "partial", source: "Kasaji–Kisenge technical proposal, August 2023" },
      { label: "Ownership and development rights", value: NOT_DISCLOSED, status: "not-disclosed" },
      { label: "Technical evidence", value: "A 40-page proposal describes 50 MW of solar generation, battery storage, substations, distribution and public lighting. Independent engineering review is not recorded", status: "partial", source: "Kasaji–Kisenge technical proposal, August 2023" },
      { label: "Capital estimate", value: "Sponsor estimate: approximately $86.2 million including taxes and project delivery costs; quotations and current pricing require validation", status: "partial", source: "Kasaji–Kisenge technical proposal, August 2023" },
      { label: "Revenue and offtake evidence", value: NOT_DISCLOSED, status: "not-disclosed" },
      { label: "Implementation timetable", value: "Sponsor proposes 11 months from contract signature and funding; critical path and procurement evidence are not disclosed", status: "partial", source: "Kasaji–Kisenge technical proposal, August 2023" },
    ],
    risks: [
      { label: "Development and construction", value: "The 2023 design, equipment quantities, battery configuration, grid studies, schedule and pricing require independent technical validation", status: "partial", source: "DESCO folder review" },
      { label: "Commercial and offtake", value: "Customer demand, tariffs, utility interface, payment security and executed offtake arrangements are not disclosed", status: "not-disclosed" },
      { label: "Legal, title and permitting", value: "Land rights, generation and distribution licences, environmental approvals and contracting authority are not disclosed", status: "not-disclosed" },
      { label: "Financial and currency", value: "Financing terms, contingencies, escalation, foreign-exchange exposure and operating model are not disclosed", status: "not-disclosed" },
      { label: "Environmental and social", value: "ESIA, land-use impacts, battery end-of-life plan and community consultation are not disclosed", status: "not-disclosed" },
    ],
    provenance: {
      classification: "Sponsor technical proposal and preliminary budget",
      source: "Projet d’électrification de Kasaji & Kisenge par système hybride, DIPC Group",
      sourceDate: "Plans dated 31 August 2023; folder reviewed 29 July 2026",
      reviewStatus: "DESCO source review recorded; independent technical, legal and financial verification not recorded",
    },
  },
  "ldc-integrated-housing-drc": {
    fields: [
      { label: "Legal project entity", value: "ONGD Logement Décent pour les Congolais and ADDCPB are named in the concept paper; project SPVs and contracting authority are not disclosed", status: "partial", source: "LDC integrated modern city narrative" },
      { label: "Ownership and development rights", value: NOT_DISCLOSED, status: "not-disclosed" },
      { label: "Technical evidence", value: "Concept narrative and preliminary cost schedule cover three sites, but housing quantities and utility capacities are inconsistent across sections", status: "partial", source: "LDC integrated modern city narrative" },
      { label: "Capital estimate", value: "Sponsor estimate: $14,635,509,000 including a 5% monitoring and evaluation allowance; no independent cost review is disclosed", status: "partial", source: "LDC integrated modern city narrative" },
      { label: "Revenue and offtake evidence", value: "A proposed buyer pathway uses a 20% contribution and up to 15 years of repayment. Demand, affordability, lender commitments and credit performance are not evidenced", status: "partial", source: "LDC integrated modern city narrative" },
      { label: "Implementation timetable", value: NOT_DISCLOSED, status: "not-disclosed" },
    ],
    risks: [
      { label: "Scope and cost baseline", value: "Unit counts, power capacity, water assets and cost schedules conflict and must be reconciled before reliance", status: "partial", source: "DESCO folder review" },
      { label: "Commercial and demand", value: "Household demand, affordability, absorption, pricing and employer or bank participation are not evidenced", status: "not-disclosed" },
      { label: "Legal, title and permitting", value: "Site locations, land title, customary rights, planning consent, environmental approvals and public authority are not disclosed", status: "not-disclosed" },
      { label: "Financial and currency", value: "The programme has no disclosed phased financing plan, lender commitments, subsidy framework, sensitivity analysis or foreign-exchange treatment", status: "not-disclosed" },
      { label: "Delivery and governance", value: "Procurement strategy, design standards, programme controls, delivery partners and accountable governance are not disclosed", status: "not-disclosed" },
    ],
    provenance: {
      classification: "Sponsor concept narrative and preliminary cost plan",
      source: "LDC explanatory note, technical note and integrated modern city narrative",
      sourceDate: "Documents undated; folder reviewed 29 July 2026",
      reviewStatus: "DESCO source review recorded; independent technical, legal and financial verification not recorded",
    },
  },
  "energulf-lotshi-block": {
    fields: [
      { label: "Legal project entity", value: "EnerGulf Congo SARL is identified as the local project company", status: "partial", source: "EnerGulf Lotshi project one-pager" },
      { label: "Ownership and development rights", value: "The material describes a 90% EnerGulf and 10% COHYDRO participation and a separate 2024 conditional share-transfer arrangement. Current ownership, licence validity and completed approvals require legal confirmation", status: "partial", source: "EnerGulf Lotshi project one-pager" },
      { label: "Technical evidence", value: "The material refers to 202 km of 2010 seismic work, seven prospects and an independent DeGolyer & MacNaughton review. The underlying seismic data and certification report are not included", status: "partial", source: "EnerGulf Lotshi project one-pager" },
      { label: "Development plan", value: "The Dallas prospect is identified as the first drilling target at a planned depth of 1,500–2,300 metres, followed by testing and a possible second well", status: "partial", source: "EnerGulf Lotshi project one-pager" },
      { label: "Revenue and offtake evidence", value: NOT_DISCLOSED, status: "not-disclosed" },
      { label: "Implementation timetable", value: NOT_DISCLOSED, status: "not-disclosed" },
    ],
    risks: [
      { label: "Legal, title and permitting", value: "Current licence standing, ownership, conditional transfer completion, government approvals and authority to raise capital require independent legal confirmation", status: "partial", source: "EnerGulf Lotshi project one-pager" },
      { label: "Geology and resource", value: "Prospect and recoverable-volume figures in the one-pager are exploration estimates. The underlying technical report, assumptions and classification are not available for review", status: "partial", source: "DESCO folder review" },
      { label: "Development and construction", value: "Well design, rig and service contracts, drilling budget, logistics plan, schedule and contingency are not disclosed", status: "not-disclosed" },
      { label: "Environmental and social", value: "Current ESIA, demining clearance, emergency response, community engagement, spill prevention and abandonment plans are not disclosed", status: "not-disclosed" },
      { label: "Commercial and financial", value: "Capital requirement, financing terms, fiscal assumptions, market route and independently reviewed economics are not disclosed", status: "not-disclosed" },
    ],
    provenance: {
      classification: "Project summary derived from historical and transaction-related materials",
      source: "EnerGulf Congo Lotshi Block one-pager",
      sourceDate: "References activity from 1972 to a conditional 2024 transaction; folder reviewed 29 July 2026",
      reviewStatus: "DESCO source review recorded; current legal, technical, environmental and financial verification not recorded",
    },
  },
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
        value: "The study records research permit 8252 as granted on 21 July 2007 for a renewable five-year term. Subsequent renewals, current ownership and present validity are not established by the supplied record",
        status: "partial",
        source: "Tilu preliminary technical geochemical study",
      },
      {
        label: "Technical evidence",
        value: "The study reports 933 soil samples over 24 survey lines across approximately 89 km², with copper values up to 581 ppm and cobalt values up to 7,490 ppm. These are geochemical indicators; no mineral resource or reserve is reported",
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
      sourceDate: "Permit granted July 2007; study describes 2010 fieldwork; current renewal evidence not supplied",
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
