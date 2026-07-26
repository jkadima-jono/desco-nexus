import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canReviewSubmissions } from "@/lib/authz";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  if (!canReviewSubmissions(user)) return NextResponse.json({ error: "Not permitted for your role" }, { status: 403 });
  const submissions = await prisma.projectSubmission.findMany({
    where: { status: { in: ["submitted", "under_review"] } },
    orderBy: { createdAt: "asc" },
    include: { owner: { select: { fullName: true, email: true } } },
  });
  return NextResponse.json({ submissions });
}
