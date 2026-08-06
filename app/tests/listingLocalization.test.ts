import assert from "node:assert/strict";
import test from "node:test";
import { listings } from "../src/lib/data";
import { localizeListing, organizationPresentation } from "../src/lib/translations/listing-content";
import { exampleProjectImages, localizeExampleProjectImageCaption } from "../src/lib/example-project-images";
import { PUBLIC_OPPORTUNITY_IDS } from "../src/lib/public-listings";

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

test("published English summaries distinguish sourced facts from readiness judgments", () => {
  for (const id of PUBLIC_OPPORTUNITY_IDS) {
    const listing = listings.find((item) => item.id === id);
    assert.ok(listing, id);
    assert.match(listing.summary, /\b(?:proposal|sponsor material)\b/i, `${id}: source attribution`);
    assert.match(listing.summary, /\b(?:needs|not ready|remain unconfirmed)\b/i, `${id}: readiness limitation`);
  }
});

test("published project summaries avoid canned presentation language in every locale", () => {
  const cannedOpeners = /^(?:We are presenting|Nous présentons|Presentamos|Apresentamos|我们(?:展示|将))/i;
  for (const id of PUBLIC_OPPORTUNITY_IDS) {
    const listing = listings.find((item) => item.id === id);
    assert.ok(listing, id);
    assert.doesNotMatch(listing.summary, cannedOpeners, `${id} (en)`);
    for (const locale of locales) {
      const localized = localizeListing(listing, locale);
      assert.doesNotMatch(localized.summary, cannedOpeners, `${id} (${locale})`);
    }
  }
});

test("public organisation roles are governed and translated", () => {
  const publicIds = [
    "kasaji-kisenge-solar-50mw",
    "waterdesco-grand-kasai",
    "energulf-lotshi-block",
    "ldc-integrated-housing-drc",
  ];
  for (const id of publicIds) {
    const english = organizationPresentation(id, "en");
    assert.ok(english?.role, `${id} English role`);
    assert.ok(english?.context, `${id} English context`);
    for (const locale of locales) {
      const translated = organizationPresentation(id, locale);
      assert.ok(translated?.role, `${id} ${locale} role`);
      assert.ok(translated?.context, `${id} ${locale} context`);
      assert.notEqual(translated?.context, english.context, `${id} ${locale} context translation`);
    }
  }
});
