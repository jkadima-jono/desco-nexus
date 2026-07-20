import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Demo passwordless login: identifies-or-creates user by email and issues a
// session. Production replaces this with magic-link/passkey delivery
// (docs/03 §7) — the session layer stays the same.
export async function POST(req: Request) {
  let body: { email?: string; fullName?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const email = body.email?.trim().toLowerCase() ?? "";
  const fullName = body.fullName?.trim() ?? "";
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  if (fullName.length > 120) {
    return NextResponse.json({ error: "Name too long" }, { status: 400 });
  }

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    if (!fullName) {
      return NextResponse.json(
        { error: "New account — fullName required" },
        { status: 400 }
      );
    }
    user = await prisma.user.create({ data: { email, fullName } });
  }

  const token = await createSessionToken(user.id);
  const res = NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email, fullName: user.fullName },
  });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
