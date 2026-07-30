import assert from "node:assert/strict";
import test from "node:test";
import { t } from "../src/lib/i18n";

const locales = ["en", "fr", "es", "pt", "zh"] as const;

test("production access state has dedicated localized explanatory copy", () => {
  for (const locale of locales) {
    const subtitle = t(locale, "login.accessSubtitle");
    const note = t(locale, "login.accessNote");
    assert.ok(subtitle.trim(), `${locale}: access subtitle`);
    assert.ok(note.trim(), `${locale}: access note`);
    assert.notEqual(subtitle, t(locale, "login.demoSubtitle"), `${locale}: subtitle must not use demo copy`);
    assert.notEqual(note, t(locale, "login.demoNote"), `${locale}: note must not use demo copy`);
  }
});
