import { NextResponse, type NextRequest } from "next/server";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function middleware(req: NextRequest) {
  if (!MUTATING_METHODS.has(req.method)) return NextResponse.next();
  const origin = req.headers.get("origin");
  if (!origin) return NextResponse.next();
  try {
    if (new URL(origin).host === req.nextUrl.host) return NextResponse.next();
  } catch {
    // Invalid origins are rejected below.
  }
  return NextResponse.json({ error: "Untrusted request origin" }, { status: 403 });
}

export const config = {
  matcher: "/api/:path*",
};
