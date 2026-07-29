import { PrismaClient } from "@prisma/client";
import { listings } from "../src/lib/data";
import {
  normalizeHighlights,
  normalizeStage,
  normalizeSummary,
} from "../src/lib/investment-evidence";

const prisma = new PrismaClient();
const SOURCE_MANAGED_IDS = new Set([
  "comicordia-mining",
  "comicordia-agri",
  "tilu-pepm-8252",
  "sciress-kolwezi-12423",
]);

// Additive catalogue synchronisation for deployed environments. Existing
// projects keep administrator-managed content and verification history; only
// their shared pillar colour is refreshed. Missing catalogue projects are
// created from the public-safe source data.
async function main() {
  let created = 0;
  let refreshed = 0;

  for (const listing of listings) {
    const existing = await prisma.listing.findUnique({
      where: { id: listing.id },
      select: { id: true },
    });

    if (existing) {
      if (SOURCE_MANAGED_IDS.has(listing.id)) {
        const org = await prisma.organization.upsert({
          where: { name: listing.org },
          update: {},
          create: {
            name: listing.org,
            type: "seeker",
            country: listing.country,
          },
        });
        await prisma.listing.update({
          where: { id: listing.id },
          data: {
            orgId: org.id,
            title: listing.title,
            sector: listing.sector,
            sectorColor: listing.sectorColor,
            country: listing.country,
            flag: listing.flag,
            raiseUsd: listing.raiseUsd,
            instrument: listing.instrument,
            stage: normalizeStage(listing.stage),
            irr: listing.irr,
            summary: normalizeSummary(listing.id, listing.summary),
            useOfFunds: listing.useOfFunds,
            matchScore: listing.scores.match,
            readiness: listing.scores.readiness,
            esg: listing.scores.esg,
            risk: listing.scores.risk,
            highlights: JSON.stringify(normalizeHighlights(listing.highlights)),
            whyMatch: listing.whyMatch,
          },
        });
        refreshed += 1;
        continue;
      }
      await prisma.listing.update({
        where: { id: listing.id },
        data: { sectorColor: listing.sectorColor },
      });
      refreshed += 1;
      continue;
    }

    const org = await prisma.organization.upsert({
      where: { name: listing.org },
      update: {},
      create: {
        name: listing.org,
        type: "seeker",
        country: listing.country,
      },
    });

    await prisma.listing.create({
      data: {
        id: listing.id,
        orgId: org.id,
        title: listing.title,
        sector: listing.sector,
        sectorColor: listing.sectorColor,
        country: listing.country,
        flag: listing.flag,
        raiseUsd: listing.raiseUsd,
        instrument: listing.instrument,
        stage: normalizeStage(listing.stage),
        irr: listing.irr,
        summary: normalizeSummary(listing.id, listing.summary),
        useOfFunds: listing.useOfFunds,
        verified: listing.verified,
        governmentBacked: listing.governmentBacked,
        matchScore: listing.scores.match,
        readiness: listing.scores.readiness,
        esg: listing.scores.esg,
        risk: listing.scores.risk,
        highlights: JSON.stringify(normalizeHighlights(listing.highlights)),
        whyMatch: listing.whyMatch,
      },
    });
    created += 1;
  }

  console.log(`Catalogue synchronised: ${created} created, ${refreshed} colours refreshed.`);
}

main().finally(() => prisma.$disconnect());
