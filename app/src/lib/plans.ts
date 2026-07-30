import type { User, Plan } from "@prisma/client";
import { prisma } from "./db";

// Legacy entitlement profiles. Commercial terms live on organization
// contracts; these records define limits only and are not public prices.
export const PLAN_SEED = [
  { name: "Free", priceUsdPerMonth: 0, maxActiveMandates: 3, maxCollections: 1, sortOrder: 0,
    description: "Discover opportunities, up to 3 active mandates, 1 saved collection." },
  { name: "Professional", priceUsdPerMonth: 0, maxActiveMandates: 20, maxCollections: 10, sortOrder: 1,
    description: "Higher mandate and collection limits for active investors." },
  { name: "Institutional", priceUsdPerMonth: 0, maxActiveMandates: null, maxCollections: null, sortOrder: 2,
    description: "Unlimited mandates and collections for institutional teams." },
] as const;

// Organization contracts are authoritative. Per-user plan assignment remains
// only as a backwards-compatible demo configuration until existing test and
// preview data has been migrated.
export async function effectivePlan(user: Pick<User, "planId" | "orgId">): Promise<Plan> {
  if (user.orgId) {
    const now = new Date();
    const contract = await prisma.commercialContract.findFirst({
      where: {
        orgId: user.orgId,
        status: "active",
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gt: now } }] },
        ],
      },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });
    if (contract) return contract.plan;
  }
  if (user.planId) {
    const plan = await prisma.plan.findUnique({ where: { id: user.planId } });
    if (plan) return plan;
  }
  const free = await prisma.plan.findUnique({ where: { name: "Free" } });
  if (free) return free;
  // Seed data missing (e.g. fresh db before scripts/seed-plans.ts ran) —
  // fail safe to the same limits as the Free tier rather than crashing.
  return {
    id: "unseeded-free-fallback",
    name: "Free",
    priceUsdPerMonth: 0,
    maxActiveMandates: 3,
    maxCollections: 1,
    description: "",
    sortOrder: 0,
  };
}
