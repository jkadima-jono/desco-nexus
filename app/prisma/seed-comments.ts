import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seeds sample comments for testing
  const users = await prisma.user.findMany({ take: 5 });
  const listings = await prisma.listing.findMany({ take: 5 });

  if (users.length === 0 || listings.length === 0) {
    console.log(
      "Skipping comment seeding: insufficient users or listings available"
    );
    return;
  }

  // Clear existing comments
  await prisma.commentLike.deleteMany();
  await prisma.comment.deleteMany();

  // Create sample comments
  for (let i = 0; i < Math.min(users.length, listings.length); i++) {
    const comment = await prisma.comment.create({
      data: {
        listingId: listings[i].id,
        userId: users[i].id,
        body: `Sample comment ${i + 1} on this listing`,
      },
    });

    // Add a reply to some comments
    if (i % 2 === 0 && users.length > i + 1) {
      await prisma.comment.create({
        data: {
          listingId: listings[i].id,
          userId: users[(i + 1) % users.length].id,
          parentId: comment.id,
          body: `Reply to comment ${i + 1}`,
        },
      });
    }

    // Add a like to some comments
    if (i % 3 === 0 && users.length > i + 1) {
      await prisma.commentLike.create({
        data: {
          commentId: comment.id,
          userId: users[(i + 1) % users.length].id,
        },
      });
    }
  }

  const commentCount = await prisma.comment.count();
  console.log("Seeded", commentCount, "comments");
}

main().finally(() => prisma.$disconnect());
