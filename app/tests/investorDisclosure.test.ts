import assert from "node:assert/strict";
import test from "node:test";
import { isDescoRelatedOpportunity, listings } from "../src/lib/data";
import { getInvestmentEvidence, summarizeEvidence } from "../src/lib/investment-evidence";
import { relatedPartyDisclosure } from "../src/lib/translations/investment-ui";
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
