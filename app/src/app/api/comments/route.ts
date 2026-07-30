import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canParticipateInListing } from "@/lib/listing-participation";

export async function GET(req: Request) {
  const listingId = new URL(req.url).searchParams.get("listingId");
  if (!listingId) {
    return NextResponse.json({ error: "listingId required" }, { status: 400 });
  }
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing || !(await canParticipateInListing(user, listing))) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }
  const comments = await prisma.comment.findMany({
    where: { listingId, parentId: null },
    orderBy: { createdAt: "desc" },
    include: {
      likes: true,
      replies: { orderBy: { createdAt: "asc" }, include: { likes: true } },
    },
  });
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: [
          ...new Set(
            comments.flatMap((c) => [c.userId, ...c.replies.map((r) => r.userId)])
          ),
        ],
      },
    },
    select: { id: true, fullName: true, title: true },
  });
  const byId = Object.fromEntries(users.map((u) => [u.id, u]));
  const shape = (c: (typeof comments)[number] | (typeof comments)[number]["replies"][number]) => ({
    id: c.id,
    body: c.body,
    createdAt: c.createdAt,
    author: byId[c.userId] ?? { id: c.userId, fullName: "Member", title: null },
    likeCount: c.likes.length,
    likedByMe: c.likes.some((l) => l.userId === user.id),
  });
  return NextResponse.json({
    comments: comments.map((c) => ({ ...shape(c), replies: c.replies.map(shape) })),
    viewer: { id: user.id, fullName: user.fullName },
  });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  let body: { listingId?: string; text?: string; parentId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const text = body.text?.trim() ?? "";
  if (!body.listingId || !text) {
    return NextResponse.json({ error: "listingId and text required" }, { status: 400 });
  }
  if (text.length > 2000) {
    return NextResponse.json({ error: "Comment too long (max 2000)" }, { status: 400 });
  }
  const listing = await prisma.listing.findUnique({ where: { id: body.listingId } });
  if (!listing || !(await canParticipateInListing(user, listing))) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }
  if (body.parentId) {
    const parent = await prisma.comment.findUnique({ where: { id: body.parentId } });
    if (!parent || parent.listingId !== body.listingId || parent.parentId) {
      return NextResponse.json({ error: "Invalid parent comment" }, { status: 400 });
    }
  }
  const comment = await prisma.comment.create({
    data: {
      listingId: body.listingId,
      userId: user.id,
      parentId: body.parentId ?? null,
      body: text,
    },
  });
  return NextResponse.json({ ok: true, comment });
}
