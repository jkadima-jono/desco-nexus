-- Repair a production database where the controlled-release migration was
-- incorrectly baselined before its additive columns were applied. Every
-- operation is idempotent so a partially updated schema fails neither forward
-- deployment nor a later recovery.

ALTER TABLE "Listing"
  ADD COLUMN IF NOT EXISTS "currentCapitalAskUsd" INTEGER,
  ADD COLUMN IF NOT EXISTS "estimatedProjectCostUsd" INTEGER,
  ADD COLUMN IF NOT EXISTS "lastPublishedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "legalClearanceScope" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "legalClearedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "legalClearedBy" TEXT,
  ADD COLUMN IF NOT EXISTS "relatedPartyReviewedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "relatedPartyReviewedBy" TEXT,
  ADD COLUMN IF NOT EXISTS "sponsorApprovalNote" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "sponsorApprovalVersion" INTEGER,
  ADD COLUMN IF NOT EXISTS "sponsorApprovedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "sponsorApprovedBy" TEXT;

ALTER TABLE "Document"
  ADD COLUMN IF NOT EXISTS "blobUploadedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "scanCheckedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "scanNote" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "scanProviderRef" TEXT,
  ADD COLUMN IF NOT EXISTS "scanStatus" TEXT NOT NULL DEFAULT 'pending';

ALTER TABLE "DataRoomAccess" ADD COLUMN IF NOT EXISTS "ndaExecutionId" TEXT;
ALTER TABLE "MatchAction" ADD COLUMN IF NOT EXISTS "requestKey" TEXT;
ALTER TABLE "Deal" ADD COLUMN IF NOT EXISTS "investorId" TEXT;

ALTER TABLE "ContactInquiry"
  ADD COLUMN IF NOT EXISTS "acknowledgedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "campaignMedium" TEXT,
  ADD COLUMN IF NOT EXISTS "campaignName" TEXT,
  ADD COLUMN IF NOT EXISTS "campaignSource" TEXT,
  ADD COLUMN IF NOT EXISTS "contactNoticeVersion" TEXT,
  ADD COLUMN IF NOT EXISTS "crmContactId" TEXT,
  ADD COLUMN IF NOT EXISTS "crmOpportunityId" TEXT,
  ADD COLUMN IF NOT EXISTS "locale" TEXT NOT NULL DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS "projectId" TEXT,
  ADD COLUMN IF NOT EXISTS "referrer" TEXT,
  ADD COLUMN IF NOT EXISTS "requestKey" TEXT,
  ADD COLUMN IF NOT EXISTS "retentionEndsAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "sourcePath" TEXT NOT NULL DEFAULT '/contact',
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX IF NOT EXISTS "MatchAction_requestKey_key" ON "MatchAction"("requestKey");
CREATE INDEX IF NOT EXISTS "Deal_listingId_idx" ON "Deal"("listingId");
CREATE UNIQUE INDEX IF NOT EXISTS "ListingImage_listingId_position_key" ON "ListingImage"("listingId", "position");
CREATE UNIQUE INDEX IF NOT EXISTS "ContactInquiry_requestKey_key" ON "ContactInquiry"("requestKey");
CREATE INDEX IF NOT EXISTS "ContactInquiry_status_createdAt_idx" ON "ContactInquiry"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "ContactInquiry_email_idx" ON "ContactInquiry"("email");
