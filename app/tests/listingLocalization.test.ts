import assert from "node:assert/strict";
import test from "node:test";
import { listings } from "../src/lib/data";
import { localizeListing } from "../src/lib/translations/listing-content";
import { exampleProjectImages, localizeExampleProjectImageCaption } from "../src/lib/example-project-images";

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

test("new public projects have presentation titles in every supported locale", () => {
  const ids = [
    "kasaji-kisenge-solar-50mw",
    "ldc-integrated-housing-drc",
    "energulf-lotshi-block",
  ];
  for (const id of ids) {
    const listing = listings.find((item) => item.id === id);
    assert.ok(listing, id);
    for (const locale of locales) {
      const localized = localizeListing(listing, locale);
      assert.notEqual(localized.title, listing.title, `${id} must have a ${locale} title`);
    }
  }
});

test("material example-image captions are localized and wired into listing presentation", () => {
  for (const listing of listings) {
    const images = exampleProjectImages(listing.id);
    for (const image of images) {
      for (const locale of locales) {
        assert.notEqual(
          localizeExampleProjectImageCaption(image.id, image.caption, locale),
          image.caption,
          `${image.id} must have a ${locale} caption`,
        );
      }
    }
    if (images.length > 0) {
      const localized = localizeListing({ ...listing, photos: images }, "zh");
      assert.notEqual(localized.photos?.[0]?.caption, images[0].caption, `${listing.id} must display the localized caption`);
    }
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
