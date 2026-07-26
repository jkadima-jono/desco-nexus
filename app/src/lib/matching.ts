// Deterministic, rule-based mandate-vs-listing matching. This is NOT an AI
// model — it is transparent criteria comparison, and is presented to users
// as exactly that. Every claim in a MatchExplanation traces to a specific
// mandate field and a specific listing field; nothing here is fabricated.
//
// Mandate compatibility (this file) is kept deliberately separate from
// investment readiness (Listing.readiness), verification (Listing.verified
// + TrustBadges), ESG assessment (Listing.scores.esg), and risk assessment
// (Listing.scores.risk) — those are independent dimensions rendered by
// separate UI blocks, never folded into one combined score.

export type MandateCriteria = {
  sectors: string[];
  countries: string[];
  ticketMinUsd: number | null;
  ticketMaxUsd: number | null;
  instruments: string[];
  esgRequired: boolean;
  govSupportRequired: boolean;
  excludedSectors: string[];
  excludedCountries: string[];
};

export type MatchableListing = {
  sector: string;
  country: string;
  raiseUsd: number;
  instrument: string;
  governmentBacked: boolean;
  scores: { esg: number };
};

export type MatchExplanation = {
  metCriteria: string[];
  partiallyMetCriteria: string[];
  unmetCriteria: string[];
  missingProjectData: string[];
  hardExclusions: string[];
  dataSources: string[];
  dataCompleteness: number; // 0-100 — how many of the mandate's own dimensions are actually set
  confidence: "high" | "medium" | "low" | "excluded";
  calculatedAt: string; // ISO timestamp — this is a point-in-time evaluation, not a live score
};

const ESG_QUALIFYING_THRESHOLD = 80;
const ESG_PARTIAL_MARGIN = 10; // within 10 points of threshold counts as "partially" met
const TICKET_PARTIAL_MARGIN = 0.15; // within 15% of range counts as "partially" met

