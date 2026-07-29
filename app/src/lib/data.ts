import { DESCO_COLORS, sectorColor as colorForSector } from "./theme";

export type Scores = {
  match: number;      // 0-100 AI match vs. current mandate
  readiness: number;  // investment readiness
  esg: number;
  risk: number;       // higher = riskier
};

export type Listing = {
  id: string;
  title: string;
  org: string;
  sector: string;
  sectorColor: string;
  country: string;
  flag: string;
  raiseUsd: number;
  instrument: string;
  stage: string;
  irr: string;
  summary: string;
  verified: boolean;
  governmentBacked: boolean;
  scores: Scores;
  highlights: string[];
  docs: { name: string; size: string; folder: string }[];
  whyMatch: string;
  photos?: {
    id: string;
    url: string;
    caption: string | null;
    isExample?: boolean;
    kind?: "example" | "regional";
  }[];
  // Sponsor-provided financial detail carried from the intake submission.
  // Absent on the static seed literals below; optional on published
  // listings too, since older listings were published before these fields
  // existed.
  useOfFunds?: string | null;
  fundingSecuredUsd?: number | null;
  sponsorContributionUsd?: number | null;
  // Optional: absent on the static seed literals below (Prisma sets it on
  // insert via @default(now())/@updatedAt); always present once loaded
  // through toListing() from the database.
  updatedAt?: Date;
};

export type CapitalPresentation = {
  label: string;
  value: string;
  includeInProjectTotal: boolean;
};

export function capitalPresentation(listing: Pick<Listing, "id" | "raiseUsd">): CapitalPresentation {
  if (listing.id === "comicordia-agri") {
    return {
      label: "Programme allocation, not a project-specific ask",
      value: fmtUsd(listing.raiseUsd),
      includeInProjectTotal: false,
    };
  }
  if (listing.raiseUsd <= 0) {
    return {
      label: "Capital requirement not publicly disclosed",
      value: "Not disclosed",
      includeInProjectTotal: false,
    };
  }
  return {
    label: "Project capital sought",
    value: fmtUsd(listing.raiseUsd),
    includeInProjectTotal: true,
  };
}

export function returnPresentation(listing: Pick<Listing, "id" | "irr">) {
  const labels: Record<string, string> = {
    "port-de-ndomba": "Programme return target, not a project return",
    "port-de-kasenga": "Programme return target, not a project return",
    "comicordia-agri": "Programme return target, not a project return",
    "manioc-plant": "Sponsor unit-economics illustration",
    "phardesco-mbuji-mayi": "Sponsor operating forecast",
    "sciress-kolwezi-12423": "Sponsor return illustration",
  };
  return {
    label: labels[listing.id] ?? "Return information",
    value: listing.irr,
  };
}

