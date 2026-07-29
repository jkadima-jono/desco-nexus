import { PrismaClient } from "@prisma/client";
import { listings } from "../src/lib/data";
import {
  normalizeHighlights,
  normalizeStage,
  normalizeSummary,
} from "../src/lib/investment-evidence";

const prisma = new PrismaClient();
const SOURCE_MANAGED_IDS = new Set(listings.map((listing) => listing.id));

// Catalogue synchronisation for DESCO-managed public opportunities. Public
// narrative and disclosure fields follow the reviewed source catalogue on
// every deployment, while verification history and uploaded room material
// remain untouched.
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
