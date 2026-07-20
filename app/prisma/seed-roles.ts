import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const maghreb = await prisma.organization.findUnique({ where: { name: "Maghreb Renewables SA" } });
  await prisma.user.updateMany({ where: { email: "amara@khalilcapital.com" }, data: { role: "investor" } });
  await prisma.user.updateMany({ where: { email: "marcus@infrafund.co.uk" }, data: { role: "investor" } });
  await prisma.user.updateMany({
    where: { email: "yasmine@maghreb-renewables.ma" },
    data: { role: "owner", orgId: maghreb?.id },
  });

  await prisma.listing.update({ where: { id: "atlas-solar" }, data: { govMechanism: "ppa" } });
  await prisma.listing.update({ where: { id: "mombasa-port" }, data: { govMechanism: "concession" } });
  await prisma.listing.update({ where: { id: "zambezi-water" }, data: { govMechanism: "first-loss" } });

  const main = await prisma.deal.findFirst({ where: { title: "Atlas Solar 120MW" } });
  if (main) {
    await prisma.deal.updateMany({
      where: { title: "Atlas Solar — Debt tranche" },
      data: { parentId: main.id, kind: "debt-tranche" },
    });
    await prisma.deal.updateMany({
      where: { title: "Atlas Solar Portfolio — 120MW" },
      data: { parentId: main.id, kind: "equity-tranche", title: "Atlas Solar — Equity tranche" },
    });
  }
  console.log("roles + tranches + mechanisms seeded");
}
main().finally(() => prisma.$disconnect());
