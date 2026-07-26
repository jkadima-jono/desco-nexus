import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Get some listings to add comments to
  const listings = await prisma.listing.findMany({
    take: 3,
  });

  // Get some users to use as commenters
  const users = await prisma.user.findMany({
    take: 2,
  });

  if (listings.length === 0 || users.length === 0) {
    console.log("No listings or users found. Skipping comment seeding.");
    return;
  }

  // Clear existing comments
  await prisma.commentLike.deleteMany();
  await prisma.comment.deleteMany();

  // Seed comments
  for (const listing of listings) {
    for (let i = 0; i < 2; i++) {
      const comment = await prisma.comment.create({
        data: {
          listingId: listing.id,
          userId: users[i % users.length].id,
          body: `This is a seeded comment on ${listing.title}. Great opportunity!`,
        },
      });

      // Add a reply to the comment
      await prisma.comment.create({
        data: {
          listingId: listing.id,
          userId: users[(i + 1) % users.length].id,
          parentId: comment.id,
          body: "Thanks for the insight! I agree.",
        },
      });
    }
  }

  console.log("Seeded comments for", listings.length, "listings");
}

main().finally(() => prisma.$disconnect());
