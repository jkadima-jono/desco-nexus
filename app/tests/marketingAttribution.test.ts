import assert from "node:assert/strict";
import test from "node:test";
import {
  campaignAttributionFromSearch,
  hasCampaignAttribution,
  parseStoredCampaignAttribution,
  readCampaignAttribution,
  storeCampaignAttribution,
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

test("campaign storage failures never interrupt the user journey", () => {
  const blockedStorage = {
    getItem: () => { throw new Error("blocked"); },
    setItem: () => { throw new Error("blocked"); },
  };
  assert.equal(readCampaignAttribution(blockedStorage), null);
  assert.equal(storeCampaignAttribution(blockedStorage, {
    source: "newsletter",
    medium: "email",
    campaign: "August",
  }), false);
});

test("campaign storage helpers preserve valid session attribution", () => {
  let stored: string | null = null;
  const storage = {
    getItem: () => stored,
    setItem: (_key: string, value: string) => { stored = value; },
  };
  const attribution = { source: "partner", medium: "referral", campaign: "DRC" };
  assert.equal(storeCampaignAttribution(storage, attribution), true);
  assert.deepEqual(readCampaignAttribution(storage), attribution);
});
