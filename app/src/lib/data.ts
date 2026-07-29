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
// (Comicordia entries), that is stated explicitly rather than presented
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
    stage: "Feasibility reported by sponsor",
    irr: "Part of Desco Global's 17.2% target Phase 1 program IRR",
    summary:
      "The sponsor proposes a river-port development on the Kasai River intended to connect the Grand Kasai region with Kinshasa and export routes. Proposed works include a quay wall, dredging, berths, warehousing, silos, fuel services, customs facilities and a digital gate. Feasibility, rights, permits, demand, cost and delivery evidence are not publicly disclosed.",
    verified: false,
    governmentBacked: false,
    scores: { match: 91, readiness: 78, esg: 74, risk: 46 },
    highlights: [
      "Sponsor reports a completed feasibility study",
      "Sponsor target: 1,200 construction roles and 450 permanent operational roles",
      "Sponsor-stated framework: IFC Performance Standards, biodiversity plan and community compact; evidence not public",
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
      "The sponsor proposes a Lake Mweru port intended to support trade with Zambia and connections towards Angola. Sponsor targets include annual throughput of 300,000 tonnes and a 40% reduction in border-clearance time; supporting studies are not publicly disclosed.",
    verified: false,
    governmentBacked: false,
    scores: { match: 84, readiness: 63, esg: 71, risk: 52 },
    highlights: [
      "300k tons/year throughput target",
      "Cross-border link to Zambia (Copperbelt) and Angola",
      "Sponsor target: 40% reduction in border-clearance time; supporting study not public",
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
      "Comicordia proposes a staged move from artisanal activity to semi-mechanised gold and diamond recovery near Luiza and Musefu in Kasaï Central. The available folder contains a 2017 geological report for PR 13578, an October 2024 investment proposal and a concept-level operating-cost paper. These documents indicate geological potential and a development concept; they do not establish a current mineral resource, confirmed mine life or independently verified economics.",
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
    title: "Comicordia Agricultural Complex",
    org: "Comicordia Corporation",
    sector: "Agriculture",
    sectorColor: colorForSector("Agriculture"),
    country: "DR Congo",
    flag: "🇨🇩",
    raiseUsd: 225_000_000,
    instrument: "Agridesco pillar capital allocation (30% of Desco Global's $750M Phase 1 program)",
    stage: "Operating information supplied",
    irr: "Part of Desco Global's 17.2% target Phase 1 program IRR",
    summary:
      "Desco Global's proposed agricultural impact platform in central DRC, organizing smallholders into outgrower networks with input credit, shared mechanization, post-harvest storage, and value-add milling for maize, cassava, and soy — intended to connect farmers with proposed offtake arrangements at transparent prices.",
    verified: false,
    governmentBacked: false,
    scores: { match: 82, readiness: 69, esg: 89, risk: 44 },
    highlights: [
      "Sponsor-reported: 50,000+ farmers and 25,000 hectares; measurement evidence and reporting date not public",
      "Sponsor-reported: 40+ villages and 45% income uplift; methodology and reporting date not public",
      "Sponsor-reported employment figure: 10,000 women; measurement evidence not public",
    ],
    docs: [],
    whyMatch:
      "Agriculture opportunity requiring validation of farmer reach, land access, offtake, safeguards and reported impact.",
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
    irr: "Sponsor model: approximately $15,444 per batch based on a 2,000 kg input; assumptions not independently reviewed",
    summary:
      "Sponsor materials describe a proposed four-hectare freeze-drying facility near Kimwenza station, sourcing cassava leaves from growers in Mont Ngafula and Kongo Central. The materials state an approximate ten-year shelf life and propose distribution through retail vendors and depots; product testing, demand and validation evidence are not publicly disclosed.",
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
      "Phardesco's proposed first Pharmalab Hub — a solar-powered, one-stop facility combining pharmaceutical retail, diagnostics, clean-water access, and health education for the Grand Kasai region, where sponsor materials state that current provision is roughly one pharmacist per 50,000 people against a WHO benchmark of 1 per 2,000.",
    verified: false,
    governmentBacked: false,
    scores: { match: 73, readiness: 51, esg: 86, risk: 57 },
    highlights: [
      "First of a planned 10+ hub network (medium-term), 50+ hubs by 2035",
      "Solar-powered, cold-chain capable, GMP-track generic production planned",
      "Potential financing institutions named in sponsor materials; no participation or commitment is confirmed",
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
    irr: "No project return disclosed; sponsor materials prioritise operating cost recovery",
    summary:
      "WaterDesco proposes clean-water infrastructure for underserved communities in Grand Kasaï. A 2026 master deck describes 300 decentralized solar-powered WASH hubs and a $12 million deployment budget. A separate 2026 executive deck describes 12 treatment stations, 500 km of distribution network and 50,000 m³/day capacity. The alternatives have not been reconciled, and site studies, source-water tests, permits, procurement evidence and a reviewed financial model are not publicly disclosed.",
    useOfFunds:
      "Sponsor concept allocation: solar pumping and dispensing hardware, multi-stage filtration, monitoring, deployment, local maintenance capability and community operations. Detailed quantities and supplier quotations are not public.",
    verified: false,
    governmentBacked: false,
    scores: { match: 0, readiness: 28, esg: 0, risk: 69 },
    highlights: [
      "Master-deck concept: 300 solar WASH hubs with a $12 million phase-one deployment budget",
      "Alternative executive-deck concept: 12 treatment stations, 500 km of network and 50,000 m³/day",
      "Sponsor materials describe low-cost pay-per-use and subscription models; demand, affordability and collection evidence are not public",
    ],
    docs: [],
    whyMatch:
      "Early-stage Waterdesco infrastructure concept for investors able to fund technical, environmental, affordability and delivery diligence before selecting a network design.",
  },
  {
    id: "tilu-pepm-8252",
    title: "Tilu Mining — PEPM 8252 Copper-Cobalt Prospect",
    org: "Tilu Mining SPRL",
    sector: "Mining",
    sectorColor: colorForSector("Mining"),
    country: "DR Congo",
    flag: "🇨🇩",
    raiseUsd: 0,
    instrument: "Exploration capital requirement not publicly disclosed",
    stage: "Historical exploration data — current title status unverified",
    irr: "Not publicly disclosed",
    summary:
      "An early-stage copper-cobalt exploration prospect in Manono territory. A historical technical study reports geochemical work completed in 2010 across permit area PEPM 8252, including 933 soil samples. The study recommends structural mapping, trenching and drilling before any mineral resource can be defined. Current permit ownership, validity and renewal status have not been independently verified.",
    verified: false,
    governmentBacked: false,
    scores: { match: 0, readiness: 20, esg: 0, risk: 80 },
    highlights: [
      "Historical study reports 933 soil samples across 24 north-south lines",
      "Study reports copper and cobalt anomalies; no mineral resource or reserve is disclosed",
      "Structural mapping, trenching and exploration drilling remain recommended",
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
    irr: "Sponsor illustration: 35% target IRR; no compliant resource, feasibility study or independently reviewed model disclosed",
    summary:
      "Scires Mining proposes to acquire and develop PE 12423, a cobalt-copper exploration project in Lualaba Province. A December 2025 sponsor deck describes historical drilling, trenching and soil sampling, and proposes a $45 million two-stage capital plan. The project does not yet disclose a compliant mineral resource, completed feasibility study or independently reviewed financial model. Permit transfer, title, technical data and transaction authority remain subject to diligence.",
    useOfFunds:
      "Sponsor proposal: $15 million for permit acquisition, legal closing, regulatory costs and initial working capital; $30 million for drilling, resource definition, studies, infrastructure, engineering, environmental and community work, project management and contingency.",
    verified: false,
    governmentBacked: false,
    scores: { match: 0, readiness: 38, esg: 0, risk: 76 },
    highlights: [
      "Sponsor deck describes PE 12423 as six mining squares covering approximately 5.066 km²",
      "Sponsor-reported exploration history: four diamond holes, 22 RC holes, trenching and 1,334 soil samples",
      "A 500m by 300m northern copper anomaly remains a proposed priority drilling target; no compliant resource is disclosed",
    ],
    docs: [],
    whyMatch:
      "Early-stage Investdesco critical-minerals opportunity requiring staged title, resource, feasibility, environmental and commercial diligence.",
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
