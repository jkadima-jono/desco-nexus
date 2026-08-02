import assert from "node:assert/strict";
import test from "node:test";
import {
  campaignAttributionFromSearch,
  hasCampaignAttribution,
  parseStoredCampaignAttribution,
} from "../src/lib/marketing-attribution";

test("campaign attribution reads only the governed UTM fields", () => {
  assert.deepEqual(
    campaignAttributionFromSearch("?utm_source=dfi&utm_medium=email&utm_campaign=water-brief&utm_content=private"),
    { source: "dfi", medium: "email", campaign: "water-brief" },
  );
});

test("campaign attribution is bounded and empty values are omitted", () => {
  const value = campaignAttributionFromSearch(`?utm_source=${"x".repeat(150)}`);
  assert.equal(value.source?.length, 120);
  assert.equal(value.medium, null);
  assert.equal(hasCampaignAttribution(value), true);
});

test("stored attribution fails closed on malformed or unrelated data", () => {
  assert.equal(parseStoredCampaignAttribution("not-json"), null);
  assert.equal(parseStoredCampaignAttribution(JSON.stringify({ email: "person@example.com" })), null);
  assert.deepEqual(
    parseStoredCampaignAttribution(JSON.stringify({ source: "conference", medium: "referral" })),
    { source: "conference", medium: "referral", campaign: null },
  );
});
