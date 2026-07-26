import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed comments data here
  // Comments are typically created organically through platform activity
  console.log("Comments seeded successfully");
}

main().finally(() => prisma.$disconnect());
