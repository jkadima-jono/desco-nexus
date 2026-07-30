import assert from "node:assert/strict";
import test from "node:test";
import { listings } from "../src/lib/data";
import { localizeListing } from "../src/lib/translations/listing-content";

const locales = ["fr", "es", "pt", "zh"] as const;
const descoVoice = {
  fr: /^Nous (?:présentons|structurons)/,
  es: /^(?:Presentamos|Estructuramos)/,
  pt: /^(?:Apresentamos|Estruturamos)/,
  zh: /^我们/,
} as const;

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

test("every public listing has a French presentation title", () => {
  for (const listing of listings) {
    const localized = localizeListing(listing, "fr");
    assert.notEqual(localized.title, listing.title, `${listing.id} must have a French title`);
  }
});

test("English project summaries use DESCO voice instead of detached promoter copy", () => {
  const detachedVoice = /\b(the sponsor proposes|sponsor materials describe|sponsor proposes)\b/i;
  for (const listing of listings) {
    assert.doesNotMatch(listing.summary, detachedVoice, listing.id);
  }
});

test("translated project summaries retain DESCO's first-person institutional voice", () => {
  for (const listing of listings) {
    for (const locale of locales) {
      const localized = localizeListing(listing, locale);
      assert.match(localized.summary, descoVoice[locale], `${listing.id} (${locale})`);
    }
  }
});
