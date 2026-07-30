import type { InstitutionalAccessProfile } from "@prisma/client";
import { prisma } from "./db";

export type InstitutionalAccessDecision =
  | { eligible: true; profile: InstitutionalAccessProfile }
  | { eligible: false; reason: string };

export async function institutionalAccessDecision(userId: string): Promise<InstitutionalAccessDecision> {
  const profile = await prisma.institutionalAccessProfile.findUnique({ where: { userId } });
  if (!profile) return { eligible: false, reason: "Institutional access review has not started." };
  if (profile.expiresAt && profile.expiresAt <= new Date()) {
    return { eligible: false, reason: "Institutional access review has expired." };
  }
  const demoStatusAllowed =
    process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview";
  const acceptedVerification = new Set([
    "verified",
    ...(demoStatusAllowed ? ["demo_verified"] : []),
  ]);
  if (
    !acceptedVerification.has(profile.authorizedRepresentativeStatus) ||
    !acceptedVerification.has(profile.kybStatus) ||
    !acceptedVerification.has(profile.kycStatus)
  ) {
    return { eligible: false, reason: "Identity, authority and institutional verification must be completed." };
  }
  if (!["clear", ...(demoStatusAllowed ? ["demo_clear"] : [])].includes(profile.screeningStatus)) {
    return { eligible: false, reason: "Integrity screening has not been cleared." };
  }
  const acceptedClassifications = new Set([
    "institutional",
    "professional",
    "accredited",
    "eligible_counterparty",
  ]);
  if (!acceptedClassifications.has(profile.investorClassification)) {
    return { eligible: false, reason: "Investor classification has not been established." };
  }
  if (!profile.classificationJurisdiction) {
    return { eligible: false, reason: "Investor-classification jurisdiction is required." };
  }
  if (!["low", "medium"].includes(profile.riskRating)) {
    return { eligible: false, reason: "Institutional risk review does not permit restricted access." };
  }
  if (process.env.VERCEL_ENV === "production") {
    if (!profile.reviewedAt || !profile.reviewedBy || !profile.providerReference) {
      return { eligible: false, reason: "A completed institutional review case is required." };
    }
  }
  return { eligible: true, profile };
}

export async function validNdaExecution(userId: string, listingId: string) {
  const now = new Date();
  const demoStatusAllowed =
    process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview";
  const acceptedStatuses = ["executed", ...(demoStatusAllowed ? ["demo_executed"] : [])];
  return prisma.ndaExecution.findFirst({
    where: {
      userId,
      listingId,
      status: { in: acceptedStatuses },
      revokedAt: null,
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
    orderBy: { executedAt: "desc" },
    select: { id: true },
  });
}

export async function hasValidNda(userId: string, listingId: string): Promise<boolean> {
  return !!(await validNdaExecution(userId, listingId));
}
