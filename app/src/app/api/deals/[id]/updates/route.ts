import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canManageDeal, forbidden, unauthorized } from "@/lib/authz";
import { boundedString } from "@/lib/request-input";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  const { id } = await params;
  const deal = await prisma.deal.findUnique({ where: { id }, include: { listing: true } });
  if (!deal) return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  if (!canManageDeal(user, deal)) return forbidden();

  let body: { title?: string; body?: string; period?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const title = boundedString(body.title, 151);
  const text = boundedString(body.body, 4001);
  const period = boundedString(body.period, 41);
  if (!title || title.length > 150) {
    return NextResponse.json({ error: "title required (max 150 chars)" }, { status: 400 });
  }
  if (!text || text.length > 4000) {
    return NextResponse.json({ error: "body required (max 4000 chars)" }, { status: 400 });
  }
  if (!period || period.length > 40) {
    return NextResponse.json({ error: "period required, e.g. \"Q3 2026\"" }, { status: 400 });
  }

  const update = await prisma.portfolioUpdate.create({
    data: { dealId: id, authorId: user.id, title, body: text, period },
  });
  return NextResponse.json({ ok: true, update });
}
