import assert from "node:assert/strict";
import test from "node:test";
import { capitalPresentation, isDescoRelatedOpportunity, listings, returnPresentation, sanitizePublicListing } from "../src/lib/data";
import { evidenceDisclosureStatus, getInvestmentEvidence, summarizeEvidence } from "../src/lib/investment-evidence";
import { PUBLIC_OPPORTUNITY_IDS, isPublicOpportunityId } from "../src/lib/public-listings";
import { disclosureStatusCopy, relatedPartyDisclosure } from "../src/lib/translations/investment-ui";
import { getMarketingCopy } from "../src/lib/translations/marketing";

test("evidence coverage includes partially supported fields without calling them verified", () => {
  const solar = listings.find((listing) => listing.id === "kasaji-kisenge-solar-50mw");
  assert.ok(solar);
  const summary = summarizeEvidence(getInvestmentEvidence(solar));

  assert.ok(summary.partial > 0);
  assert.ok(summary.supported > summary.disclosed);
  assert.equal(summary.supported, summary.disclosed + summary.partial);
  assert.equal(summary.risksSupported, summary.risksDisclosed + summary.risksPartial);
});

test("DESCO-sponsored opportunities are identifiable as related-party opportunities", () => {
  const related = listings.find((listing) => listing.id === "port-de-ndomba");
  const thirdParty = listings.find((listing) => listing.id === "energulf-lotshi-block");
  assert.ok(related);
  assert.ok(thirdParty);
  assert.equal(isDescoRelatedOpportunity(related), true);
  assert.equal(isDescoRelatedOpportunity(thirdParty), false);
});

test("related-party and institutional risk disclosures are translated", () => {
  for (const locale of ["en", "fr", "es", "pt", "zh"] as const) {
    assert.ok(relatedPartyDisclosure(locale).length > 40);
    const controls = getMarketingCopy(locale, "trust").controls;
    assert.ok(controls.length >= 7, locale);
  }
});

test("concept programme estimates are not presented as current capital asks", () => {
  const ldc = listings.find((listing) => listing.id === "ldc-integrated-housing-drc");
  assert.ok(ldc);
  assert.equal(ldc.raiseUsd, 0);
  assert.equal(capitalPresentation(ldc).includeInProjectTotal, false);
  assert.match(capitalPresentation(ldc).label, /not publicly disclosed/i);
});

test("the public catalogue is limited to the four reviewed briefings", () => {
  assert.deepEqual([...PUBLIC_OPPORTUNITY_IDS], [
    "kasaji-kisenge-solar-50mw",
    "waterdesco-grand-kasai",
    "ldc-integrated-housing-drc",
    "energulf-lotshi-block",
  ]);
  assert.equal(isPublicOpportunityId("sciress-kolwezi-12423"), false);
  assert.equal(isPublicOpportunityId("port-de-ndomba"), false);
});

test("public presentation never publishes a return projection", () => {
  for (const listing of listings) {
    assert.equal(listing.irr, "No public return projection published", listing.id);
    assert.equal(returnPresentation(listing).value, "No public return projection published");
  }
});

test("public listing payloads replace legacy return and confidential matching data", () => {
  const listing = {
    ...listings[0],
    irr: "Legacy 17.2% target IRR",
    whyMatch: "Private mandate explanation",
    docs: [{ name: "confidential.pdf", size: "1 MB", folder: "Data room" }],
  };
  const publicListing = sanitizePublicListing(listing);
  assert.equal(publicListing.irr, "No public return projection published");
  assert.equal(publicListing.whyMatch, "");
  assert.deepEqual(publicListing.docs, []);
});

test("evidence coverage is presented as a plain status in every language", () => {
  const solar = listings.find((listing) => listing.id === "kasaji-kisenge-solar-50mw");
  assert.ok(solar);
  const status = evidenceDisclosureStatus(summarizeEvidence(getInvestmentEvidence(solar)));
  for (const locale of ["en", "fr", "es", "pt", "zh"] as const) {
    const label = disclosureStatusCopy(locale, status);
    assert.ok(label.length > 3);
    assert.doesNotMatch(label, /\d+\s*\/\s*\d+/);
  }
});
