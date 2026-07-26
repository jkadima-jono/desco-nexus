import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Get existing listings and users for seeding comments
  const listings = await prisma.listing.findMany({ take: 3 });
  const users = await prisma.user.findMany({ take: 2 });

  if (listings.length === 0 || users.length === 0) {
    console.log("Not enough listings or users to seed comments");
    return;
  }

  // Clear existing comments
  await prisma.commentLike.deleteMany();
  await prisma.comment.deleteMany();

  // Create sample comments
  for (let i = 0; i < listings.length; i++) {
    const listing = listings[i];
    const user = users[i % users.length];

    await prisma.comment.create({
      data: {
        listingId: listing.id,
        userId: user.id,
        body: `This is a sample comment on ${listing.title}. Great opportunity!`,
      },
    });
  }

  console.log("Seeded comments successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });