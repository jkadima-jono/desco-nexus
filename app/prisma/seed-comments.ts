import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Add your comment seeding logic here
  console.log("Seeded comments");
}

main().finally(() => prisma.$disconnect());
