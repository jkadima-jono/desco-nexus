import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canManageDeal, forbidden, unauthorized } from "@/lib/authz";

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

  let body: { amountUsd?: number; purpose?: string; dueDate?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const amountUsd = Number(body.amountUsd);
  const purpose = body.purpose?.trim() ?? "";
  const dueDate = body.dueDate ? new Date(body.dueDate) : null;
  if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
    return NextResponse.json({ error: "amountUsd must be a positive number" }, { status: 400 });
  }
  if (!purpose || purpose.length > 300) {
    return NextResponse.json({ error: "purpose required (max 300 chars)" }, { status: 400 });
  }
  if (!dueDate || Number.isNaN(dueDate.getTime())) {
    return NextResponse.json({ error: "valid dueDate required" }, { status: 400 });
  }

  const callNumber = (await prisma.capitalCall.count({ where: { dealId: id } })) + 1;
  const call = await prisma.capitalCall.create({
    data: { dealId: id, callNumber, amountUsd, purpose, dueDate },
  });
  return NextResponse.json({ ok: true, call });
}
