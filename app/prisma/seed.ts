import { PrismaClient } from "@prisma/client";
import { listings } from "../src/lib/data";

const prisma = new PrismaClient();

// Seeds only real Desco Global projects, sourced from the company's own
// investor deck and business plans. No fictional users, deals, or
// messages are pre-created — demo identities are created on demand by
// /api/auth/demo, and deal/message history accrues organically from
// real platform activity.
async function main() {
  await prisma.message.deleteMany();
  await prisma.thread.deleteMany();
  await prisma.portfolioUpdate.deleteMany();
  await prisma.distribution.deleteMany();
  await prisma.capitalCall.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.matchAction.deleteMany();
  await prisma.document.deleteMany();
  await prisma.listingImage.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  for (const l of listings) {
    const org = await prisma.organization.upsert({
      where: { name: l.org },
      update: {},
      create: {
        name: l.org,
        type: "seeker",
        country: l.country,
      },
    });
    await prisma.listing.create({
      data: {
        id: l.id,
        orgId: org.id,
        title: l.title,
        sector: l.sector,
        sectorColor: l.sectorColor,
        country: l.country,
        flag: l.flag,
        raiseUsd: l.raiseUsd,
        instrument: l.instrument,
        stage: l.stage,
        irr: l.irr,
        summary: l.summary,
        verified: l.verified,
        governmentBacked: l.governmentBacked,
        matchScore: l.scores.match,
        readiness: l.scores.readiness,
        esg: l.scores.esg,
        risk: l.scores.risk,
        highlights: JSON.stringify(l.highlights),
        whyMatch: l.whyMatch,
      },
    });
  }

  console.log("Seeded", await prisma.listing.count(), "real Desco Global projects");
}

main().finally(() => prisma.$disconnect());
