import assert from "node:assert/strict";
import test from "node:test";
import { metadataBaseUrl, publicPageMetadata } from "../src/lib/metadata";
import { investmentUi } from "../src/lib/translations/investment-ui";
import { getMarketingMetadata } from "../src/lib/translations/marketing";

test("public pages publish page-specific Open Graph and Twitter metadata", () => {
  const metadata = publicPageMetadata("Water project — DESCO Compass", "A controlled project summary.", {
    canonical: "/project/water-project",
  });

  assert.equal(metadata.openGraph?.title, "Water project — DESCO Compass");
  assert.equal(metadata.openGraph?.description, "A controlled project summary.");
  const twitter = metadata.twitter as { card?: string; title?: string };
  assert.equal(twitter.card, "summary");
  assert.equal(twitter.title, "Water project — DESCO Compass");
  assert.deepEqual(metadata.alternates, { canonical: "/project/water-project" });
});

test("opportunity metadata describes preparation files in every language", () => {
  for (const locale of ["en", "fr", "es", "pt", "zh"] as const) {
    const metadata = investmentUi(locale).opportunities;
    assert.match(metadata.metadataTitle, /Compass/);
    assert.doesNotMatch(metadata.metadataDescription, /selected DRC investment opportunities/i);
    assert.ok(metadata.metadataDescription.length > 25, locale);
  }
});

test("project metadata sentence fragments are localized", () => {
  const spanish = investmentUi("es").project;
  const portuguese = investmentUi("pt").project;

  assert.equal(spanish.opportunityIn, "oportunidad en");
  assert.equal(spanish.capitalNotDisclosed, "necesidad de capital no divulgada públicamente");
  assert.equal(portuguese.opportunityIn, "oportunidade em");
  assert.equal(portuguese.capitalNotDisclosed, "necessidade de capital não divulgada publicamente");
});

test("about and diligence publish canonical and social metadata", () => {
  for (const page of ["about", "diligence"] as const) {
    const metadata = getMarketingMetadata("en", page);
    assert.deepEqual(metadata.alternates, { canonical: `/${page}` });
    assert.ok(metadata.openGraph?.description, `${page}: Open Graph description`);
    assert.equal(metadata.openGraph?.url, `/${page}`);
  }
});

test("preview metadata resolves against the active Vercel deployment", () => {
  const previousEnvironment = process.env.VERCEL_ENV;
  const previousUrl = process.env.VERCEL_URL;
  process.env.VERCEL_ENV = "preview";
  process.env.VERCEL_URL = "desco-preview.vercel.app";

  try {
    assert.equal(metadataBaseUrl().toString(), "https://desco-preview.vercel.app/");
  } finally {
    if (previousEnvironment === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previousEnvironment;
    if (previousUrl === undefined) delete process.env.VERCEL_URL;
    else process.env.VERCEL_URL = previousUrl;
  }
});

test("production metadata falls back to the active Vercel production hostname", () => {
  const previous = {
    environment: process.env.VERCEL_ENV,
    publicUrl: process.env.NEXT_PUBLIC_SITE_URL,
    productionUrl: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  };
  process.env.VERCEL_ENV = "production";
  delete process.env.NEXT_PUBLIC_SITE_URL;
  process.env.VERCEL_PROJECT_PRODUCTION_URL = "desco-production.vercel.app";

  try {
    assert.equal(metadataBaseUrl().toString(), "https://desco-production.vercel.app/");
  } finally {
    if (previous.environment === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previous.environment;
    if (previous.publicUrl === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = previous.publicUrl;
    if (previous.productionUrl === undefined) delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    else process.env.VERCEL_PROJECT_PRODUCTION_URL = previous.productionUrl;
  }
});
