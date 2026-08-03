import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { consumeLoginToken } from "@/lib/loginToken";
import { openSignupConfig } from "@/lib/openSignup";
import { sanitizeNextPath } from "@/lib/nextParam";
import { applyRateLimit, clientIpHash, rejectUntrustedOrigin } from "@/lib/request-security";

export async function POST(req: Request) {
  const originRejection = rejectUntrustedOrigin(req);
  if (originRejection) return originRejection;
  const access = openSignupConfig();
  if (!access.emailAccessEnabled) {
    return NextResponse.json({ error: "Email account access is not configured." }, { status: 503 });
  }
  const limited = await applyRateLimit(req, "auth-verify-ip", 10, 15 * 60_000);
  if (limited) return limited;

  let body: { token?: unknown; next?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof body.token !== "string" || body.token.length < 32 || body.token.length > 200) {
    return NextResponse.json({ error: "This sign-in link is invalid or expired." }, { status: 400 });
  }

  const consumed = await consumeLoginToken(body.token);
  if (!consumed) {
    return NextResponse.json({ error: "This sign-in link is invalid or expired." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: consumed.email }, select: { id: true } });
  if (!existing && !access.enabled) {
    return NextResponse.json({ error: "Account registration is not currently available." }, { status: 403 });
  }
  if (!existing && (!consumed.requestedFullName || !consumed.termsVersion || !consumed.privacyVersion)) {
    return NextResponse.json({ error: "Account registration details are required." }, { status: 400 });
  }

  const user = await prisma.$transaction(async (tx) => {
    const account = await tx.user.upsert({
      where: { email: consumed.email },
      update: { emailVerifiedAt: new Date() },
      create: {
        email: consumed.email,
        fullName: consumed.requestedFullName!,
        role: "investor",
        emailVerifiedAt: new Date(),
      },
    });
    if (consumed.termsVersion && consumed.privacyVersion) {
      await tx.accountAcceptance.upsert({
        where: {
          userId_termsVersion_privacyVersion: {
            userId: account.id,
            termsVersion: consumed.termsVersion,
            privacyVersion: consumed.privacyVersion,
          },
        },
        update: {},
        create: {
          userId: account.id,
          termsVersion: consumed.termsVersion,
          privacyVersion: consumed.privacyVersion,
          // Record the explicit confirmation request, not the earlier link
          // request, as the acceptance context.
          requestIpHash: clientIpHash(req),
        },
      });
    }
    return account;
  });

  const token = await createSessionToken(user.id);
  const next = sanitizeNextPath(typeof body.next === "string" ? body.next : null);
  const response = NextResponse.json({ ok: true, next }, {
    headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" },
  });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}
