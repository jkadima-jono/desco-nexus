import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { LOCALES } from "../src/lib/i18n";
import { getMarketingMetadata } from "../src/lib/translations/marketing";
import { canonicalFromHtml, canonicalTargetMatches } from "../src/lib/release-smoke";

const canonicalByPage = {
  home: "/",
  about: "/about",
  diligence: "/diligence",
  investors: "/investors",
  sponsors: "/sponsors",
  partners: "/partners",
  pricing: "/pricing",
  trust: "/trust",
} as const;

test("every translated marketing page publishes its governed canonical", () => {
  for (const locale of LOCALES) {
    for (const [page, canonical] of Object.entries(canonicalByPage)) {
      const metadata = getMarketingMetadata(locale, page as keyof typeof canonicalByPage);
      assert.deepEqual(metadata.alternates, { canonical }, `${locale}.${page}`);
    }
  }
});
test("visible brand marks and install icons use the supplied Compass artwork", () => {
  for (const asset of [
    "public/brand/desco-compass-logo.jpg",
    "public/brand/desco-compass-192.png",
    "public/brand/desco-compass-512.png",
    "public/brand/desco-compass-apple.png",
  ]) {
    assert.equal(existsSync(asset), true, asset);
  }
  const brandMark = readFileSync("src/components/BrandMark.tsx", "utf8");
  const sidebar = readFileSync("src/components/Sidebar.tsx", "utf8");
  const manifest = readFileSync("src/app/manifest.ts", "utf8");
  assert.match(brandMark, /desco-compass-logo\.jpg/);
  assert.match(sidebar, /desco-compass-logo\.jpg/);
  assert.doesNotMatch(`${brandMark}\n${sidebar}\n${manifest}`, /desco-mark|desco-globe|desco-coin/);
});

test("public navigation promotes preparation resources and public files do not fall back to concept art", () => {
  const header = readFileSync("src/components/PublicHeader.tsx", "utf8");
  const heroVisual = readFileSync("src/components/HeroVisual.tsx", "utf8");
  const projectPage = readFileSync("src/app/project/[id]/page.tsx", "utf8");
  assert.match(header, /\["\/resources", "nav\.resources"\]/);
  assert.doesNotMatch(header, /\["\/pricing", "nav\.billing"\]/);
  assert.match(heroVisual, /listing\.photos\?\.find\(\(item\) => !item\.isExample\)/);
  assert.match(projectPage, /filter\(\(photo\) => !photo\.isExample\)/);
});

test("production smoke checks cover release-critical public contracts", () => {
  const smoke = readFileSync("scripts/smoke-production.ts", "utf8");
  assert.match(smoke, /canonicalFromHtml/);
  assert.match(smoke, /submit-project/);
  assert.match(smoke, /not-a-real-route/);
  assert.match(smoke, /localized 404 contract failed/);
  assert.match(smoke, /unauthenticated request returned/);
  assert.match(smoke, /mailto:support@desco\.global/);
  assert.match(smoke, /\["\/api\/saved", "\/api\/mandates"\]/);
  assert.doesNotMatch(smoke, /\["\/api\/account"/);
});

test("canonical smoke helpers reject redirects to the wrong host or path", () => {
  assert.equal(
    canonicalFromHtml('<link rel="canonical" href="https://compass.desco.global/investors">'),
    "https://compass.desco.global/investors",
  );
  assert.equal(
    canonicalFromHtml('<link href="/trust" rel="canonical">'),
    "/trust",
  );
  const expected = new URL("https://compass.desco.global/investors");
  assert.equal(canonicalTargetMatches(expected, new URL("https://compass.desco.global/investors")), true);
  assert.equal(canonicalTargetMatches(expected, new URL("https://desco.global/")), false);
  assert.equal(canonicalTargetMatches(expected, new URL("https://compass.desco.global/")), false);
});
