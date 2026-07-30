import assert from "node:assert/strict";
import test from "node:test";
import { t, type Locale } from "../src/lib/i18n";
import { getMarketingCopy } from "../src/lib/translations/marketing";

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
  }
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
