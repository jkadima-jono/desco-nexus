import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { boundedString, sanitizeStringArray } from "@/lib/request-input";

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
  if (body.notes !== undefined && typeof body.notes !== "string") {
    return NextResponse.json({ error: "notes must be text" }, { status: 400 });
  }
  if (body.tags !== undefined && !Array.isArray(body.tags)) {
    return NextResponse.json({ error: "tags must be an array" }, { status: 400 });
  }
  if (body.collectionId !== undefined && body.collectionId !== null && typeof body.collectionId !== "string") {
    return NextResponse.json({ error: "collectionId must be text or null" }, { status: 400 });
  }
  const collectionId = body.collectionId === null ? null : boundedString(body.collectionId, 100) || undefined;
  if (collectionId) {
    const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
    if (!collection || collection.userId !== user.id) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }
  }
  const updated = await prisma.savedOpportunity.update({
    where: { id },
    data: {
      notes: body.notes !== undefined ? boundedString(body.notes, 1000) : undefined,
      tags: body.tags !== undefined ? JSON.stringify(sanitizeStringArray(body.tags, undefined, 30).slice(0, 10)) : undefined,
      collectionId: body.collectionId !== undefined ? collectionId ?? null : undefined,
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
