import { createHash } from "node:crypto";

export type PublicationContent = {
  id: string;
  contentVersion: number;
  title: string;
  sector: string;
  country: string;
  stage: string;
  instrument: string;
  summary: string;
  useOfFunds: string | null;
  fundingSecuredUsd: number | null;
  sponsorContributionUsd: number | null;
  estimatedProjectCostUsd: number | null;
  currentCapitalAskUsd: number | null;
  highlights: string;
  relatedParty: boolean;
  relatedPartyType: string | null;
  relatedPartyDisclosure: string;
  governmentBacked: boolean;
  govMechanism: string | null;
  verified: boolean;
};

export function publicationContentHash(listing: PublicationContent): string {
  const canonical = {
    id: listing.id,
    contentVersion: listing.contentVersion,
    title: listing.title,
    sector: listing.sector,
    country: listing.country,
    stage: listing.stage,
    instrument: listing.instrument,
    summary: listing.summary,
    useOfFunds: listing.useOfFunds,
    fundingSecuredUsd: listing.fundingSecuredUsd,
    sponsorContributionUsd: listing.sponsorContributionUsd,
    estimatedProjectCostUsd: listing.estimatedProjectCostUsd,
    currentCapitalAskUsd: listing.currentCapitalAskUsd,
    highlights: listing.highlights,
    relatedParty: listing.relatedParty,
    relatedPartyType: listing.relatedPartyType,
    relatedPartyDisclosure: listing.relatedPartyDisclosure,
    governmentBacked: listing.governmentBacked,
    govMechanism: listing.govMechanism,
    verified: listing.verified,
  };
  return createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
}