export function computeMatchExplanation(
  mandate: MandateCriteria,
  listing: MatchableListing
): MatchExplanation {
  const hardExclusions: string[] = [];
  if (mandate.excludedSectors.includes(listing.sector)) {
    hardExclusions.push(`Sector "${listing.sector}" is on your excluded-sectors list`);
  }
  if (mandate.excludedCountries.includes(listing.country)) {
    hardExclusions.push(`Country "${listing.country}" is on your excluded-jurisdictions list`);
  }

  const metCriteria: string[] = [];
  const partiallyMetCriteria: string[] = [];
  const unmetCriteria: string[] = [];
  const missingProjectData: string[] = [];
  const dataSources = new Set<string>(["Your saved mandate (self-reported)"]);
  let dimensionsSet = 0;

  if (mandate.sectors.length > 0) {
    dimensionsSet++;
    if (!listing.sector) {
      missingProjectData.push("Listing has no sector recorded to compare against your target sectors");
    } else if (mandate.sectors.includes(listing.sector)) {
      metCriteria.push(`Sector "${listing.sector}" is in your target sectors`);
      dataSources.add("Listing sector (sponsor-provided)");
    } else {
      unmetCriteria.push(`Sector "${listing.sector}" is not in your target sectors (${mandate.sectors.join(", ")})`);
      dataSources.add("Listing sector (sponsor-provided)");
    }
  }

  if (mandate.countries.length > 0) {
    dimensionsSet++;
    if (!listing.country) {
      missingProjectData.push("Listing has no country recorded to compare against your target geography");
    } else if (mandate.countries.includes(listing.country)) {
      metCriteria.push(`Country "${listing.country}" is in your target geography`);
      dataSources.add("Listing country (sponsor-provided)");
    } else {
      unmetCriteria.push(`Country "${listing.country}" is not in your target geography (${mandate.countries.join(", ")})`);
      dataSources.add("Listing country (sponsor-provided)");
    }
  }

  if (mandate.ticketMinUsd !== null || mandate.ticketMaxUsd !== null) {
    dimensionsSet++;
    if (!listing.raiseUsd) {
      missingProjectData.push("Listing has no capital-sought figure recorded to compare against your ticket-size range");
    } else {
      const min = mandate.ticketMinUsd ?? 0;
      const max = mandate.ticketMaxUsd ?? Number.MAX_SAFE_INTEGER;
      const margin = (max === Number.MAX_SAFE_INTEGER ? min : max - min) * TICKET_PARTIAL_MARGIN;
      dataSources.add("Listing capital sought (sponsor-provided)");
      if (listing.raiseUsd >= min && listing.raiseUsd <= max) {
        metCriteria.push(`Capital sought ($${Math.round(listing.raiseUsd / 1e6)}M) is within your ticket-size range`);
      } else if (listing.raiseUsd >= min - margin && listing.raiseUsd <= max + margin) {
        partiallyMetCriteria.push(`Capital sought ($${Math.round(listing.raiseUsd / 1e6)}M) is just outside your ticket-size range, within 15%`);
      } else {
        unmetCriteria.push(`Capital sought ($${Math.round(listing.raiseUsd / 1e6)}M) is outside your ticket-size range`);
      }
    }
  }

  if (mandate.instruments.length > 0) {
    dimensionsSet++;
    if (!listing.instrument) {
      missingProjectData.push("Listing has no instrument recorded to compare against your preferred instruments");
    } else {
      dataSources.add("Listing instrument (sponsor-provided)");
      const matched = mandate.instruments.some((i) =>
        listing.instrument.toLowerCase().includes(i.toLowerCase())
      );
      if (matched) {
        metCriteria.push(`Instrument ("${listing.instrument}") matches one of your preferred instruments`);
      } else {
        unmetCriteria.push(`Instrument ("${listing.instrument}") does not match your preferred instruments (${mandate.instruments.join(", ")})`);
      }
    }
  }

  if (mandate.esgRequired) {
    dimensionsSet++;
    dataSources.add("Listing ESG score (platform-illustrative, see ESG disclosure)");
    if (listing.scores.esg >= ESG_QUALIFYING_THRESHOLD) {
      metCriteria.push(`ESG score (${listing.scores.esg}) meets your ESG requirement`);
    } else if (listing.scores.esg >= ESG_QUALIFYING_THRESHOLD - ESG_PARTIAL_MARGIN) {
      partiallyMetCriteria.push(`ESG score (${listing.scores.esg}) is close to, but below, the ${ESG_QUALIFYING_THRESHOLD} threshold your mandate requires`);
    } else {
      unmetCriteria.push(`ESG score (${listing.scores.esg}) is below the ${ESG_QUALIFYING_THRESHOLD} threshold your mandate requires`);
    }
  }

  if (mandate.govSupportRequired) {
    dimensionsSet++;
    dataSources.add("Listing government-backing disclosure (sponsor-provided)");
    if (listing.governmentBacked) {
      metCriteria.push("Has disclosed government backing, as your mandate requires");
    } else {
      unmetCriteria.push("No disclosed government backing, which your mandate requires");
    }
  }

  const dataCompleteness = dimensionsSet === 0 ? 0 : Math.round((dimensionsSet / 6) * 100);
  const confidence: MatchExplanation["confidence"] =
    hardExclusions.length > 0
      ? "excluded"
      : dimensionsSet === 0
        ? "low"
        : unmetCriteria.length === 0 && partiallyMetCriteria.length === 0
          ? "high"
          : unmetCriteria.length === 0 && partiallyMetCriteria.length <= 1
            ? "medium"
            : unmetCriteria.length <= 1
              ? "medium"
              : "low";

  return {
    metCriteria,
    partiallyMetCriteria,
    unmetCriteria,
    missingProjectData,
    hardExclusions,
    dataSources: [...dataSources],
    dataCompleteness,
    confidence,
    calculatedAt: new Date().toISOString(),
  };
}

export function parseJsonArray(raw: string): string[] {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
