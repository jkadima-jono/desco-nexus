// Deterministic, rule-based mandate-vs-listing matching. This is NOT an AI
// model — it is transparent criteria comparison, and is presented to users
// as exactly that. Every claim in a MatchExplanation traces to a specific
// mandate field and a specific listing field; nothing here is fabricated.

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
  unmetCriteria: string[];
  hardExclusions: string[];
  dataCompleteness: number; // 0-100 — how many of the mandate's own dimensions are actually set
  confidence: "high" | "medium" | "low" | "excluded";
  calculatedAt: string; // ISO timestamp — this is a point-in-time evaluation, not a live score
};

const ESG_QUALIFYING_THRESHOLD = 80;

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
  const unmetCriteria: string[] = [];
  let dimensionsSet = 0;

  if (mandate.sectors.length > 0) {
    dimensionsSet++;
    if (mandate.sectors.includes(listing.sector)) {
      metCriteria.push(`Sector "${listing.sector}" is in your target sectors`);
    } else {
      unmetCriteria.push(`Sector "${listing.sector}" is not in your target sectors (${mandate.sectors.join(", ")})`);
    }
  }

  if (mandate.countries.length > 0) {
    dimensionsSet++;
    if (mandate.countries.includes(listing.country)) {
      metCriteria.push(`Country "${listing.country}" is in your target geography`);
    } else {
      unmetCriteria.push(`Country "${listing.country}" is not in your target geography (${mandate.countries.join(", ")})`);
    }
  }

  if (mandate.ticketMinUsd !== null || mandate.ticketMaxUsd !== null) {
    dimensionsSet++;
    const min = mandate.ticketMinUsd ?? 0;
    const max = mandate.ticketMaxUsd ?? Number.MAX_SAFE_INTEGER;
    if (listing.raiseUsd >= min && listing.raiseUsd <= max) {
      metCriteria.push(`Capital sought ($${Math.round(listing.raiseUsd / 1e6)}M) is within your ticket-size range`);
    } else {
      unmetCriteria.push(`Capital sought ($${Math.round(listing.raiseUsd / 1e6)}M) is outside your ticket-size range`);
    }
  }

  if (mandate.instruments.length > 0) {
    dimensionsSet++;
    const matched = mandate.instruments.some((i) =>
      listing.instrument.toLowerCase().includes(i.toLowerCase())
    );
    if (matched) {
      metCriteria.push(`Instrument ("${listing.instrument}") matches one of your preferred instruments`);
    } else {
      unmetCriteria.push(`Instrument ("${listing.instrument}") does not match your preferred instruments (${mandate.instruments.join(", ")})`);
    }
  }

  if (mandate.esgRequired) {
    dimensionsSet++;
    if (listing.scores.esg >= ESG_QUALIFYING_THRESHOLD) {
      metCriteria.push(`ESG score (${listing.scores.esg}) meets your ESG requirement`);
    } else {
      unmetCriteria.push(`ESG score (${listing.scores.esg}) is below the ${ESG_QUALIFYING_THRESHOLD} threshold your mandate requires`);
    }
  }

  if (mandate.govSupportRequired) {
    dimensionsSet++;
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
        : unmetCriteria.length === 0
          ? "high"
          : unmetCriteria.length <= 1
            ? "medium"
            : "low";

  return {
    metCriteria,
    unmetCriteria,
    hardExclusions,
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
