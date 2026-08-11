import assert from "node:assert/strict";
import test from "node:test";
import { sanitizeProductEventContext, sanitizeProductEventPath } from "../src/lib/product-analytics";

test("analytics paths omit query strings and reject unsafe characters", () => {
  assert.equal(sanitizeProductEventPath("/project/solar?email=person@example.com"), "/project/solar");
  assert.equal(sanitizeProductEventPath("/project/%40private"), "/redacted");
  assert.equal(sanitizeProductEventPath("https://example.com/private"), "/");
  assert.equal(sanitizeProductEventPath(null), "/");
});

test("analytics context accepts only governed non-sensitive dimensions", () => {
  assert.deepEqual(sanitizeProductEventContext({
    locale: "fr",
    listingId: "kasaji-kisenge-solar-50mw",
    hasProject: true,
    status: 204,
    arbitraryFreeText: "should not be stored",
    topic: "person@example.com",
  }), {
    locale: "fr",
    listingId: "kasaji-kisenge-solar-50mw",
    hasProject: true,
    status: 204,
  });
});

test("analytics context rejects arrays, empty strings and email-like campaign values", () => {
  assert.deepEqual(sanitizeProductEventContext([]), {});
  assert.deepEqual(sanitizeProductEventContext({ locale: " ", campaignName: "lead@example.com" }), {});
});
