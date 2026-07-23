import { NextResponse } from "next/server";
import { SESSION_COOKIE, revokeCurrentSession } from "@/lib/auth";

export async function POST() {
  await revokeCurrentSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
