import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { id } = await params;
  const saved = await prisma.savedOpportunity.findUnique({ where: { id } });
  if (!saved || saved.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  let body: { notes?: string; tags?: string[]; collectionId?: string | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (body.collectionId) {
    const collection = await prisma.collection.findUnique({ where: { id: body.collectionId } });
    if (!collection || collection.userId !== user.id) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }
  }
  const updated = await prisma.savedOpportunity.update({
    where: { id },
    data: {
      notes: body.notes !== undefined ? body.notes.trim().slice(0, 1000) : undefined,
      tags: body.tags !== undefined ? JSON.stringify(body.tags.filter((t) => typeof t === "string").slice(0, 10).map((t) => t.trim().slice(0, 30))) : undefined,
      collectionId: body.collectionId !== undefined ? body.collectionId : undefined,
    },
  });
  return NextResponse.json({ ok: true, saved: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { id } = await params;
  const saved = await prisma.savedOpportunity.findUnique({ where: { id } });
  if (!saved || saved.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await prisma.savedOpportunity.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
