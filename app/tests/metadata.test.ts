import assert from "node:assert/strict";
import test from "node:test";
import { metadataBaseUrl, publicPageMetadata } from "../src/lib/metadata";

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
