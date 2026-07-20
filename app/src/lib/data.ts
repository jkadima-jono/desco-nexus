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
  photos?: { id: string; url: string; caption: string | null }[];
};

export const listings: Listing[] = [
  {
    id: "atlas-solar",
    title: "Atlas Solar Portfolio — 120MW",
    org: "Maghreb Renewables SA",
    sector: "Renewable Energy",
    sectorColor: DESCO_COLORS.charcoal,
    country: "Morocco",
    flag: "🇲🇦",
    raiseUsd: 90_000_000,
    instrument: "Project Finance (70/30 D/E)",
    stage: "Shovel-ready",
    irr: "14–17% IRR",
    summary:
      "Three utility-scale solar sites with signed 25-year PPAs, grid interconnection secured, EPC contracted. Seeking senior debt + equity co-investment.",
    verified: true,
    governmentBacked: true,
    scores: { match: 94, readiness: 91, esg: 88, risk: 32 },
    highlights: ["25-yr sovereign-backed PPA", "Land + permits secured", "Tier-1 EPC (fixed price)"],
    docs: [
      { name: "Information Memorandum.pdf", size: "4.2 MB", folder: "1. Overview" },
      { name: "Financial Model v12.xlsx", size: "1.8 MB", folder: "2. Financials" },
      { name: "PPA — Executed.pdf", size: "2.1 MB", folder: "3. Legal" },
      { name: "ESIA Report.pdf", size: "8.4 MB", folder: "4. ESG" },
    ],
    whyMatch:
      "Fits your mandate: renewable energy, Africa, $20–100M ticket, government-backed offtake. Similar to 2 deals you moved to diligence last quarter.",
  },
  {
    id: "kivu-agri",
    title: "Kivu Agri-Processing Expansion",
    org: "Desco Agri Holdings",
    sector: "Agriculture",
    sectorColor: DESCO_COLORS.emerald,
    country: "DR Congo",
    flag: "🇨🇩",
    raiseUsd: 8_000_000,
    instrument: "Equity + Mezzanine",
    stage: "Expansion",
    irr: "22–28% IRR",
    summary:
      "Profitable maize & cassava processor doubling capacity. 4,200 smallholder farmers in supply chain, offtake LOIs from 3 regional distributors.",
    verified: true,
    governmentBacked: false,
    scores: { match: 87, readiness: 76, esg: 92, risk: 48 },
    highlights: ["EBITDA-positive 3 yrs", "4,200 farmer network", "Desco Global operating pillar"],
    docs: [
      { name: "Teaser (AI-generated).pdf", size: "900 KB", folder: "1. Overview" },
      { name: "Audited Accounts 2023-25.pdf", size: "3.3 MB", folder: "2. Financials" },
      { name: "Offtake LOIs.pdf", size: "1.2 MB", folder: "3. Legal" },
    ],
    whyMatch:
      "High ESG fit (smallholder impact) and matches your agri-processing interest. Readiness gaps: formal valuation pending.",
  },
  {
    id: "mombasa-port",
    title: "Mombasa Logistics Corridor PPP",
    org: "Kenya Investment Authority",
    sector: "Infrastructure",
    sectorColor: DESCO_COLORS.charcoal,
    country: "Kenya",
    flag: "🇰🇪",
    raiseUsd: 240_000_000,
    instrument: "PPP Concession (30-yr)",
    stage: "Feasibility complete",
    irr: "12–15% IRR",
    summary:
      "Inland container depot + rail link concession. Feasibility by international advisor, sovereign support package approved, IFC exploring co-investment.",
    verified: true,
    governmentBacked: true,
    scores: { match: 81, readiness: 84, esg: 79, risk: 41 },
    highlights: ["Sovereign support approved", "DFI co-investor engaged", "Traffic study: 8.2% CAGR"],
    docs: [
      { name: "Feasibility Study.pdf", size: "12.6 MB", folder: "1. Overview" },
      { name: "Concession Term Sheet.pdf", size: "1.4 MB", folder: "3. Legal" },
    ],
    whyMatch:
      "Matches your infrastructure mandate and DFI co-investment preference. Ticket above your usual range — syndication room open.",
  },
  {
    id: "lagos-health",
    title: "MediServe — Clinic Network Series B",
    org: "MediServe Health",
    sector: "Healthcare",
    sectorColor: DESCO_COLORS.blue,
    country: "Nigeria",
    flag: "🇳🇬",
    raiseUsd: 25_000_000,
    instrument: "Series B Equity",
    stage: "Growth",
    irr: "3.2x target multiple",
    summary:
      "18 primary-care clinics + telehealth platform, 340k patient visits/yr, 68% gross margin on diagnostics. Expanding to Ghana and Côte d'Ivoire.",
    verified: true,
    governmentBacked: false,
    scores: { match: 78, readiness: 88, esg: 85, risk: 44 },
    highlights: ["340k visits/yr", "Insurance partnerships ×6", "Unit economics proven in 3 cities"],
    docs: [
      { name: "Series B Deck.pdf", size: "6.1 MB", folder: "1. Overview" },
      { name: "Data Room Index.pdf", size: "300 KB", folder: "1. Overview" },
    ],
    whyMatch:
      "Healthcare exposure you flagged as a 2026 priority; strong readiness. Risk driver: FX repatriation — hedging memo available.",
  },
  {
    id: "zambezi-water",
    title: "Zambezi Clean Water Utility",
    org: "AquaVita Partners",
    sector: "Water",
    sectorColor: DESCO_COLORS.deepblue,
    country: "Zambia",
    flag: "🇿🇲",
    raiseUsd: 45_000_000,
    instrument: "Blended Finance (DFI first-loss)",
    stage: "Greenfield",
    irr: "9–11% IRR + impact",
    summary:
      "Municipal water treatment + distribution serving 800k residents. First-loss tranche committed by European DFI; seeking commercial tranche.",
    verified: true,
    governmentBacked: true,
    scores: { match: 72, readiness: 69, esg: 96, risk: 55 },
    highlights: ["DFI first-loss committed", "800k beneficiaries", "Tariff framework ratified"],
    docs: [
      { name: "Blended Structure Memo.pdf", size: "1.1 MB", folder: "2. Financials" },
    ],
    whyMatch:
      "Top-decile ESG score; blended structure de-risks your entry. Readiness below your threshold — AI coach engaged with sponsor.",
  },
  {
    id: "dakar-fintech",
    title: "Teranga Pay — Series A",
    org: "Teranga Technologies",
    sector: "Fintech",
    sectorColor: DESCO_COLORS.gold,
    country: "Senegal",
    flag: "🇸🇳",
    raiseUsd: 12_000_000,
    instrument: "Series A Equity",
    stage: "Scaling",
    irr: "5x target multiple",
    summary:
      "Cross-border payments for francophone West Africa. $180M annualized TPV, 140% YoY growth, licensed in 4 markets.",
    verified: false,
    governmentBacked: false,
    scores: { match: 68, readiness: 82, esg: 71, risk: 61 },
    highlights: ["$180M TPV run-rate", "4 licenses", "140% YoY"],
    docs: [
      { name: "Series A Deck.pdf", size: "5.4 MB", folder: "1. Overview" },
    ],
    whyMatch:
      "Adjacent to your fintech watchlist. Verification pending — company documents under review (ETA 2 days).",
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

export const deals: Deal[] = [
  { id: "d1", listingId: "atlas-solar", title: "Atlas Solar 120MW", flag: "🇲🇦", amount: "$90M", stage: "Diligence", owner: "AK", nextStep: "Site visit — Thu", days: 24 },
  { id: "d2", listingId: "kivu-agri", title: "Kivu Agri-Processing", flag: "🇨🇩", amount: "$8M", stage: "NDA", owner: "AK", nextStep: "Countersign NDA", days: 3 },
  { id: "d3", listingId: "mombasa-port", title: "Mombasa Corridor PPP", flag: "🇰🇪", amount: "$240M", stage: "Screening", owner: "JM", nextStep: "Syndicate call", days: 6 },
  { id: "d4", listingId: "lagos-health", title: "MediServe Series B", flag: "🇳🇬", amount: "$25M", stage: "IC Review", owner: "AK", nextStep: "IC memo Fri", days: 41 },
  { id: "d5", listingId: "zambezi-water", title: "Zambezi Water Utility", flag: "🇿🇲", amount: "$45M", stage: "Screening", owner: "SL", nextStep: "Readiness recheck", days: 12 },
  { id: "d6", listingId: "atlas-solar", title: "Atlas Solar — Debt tranche", flag: "🇲🇦", amount: "$60M", stage: "Term Sheet", owner: "JM", nextStep: "Legal review", days: 58 },
];

export type Thread = {
  id: string;
  name: string;
  org: string;
  preview: string;
  time: string;
  unread: number;
  messages: { from: "them" | "me" | "system"; text: string; time: string }[];
};

export const threads: Thread[] = [
  {
    id: "t1",
    name: "Yasmine El Fassi",
    org: "Maghreb Renewables",
    preview: "Site visit confirmed for Thursday 09:00 —",
    time: "2m",
    unread: 2,
    messages: [
      { from: "system", text: "NDA executed by both parties · Data room access granted", time: "Mon" },
      { from: "them", text: "Welcome aboard. The full model and executed PPAs are now visible in folder 2 and 3.", time: "Mon" },
      { from: "me", text: "Thank you — our analyst flagged two questions on the O&M reserve assumptions. Sending via the deal thread.", time: "Tue" },
      { from: "them", text: "Site visit confirmed for Thursday 09:00 — driver will meet your team at Marrakech airport.", time: "2m" },
    ],
  },
  {
    id: "t2",
    name: "Dieudonné Mbala",
    org: "Desco Agri Holdings",
    preview: "Updated valuation memo uploaded as requested",
    time: "1h",
    unread: 0,
    messages: [
      { from: "them", text: "Updated valuation memo uploaded as requested.", time: "1h" },
    ],
  },
  {
    id: "t3",
    name: "Nexus AI Assistant",
    org: "Deal Assistant",
    preview: "Your Thursday brief: 3 new matches, 1 room update…",
    time: "3h",
    unread: 1,
    messages: [
      { from: "them", text: "Your Thursday brief: 3 new matches above 80, MediServe uploaded Q2 financials (revenue +18% vs. plan), and your Atlas diligence checklist is 71% complete.", time: "3h" },
    ],
  },
];

export const fmtUsd = (n: number) =>
  n >= 1_000_000_000
    ? "$" + (n / 1_000_000_000).toFixed(1) + "B"
    : "$" + Math.round(n / 1_000_000) + "M";
