import { NextResponse } from "next/server";
import { getSessionUser, revokeAllSessions, SESSION_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { applyIdentifierRateLimit, applyRateLimit, rejectUntrustedOrigin } from "@/lib/request-security";
import { Prisma } from "@prisma/client";

const REQUEST_TYPES = new Set(["data_export", "account_deletion"]);

export async function POST(req: Request) {
  const originRejection = rejectUntrustedOrigin(req);
  if (originRejection) return originRejection;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const limited = await applyRateLimit(req, "account-lifecycle", 6, 60 * 60_000);
  if (limited) return limited;
  const userLimited = await applyIdentifierRateLimit(user.id, "account-lifecycle-user", 6, 60 * 60_000);
  if (userLimited) return userLimited;
  let body: { action?: unknown };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (body.action === "sign_out_all") {
    await revokeAllSessions(user.id);
    const response = NextResponse.json({ ok: true, action: "sign_out_all" });
    response.cookies.set(SESSION_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
    });
    return response;
  }
  if (typeof body.action !== "string" || !REQUEST_TYPES.has(body.action)) {
    return NextResponse.json({ error: "Unsupported account action." }, { status: 400 });
  }
  const existing = await prisma.accountLifecycleRequest.findFirst({
    where: { userId: user.id, type: body.action, status: { in: ["requested", "in_review"] } },
    select: { id: true },
  });
  let request = existing;
  if (!request) {
    try {
      request = await prisma.accountLifecycleRequest.create({
        data: { userId: user.id, type: body.action },
        select: { id: true },
      });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") throw error;
      request = await prisma.accountLifecycleRequest.findFirst({
        where: { userId: user.id, type: body.action, status: { in: ["requested", "in_review"] } },
        select: { id: true },
      });
      if (!request) throw error;
    }
  }
  return NextResponse.json({ ok: true, action: body.action, requestId: request.id }, { status: 202 });
}
