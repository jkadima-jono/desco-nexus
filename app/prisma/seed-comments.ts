import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Get sample users and listings for comment seeding
  const users = await prisma.user.findMany({ take: 5 });
  const listings = await prisma.listing.findMany({ take: 5 });

  if (users.length === 0 || listings.length === 0) {
    console.log("Skipping comment seeding: insufficient users or listings");
    return;
  }

  // Sample comments to seed
  const sampleComments = [
    "Great opportunity! Interested in learning more about the investment terms.",
    "This looks promising. Can you provide more details on the management team?",
    "Impressive financials. What's the timeline for deployment?",
    "Very interested in this sector. Would like to schedule a call.",
    "Strong fundamentals. How mature is the current product?",
  ];

  for (let i = 0; i < Math.min(users.length, listings.length); i++) {
    const user = users[i];
    const listing = listings[i];

    await prisma.comment.create({
      data: {
        userId: user.id,
        listingId: listing.id,
        content: sampleComments[i % sampleComments.length],
        createdAt: new Date(),
      },
    });
  }

  console.log("Seeded comments for development");
}

main().finally(() => prisma.$disconnect());