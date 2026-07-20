import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const mandates = await prisma.standingMandate.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ mandates });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  let body: { name?: string; query?: string; criteria?: string[]; threshold?: number; frequency?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const name = body.name?.trim() ?? "";
  const query = body.query?.trim() ?? "";
  if (!name || name.length > 80 || !query || query.length > 500) {
    return NextResponse.json({ error: "name (≤80) and query (≤500) required" }, { status: 400 });
  }
  const threshold = Math.min(100, Math.max(0, body.threshold ?? 70));
  const frequency = ["daily", "weekly"].includes(body.frequency ?? "") ? body.frequency! : "weekly";
  const mandate = await prisma.standingMandate.create({
    data: {
      userId: user.id,
      name,
      query,
      criteria: JSON.stringify(body.criteria ?? []),
      threshold,
      frequency,
    },
  });
  return NextResponse.json({ ok: true, mandate });
}

export async function DELETE(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const mandate = await prisma.standingMandate.findUnique({ where: { id } });
  if (!mandate || mandate.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await prisma.standingMandate.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  let body: { id?: string; active?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const mandate = await prisma.standingMandate.findUnique({ where: { id: body.id } });
  if (!mandate || mandate.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const updated = await prisma.standingMandate.update({
    where: { id: body.id },
    data: { active: body.active ?? mandate.active },
  });
  return NextResponse.json({ ok: true, mandate: updated });
}
