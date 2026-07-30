import test from "node:test";
import assert from "node:assert/strict";
import { invalidatePublicationForImageChange } from "../src/lib/invalidate-publication";

test("an image mutation revokes approvals and returns a public teaser to review", async () => {
  const approvalRevocations: string[] = [];
  let listingUpdate: Record<string, unknown> | undefined;
  const tx = {
    listing: {
      findUniqueOrThrow: async () => ({
        publicationStatus: "public_teaser",
        publicationHistory: "[]",
      }),
      update: async ({ data }: { data: Record<string, unknown> }) => {
        listingUpdate = data;
      },
    },
    sponsorConsent: {
      updateMany: async () => approvalRevocations.push("sponsor"),
    },
    legalClearance: {
      updateMany: async () => approvalRevocations.push("legal"),
    },
    relatedPartyReview: {
      updateMany: async () => approvalRevocations.push("related-party"),
    },
  };

  await invalidatePublicationForImageChange(
    tx as never,
    "listing-1",
    "owner-1",
    "Project image uploaded",
  );

  assert.deepEqual(approvalRevocations.sort(), ["legal", "related-party", "sponsor"]);
  assert.equal(listingUpdate?.publicationStatus, "internal_review");
  assert.equal(listingUpdate?.designation, "candidate");
  assert.deepEqual(listingUpdate?.contentVersion, { increment: 1 });
  assert.equal(listingUpdate?.sponsorApprovedAt, null);
  assert.equal(listingUpdate?.legalClearedAt, null);
  assert.equal(listingUpdate?.relatedPartyReviewedAt, null);
  assert.match(String(listingUpdate?.publicationHistory), /invalidate_image_change/);
});

test("an image mutation preserves a non-public workflow state", async () => {
  let listingUpdate: Record<string, unknown> | undefined;
  const tx = {
    listing: {
      findUniqueOrThrow: async () => ({
        publicationStatus: "draft",
        publicationHistory: "[]",
      }),
      update: async ({ data }: { data: Record<string, unknown> }) => {
        listingUpdate = data;
      },
    },
    sponsorConsent: { updateMany: async () => ({ count: 0 }) },
    legalClearance: { updateMany: async () => ({ count: 0 }) },
    relatedPartyReview: { updateMany: async () => ({ count: 0 }) },
  };

  await invalidatePublicationForImageChange(
    tx as never,
    "listing-1",
    "owner-1",
    "Project image deleted",
  );

  assert.equal(listingUpdate?.publicationStatus, "draft");
});
