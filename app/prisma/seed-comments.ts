import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Add seed comment data here if needed
  const commentCount = await prisma.comment.count();
  console.log("Comments seeding completed. Total comments:", commentCount);
}

main().finally(() => prisma.$disconnect());
