import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { capitalPresentation, controlledCapitalFields, isDescoRelatedOpportunity, listings, materialFactPresentation, returnPresentation, sanitizePublicListing } from "../src/lib/data";
import { exampleProjectImages } from "../src/lib/example-project-images";
import { evidenceDisclosureStatus, getInvestmentEvidence, sourceDatePresentation, summarizeEvidence } from "../src/lib/investment-evidence";
import { PUBLIC_OPPORTUNITY_IDS, isPublicOpportunityId } from "../src/lib/public-listings";
import { disclosureStatusCopy, materialFactCopy, relatedPartyDisclosure } from "../src/lib/translations/investment-ui";
import { localizeInvestmentEvidence } from "../src/lib/translations/listing-content";
import { getMarketingCopy } from "../src/lib/translations/marketing";
import { getPillarsLegal } from "../src/lib/translations/pillars-legal";

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

test("the public investor preview and conflict policy are complete in every language", () => {
  for (const locale of ["en", "fr", "es", "pt", "zh"] as const) {
    const preview = getMarketingCopy(locale, "investors").previewCopy;
    assert.ok(preview.title.length > 4, locale);
    assert.equal(typeof preview.resultOne, "string", locale);
    assert.equal(typeof preview.resultMany, "string", locale);
    assert.ok(preview.resultMany.replace("{count}", "2").includes("2"), locale);
    assert.doesNotThrow(() => JSON.stringify(preview), locale);
    assert.ok(preview.capitalNote.length > 40, locale);
    const legalSections = getPillarsLegal(locale).legal.sections;
    assert.ok(legalSections.length >= 10, locale);
    assert.ok(legalSections.some(([title]) => /related|liée|vinculad|relacionad|关联/.test(title.toLowerCase())), `${locale} related-party policy`);
  }
});

test("concept programme estimates are not presented as current capital asks", () => {
  const ldc = listings.find((listing) => listing.id === "ldc-integrated-housing-drc");
  assert.ok(ldc);
  assert.equal(ldc.raiseUsd, 0);
  assert.equal(capitalPresentation(ldc).includeInProjectTotal, false);
  assert.match(capitalPresentation(ldc).label, /not publicly disclosed/i);
});

test("the strongest known material fact leads without implying it is the current ask", () => {
  const solar = listings.find((listing) => listing.id === "kasaji-kisenge-solar-50mw");
  const ldc = listings.find((listing) => listing.id === "ldc-integrated-housing-drc");
  assert.ok(solar);
  assert.ok(ldc);

  const solarFact = materialFactPresentation(solar, "2026-04-18");
  assert.equal(solarFact.kind, "estimated_cost");
  assert.equal(solarFact.value, "$86M");
  assert.equal(solarFact.sourceDate, "Apr 2026");

  const ldcFact = materialFactPresentation(ldc, "2025-11");
  assert.equal(ldcFact.kind, "estimated_cost");
  assert.equal(ldcFact.value, "$14.6B");
  assert.equal(ldcFact.sourceDate, "Nov 2025");

  assert.equal(
    materialFactPresentation(solar, "Plans dated 31 August 2023; folder reviewed 29 July 2026").sourceDate,
    "August 2023",
  );
  assert.equal(
    materialFactPresentation(ldc, "Documents undated; folder reviewed 29 July 2026").sourceDate,
    null,
  );
  assert.equal(
    materialFactPresentation(solar, "2026 decks; retrieved from folder on 29 July 2026").sourceDate,
    "2026",
  );
});

test("controlled project costs remain available before database catalogue synchronization", () => {
  assert.deepEqual(
    controlledCapitalFields("kasaji-kisenge-solar-50mw", {
      estimatedProjectCostUsd: null,
      currentCapitalAskUsd: null,
    }),
    { estimatedProjectCostUsd: 86_215_774, currentCapitalAskUsd: null },
  );
});

test("material-fact source months are localized without inventing dates", () => {
  assert.match(materialFactCopy("fr", "estimated_cost", "August 2023").label, /août 2023/);
  assert.doesNotMatch(materialFactCopy("fr", "estimated_cost", null).label, /2026/);
  assert.match(materialFactCopy("zh", "estimated_cost", "August 2023").label, /2023年8月/);
});

test("material fact presentation falls back to physical scale, then a muted disclosure", () => {
  const base = listings[0];
  assert.ok(base);
  const scaleFact = materialFactPresentation({
    ...base,
    currentCapitalAskUsd: null,
    estimatedProjectCostUsd: null,
    highlights: ["50 MW planned generation capacity"],
  });
  assert.equal(scaleFact.kind, "physical_scale");
  assert.equal(scaleFact.value, "50 MW planned generation capacity");

  const missingFact = materialFactPresentation({
    ...base,
    currentCapitalAskUsd: null,
    estimatedProjectCostUsd: null,
    highlights: ["Sponsor materials under review"],
  });
  assert.equal(missingFact.kind, "not_disclosed");
  assert.equal(missingFact.value, "Capital ask not disclosed");
});

test("source dates use the document date and calculate age at render time", () => {
  const now = new Date("2026-08-02T00:00:00Z");
  const dated = sourceDatePresentation(
    "Plans dated 31 August 2023; folder reviewed 29 July 2026",
    now,
  );
  assert.equal(dated.label, "Aug 2023");
  assert.equal(dated.ageMonths, 36);

  const transaction = sourceDatePresentation(
    "References activity from 1972 to a conditional 2024 transaction; folder reviewed 29 July 2026",
    now,
  );
  assert.equal(transaction.label, "2024");
  assert.equal(transaction.ageMonths, null);

  const undated = sourceDatePresentation(
    "Documents undated; folder reviewed 29 July 2026",
    now,
  );
  assert.equal(undated.date, null);
  assert.equal(undated.ageMonths, null);
});

test("the public catalogue excludes projects with unresolved scope conflicts", () => {
  assert.deepEqual([...PUBLIC_OPPORTUNITY_IDS], [
    "kasaji-kisenge-solar-50mw",
    "energulf-lotshi-block",
    "ldc-integrated-housing-drc",
  ]);
  assert.equal(isPublicOpportunityId("sciress-kolwezi-12423"), false);
  assert.equal(isPublicOpportunityId("port-de-ndomba"), false);
  assert.equal(isPublicOpportunityId("waterdesco-grand-kasai"), false);
});

test("every public opportunity has a controlled people-free project visual", () => {
  for (const listingId of PUBLIC_OPPORTUNITY_IDS) {
    const images = exampleProjectImages(listingId);
    assert.ok(images.length > 0, listingId);
    assert.ok(existsSync(join(process.cwd(), "public", images[0].url)), images[0].url);
    assert.match(images[0].caption, /(unconfirmed|pending|not evidence)/i, listingId);
  }
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

test("missing disclosure field names are localized in every supported language", () => {
  const solar = listings.find((listing) => listing.id === "kasaji-kisenge-solar-50mw");
  assert.ok(solar);
  for (const locale of ["fr", "es", "pt", "zh"] as const) {
    const localized = localizeInvestmentEvidence(getInvestmentEvidence(solar), locale);
    const missing = localized.fields.filter((field) => field.status === "not-disclosed");
    assert.ok(missing.length > 0);
    assert.equal(missing.some((field) => field.label === "Funding already secured"), false, locale);
    assert.equal(missing.some((field) => field.label === "Ownership and development rights"), false, locale);
  }
});
