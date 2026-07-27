import { DESCO_COLORS } from "./theme";

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
  photos?: { id: string; url: string; caption: string | null; isExample?: boolean }[];
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

// Sourced from Desco Global's own investor deck and business plans
// (Desco_Investor_Deck_Fin.pdf, Phardesco_Expanded_Business_Plan.docx,
// Manioc-Project business plan) — no invented projects, figures, or
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
    sectorColor: DESCO_COLORS.charcoal,
    country: "DR Congo",
    flag: "🇨🇩",
    raiseUsd: 85_000_000,
    instrument: "Project SPV — Desco majority ownership",
    stage: "Feasibility reported by sponsor",
    irr: "Part of Desco Global's 17.2% target Phase 1 program IRR",
    summary:
      "Strategic river gateway on the Kasai River — the central logistics hub connecting the Grand Kasai region to Kinshasa and export markets. Phase 1 (2026–2028): quay wall, dredging, multi-purpose berths, warehousing and silos, fuel & bunkering, customs/compliance, digital smart gate. Phase 2 (2028–2030): adjacent industrial park and agro-processing integration.",
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
      "Infrastructure gateway asset underpinning Desco Global's integrated Kasai platform — unlocks export routes for the agri and mining pillars.",
  },
  {
    id: "port-de-kasenga",
    title: "Port de Kasenga — Lake Mweru Cross-Border Hub",
    org: "Desco Global (Investdesco)",
    sector: "Infrastructure",
    sectorColor: DESCO_COLORS.charcoal,
    country: "DR Congo",
    flag: "🇨🇩",
    raiseUsd: 65_000_000,
    instrument: "Project SPV — Desco majority ownership",
    stage: "Structuring",
    irr: "Part of Desco Global's 17.2% target Phase 1 program IRR",
    summary:
      "Cross-border trade gateway on Lake Mweru linking Kasai's agricultural surplus to Zambian Copperbelt demand and the Angola corridor. Throughput target 300k tons/year. One-stop-border-post integration targets a 40% reduction in cross-border clearance times.",
    verified: false,
    governmentBacked: false,
    scores: { match: 84, readiness: 63, esg: 71, risk: 52 },
    highlights: [
      "300k tons/year throughput target",
      "Cross-border link to Zambia (Copperbelt) and Angola",
      "One-stop border post — 40% faster clearance",
    ],
    docs: [],
    whyMatch:
      "Regional trade-corridor asset complementing Port de Ndomba within Desco Global's integrated logistics platform.",
  },
  {
    id: "comicordia-mining",
    title: "Comicordia Corporation — Luiza-Mwefu Mining Concessions",
    org: "Comicordia Corporation",
    sector: "Mining",
    sectorColor: DESCO_COLORS.brandred,
    country: "DR Congo",
    flag: "🇨🇩",
    raiseUsd: 20_000_000,
    instrument: "Tiered mining development capital ($100K–$20M+, per Investdesco investment tiers)",
    stage: "Concession modernization",
    irr: "15–25% targeted annual ROI (Investdesco mining tier guidance)",
    summary:
      "Investdesco states that it has secured exclusive development rights with Comicordia Corporation to modernize artisanal gold and diamond concessions across 924+ sq km in the Luiza-Mwefu territory, converting manual operations into semi-mechanized production hubs under a proposed responsible-sourcing framework described by the sponsor as OECD-aligned and mercury-free.",
    verified: false,
    governmentBacked: false,
    scores: { match: 76, readiness: 55, esg: 58, risk: 68 },
    highlights: [
      "Sponsor-reported concession area: 924+ sq km; title evidence not public",
      "Gold purity 22–24K; strategic interest in copper and cobalt",
      "Sponsor-stated OECD guidance alignment and mercury-free processing; evidence not public",
    ],
    docs: [],
    whyMatch:
      "Flagship Investdesco mining partnership — formalizes artisanal production under Desco Global's responsible-sourcing model.",
  },
  {
    id: "comicordia-agri",
    title: "Comicordia Agricultural Complex",
    org: "Comicordia Corporation",
    sector: "Agriculture",
    sectorColor: DESCO_COLORS.emerald,
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
      "High-ESG flagship agri platform anchoring Desco Global's Agridesco pillar and its 90M-person food-security thesis.",
  },
  {
    id: "manioc-plant",
    title: "Cassava Leaf Processing Plant — Kinshasa / Mont Ngafula",
    org: "Desco Global (Agridesco)",
    sector: "Agriculture",
    sectorColor: DESCO_COLORS.emerald,
    country: "DR Congo",
    flag: "🇨🇩",
    raiseUsd: 4_483_170,
    instrument: "Equity + equipment finance",
    stage: "Pre-construction",
    irr: "Illustrative unit economics: ~$15,444/batch on a 2,000kg cassava-leaf input run",
    summary:
      "A 4-hectare freeze-drying (lyophilization) facility near Kimwenza station on the Kinshasa–Matadi rail line, sourcing cassava leaf (\"pondu\") from smallholder growers in Mont Ngafula and neighboring Kongo Central. Output is a vacuum-packed powder preserving taste and color for roughly 10 years, sold through a women-led retail and depot network across Kinshasa.",
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
    sectorColor: DESCO_COLORS.blue,
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
      "Financing partners referenced: IFC, Proparco, AfDB, UNDP",
    ],
    docs: [],
    whyMatch:
      "Early-stage healthcare-access platform anchoring Desco Global's Phardesco pillar in its founding region.",
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
  n >= 1_000_000_000
    ? "$" + (n / 1_000_000_000).toFixed(1) + "B"
    : n >= 1_000_000
    ? "$" + Math.round(n / 1_000_000) + "M"
    : n >= 1_000
    ? "$" + Math.round(n / 1_000) + "K"
    : "$" + n;
