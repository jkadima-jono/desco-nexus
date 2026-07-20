import { DESCO_COLORS } from "./theme";

export type Milestone = { year: string; label: string; done: boolean };
export type ImpactStat = { label: string; value: number; suffix: string };

export type Pillar = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  color: string;
  summary: string;
  thesis: string;
  marketOpportunity: string;
  geography: string[];
  objectives: string[];
  impact: ImpactStat[];
  milestones: Milestone[];
};

export const PILLARS: Pillar[] = [
  {
    slug: "mining",
    name: "Strategic Minerals",
    shortName: "Mining",
    tagline: "Formalizing frontier extraction into export-ready operations.",
    color: DESCO_COLORS.brandred,
    summary:
      "We bring structure and governance to undercapitalized mining concessions and artisanal operations, converting informal activity into transparent, exportable production.",
    thesis:
      "Frontier mineral assets fail to attract capital not because of geology, but because of missing structure: unclear title, informal labor, and absent chain-of-custody. We de-risk by securing lawful access first, then layering governance and capital in that order — never the reverse.",
    marketOpportunity:
      "Global demand for battery and industrial minerals continues to outpace formalized African supply. Concessions with clear governance and export compliance command a structural premium over informal production.",
    geography: ["DR Congo — Kasaï & Katanga corridors", "Southern Africa expansion pipeline"],
    objectives: [
      "Secure lawful concession access with community consent",
      "Formalize artisanal supply chains to export standard",
      "Build logistics and processing infrastructure on-site",
      "Introduce disciplined long-term capital partners",
    ],
    impact: [
      { label: "Concessions under formalization", value: 4, suffix: "" },
      { label: "Artisanal miners in formal supply chains", value: 1200, suffix: "+" },
      { label: "Years operating on the ground", value: 10, suffix: "+" },
    ],
    milestones: [
      { year: "2016", label: "First concession access secured", done: true },
      { year: "2019", label: "Community consent framework established", done: true },
      { year: "2023", label: "Export-compliance formalization program launched", done: true },
      { year: "2026", label: "Strategic capital partner onboarding", done: false },
    ],
  },
  {
    slug: "investdesco",
    name: "InvestDesco",
    shortName: "Strategic Capital",
    tagline: "Structuring capital partnerships aligned with real assets.",
    color: DESCO_COLORS.gold,
    summary:
      "InvestDesco structures capital partnerships, joint ventures, and long-term investment vehicles that connect disciplined investors to development-stage real assets across our platform.",
    thesis:
      "Capital seeking African real-asset exposure needs a structured entry point with governance already in place. InvestDesco is that entry point — we absorb the on-the-ground structuring risk before capital arrives, not after.",
    marketOpportunity:
      "Institutional appetite for real-asset and blended-finance exposure in frontier markets is growing faster than the pipeline of investable, de-risked opportunities.",
    geography: ["DR Congo", "Pan-African growth corridors", "Global capital partners"],
    objectives: [
      "Structure joint ventures across all operating pillars",
      "Align investor mandates with measurable development impact",
      "Maintain transparent reporting and governance standards",
      "Build a repeatable structuring playbook across sectors",
    ],
    impact: [
      { label: "Sectors under active structuring", value: 6, suffix: "" },
      { label: "Years of on-the-ground relationships", value: 10, suffix: "+" },
      { label: "Countries in near-term pipeline", value: 3, suffix: "" },
    ],
    milestones: [
      { year: "2018", label: "First joint venture structured", done: true },
      { year: "2022", label: "Institutional investment framework formalized", done: true },
      { year: "2026", label: "Grand Kasaï Investment Expedition", done: false },
    ],
  },
  {
    slug: "agridesco",
    name: "AgriDesco",
    shortName: "Agriculture",
    tagline: "Connecting productive land to markets and food security.",
    color: DESCO_COLORS.emerald,
    summary:
      "AgriDesco supports modern agricultural production and agribusiness platforms that connect farmers to markets, focused on productivity, infrastructure, and sustainable land use.",
    thesis:
      "Agricultural value in the region is constrained by market access and post-harvest infrastructure, not by land or labor. Solve logistics and aggregation, and productive capacity converts directly into investable output.",
    marketOpportunity:
      "Regional food security mandates and rising urban demand create durable off-take for formalized agri-processing capacity.",
    geography: ["DR Congo — Kivu & Kasaï regions"],
    objectives: [
      "Modernize production on partner farms",
      "Build aggregation and processing infrastructure",
      "Connect smallholder supply chains to formal markets",
      "Advance sustainable land-use practices",
    ],
    impact: [
      { label: "Smallholder farmers in supply chain", value: 4200, suffix: "+" },
      { label: "Regional distributor partnerships", value: 3, suffix: "" },
    ],
    milestones: [
      { year: "2020", label: "First processing facility established", done: true },
      { year: "2024", label: "Capacity expansion program launched", done: true },
      { year: "2026", label: "Regional market integration", done: false },
    ],
  },
  {
    slug: "phardesco",
    name: "PharDesco",
    shortName: "Healthcare",
    tagline: "Delivering essential pharmaceutical access at scale.",
    color: DESCO_COLORS.blue,
    summary:
      "PharDesco delivers essential pharmaceutical solutions to improve community health outcomes, building structured, compliant, and scalable distribution platforms.",
    thesis:
      "Healthcare access gaps in frontier markets are a distribution and compliance problem as much as a supply problem. Structured, compliant platforms unlock both public-health impact and durable commercial margin.",
    marketOpportunity:
      "Underserved regional healthcare markets reward operators who can guarantee compliant, reliable last-mile distribution.",
    geography: ["DR Congo", "Regional distribution network"],
    objectives: [
      "Build compliant pharmaceutical distribution infrastructure",
      "Expand equitable access to essential medicines",
      "Establish quality and regulatory standards",
      "Scale through partnership with regional providers",
    ],
    impact: [
      { label: "Communities served", value: 18, suffix: "+" },
      { label: "Distribution compliance standard", value: 100, suffix: "%" },
    ],
    milestones: [
      { year: "2021", label: "Distribution platform established", done: true },
      { year: "2025", label: "Regional compliance certification", done: true },
      { year: "2026", label: "Network expansion", done: false },
    ],
  },
  {
    slug: "waterdesco",
    name: "WaterDesco",
    shortName: "Water & Sanitation",
    tagline: "Water security as the foundation for growth, not an add-on.",
    color: DESCO_COLORS.deepblue,
    summary:
      "WaterDesco develops clean water solutions and sanitation infrastructure supporting communities and industrial operations — because water security is foundational, not incidental.",
    thesis:
      "Every other pillar depends on reliable water access — mining, agriculture, and community development all stall without it. WaterDesco is infrastructure investment with the widest multiplier effect on the platform.",
    marketOpportunity:
      "Blended finance for water infrastructure in underserved regions attracts DFI first-loss capital, de-risking commercial co-investment.",
    geography: ["DR Congo", "Southern Africa"],
    objectives: [
      "Develop municipal and industrial water treatment capacity",
      "Build sanitation infrastructure for underserved communities",
      "Support blended-finance structures with DFI partners",
      "Ensure tariff frameworks sustain long-term operations",
    ],
    impact: [
      { label: "Residents served (est.)", value: 800000, suffix: "" },
      { label: "DFI first-loss commitments", value: 1, suffix: "" },
    ],
    milestones: [
      { year: "2023", label: "Feasibility and tariff framework ratified", done: true },
      { year: "2025", label: "DFI first-loss tranche committed", done: true },
      { year: "2026", label: "Construction phase", done: false },
    ],
  },
  {
    slug: "infrastructure",
    name: "Infrastructure",
    shortName: "Infrastructure",
    tagline: "Enabling systems that reduce risk and unlock scale.",
    color: DESCO_COLORS.charcoal,
    summary:
      "We invest in enabling infrastructure — logistics, energy, water systems, and operational platforms — that reduces execution risk and unlocks scale across every pillar.",
    thesis:
      "Real-asset development in frontier markets fails without enabling infrastructure in place first. We treat infrastructure as prerequisite capital, not a downstream line item.",
    marketOpportunity:
      "Infrastructure gaps are the binding constraint on frontier-market capital deployment; closing them unlocks value across every adjacent sector.",
    geography: ["DR Congo — national corridors", "Regional cross-border links"],
    objectives: [
      "Build logistics corridors connecting production to export",
      "Expand reliable energy access for operations",
      "Develop operational platforms shared across pillars",
      "Reduce structural risk for downstream capital",
    ],
    impact: [
      { label: "Active infrastructure programs", value: 5, suffix: "" },
      { label: "Corridors under development", value: 2, suffix: "" },
    ],
    milestones: [
      { year: "2019", label: "First logistics corridor initiated", done: true },
      { year: "2024", label: "Energy access program launched", done: true },
      { year: "2026", label: "Cross-border corridor expansion", done: false },
    ],
  },
  {
    slug: "ports-logistics",
    name: "Strategic Ports & Logistics",
    shortName: "Ports & Logistics",
    tagline: "The corridors that turn assets into export revenue.",
    color: DESCO_COLORS.wgray,
    summary:
      "We develop strategic logistics assets — depots, corridors, and port-linked infrastructure — that convert landlocked production into exportable, bankable revenue.",
    thesis:
      "An asset that cannot reach export markets efficiently is not fully investable. Logistics is the conversion layer between resource and revenue, and it is where frontier deals most often fail.",
    marketOpportunity:
      "Regional trade corridors with sovereign support and DFI co-investment interest represent some of the highest-multiplier infrastructure investments available.",
    geography: ["DR Congo corridors", "Regional port access via East and Southern Africa"],
    objectives: [
      "Secure and develop corridor concessions",
      "Build inland depot and handling capacity",
      "Partner with DFIs on co-investment structures",
      "Align with sovereign trade-facilitation priorities",
    ],
    impact: [
      { label: "Corridor concessions in pipeline", value: 1, suffix: "" },
      { label: "Estimated annual traffic growth", value: 8, suffix: "%" },
    ],
    milestones: [
      { year: "2024", label: "Feasibility study completed", done: true },
      { year: "2025", label: "Sovereign support package approved", done: true },
      { year: "2026", label: "DFI co-investment discussions", done: false },
    ],
  },
  {
    slug: "community-development",
    name: "Community Development",
    shortName: "Community",
    tagline: "Consent and shared value are structural, not optional.",
    color: DESCO_COLORS.orange,
    summary:
      "Every asset we develop is built on documented community consent and shared value — the foundation that reduces political risk and sustains long-term operations.",
    thesis:
      "Frontier assets built without community alignment are structurally fragile, regardless of capital behind them. We treat community consent as a governance input, not a communications exercise.",
    marketOpportunity:
      "Investors increasingly price community risk explicitly; documented consent frameworks convert a soft-diligence question into hard evidence.",
    geography: ["All operating regions"],
    objectives: [
      "Formalize community consent processes on every asset",
      "Deliver shared-value programs alongside development",
      "Maintain transparent grievance and accountability channels",
      "Report community outcomes alongside financial outcomes",
    ],
    impact: [
      { label: "Communities engaged", value: 22, suffix: "+" },
      { label: "Formal consent frameworks in place", value: 100, suffix: "%" },
    ],
    milestones: [
      { year: "2017", label: "Community consent framework designed", done: true },
      { year: "2021", label: "Grievance mechanism formalized", done: true },
      { year: "2026", label: "Shared-value reporting standard", done: false },
    ],
  },
  {
    slug: "esg-sustainability",
    name: "ESG & Sustainability",
    shortName: "ESG",
    tagline: "Measurable impact, transparent governance, long-term view.",
    color: DESCO_COLORS.emerald,
    summary:
      "ESG is embedded across every pillar — from environmental stewardship in resource extraction to governance frameworks that satisfy institutional and DFI due diligence.",
    thesis:
      "In frontier markets, ESG is not a reporting layer added after the fact — it is the governance infrastructure that makes an asset investable to institutional and DFI capital in the first place.",
    marketOpportunity:
      "Blended finance and DFI capital pools are expanding fastest where verifiable ESG governance already exists — rewarding platforms that build it in from the start.",
    geography: ["All operating regions"],
    objectives: [
      "Maintain environmental standards across extraction and infrastructure",
      "Uphold governance frameworks meeting institutional due diligence",
      "Track and report measurable social and environmental impact",
      "Align with DFI and blended-finance ESG requirements",
    ],
    impact: [
      { label: "Pillars with active ESG frameworks", value: 9, suffix: "" },
      { label: "Independent due-diligence engagements", value: 6, suffix: "+" },
    ],
    milestones: [
      { year: "2019", label: "Governance framework established", done: true },
      { year: "2023", label: "First DFI due-diligence engagement", done: true },
      { year: "2026", label: "Platform-wide impact reporting", done: false },
    ],
  },
];

export function getPillar(slug: string): Pillar | undefined {
  return PILLARS.find((p) => p.slug === slug);
}
