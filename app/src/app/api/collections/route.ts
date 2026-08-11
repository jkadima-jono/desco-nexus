import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { effectivePlan } from "@/lib/plans";
import { boundedString } from "@/lib/request-input";

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
  const name = boundedString(body.name, 60);
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
  const existing = await prisma.collection.findFirst({ where: { userId: user.id, name } });
  if (existing) return NextResponse.json({ ok: true, collection: existing });

  const plan = await effectivePlan(user);
  if (plan.maxCollections !== null) {
    const count = await prisma.collection.count({ where: { userId: user.id } });
    if (count >= plan.maxCollections) {
      return NextResponse.json(
        { error: "Your current workspace allowance supports up to " + plan.maxCollections + " collection(s). Request expanded access to create another." },
        { status: 402 }
      );
    }
  }

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
