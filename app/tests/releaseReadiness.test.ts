import assert from "node:assert/strict";
import test from "node:test";
import { accountCopy } from "../src/lib/translations/account";
import { releaseReadinessCopy } from "../src/lib/translations/release-readiness";

const locales = ["en", "fr", "es", "pt", "zh"] as const;

test("release-critical conflicts and contact boundaries are translated", () => {
  for (const locale of locales) {
    const copy = releaseReadinessCopy(locale);
    assert.ok(copy.relatedTitle.trim(), `${locale}: related-party title`);
    assert.ok(copy.relatedBody.trim(), `${locale}: related-party explanation`);
    assert.ok(copy.advancedFilters.trim(), `${locale}: advanced filters`);
    assert.ok(copy.contactProcess.trim(), `${locale}: contact process`);
  }
});

test("unavailable account copy covers sign-in and registration in every language", () => {
  for (const locale of locales) {
    const copy = accountCopy(locale);
    assert.ok(copy.unavailableTitle.trim(), `${locale}: title`);
    assert.ok(copy.unavailableBody.trim(), `${locale}: body`);
    assert.ok(!/creation is not available/i.test(copy.unavailableTitle), `${locale}: must not describe registration alone`);
  }
});
