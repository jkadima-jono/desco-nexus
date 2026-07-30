import test from "node:test";
import assert from "node:assert/strict";
import { publicationContentHash, type PublicationContent } from "../src/lib/publication-content";

const listing: PublicationContent = {
  id: "project",
  contentVersion: 4,
  title: "Project",
  sector: "Water",
  country: "DR Congo",
  stage: "Structuring",
  instrument: "Project finance",
  summary: "Controlled summary",
  useOfFunds: "Construction",
  fundingSecuredUsd: null,
  sponsorContributionUsd: 1_000_000,
  estimatedProjectCostUsd: 20_000_000,
  currentCapitalAskUsd: 12_000_000,
  highlights: "[]",
  relatedParty: true,
  relatedPartyType: "Sponsor",
  relatedPartyDisclosure: "Relationship disclosed",
  governmentBacked: false,
  govMechanism: null,
  verified: false,
  images: [
    {
      id: "image-1",
      storageKey: "https://assets.example/project.jpg",
      caption: "Sponsor-approved project image",
      position: 0,
    },
  ],
};

test("publication hash is stable for identical controlled content", () => {
  assert.equal(publicationContentHash(listing), publicationContentHash({ ...listing }));
});

test("every material public-content change invalidates the publication hash", () => {
  const baseline = publicationContentHash(listing);
  const changes: PublicationContent[] = [
    { ...listing, summary: "Changed summary" },
    { ...listing, currentCapitalAskUsd: 13_000_000 },
    { ...listing, stage: "Diligence" },
    { ...listing, governmentBacked: true, govMechanism: "guarantee" },
    { ...listing, relatedPartyDisclosure: "Changed disclosure" },
    { ...listing, contentVersion: 5 },
    {
      ...listing,
      images: [{ ...listing.images![0], caption: "Changed image caption" }],
    },
    {
      ...listing,
      images: [{ ...listing.images![0], storageKey: "https://assets.example/replacement.jpg" }],
    },
  ];
  for (const changed of changes) assert.notEqual(publicationContentHash(changed), baseline);
});