// Sourced from Desco Global's own investor deck, business plans and
// project-folder technical records
// (Desco_Investor_Deck_Fin.pdf, Phardesco_Expanded_Business_Plan.docx,
// Manioc-Project business plan, the Tilu preliminary geochemical study,
// and the Sciress CAMI extract) — no invented projects, figures, or
// sponsors. Where the source deck gives only a pillar-level allocation
// (including the Agridesco programme), that is stated explicitly rather than presented
// as a project-specific ask. Legacy score fields remain only for schema
// compatibility and are not used for public ranking or disclosure.
export const listings: Listing[] = [
  {
    id: "port-de-ndomba",
    title: "Port de Ndomba — Kasai River Gateway",
    org: "Desco Global (Investdesco)",
    sector: "Infrastructure",
    sectorColor: colorForSector("Infrastructure"),
    country: "DR Congo",
    flag: "🇨🇩",
    raiseUsd: 85_000_000,
    instrument: "Project SPV — Desco majority ownership",
    stage: "Feasibility reported; evidence under review",
    irr: "Part of Desco Global's 17.2% target Phase 1 program IRR",
    summary:
      "We are structuring a river-port opportunity on the Kasai River to connect Grand Kasaï with Kinshasa and export routes. The proposed scope includes a quay wall, dredging, berths, warehousing, silos, fuel services, customs facilities and a digital gate. Before advancing the opportunity, we require verified feasibility, rights, permits, demand, cost and delivery evidence.",
    verified: false,
    governmentBacked: false,
    scores: { match: 91, readiness: 78, esg: 74, risk: 46 },
    highlights: [
      "Available material reports a completed feasibility study; the study remains under review",
      "Development target: 1,200 construction roles and 450 permanent operational roles",
      "Proposed framework: IFC Performance Standards, biodiversity plan and community compact; evidence remains under review",
    ],
    docs: [],
    whyMatch:
      "Infrastructure gateway asset in Desco Global's Kasai platform — opens export routes for the agriculture and mining pillars.",
  },
  {
    id: "port-de-kasenga",
    title: "Port de Kasenga — Lake Mweru Cross-Border Hub",
    org: "Desco Global (Investdesco)",
    sector: "Infrastructure",
    sectorColor: colorForSector("Infrastructure"),
    country: "DR Congo",
    flag: "🇨🇩",
    raiseUsd: 65_000_000,
    instrument: "Project SPV — Desco majority ownership",
    stage: "Structuring",
    irr: "Part of Desco Global's 17.2% target Phase 1 program IRR",
    summary:
      "We are structuring a Lake Mweru port opportunity to support trade with Zambia and connections towards Angola. The development targets annual throughput of 300,000 tonnes and a 40% reduction in border-clearance time. We require supporting demand, border, rights, cost and delivery studies before presenting these targets as validated.",
    verified: false,
    governmentBacked: false,
    scores: { match: 84, readiness: 63, esg: 71, risk: 52 },
    highlights: [
      "300k tons/year throughput target",
      "Cross-border link to Zambia (Copperbelt) and Angola",
      "Development target: 40% reduction in border-clearance time; supporting study remains under review",
    ],
    docs: [],
    whyMatch:
      "Regional trade-corridor asset complementing Port de Ndomba within Desco Global's integrated logistics platform.",
  },
  {
    id: "comicordia-mining",
    title: "Comicordia — Luiza-Musefu Gold and Diamond Programme",
    org: "Comicordia/Luiza Mining Cooperative",
    sector: "Mining",
    sectorColor: colorForSector("Mining"),
    country: "DR Congo",
    flag: "🇨🇩",
    raiseUsd: 0,
    instrument: "Proposed joint venture; public transaction terms not disclosed",
    stage: "Historical geology and concept-stage mine planning",
    irr: "Not publicly disclosed",
    summary:
      "We are presenting Comicordia as a staged opportunity to move from artisanal activity to semi-mechanised gold and diamond recovery near Luiza and Musefu in Kasaï Central. The file includes a 2017 geological report for PR 13578, an October 2024 investment proposal and a concept-level operating-cost paper. Before investment, we require a current resource basis, confirmed title, mine-life work and independently reviewed economics.",
    verified: false,
    governmentBacked: false,
    scores: { match: 0, readiness: 35, esg: 0, risk: 75 },
    highlights: [
      "2017 report covers PR 13578, described as eight mining squares over approximately 6.8 km²",
      "Historical material discusses alluvial, eluvial and hard-rock gold potential, with associated diamond potential",
      "Concept paper recommends a staged start and states that mine life has not been confirmed",
    ],
    docs: [],
    whyMatch:
      "Early-stage Investdesco opportunity for investors able to fund title, geology, feasibility and environmental diligence before mine development.",
  },
  {
    id: "comicordia-agri",
    title: "Agridesco Integrated Agriculture Project — Grand Kasaï",
    org: "Desco Global (Agridesco)",
    sector: "Agriculture",
    sectorColor: colorForSector("Agriculture"),
    country: "DR Congo",
    flag: "🇨🇩",
    raiseUsd: 225_000_000,
    instrument: "Agridesco pillar capital allocation (30% of Desco Global's $750M Phase 1 program)",
    stage: "Operating information supplied",
    irr: "Part of Desco Global's 17.2% target Phase 1 program IRR",
    summary:
      "We are developing Agridesco as a standalone agricultural platform in central DRC, organising smallholders through input finance, shared mechanisation, post-harvest storage and processing for maize, cassava and soy. Our model is designed to connect participating farmers with transparent purchasing arrangements. We are validating farmer reach, land access, operating performance and offtake commitments.",
    verified: false,
    governmentBacked: false,
    scores: { match: 82, readiness: 69, esg: 89, risk: 44 },
    highlights: [
      "Reported reach: 50,000+ farmers and 25,000 hectares; measurement evidence and reporting date remain under review",
      "Reported coverage: 40+ villages and 45% income uplift; methodology and reporting date remain under review",
      "Reported employment: 10,000 women; measurement evidence remains under review",
    ],
    docs: [],
    whyMatch:
      "Standalone Agridesco project requiring validation of farmer participation, land access, production assumptions, offtake, safeguards and reported impact.",
  },
  {
    id: "manioc-plant",
    title: "Cassava Leaf Processing Plant — Kinshasa / Mont Ngafula",
    org: "Desco Global (Agridesco)",
    sector: "Agriculture",
    sectorColor: colorForSector("Agriculture"),
    country: "DR Congo",
    flag: "🇨🇩",
    raiseUsd: 4_483_170,
    instrument: "Equity + equipment finance",
    stage: "Pre-construction",
    irr: "Project model: approximately $15,444 per batch based on a 2,000 kg input; assumptions require independent review",
    summary:
      "We are presenting a four-hectare freeze-drying facility near Kimwenza station, sourcing cassava leaves from growers in Mont Ngafula and Kongo Central. The model combines solar power, cold storage, water treatment and distribution through retail vendors and depots. Before investment, we require product testing, demand validation, site rights and independently reviewed unit economics.",
    verified: false,
    governmentBacked: false,
    scores: { match: 79, readiness: 74, esg: 81, risk: 39 },
    highlights: [
      "4-hectare site with solar power, cold storage, and on-site water treatment",
      "Freeze-dried product shelf-stable ~10 years",
      "Distribution model built around women-led market vendors",
    ],
    docs: [],
    whyMatch:
      "Small-ticket, fast-to-market Agridesco processing asset with a fully costed build plan and clear distribution channel.",
  },
  {
    id: "phardesco-mbuji-mayi",
    title: "Phardesco Pharmalab Hub — Mbuji-Mayi",
    org: "Desco Global (Phardesco)",
    sector: "Healthcare",
    sectorColor: colorForSector("Healthcare"),
    country: "DR Congo",
    flag: "🇨🇩",
    raiseUsd: 10_000_000,
    instrument: "DFI + impact equity ($5M–$10M startup raise)",
    stage: "Pre-launch",
    irr: "5-yr forecast: EBITDA breakeven Year 2, +$3.8M EBITDA by Year 5",
    summary:
      "We are developing the first Phardesco Pharmalab Hub as a solar-powered facility combining pharmaceutical retail, diagnostics, clean-water access and health education for Grand Kasaï. Available material reports roughly one pharmacist per 50,000 people against a cited WHO benchmark of 1 per 2,000; we require current, attributable market evidence before relying on that comparison.",
    verified: false,
    governmentBacked: false,
    scores: { match: 73, readiness: 51, esg: 86, risk: 57 },
    highlights: [
      "First of a planned 10+ hub network (medium-term), 50+ hubs by 2035",
      "Solar-powered, cold-chain capable, GMP-track generic production planned",
      "Potential financing institutions are identified in project material; no participation or commitment is confirmed",
    ],
    docs: [],
    whyMatch:
      "Early-stage healthcare-access platform anchoring Desco Global's Phardesco pillar in its founding region.",
  },
  {
    id: "waterdesco-grand-kasai",
    title: "WaterDesco — Grand Kasaï Clean Water Network",
    org: "Desco Global (Waterdesco)",
    sector: "Water",
    sectorColor: colorForSector("Water"),
    country: "DR Congo",
    flag: "🇨🇩",
    raiseUsd: 12_000_000,
    instrument: "Proposed blended infrastructure and impact capital; final structure not disclosed",
    stage: "Concept design — scope requires reconciliation",
    irr: "No project return disclosed; the current concept prioritises operating cost recovery",
    summary:
      "We are developing WaterDesco to provide clean-water infrastructure for underserved communities in Grand Kasaï. Our 2026 materials currently contain two configurations: 300 decentralised solar-powered WASH hubs with a $12 million budget, or 12 treatment stations with 500 km of network and 50,000 m³/day capacity. We will select a bankable configuration only after reconciling scope and completing site, water-source, permitting, procurement and financial work.",
    useOfFunds:
      "Our concept allocation covers solar pumping and dispensing hardware, multi-stage filtration, monitoring, deployment, local maintenance capability and community operations. Detailed quantities and supplier quotations remain under review.",
    verified: false,
    governmentBacked: false,
    scores: { match: 0, readiness: 28, esg: 0, risk: 69 },
    highlights: [
      "Master-deck concept: 300 solar WASH hubs with a $12 million phase-one deployment budget",
      "Alternative executive-deck concept: 12 treatment stations, 500 km of network and 50,000 m³/day",
      "The concept includes pay-per-use and subscription models; demand, affordability and collection evidence require validation",
    ],
    docs: [],
    whyMatch:
      "Early-stage Waterdesco infrastructure concept for investors able to fund technical, environmental, affordability and delivery diligence before selecting a network design.",
  },
  {
    id: "tilu-pepm-8252",
    title: "Tilu Mining — Permit 8252 Copper-Cobalt-Gold Prospect",
    org: "Tilu Mining SPRL",
    sector: "Mining",
    sectorColor: colorForSector("Mining"),
    country: "DR Congo",
    flag: "🇨🇩",
    raiseUsd: 0,
    instrument: "Exploration capital requirement not publicly disclosed",
    stage: "Historical exploration data — permit renewal and current title status unverified",
    irr: "Not publicly disclosed",
    summary:
      "We are presenting an early-stage copper-cobalt-gold prospect in Manono territory. A historical technical study records research permit 8252, granted in July 2007, and a 2010 geochemical campaign covering 933 soil samples. The work identified exploration anomalies and recommended mapping, trenching and drilling. We require current title, renewal and ownership confirmation before progressing the opportunity.",
    verified: false,
    governmentBacked: false,
    scores: { match: 0, readiness: 20, esg: 0, risk: 80 },
    highlights: [
      "Historical study reports 933 soil samples across 24 north-south lines over approximately 89 km²",
      "Reported ranges: copper up to 581 ppm and cobalt up to 7,490 ppm; these are exploration indicators, not a resource",
      "The 2007 research permit lists copper, cobalt and gold; current renewal and standing require confirmation",
    ],
    docs: [],
    whyMatch:
      "Early-stage Investdesco mining opportunity for investors able to evaluate pre-resource geological and title risk.",
  },
  {
    id: "sciress-kolwezi-12423",
    title: "Scires Mining — PE 12423 Cobalt-Copper Project",
    org: "Scires Mining",
    sector: "Mining",
    sectorColor: colorForSector("Mining"),
    country: "DR Congo",
    flag: "🇨🇩",
    raiseUsd: 45_000_000,
    instrument: "Proposed equity, joint-venture or offtake financing, subject to diligence and final terms",
    stage: "Pre-resource exploration and proposed permit acquisition",
    irr: "Project illustration: 35% target IRR; no compliant resource, feasibility study or independently reviewed model disclosed",
    summary:
      "We are presenting Scires Mining’s proposed acquisition and development of PE 12423, a cobalt-copper exploration project in Lualaba Province. December 2025 material describes historical drilling, trenching and soil sampling and a $45 million two-stage capital plan. Before investment, we require a compliant resource basis, permit-transfer confirmation, current title, verified technical data, feasibility work and independent financial review.",
    useOfFunds:
      "Proposed allocation: $15 million for permit acquisition, legal closing, regulatory costs and initial working capital; $30 million for drilling, resource definition, studies, infrastructure, engineering, environmental and community work, project management and contingency.",
    verified: false,
    governmentBacked: false,
    scores: { match: 0, readiness: 38, esg: 0, risk: 76 },
    highlights: [
      "Project material describes PE 12423 as six mining squares covering approximately 5.066 km²",
      "Reported exploration history: four diamond holes, 22 RC holes, trenching and 1,334 soil samples",
      "$15M is allocated to proposed acquisition and $30M to exploration, studies and pre-production work",
      "A 500m by 300m northern copper anomaly remains a proposed priority drilling target; no compliant resource is disclosed",
    ],
    docs: [],
    whyMatch:
      "Early-stage Investdesco critical-minerals opportunity requiring staged title, resource, feasibility, environmental and commercial diligence.",
  },
  {
    id: "kasaji-kisenge-solar-50mw",
    title: "Kasaji–Kisenge 50 MW Solar and Grid Project",
    org: "DIPC Group",
    sector: "Energy",
    sectorColor: colorForSector("Energy"),
    country: "DR Congo",
    flag: "🇨🇩",
    raiseUsd: 86_215_774,
    instrument: "Project finance; transaction structure to be defined",
    stage: "Technical proposal and budget dated August 2023",
    irr: "Not publicly disclosed",
    summary:
      "We are presenting an energy-infrastructure opportunity that combines 50 MW of photovoltaic generation and battery storage with medium-voltage substations, distribution works and public lighting for Kasaji, Kisenge and surrounding communities. The 2023 technical proposal estimates total project cost at $86.2 million and an 11-month delivery period from contract signature and funding. Before advancing the opportunity, we require confirmation of land rights, permits, utility arrangements, demand, procurement pricing and the financial model.",
    useOfFunds:
      "Sponsor budget covers photovoltaic and battery equipment, substations, medium- and low-voltage distribution, public lighting, site works, logistics, taxes and project delivery costs.",
    verified: false,
    governmentBacked: false,
    scores: { match: 0, readiness: 48, esg: 0, risk: 66 },
    highlights: [
      "Designed capacity: 50 MW photovoltaic generation with battery storage and grid works",
      "2023 project budget: $86,215,774.30 including taxes and delivery costs",
      "Proposed delivery period: 11 months after contract signature and funding",
      "Target service area: Kasaji, Kisenge and nearby communities; demand and connection evidence require validation",
    ],
    docs: [],
    whyMatch:
      "We see this as a potential Investdesco energy-infrastructure opportunity, subject to current technical, legal, commercial and financing validation.",
  },
  {
    id: "ldc-integrated-housing-drc",
    title: "LDC Integrated Housing and Urban Infrastructure Programme",
    org: "ONGD Logement Décent pour les Congolais (LDC)",
    sector: "Infrastructure",
    sectorColor: colorForSector("Infrastructure"),
    country: "DR Congo",
    flag: "🇨🇩",
    raiseUsd: 14_635_509_000,
    instrument: "Public-private development and mortgage finance; structure to be completed",
    stage: "Sponsor concept and preliminary cost plan",
    irr: "Concept model assumes a 10% net margin per social housing unit; independent review required",
    summary:
      "We are presenting a large-scale urban development opportunity that brings together housing, roads, utilities, public facilities and industrial uses across three proposed sites in the DRC, with an initial focus on the housing and infrastructure pressure around Kinshasa. The concept-level cost estimate is $14.64 billion. We intend to evaluate the programme in phases, beginning with a reconciled scope, confirmed sites and land rights, tested household demand, bank participation and independently validated costs.",
    useOfFunds:
      "Preliminary sponsor allocation includes housing, site preparation, industrial facilities, police housing, schools, health and civic facilities, power, water, roads and programme monitoring.",
    verified: false,
    governmentBacked: false,
    scores: { match: 0, readiness: 27, esg: 0, risk: 82 },
    highlights: [
      "Three integrated sites with residential, economic and public-service housing",
      "Preliminary programme estimate: $14.64 billion, including a 5% monitoring and evaluation allowance",
      "Buyer-finance concept: 20% initial contribution followed by up to 15 years of mortgage repayment",
      "Housing counts, power capacity and water assets are inconsistent across the narrative and budget and require a controlled baseline",
    ],
    docs: [],
    whyMatch:
      "We see a potential Investdesco urban-infrastructure platform, provided that scope, land, planning, demand and financing are validated through a phased process.",
  },
  {
    id: "energulf-lotshi-block",
    title: "EnerGulf Lotshi Onshore Exploration Block",
    org: "EnerGulf Congo SARL",
    sector: "Energy",
    sectorColor: colorForSector("Energy"),
    country: "DR Congo",
    flag: "🇨🇩",
    raiseUsd: 0,
    instrument: "Exploration and appraisal financing; transaction terms not publicly disclosed",
    stage: "Pre-drilling opportunity requiring current title and approval confirmation",
    irr: "Not publicly disclosed",
    summary:
      "We are presenting the Lotshi opportunity as an onshore exploration asset covering an area described as approximately 506 km² in Kongo Central, between Moanda and Lukula. Available materials identify seven prospects from historical seismic work and position Dallas as the first drilling target, at a planned depth of 1,500–2,300 metres. Before introducing financing, we require confirmation of current licence standing, ownership and transfer approvals, access to the underlying seismic and certification reports, an independently reviewed drilling budget and a complete environmental and safety plan.",
    useOfFunds:
      "Exploration and appraisal capital is expected to support legal and regulatory completion, technical-data review, site preparation, access and logistics, drilling of the Dallas prospect, testing, environmental and safety work, and contingency. A current itemised financing requirement is not publicly disclosed.",
    verified: false,
    governmentBacked: false,
    scores: { match: 0, readiness: 31, esg: 0, risk: 85 },
    highlights: [
      "Exploration area described in the available material: approximately 506 km² in Kongo Central",
      "Historical programme: 202 km of seismic acquisition completed in 2010",
      "Seven prospects identified in the source material; Dallas is presented as the initial drilling target",
      "Planned drilling depth: 1,500–2,300 metres, with logistics routed through Banana, Moanda and Ntala",
    ],
    docs: [],
    whyMatch:
      "We classify Lotshi as a high-risk Investdesco energy opportunity suited to investors with upstream technical, legal, environmental and frontier-market diligence capability.",
  },
];

export type DealStage =
  | "Screening"
  | "NDA"
  | "Diligence"
  | "IC Review"
  | "Term Sheet";

export type Deal = {
  id: string;
  listingId: string;
  title: string;
  flag: string;
  amount: string;
  stage: DealStage;
  owner: string;
  nextStep: string;
  days: number;
};

// No pipeline deals ship pre-seeded — real projects should not carry an
// invented negotiation history. Deals populate organically as demo users
// express interest via Flow Mode.
export const deals: Deal[] = [];

export type Thread = {
  id: string;
  name: string;
  org: string;
  preview: string;
  time: string;
  unread: number;
  messages: { from: "them" | "me" | "system"; text: string; time: string }[];
};

// No pre-seeded conversations — see note on `deals` above.
export const threads: Thread[] = [];

export const fmtUsd = (n: number) =>
  n <= 0
    ? "Not disclosed"
    : n >= 1_000_000_000
    ? "$" + (n / 1_000_000_000).toFixed(1) + "B"
    : n >= 1_000_000
    ? "$" + Math.round(n / 1_000_000) + "M"
    : n >= 1_000
    ? "$" + Math.round(n / 1_000) + "K"
    : "$" + n;
