import assert from "node:assert/strict";
import test from "node:test";
import { sponsorReadinessCopy } from "../src/lib/translations/sponsor-readiness";

const locales = ["en", "fr", "es", "pt", "zh"] as const;

test("sponsor readiness explains every required preparation area in every language", () => {
  for (const locale of locales) {
    const copy = sponsorReadinessCopy(locale);
    assert.equal(copy.areas.length, 10, `${locale}: readiness areas`);
    assert.ok(copy.areas.every((item) => item.title.trim() && item.body.trim()), `${locale}: readiness explanations`);
    assert.equal(copy.engagement.length, 3, `${locale}: engagement expectations`);
    assert.ok(copy.engagement.every((item) => item.title.trim() && item.body.trim()), `${locale}: engagement explanations`);
    assert.ok(copy.standardCta.trim(), `${locale}: standard CTA`);
    assert.ok(copy.modelCta.trim(), `${locale}: model CTA`);
    assert.ok(copy.emailCta.trim(), `${locale}: email CTA`);
  }
});

test("sponsor copy states the measurable Compass publication threshold", () => {
  const english = sponsorReadinessCopy("en");
  assert.match(english.standardBody, /7 of 9 public fields/);
  assert.match(english.standardBody, /4 of 5 risk categories/);
  assert.match(english.standardBody, /18 months/);
  assert.match(english.engagementBody, /confirmed in writing/);
});
