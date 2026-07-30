export type RelatedPartyMetadata = {
  relatedParty: boolean;
  relatedPartyType: string | null;
  relatedPartyDisclosure: string;
};

const DESCO_SPONSORED = new Set([
  "port-de-ndomba",
  "port-de-kasenga",
  "comicordia-agri",
  "manioc-plant",
  "phardesco-mbuji-mayi",
  "waterdesco-grand-kasai",
]);

const DESCO_MANDATE_OR_ADVISORY = new Set([
  "comicordia-mining",
  "tilu-pepm-8252",
  "sciress-kolwezi-12423",
  "energulf-lotshi-block",
]);

export function relatedPartyMetadata(listingId: string): RelatedPartyMetadata {
  if (DESCO_SPONSORED.has(listingId)) {
    return {
      relatedParty: true,
      relatedPartyType: "DESCO sponsor or development platform",
      relatedPartyDisclosure:
        "DESCO is connected to the sponsor or development platform for this opportunity. DESCO review is an internal completeness review and is not independent verification.",
    };
  }
  if (DESCO_MANDATE_OR_ADVISORY.has(listingId)) {
    return {
      relatedParty: true,
      relatedPartyType: "DESCO mandate, facilitation or advisory relationship",
      relatedPartyDisclosure:
        "Available source material records a DESCO mandate, facilitation or advisory relationship. The exact current scope, authority and compensation require contract-level confirmation.",
    };
  }
  return {
    relatedParty: false,
    relatedPartyType: null,
    relatedPartyDisclosure:
      "No DESCO ownership, control, mandate, facilitation or advisory relationship is recorded in the current project source manifest. This status requires review before publication.",
  };
}
