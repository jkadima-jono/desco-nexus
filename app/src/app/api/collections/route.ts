import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const collections = await prisma.collection.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ collections });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  let body: { name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const name = body.name?.trim().slice(0, 60);
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
  const existing = await prisma.collection.findFirst({ where: { userId: user.id, name } });
  if (existing) return NextResponse.json({ ok: true, collection: existing });
  const collection = await prisma.collection.create({ data: { userId: user.id, name } });
  return NextResponse.json({ ok: true, collection });
}

export async function DELETE(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const collection = await prisma.collection.findUnique({ where: { id } });
  if (!collection || collection.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  // Un-group items rather than cascade-deleting the saves themselves.
  await prisma.savedOpportunity.updateMany({ where: { collectionId: id }, data: { collectionId: null } });
  await prisma.collection.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
