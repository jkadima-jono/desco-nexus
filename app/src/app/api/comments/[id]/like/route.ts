import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canParticipateInListing } from "@/lib/listing-participation";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const { id } = await params;
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }
  const listing = await prisma.listing.findUnique({ where: { id: comment.listingId } });
  if (!listing || !(await canParticipateInListing(user, listing))) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }
  const key = { commentId_userId: { commentId: id, userId: user.id } };
  const existing = await prisma.commentLike.findUnique({ where: key });
  if (existing) {
    await prisma.commentLike.delete({ where: key });
  } else {
    await prisma.commentLike.create({ data: { commentId: id, userId: user.id } });
  }
  const likeCount = await prisma.commentLike.count({ where: { commentId: id } });
  return NextResponse.json({ ok: true, liked: !existing, likeCount });
}
