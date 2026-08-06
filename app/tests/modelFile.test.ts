import assert from "node:assert/strict";
import test from "node:test";
import { modelFileCopy } from "../src/lib/translations/model-file";

const locales = ["en", "fr", "es", "pt", "zh"] as const;

test("illustrative model file is complete and explicitly fictional in every language", () => {
  const english = modelFileCopy("en");
  for (const locale of locales) {
    const copy = modelFileCopy(locale);
    assert.equal(copy.fields.length, 9, `${locale}: public fields`);
    assert.equal(copy.risks.length, 5, `${locale}: risk categories`);
    assert.equal(copy.sources.length, 5, `${locale}: sources`);
    assert.ok(copy.fields.every((item) => item.title.trim() && item.body.trim()), `${locale}: field content`);
    assert.ok(copy.risks.every((item) => item.title.trim() && item.body.trim()), `${locale}: risk content`);
    assert.ok(copy.warning.trim(), `${locale}: fictional warning`);
    if (locale !== "en") {
      assert.notDeepEqual(copy.fields, english.fields, `${locale}: translated fields`);
      assert.notDeepEqual(copy.risks, english.risks, `${locale}: translated risks`);
      assert.notDeepEqual(copy.sources, english.sources, `${locale}: translated sources`);
    }
  }
  assert.match(modelFileCopy("en").warning, /fictional/i);
  assert.match(modelFileCopy("en").body, /not a real project/i);
});
