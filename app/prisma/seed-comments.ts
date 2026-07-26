import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed comments if needed
  // Comments are typically created organically through platform activity
  console.log("Comments seeding complete");
}

main().finally(() => prisma.$disconnect());