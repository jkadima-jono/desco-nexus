import type { User, Plan } from "@prisma/client";
import { prisma } from "./db";

// Product-defined pricing tiers. Seeded once via scripts/seed-plans.ts,
// never created through the UI.
export const PLAN_SEED = [
  { name: "Free", priceUsdPerMonth: 0, maxActiveMandates: 3, maxCollections: 1, sortOrder: 0,
    description: "Discover opportunities, up to 3 active mandates, 1 saved collection." },
  { name: "Professional", priceUsdPerMonth: 199, maxActiveMandates: 20, maxCollections: 10, sortOrder: 1,
    description: "Higher mandate and collection limits for active investors." },
  { name: "Institutional", priceUsdPerMonth: 999, maxActiveMandates: null, maxCollections: null, sortOrder: 2,
    description: "Unlimited mandates and collections for institutional teams." },
] as const;

// A user with no assigned plan is on Free — this keeps User.planId
// nullable (no plan-assignment step required at signup) while every
// entitlement check has a concrete plan to consult.
export async function effectivePlan(user: Pick<User, "planId">): Promise<Plan> {
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
