import assert from "node:assert/strict";
import test from "node:test";
import { submissionCopy, submissionSuccess } from "../src/lib/translations/submissions";

const locales = ["en", "fr", "es", "pt", "zh"] as const;
const requiredFields = [
  "orgName", "title", "ownershipStatement", "country", "sector", "stage",
  "raiseUsd", "instrument", "useOfFunds", "keyRisks", "managementTeam",
] as const;

test("submission workflow has complete interface copy in every supported locale", () => {
  for (const locale of locales) {
    const copy = submissionCopy(locale);
    assert.ok(copy.pageTitle.trim(), `${locale}: page title`);
    assert.ok(copy.loading.trim(), `${locale}: loading state`);
    assert.ok(copy.loadError.trim(), `${locale}: recoverable load error`);
    assert.ok(copy.saveError.trim(), `${locale}: recoverable save error`);
    assert.ok(copy.deleteConfirm.trim(), `${locale}: destructive confirmation`);
    assert.ok(copy.statuses.changes_requested.trim(), `${locale}: review status`);
    for (const action of ["saved", "submitted", "withdrawn", "deleted"] as const) {
      assert.ok(submissionSuccess(locale, action).trim(), `${locale}: ${action} confirmation`);
    }
    for (const field of requiredFields) {
      assert.ok(copy.labels[field].trim(), `${locale}: label ${field}`);
    }
  }
});

test("French submission copy contains no English reviewer fallback", () => {
  const copy = submissionCopy("fr");
  assert.doesNotMatch(`${copy.pageIntro} ${copy.reviewerNote}`, /\breviewer\b/i);
});

test("translated submission interfaces do not fall back to the English page and error copy", () => {
  const english = submissionCopy("en");
  for (const locale of locales.slice(1)) {
    const copy = submissionCopy(locale);
    assert.notEqual(copy.pageIntro, english.pageIntro, locale);
    assert.notEqual(copy.networkError, english.networkError, locale);
    assert.notEqual(copy.deleteConfirm, english.deleteConfirm, locale);
  }
});
