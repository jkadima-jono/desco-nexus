import assert from "node:assert/strict";
import test from "node:test";
import { LOCALES } from "../src/lib/i18n";
import { resourceCopy } from "../src/lib/translations/resources";

test("screening resources are complete in every supported language", () => {
  for (const locale of LOCALES) {
    const copy = resourceCopy(locale);
    assert.equal(copy.investorItems.length, 6, `${locale} investor checklist`);
    assert.equal(copy.sponsorItems.length, 6, `${locale} sponsor checklist`);
    assert.equal(copy.publicItems.length, 6, `${locale} public checklist`);
    assert.equal(copy.controlledItems.length, 6, `${locale} controlled checklist`);
    assert.ok(copy.metadataTitle.includes("DESCO Compass"), `${locale} metadata brand`);
  }
});
test("translated resource checklists do not inherit the English list", () => {
  const english = resourceCopy("en");
  for (const locale of LOCALES.filter((item) => item !== "en")) {
    const copy = resourceCopy(locale);
    assert.notDeepEqual(copy.investorItems, english.investorItems, `${locale} investor checklist`);
    assert.notDeepEqual(copy.sponsorItems, english.sponsorItems, `${locale} sponsor checklist`);
    assert.notDeepEqual(copy.publicItems, english.publicItems, `${locale} public checklist`);
    assert.notDeepEqual(copy.controlledItems, english.controlledItems, `${locale} controlled checklist`);
  }
});
