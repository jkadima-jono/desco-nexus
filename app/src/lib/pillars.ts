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
      "We are developing Agridesco around farming cooperatives, processing hubs and market-access infrastructure across Grand Kasaï. Before scaling, we require verified land access, farmer participation, yields, offtake and operating evidence.",
    thesis:
      "Sponsor materials propose a network of smallholder cooperatives, shared mechanisation, storage and crop processing in Grand Kasaï. The public investment case depends on verified land access, farmer participation, yields, operating performance and offtake evidence.",
    marketOpportunity:
      "The sponsor identifies food imports and limited processing capacity as the commercial context. Current, attributable market data and an independently reviewed demand study are required before those claims can support investment decisions.",
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
      { year: "Step 1", label: "Confirm project entity, land access, participating farmers and baseline evidence", done: false },
      { year: "Step 2", label: "Validate pilot scope, demand, offtake, unit economics and safeguards", done: false },
      { year: "Step 3", label: "Define a financeable rollout only after pilot evidence is reviewed", done: false },
    ],
  },
  {
    slug: "investdesco",
    name: "Investdesco",
    shortName: "Strategic Capital",
    tagline: "Capital structuring for proposed infrastructure and operating projects.",
    color: pillarColor("investdesco"),
    summary:
      "We are building Investdesco as our capital and infrastructure platform for ports, industrial parks, energy and mining-development partnerships. We require confirmed project rights, counterparties and financing terms before committing capital.",
    thesis:
      "Investdesco is proposed as DESCO Global’s capital-structuring and infrastructure-development area. Each project requires confirmed rights, counterparties, demand, costs, delivery capacity and transaction authority before investor engagement.",
    marketOpportunity:
      "Desco Global materials describe a proposed $750 million Phase 1 programme across infrastructure and operating projects. The allocation, financing structure, project rights, delivery sequence and independently reviewed financial model are not yet publicly established.",
    geography: ["DR Congo — Kasai River and Lake Mweru corridors", "Pan-African trade links to Zambia and Angola"],
    objectives: [
      "Develop Port de Ndomba and Port de Kasenga as the region's logistics backbone",
      "Serve as Desco Global's dedicated mining-investment pillar",
      "Structure joint ventures and blended-finance partnerships with DFIs",
      "Build industrial parks and distributed renewable energy for the platform",
    ],
    impact: [
      { label: "Phase 1 capital raise target ($M)", value: 750, suffix: "" },
      { label: "Projected jobs by 2035", value: 100000, suffix: "+" },
    ],
    milestones: [
      { year: "Step 1", label: "Confirm project rights, sponsors, counterparties and authority", done: false },
      { year: "Step 2", label: "Validate feasibility, demand, safeguards, costs and delivery sequence", done: false },
      { year: "Step 3", label: "Define project-specific capital structures and approved engagement terms", done: false },
    ],
  },
  {
    slug: "phardesco",
    name: "Phardesco",
    shortName: "Healthcare",
    tagline: "Proposed pharmaceutical, diagnostic and community-health services.",
    color: pillarColor("phardesco"),
    summary:
      "We are developing solar-powered Phardesco Pharmalab Hubs that combine pharmaceutical retail, diagnostics, water access and health education, beginning in Mbuji-Mayi. We require validated licensing, demand, procurement, clinical governance and forecasts before launch.",
    thesis:
      "Sponsor materials propose solar-powered hubs combining pharmaceutical retail, diagnostics, water access and health education. Licensing, demand, clinical governance, procurement, cold-chain capacity and operating forecasts require independent review before launch.",
    marketOpportunity:
      "Sponsor materials cite limited access to pharmacists and quality medicines. The cited ratios, population figures and addressable demand require current, attributable sources before they can support the investment case.",
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
    ],
    milestones: [
      { year: "Step 1", label: "Confirm entity, licensing pathway, clinical governance and site rights", done: false },
      { year: "Step 2", label: "Validate demand, service model, procurement, cold chain and pilot budget", done: false },
      { year: "Step 3", label: "Set a launch timetable only after approvals and financing are confirmed", done: false },
    ],
  },
  {
    slug: "waterdesco",
    name: "Waterdesco",
    shortName: "Water & Sanitation",
    tagline: "Proposed drinking-water and sanitation infrastructure.",
    color: pillarColor("waterdesco"),
    summary:
      "We are developing Waterdesco as a drinking-water and sanitation platform for Grand Kasaï. We will confirm project locations, technical designs, rights, tariffs, funding and delivery plans before selecting the implementation configuration.",
    thesis:
      "Waterdesco is proposed as a drinking-water and sanitation platform for Grand Kasaï. Sponsor materials describe two conflicting network configurations, so the technical scope must be reconciled before costs, beneficiaries or delivery can be relied upon.",
    marketOpportunity:
      "The investment case depends on verified water sources, site demand, affordability, tariff approval, permits, engineering design, operating costs and maintenance capacity. These items are not yet established in the public record.",
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
      { label: "Communities proposed for service", value: 50, suffix: "" },
    ],
    milestones: [
      { year: "Step 1", label: "Reconcile the proposed network configurations and beneficiary assumptions", done: false },
      { year: "Step 2", label: "Complete source-water, site, demand, affordability and permitting studies", done: false },
      { year: "Step 3", label: "Define procurement, financing, operations and maintenance before rollout", done: false },
    ],
  },
];

export function getPillar(slug: string): Pillar | undefined {
  return PILLARS.find((p) => p.slug === slug);
}
