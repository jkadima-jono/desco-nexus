import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  if ((await prisma.comment.count()) > 0) {
    console.log("comments already seeded");
    return;
  }
  const yasmine = await prisma.user.upsert({
    where: { email: "yasmine@maghreb-renewables.ma" },
    update: {},
    create: {
      email: "yasmine@maghreb-renewables.ma",
      fullName: "Yasmine El Fassi",
      title: "Sponsor · Maghreb Renewables",
    },
  });
  const jonas = await prisma.user.upsert({
    where: { email: "jonas@angelberlin.de" },
    update: {},
    create: {
      email: "jonas@angelberlin.de",
      fullName: "Jonas Weber",
      title: "Angel Investor",
    },
  });
  const q = await prisma.comment.create({
    data: {
      listingId: "atlas-solar",
      userId: jonas.id,
      body: "Impressive PPA structure. How is curtailment risk allocated between the offtaker and the project company?",
    },
  });
  await prisma.comment.create({
    data: {
      listingId: "atlas-solar",
      userId: yasmine.id,
      parentId: q.id,
      body: "Good question — deemed-energy clauses cover grid-instructed curtailment; merchant curtailment is capped at 2% p.a. in the model. Full mechanism in data room folder 3.",
    },
  });
  await prisma.comment.create({
    data: {
      listingId: "kivu-agri",
      userId: jonas.id,
      body: "The 4,200-farmer network is the real moat here. Following this one closely.",
    },
  });
  await prisma.commentLike.create({
    data: { commentId: q.id, userId: yasmine.id },
  });
  console.log("comments seeded");
}

main().finally(() => prisma.$disconnect());
