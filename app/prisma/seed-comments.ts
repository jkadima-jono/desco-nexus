import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Get all listings to add comments to
  const listings = await prisma.listing.findMany();

  if (listings.length === 0) {
    console.log("No listings found to add comments to");
    return;
  }

  // Create a demo user for comments if none exists
  let demoUser = await prisma.user.findFirst({
    where: { email: "demo@desco.local" },
  });

  if (!demoUser) {
    demoUser = await prisma.user.create({
      data: {
        email: "demo@desco.local",
        fullName: "Demo User",
        role: "investor",
      },
    });
  }

  // Add sample comments to a few listings
  const commentsPerListing = 2;
  for (let i = 0; i < Math.min(listings.length, 3); i++) {
    for (let j = 0; j < commentsPerListing; j++) {
      await prisma.comment.create({
        data: {
          listingId: listings[i].id,
          userId: demoUser.id,
          body: `Sample comment ${j + 1} on listing ${listings[i].title}`,
        },
      });
    }
  }

  console.log("Seeded", await prisma.comment.count(), "comments");
}

main().finally(() => prisma.$disconnect());
