import assert from "node:assert/strict";
import test from "node:test";
import { accountCopy } from "../src/lib/translations/account";
import { releaseReadinessCopy } from "../src/lib/translations/release-readiness";
import { contactPausedPageCopy } from "../src/lib/translations/investment-ui";

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

test("paused contact copy describes email fallback instead of an active form", () => {
  for (const locale of locales) {
    const copy = contactPausedPageCopy(locale);
    assert.ok(copy.title.trim(), `${locale}: title`);
    assert.ok(copy.intro.trim(), `${locale}: intro`);
    assert.ok(copy.process.trim(), `${locale}: process`);
    assert.ok(copy.notice.trim(), `${locale}: notice`);
  }
  const english = contactPausedPageCopy("en");
  assert.match(english.intro, /email application/i);
  assert.doesNotMatch(english.process, /assigns an internal owner|creates a follow-up task/i);
  assert.doesNotMatch(english.notice, /submitting this form/i);
});

test("unavailable account copy covers sign-in and registration in every language", () => {
  for (const locale of locales) {
    const copy = accountCopy(locale);
    assert.ok(copy.unavailableTitle.trim(), `${locale}: title`);
    assert.ok(copy.unavailableBody.trim(), `${locale}: body`);
    assert.ok(!/creation is not available/i.test(copy.unavailableTitle), `${locale}: must not describe registration alone`);
  }
});
