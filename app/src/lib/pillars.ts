import { pillarColor } from "./theme";

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

// Desco Global operates exactly four pillars — sourced verbatim from
// Desco Global's own investor deck ("The Four Pillars" slide) and
// pillar-specific business plans. Impact figures below are the deck's
// own stated KPIs; nothing here is invented. Where the deck states a
// figure as a target/projection rather than an achieved result, this is
// preserved in the copy (e.g. "target," "by 2035").
export const PILLARS: Pillar[] = [
  {
    slug: "agridesco",
    name: "Agridesco",
    shortName: "Agriculture",
    tagline: "Proposed agricultural production, processing and market-access programme.",
    color: pillarColor("agridesco"),
    summary:
      "Sponsor materials propose farming cooperatives, processing hubs and market-access infrastructure across the Grand Kasai region. Land access, farmer participation, yields, offtake and operating evidence remain subject to diligence.",
    thesis:
      "The Grand Kasai region holds over 15 million hectares of arable land and 1,500mm of annual rainfall, yet the DRC spends an estimated $3.0B a year importing food it could grow domestically. Agridesco exists to close that gap by giving smallholders the processing and market-access infrastructure that converts fertile land into investable, exportable surplus.",
    marketOpportunity:
      "A $3.0B annual food-import bill represents immediate import-substitution potential, and the Grand Kasai region's arable land could feed over 90 million people once mechanization, processing, and market access are in place.",
    geography: ["Grand Kasai region, DR Congo — Kasai, Kasai-Central, Kasai-Oriental, Sankuru, Lomami provinces"],
    objectives: [
      "Organize smallholders into outgrower cooperatives for scale",
      "Provide input credit for seeds and fertilizer, recovered at harvest",
      "Deploy shared mechanization to reduce labor intensity",
      "Build post-harvest storage and value-add processing for maize, cassava, and soy",
    ],
    impact: [
      { label: "Farmers to be integrated (target)", value: 50000, suffix: "+" },
      { label: "Hectares to be revitalized (target)", value: 25000, suffix: "" },
      { label: "Villages to be served (target)", value: 40, suffix: "+" },
      { label: "Projected income uplift for smallholders", value: 45, suffix: "%" },
    ],
    milestones: [
      { year: "2026–2027", label: "Agridesco operations launch alongside Port de Ndomba Phase 1", done: false },
      { year: "2028", label: "Kasenga trade link opens regional export routes for agri surplus", done: false },
      { year: "2029", label: "Full portfolio operations", done: false },
    ],
  },
  {
    slug: "investdesco",
    name: "Investdesco",
    shortName: "Strategic Capital",
    tagline: "Capital structuring for proposed infrastructure and operating projects.",
    color: pillarColor("investdesco"),
    summary:
      "Sponsor materials describe Investdesco as the proposed capital and infrastructure arm for ports, industrial parks, energy and mining-development partnerships. Project rights, counterparties and financing terms require confirmation.",
    thesis:
      "Frontier real-asset opportunities in the Grand Kasai region fail to attract capital not for lack of resources, but for lack of structure — unclear logistics, informal production, and absent enabling infrastructure. Investdesco absorbs that structuring risk first: securing access, building the port and logistics backbone, then introducing disciplined capital aligned with long-term value creation.",
    marketOpportunity:
      "Desco Global's Phase 1 program targets a $750M raise (equity + debt) at a 17.2% risk-adjusted target IRR, 6-year payback, and 2.8–3.2x MOIC, anchored by two river-port gateways and a modernized mining-concession partnership.",
    geography: ["DR Congo — Kasai River and Lake Mweru corridors", "Pan-African trade links to Zambia and Angola"],
    objectives: [
      "Develop Port de Ndomba and Port de Kasenga as the region's logistics backbone",
      "Serve as Desco Global's dedicated mining-investment pillar",
      "Structure joint ventures and blended-finance partnerships with DFIs",
      "Build industrial parks and distributed renewable energy for the platform",
    ],
    impact: [
      { label: "Phase 1 capital raise target ($M)", value: 750, suffix: "" },
      { label: "Target Phase 1 program IRR", value: 17, suffix: ".2%" },
      { label: "Target MOIC", value: 3, suffix: ".0x" },
      { label: "Projected jobs by 2035", value: 100000, suffix: "+" },
    ],
    milestones: [
      { year: "2026 (Q2–Q3)", label: "Financial close and Port de Ndomba groundbreaking", done: false },
      { year: "2028 (Q2–Q4)", label: "Kasenga port start", done: false },
      { year: "2029 (Q2)", label: "Full portfolio operations", done: false },
      { year: "2030 (Q4)", label: "Scale and optimization", done: false },
      { year: "2032", label: "Target exit — IPO, strategic sale, or refinancing", done: false },
    ],
  },
  {
    slug: "phardesco",
    name: "Phardesco",
    shortName: "Healthcare",
    tagline: "Proposed pharmaceutical, diagnostic and community-health services.",
    color: pillarColor("phardesco"),
    summary:
      "Sponsor materials propose solar-powered Pharmalab Hubs combining pharmaceutical retail, diagnostics, water access and health education, beginning in Mbuji-Mayi. Licensing, demand, procurement, clinical governance and forecasts remain subject to diligence.",
    thesis:
      "In Kasai, one pharmacist serves more than 50,000 people against a WHO benchmark of 1 per 2,000, and over 80% of the DRC's population lacks regular access to quality medicines. Phardesco closes that gap with an integrated, self-sustaining Pharmalab model rather than a standalone pharmacy chain.",
    marketOpportunity:
      "A market of 100M+ people with chronic pharmaceutical supply gaps, counterfeit-drug risk, and an overburdened public health sector — creating durable demand for a compliant, reliable, last-mile health and medicine network.",
    geography: ["Grand Kasai region, DR Congo — first hub in Mbuji-Mayi", "National expansion planned across all DRC provinces by 2035"],
    objectives: [
      "Launch the first Pharmalab Hub in Mbuji-Mayi",
      "Scale to 10+ Pharmalab Hubs medium-term (3–5 years)",
      "Establish a GMP-compliant local generic-drug production unit",
      "Launch Phardesco Academy to train pharmacists, technicians, and health agents",
    ],
    impact: [
      { label: "Planned hubs by 2035", value: 50, suffix: "+" },
      { label: "Startup raise target ($M)", value: 5, suffix: "–10M" },
      { label: "Year 5 forecast EBITDA ($M)", value: 3, suffix: ".8M" },
    ],
    milestones: [
      { year: "Months 1–2", label: "Legal incorporation and licensing in the DRC", done: false },
      { year: "Months 3–6", label: "Land acquisition in Mbuji-Mayi; construction begins", done: false },
      { year: "Months 7–9", label: "Staff recruitment and health-authority registration", done: false },
      { year: "Months 10–12", label: "Pilot hub launch", done: false },
      { year: "2028 (Q2–Q4)", label: "Healthcare rollout alongside Kasenga port start", done: false },
    ],
  },
  {
    slug: "waterdesco",
    name: "Waterdesco",
    shortName: "Water & Sanitation",
    tagline: "Proposed drinking-water and sanitation infrastructure.",
    color: pillarColor("waterdesco"),
    summary:
      "Sponsor materials propose drinking-water and sanitation infrastructure for the Grand Kasai region. Project locations, technical designs, rights, tariffs, funding and delivery plans are not yet publicly evidenced.",
    thesis:
      "\"Water is the foundation of dignity.\" Every other pillar — agriculture, mining, community health — depends on reliable water access. Waterdesco is the infrastructure investment with the widest multiplier effect across the platform.",
    marketOpportunity:
      "Chronic water and sanitation deficits in the Grand Kasai region drive waterborne disease and constrain industrial and agricultural productivity alike — a foundational infrastructure gap with platform-wide returns.",
    geography: ["Grand Kasai region, DR Congo"],
    objectives: [
      "Expand clean drinking-water networks to underserved regions",
      "Build resilient wastewater and sanitation systems for public health",
      "Promote eco-friendly, climate-resilient water-lifecycle practices",
      "Build local community capacity for long-term system management",
    ],
    impact: [
      { label: "People served (target)", value: 2500000, suffix: "" },
      { label: "Liters delivered daily (target)", value: 45000000, suffix: "" },
      { label: "Sanitation facilities built (target)", value: 150, suffix: "+" },
      { label: "Communities transformed (target)", value: 50, suffix: "" },
    ],
    milestones: [
      { year: "2026–2030", label: "Distributed infrastructure build-out alongside Investdesco's port and industrial program", done: false },
    ],
  },
];

export function getPillar(slug: string): Pillar | undefined {
  return PILLARS.find((p) => p.slug === slug);
}
