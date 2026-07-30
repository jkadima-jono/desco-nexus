-- This migration assumes the database already matches the schema on main at
-- commit 7171345. Run scripts/database-preflight.ts and take a restorable backup
-- before applying it. The block below fails before any schema change if the
-- new image-position invariant is not already true.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "ListingImage"
        GROUP BY "listingId", "position"
        HAVING COUNT(*) > 1
    ) THEN
        RAISE EXCEPTION
            'Migration blocked: duplicate ListingImage positions must be resolved first';
    END IF;
END
$$;

-- DropIndex
DROP INDEX "Deal_listingId_title_key";

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "currentCapitalAskUsd" INTEGER,
ADD COLUMN     "estimatedProjectCostUsd" INTEGER,
ADD COLUMN     "lastPublishedAt" TIMESTAMP(3),
ADD COLUMN     "legalClearanceScope" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "legalClearedAt" TIMESTAMP(3),
ADD COLUMN     "legalClearedBy" TEXT,
ADD COLUMN     "relatedPartyReviewedAt" TIMESTAMP(3),
ADD COLUMN     "relatedPartyReviewedBy" TEXT,
ADD COLUMN     "sponsorApprovalNote" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "sponsorApprovalVersion" INTEGER,
ADD COLUMN     "sponsorApprovedAt" TIMESTAMP(3),
ADD COLUMN     "sponsorApprovedBy" TEXT;

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "blobUploadedAt" TIMESTAMP(3),
ADD COLUMN     "scanCheckedAt" TIMESTAMP(3),
ADD COLUMN     "scanNote" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "scanProviderRef" TEXT,
ADD COLUMN     "scanStatus" TEXT NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "DataRoomAccess" ADD COLUMN     "ndaExecutionId" TEXT;

-- AlterTable
ALTER TABLE "MatchAction" ADD COLUMN     "requestKey" TEXT;

-- AlterTable
ALTER TABLE "Deal" ADD COLUMN     "investorId" TEXT;

