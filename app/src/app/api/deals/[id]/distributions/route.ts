import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canManageDeal, forbidden, unauthorized } from "@/lib/authz";

const KINDS = new Set(["return-of-capital", "profit", "interest"]);

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

  let body: { amountUsd?: number; kind?: string; paymentDate?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const amountUsd = Number(body.amountUsd);
  const kind = body.kind ?? "";
  const paymentDate = body.paymentDate ? new Date(body.paymentDate) : new Date();
  if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
    return NextResponse.json({ error: "amountUsd must be a positive number" }, { status: 400 });
  }
  if (!KINDS.has(kind)) {
    return NextResponse.json(
      { error: "kind must be one of: return-of-capital, profit, interest" },
      { status: 400 }
    );
  }

  const dist = await prisma.distribution.create({
    data: { dealId: id, amountUsd, kind, paymentDate },
  });
  return NextResponse.json({ ok: true, distribution: dist });
}
