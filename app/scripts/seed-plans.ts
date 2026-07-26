import { prisma } from "../src/lib/db";
import { PLAN_SEED } from "../src/lib/plans";

async function main() {
  for (const p of PLAN_SEED) {
    await prisma.plan.upsert({
      where: { name: p.name },
      update: { priceUsdPerMonth: p.priceUsdPerMonth, maxActiveMandates: p.maxActiveMandates, maxCollections: p.maxCollections, description: p.description, sortOrder: p.sortOrder },
      create: { ...p },
    });
  }
  const plans = await prisma.plan.findMany({ orderBy: { sortOrder: "asc" } });
  console.log("Seeded plans:", plans.map((p) => p.name).join(", "));
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