-- AlterTable
ALTER TABLE "ContactInquiry" ADD COLUMN     "acknowledgedAt" TIMESTAMP(3),
ADD COLUMN     "campaignMedium" TEXT,
ADD COLUMN     "campaignName" TEXT,
ADD COLUMN     "campaignSource" TEXT,
ADD COLUMN     "contactNoticeVersion" TEXT,
ADD COLUMN     "crmContactId" TEXT,
ADD COLUMN     "crmOpportunityId" TEXT,
ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "projectId" TEXT,
ADD COLUMN     "referrer" TEXT,
ADD COLUMN     "requestKey" TEXT,
ADD COLUMN     "retentionEndsAt" TIMESTAMP(3),
ADD COLUMN     "sourcePath" TEXT NOT NULL DEFAULT '/contact',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "OutboxEvent" (
    "id" TEXT NOT NULL,
    "eventKey" TEXT,
    "type" TEXT NOT NULL,
    "aggregateId" TEXT,
    "payload" TEXT NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "availableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "lastError" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceRun" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '{}',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "MaintenanceRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstitutionalAccessProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,
    "legalEntityName" TEXT,
    "registrationNumber" TEXT,
    "jurisdiction" TEXT,
    "authorizedRepresentativeStatus" TEXT NOT NULL DEFAULT 'pending',
    "kybStatus" TEXT NOT NULL DEFAULT 'pending',
    "kycStatus" TEXT NOT NULL DEFAULT 'pending',
    "screeningStatus" TEXT NOT NULL DEFAULT 'pending',
    "investorClassification" TEXT NOT NULL DEFAULT 'unclassified',
    "classificationJurisdiction" TEXT,
    "riskRating" TEXT NOT NULL DEFAULT 'unrated',
    "providerReference" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstitutionalAccessProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessAcknowledgement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "noticeVersion" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "classification" TEXT NOT NULL,
    "acknowledgedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccessAcknowledgement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NdaExecution" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "termsVersion" TEXT NOT NULL,
    "termsHash" TEXT NOT NULL,
    "signatoryName" TEXT NOT NULL,
    "signatoryCapacity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "executionRef" TEXT,
    "executedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NdaExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdvisorDealAssignment" (
    "id" TEXT NOT NULL,
    "advisorId" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "assignedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "AdvisorDealAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SponsorConsent" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "contentVersion" INTEGER NOT NULL,
    "contentHash" TEXT NOT NULL,
    "signatoryName" TEXT NOT NULL,
    "signatoryCapacity" TEXT NOT NULL,
    "approvalEvidenceRef" TEXT NOT NULL,
    "approvalEvidenceHash" TEXT,
    "recordedBy" TEXT NOT NULL,
    "approvedAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SponsorConsent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegalClearance" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "contentVersion" INTEGER NOT NULL,
    "contentHash" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "counselName" TEXT NOT NULL,
    "approvalEvidenceRef" TEXT NOT NULL,
    "approvalEvidenceHash" TEXT,
    "recordedBy" TEXT NOT NULL,
    "clearedAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LegalClearance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelatedPartyReview" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "contentVersion" INTEGER NOT NULL,
    "contentHash" TEXT NOT NULL,
    "relatedParty" BOOLEAN NOT NULL,
    "relationshipType" TEXT,
    "publicDisclosure" TEXT NOT NULL,
    "reviewerName" TEXT NOT NULL,
    "reviewerIndependence" TEXT NOT NULL,
    "recordedBy" TEXT NOT NULL,
    "reviewedAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RelatedPartyReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OutboxEvent_eventKey_key" ON "OutboxEvent"("eventKey");

-- CreateIndex
CREATE INDEX "OutboxEvent_status_availableAt_idx" ON "OutboxEvent"("status", "availableAt");

-- CreateIndex
CREATE INDEX "OutboxEvent_type_createdAt_idx" ON "OutboxEvent"("type", "createdAt");

-- CreateIndex
CREATE INDEX "MaintenanceRun_kind_startedAt_idx" ON "MaintenanceRun"("kind", "startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionalAccessProfile_userId_key" ON "InstitutionalAccessProfile"("userId");

-- CreateIndex
CREATE INDEX "InstitutionalAccessProfile_organizationId_kybStatus_screeni_idx" ON "InstitutionalAccessProfile"("organizationId", "kybStatus", "screeningStatus");

-- CreateIndex
CREATE INDEX "AccessAcknowledgement_userId_listingId_action_idx" ON "AccessAcknowledgement"("userId", "listingId", "action");

-- CreateIndex
CREATE INDEX "NdaExecution_userId_listingId_status_idx" ON "NdaExecution"("userId", "listingId", "status");

-- CreateIndex
CREATE INDEX "AdvisorDealAssignment_dealId_revokedAt_idx" ON "AdvisorDealAssignment"("dealId", "revokedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdvisorDealAssignment_advisorId_dealId_key" ON "AdvisorDealAssignment"("advisorId", "dealId");

-- CreateIndex
CREATE INDEX "SponsorConsent_listingId_contentVersion_revokedAt_idx" ON "SponsorConsent"("listingId", "contentVersion", "revokedAt");

-- CreateIndex
CREATE INDEX "LegalClearance_listingId_contentVersion_revokedAt_idx" ON "LegalClearance"("listingId", "contentVersion", "revokedAt");

-- CreateIndex
CREATE INDEX "RelatedPartyReview_listingId_contentVersion_revokedAt_idx" ON "RelatedPartyReview"("listingId", "contentVersion", "revokedAt");

-- CreateIndex
CREATE UNIQUE INDEX "MatchAction_requestKey_key" ON "MatchAction"("requestKey");

-- CreateIndex
CREATE INDEX "Deal_listingId_idx" ON "Deal"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "Deal_investorId_listingId_title_key" ON "Deal"("investorId", "listingId", "title");

-- Preserve the legacy uniqueness rule for sponsor-level deals, whose
-- investorId remains null. PostgreSQL unique indexes otherwise permit
-- multiple rows with the same null-containing key.
CREATE UNIQUE INDEX "Deal_listingId_title_sponsor_key"
ON "Deal"("listingId", "title")
WHERE "investorId" IS NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ListingImage_listingId_position_key" ON "ListingImage"("listingId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "ContactInquiry_requestKey_key" ON "ContactInquiry"("requestKey");

-- CreateIndex
CREATE INDEX "ContactInquiry_status_createdAt_idx" ON "ContactInquiry"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ContactInquiry_email_idx" ON "ContactInquiry"("email");

-- AddForeignKey
ALTER TABLE "DataRoomAccess" ADD CONSTRAINT "DataRoomAccess_ndaExecutionId_fkey" FOREIGN KEY ("ndaExecutionId") REFERENCES "NdaExecution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionalAccessProfile" ADD CONSTRAINT "InstitutionalAccessProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionalAccessProfile" ADD CONSTRAINT "InstitutionalAccessProfile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessAcknowledgement" ADD CONSTRAINT "AccessAcknowledgement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessAcknowledgement" ADD CONSTRAINT "AccessAcknowledgement_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NdaExecution" ADD CONSTRAINT "NdaExecution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NdaExecution" ADD CONSTRAINT "NdaExecution_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvisorDealAssignment" ADD CONSTRAINT "AdvisorDealAssignment_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvisorDealAssignment" ADD CONSTRAINT "AdvisorDealAssignment_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SponsorConsent" ADD CONSTRAINT "SponsorConsent_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalClearance" ADD CONSTRAINT "LegalClearance_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedPartyReview" ADD CONSTRAINT "RelatedPartyReview_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactInquiry" ADD CONSTRAINT "ContactInquiry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactInquiry" ADD CONSTRAINT "ContactInquiry_crmContactId_fkey" FOREIGN KEY ("crmContactId") REFERENCES "CrmContact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactInquiry" ADD CONSTRAINT "ContactInquiry_crmOpportunityId_fkey" FOREIGN KEY ("crmOpportunityId") REFERENCES "CrmOpportunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
