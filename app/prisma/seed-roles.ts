import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed user roles if needed
  // Roles are typically managed through the application
  console.log("Roles seeding complete");
}

main().finally(() => prisma.$disconnect());
