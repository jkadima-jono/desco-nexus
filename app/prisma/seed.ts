import { PrismaClient } from "@prisma/client";
import { listings, deals, threads } from "../src/lib/data";

const prisma = new PrismaClient();

async function main() {
  await prisma.message.deleteMany();
  await prisma.thread.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.matchAction.deleteMany();
  await prisma.document.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      id: "demo-amara",
      email: "amara@khalilcapital.com",
      fullName: "Amara Khalil",
      title: "Principal · Family Office",
    },
  });

  for (const l of listings) {
    const org = await prisma.organization.upsert({
      where: { name: l.org },
      update: {},
      create: {
        name: l.org,
        type: l.governmentBacked ? "government" : "seeker",
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
        docs: { create: l.docs.map((d) => ({ ...d })) },
      },
    });
  }

  for (const d of deals) {
    await prisma.deal.create({
      data: {
        listingId: d.listingId,
        title: d.title,
        flag: d.flag,
        amount: d.amount,
        stage: d.stage,
        owner: d.owner,
        nextStep: d.nextStep,
        createdAt: new Date(Date.now() - d.days * 86400_000),
      },
    });
  }

  for (const t of threads) {
    await prisma.thread.create({
      data: {
        id: t.id,
        name: t.name,
        org: t.org,
        messages: {
          create: t.messages.map((m, i) => ({
            sender: m.from,
            text: m.text,
            createdAt: new Date(Date.now() - (t.messages.length - i) * 3600_000),
          })),
        },
      },
    });
  }

  console.log("Seeded:", await prisma.listing.count(), "listings,",
    await prisma.deal.count(), "deals,", await prisma.thread.count(), "threads");
}

main().finally(() => prisma.$disconnect());
