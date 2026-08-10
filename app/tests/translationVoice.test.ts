import assert from "node:assert/strict";
import test from "node:test";
import { t, type Locale } from "../src/lib/i18n";
import { getMarketingCopy } from "../src/lib/translations/marketing";
import { investmentUi } from "../src/lib/translations/investment-ui";

const voiceMarkers: Record<Locale, RegExp> = {
  en: /\b(?:We|we)\b/,
  fr: /\b(?:Nous|nous)\b/,
  es: /\b(?:Nosotros|nosotros|Estructuramos|Presentamos|Organizamos|Distinguimos|Ayudamos|Operamos)\b/,
  pt: /\b(?:Nós|nós|Estruturamos|Apresentamos|Organizamos|Distinguimos|Ajudamos|Operamos)\b/,
  zh: /我们/,
};

test("homepage positioning retains DESCO voice in every locale", () => {
  for (const locale of Object.keys(voiceMarkers) as Locale[]) {
    assert.match(t(locale, "home.heroBody"), voiceMarkers[locale], locale);
    assert.match(t(locale, "home.opportunitiesBody"), voiceMarkers[locale], locale);
    assert.notEqual(t(locale, "home.platform"), "", locale);
  }
  assert.doesNotMatch(t("en", "home.platform"), /investment platform/i);
});

test("public marketing journeys retain DESCO voice in every locale", () => {
  for (const locale of Object.keys(voiceMarkers) as Locale[]) {
    const home = getMarketingCopy(locale, "home");
    const investors = getMarketingCopy(locale, "investors");
    assert.match(home.processBody, voiceMarkers[locale], `home process (${locale})`);
    assert.match(home.trustBody, voiceMarkers[locale], `home trust (${locale})`);
    assert.match(investors.hero.body, voiceMarkers[locale], `investors hero (${locale})`);
  }
});

test("Chinese workspace copy does not inherit the English teaser explanation", () => {
  assert.notEqual(t("zh", "project.teaserHint"), t("en", "project.teaserHint"));
  assert.match(t("zh", "project.teaserHint"), /[\u3400-\u9fff]/);
});

test("the commercial model leads with sponsor preparation in every locale", () => {
  for (const locale of Object.keys(voiceMarkers) as Locale[]) {
    const pricing = getMarketingCopy(locale, "pricing");
    assert.match(pricing.paths[0].audience, /Project sponsors|Porteurs|Promotores|项目发起方/i, locale);
    assert.ok(pricing.pathsTitle.length > 8, locale);
  }
});

test("opportunity metadata and image guidance match the preparation-led public product", () => {
  for (const locale of Object.keys(voiceMarkers) as Locale[]) {
    const ui = investmentUi(locale);
    assert.match(ui.opportunities.metadataDescription, /project|projet|proyecto|projeto|项目/i, locale);
    assert.doesNotMatch(ui.images.uploadHelp, /replaces the current|remplacera|sustituirá|substituirá|替换.*概念图/i, locale);
  }
});

test("about and account surfaces do not revert to marketplace positioning", () => {
  for (const locale of Object.keys(voiceMarkers) as Locale[]) {
    const about = getMarketingCopy(locale, "about");
    assert.doesNotMatch(about.hero.body, /investment-opportunity|plateforme d.opportunités|plataforma de oportunidades|投资机会与尽调平台/i, locale);
    assert.notEqual(t(locale, "login.tagline"), "", locale);
  }
  assert.doesNotMatch(t("en", "login.tagline"), /capital meets opportunity/i);
});

test("project detail headings describe preparation files in every locale", () => {
  for (const locale of Object.keys(voiceMarkers) as Locale[]) {
    assert.match(investmentUi(locale).project.publicBriefing, /preparation|préparation|preparación|preparação|准备/i, locale);
  }
});
