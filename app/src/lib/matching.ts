// Deterministic, rule-based mandate-vs-listing matching. This is NOT an AI
// model — it is transparent criteria comparison, and is presented to users
// as exactly that. Every claim in a MatchExplanation traces to a specific
// mandate field and a specific listing field; nothing here is fabricated.
//
// Mandate compatibility is limited to disclosed listing facts. The platform
// does not infer readiness, ESG quality, or risk from seed-generated scores.

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
  currentCapitalAskUsd: number | null;
  instrument: string;
  governmentBacked: boolean;
  esgEvidenceAvailable: boolean;
};

export type MatchExplanation = {
  metCriteria: MatchReason[];
  partiallyMetCriteria: MatchReason[];
  unmetCriteria: MatchReason[];
  missingProjectData: MatchReason[];
  hardExclusions: MatchReason[];
  dataSources: MatchSource[];
  dataCompleteness: number; // 0-100 — how many of the mandate's own dimensions are actually set
  confidence: "high" | "medium" | "low" | "excluded";
  calculatedAt: string; // ISO timestamp — this is a point-in-time evaluation, not a live score
};

export type MatchReason = {
  code:
    | "excluded-sector" | "excluded-country"
    | "missing-sector" | "sector-match" | "sector-mismatch"
    | "missing-country" | "country-match" | "country-mismatch"
    | "missing-capital" | "capital-match" | "capital-near" | "capital-mismatch"
    | "missing-instrument" | "instrument-match" | "instrument-mismatch"
    | "esg-disclosed" | "esg-missing"
    | "government-match" | "government-mismatch";
  values?: Record<string, string | number>;
};

export type MatchSource = "mandate" | "sector" | "country" | "capital" | "instrument" | "esg" | "government";

const TICKET_PARTIAL_MARGIN = 0.15; // within 15% of range counts as "partially" met

export function computeMatchExplanation(
  mandate: MandateCriteria,
  listing: MatchableListing
): MatchExplanation {
  const hardExclusions: MatchReason[] = [];
  if (mandate.excludedSectors.includes(listing.sector)) {
    hardExclusions.push({ code: "excluded-sector", values: { sector: listing.sector } });
  }
  if (mandate.excludedCountries.includes(listing.country)) {
    hardExclusions.push({ code: "excluded-country", values: { country: listing.country } });
  }

  const metCriteria: MatchReason[] = [];
  const partiallyMetCriteria: MatchReason[] = [];
  const unmetCriteria: MatchReason[] = [];
  const missingProjectData: MatchReason[] = [];
  const dataSources = new Set<MatchSource>(["mandate"]);
  let dimensionsSet = 0;

  if (mandate.sectors.length > 0) {
    dimensionsSet++;
    if (!listing.sector) {
      missingProjectData.push({ code: "missing-sector" });
    } else if (mandate.sectors.includes(listing.sector)) {
      metCriteria.push({ code: "sector-match", values: { sector: listing.sector } });
      dataSources.add("sector");
    } else {
      unmetCriteria.push({ code: "sector-mismatch", values: { sector: listing.sector, targets: mandate.sectors.join(", ") } });
      dataSources.add("sector");
    }
  }

  if (mandate.countries.length > 0) {
    dimensionsSet++;
    if (!listing.country) {
      missingProjectData.push({ code: "missing-country" });
    } else if (mandate.countries.includes(listing.country)) {
      metCriteria.push({ code: "country-match", values: { country: listing.country } });
      dataSources.add("country");
    } else {
      unmetCriteria.push({ code: "country-mismatch", values: { country: listing.country, targets: mandate.countries.join(", ") } });
      dataSources.add("country");
    }
  }

  if (mandate.ticketMinUsd !== null || mandate.ticketMaxUsd !== null) {
    dimensionsSet++;
    if (!listing.currentCapitalAskUsd) {
      missingProjectData.push({ code: "missing-capital" });
    } else {
      const min = mandate.ticketMinUsd ?? 0;
      const max = mandate.ticketMaxUsd ?? Number.MAX_SAFE_INTEGER;
      const margin = (max === Number.MAX_SAFE_INTEGER ? min : max - min) * TICKET_PARTIAL_MARGIN;
      dataSources.add("capital");
      const capitalM = Math.round(listing.currentCapitalAskUsd / 1e6);
      if (listing.currentCapitalAskUsd >= min && listing.currentCapitalAskUsd <= max) {
        metCriteria.push({ code: "capital-match", values: { capitalM } });
      } else if (listing.currentCapitalAskUsd >= min - margin && listing.currentCapitalAskUsd <= max + margin) {
        partiallyMetCriteria.push({ code: "capital-near", values: { capitalM } });
      } else {
        unmetCriteria.push({ code: "capital-mismatch", values: { capitalM } });
      }
    }
  }

  if (mandate.instruments.length > 0) {
    dimensionsSet++;
    if (!listing.instrument) {
      missingProjectData.push({ code: "missing-instrument" });
    } else {
      dataSources.add("instrument");
      const matched = mandate.instruments.some((i) =>
        listing.instrument.toLowerCase().includes(i.toLowerCase())
      );
      if (matched) {
        metCriteria.push({ code: "instrument-match", values: { instrument: listing.instrument } });
      } else {
        unmetCriteria.push({ code: "instrument-mismatch", values: { instrument: listing.instrument, targets: mandate.instruments.join(", ") } });
      }
    }
  }

  if (mandate.esgRequired) {
    dimensionsSet++;
    if (listing.esgEvidenceAvailable) {
      partiallyMetCriteria.push({ code: "esg-disclosed" });
      dataSources.add("esg");
    } else {
      missingProjectData.push({ code: "esg-missing" });
    }
  }

  if (mandate.govSupportRequired) {
    dimensionsSet++;
    dataSources.add("government");
    if (listing.governmentBacked) {
      metCriteria.push({ code: "government-match" });
    } else {
      unmetCriteria.push({ code: "government-mismatch" });
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
