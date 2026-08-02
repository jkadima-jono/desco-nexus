import { NextResponse } from "next/server";
import { SESSION_COOKIE, revokeCurrentSession } from "@/lib/auth";
import { rejectUntrustedOrigin } from "@/lib/request-security";

export async function POST(req: Request) {
  const originRejection = rejectUntrustedOrigin(req);
  if (originRejection) return originRejection;
  await revokeCurrentSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
  return res;
}
