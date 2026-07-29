import assert from "node:assert/strict";
import test from "node:test";
import { listings } from "../src/lib/data";
import { localizeListing } from "../src/lib/translations/listing-content";

const locales = ["fr", "es", "pt", "zh"] as const;

test("every public listing has a translated summary in every supported locale", () => {
  for (const listing of listings) {
    for (const locale of locales) {
      const localized = localizeListing(listing, locale);
      assert.notEqual(
        localized.summary,
        listing.summary,
        `${listing.id} must have a ${locale} summary`,
      );
    }
  }
});

test("English project summaries use DESCO voice instead of detached promoter copy", () => {
  const detachedVoice = /\b(the sponsor proposes|sponsor materials describe|sponsor proposes)\b/i;
  for (const listing of listings) {
    assert.doesNotMatch(listing.summary, detachedVoice, listing.id);
  }
});
