import assert from "node:assert/strict";
import test from "node:test";
import { entityDisclosureCopy } from "../src/lib/translations/entity-disclosure";
import { readinessSummaryCopy } from "../src/lib/translations/investment-ui";

const locales = ["en", "fr", "es", "pt", "zh"] as const;

test("DESCO self-disclosure exposes the same corporate fields in every language", () => {
  for (const locale of locales) {
    const copy = entityDisclosureCopy(locale);
    assert.equal(copy.fields.length, 6, `${locale}: corporate disclosure fields`);
    assert.equal(copy.record.length, 5, `${locale}: public operating record`);
    assert.ok(copy.fields.every((field) => field.label.trim() && field.value.trim()), `${locale}: complete field labels and values`);
    assert.ok(copy.record.every((item) => item.trim()), `${locale}: complete operating record`);
  }

  const english = entityDisclosureCopy("en");
  assert.ok(english.fields.every((field) => field.value === "Not publicly disclosed"));
  assert.match(english.note, /not a company-registry search or independent verification/i);
});

test("catalogue readiness summary displays ready and preparation counts in every language", () => {
  for (const locale of locales) {
    const summary = readinessSummaryCopy(locale, 0, 2);
    assert.match(summary, /0/, `${locale}: ready count`);
    assert.match(summary, /2/, `${locale}: preparation count`);
  }
});
