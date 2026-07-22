import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canReviewSubmissions, unauthorized, forbidden } from "@/lib/authz";

// Reuses canReviewSubmissions (admin-only) — same role gate as the
// verification and submission-review workflows.
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getSessionUser();
  if (!admin) return unauthorized();
  if (!canReviewSubmissions(admin)) return forbidden();

  const { id } = await params;
  const targetUser = await prisma.user.findUnique({ where: { id } });
  if (!targetUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  let body: { planId?: string | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.planId) {
    const plan = await prisma.plan.findUnique({ where: { id: body.planId } });
    if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { planId: body.planId ?? null },
    include: { plan: true },
  });
  return NextResponse.json({ ok: true, userId: updated.id, plan: updated.plan });
}
