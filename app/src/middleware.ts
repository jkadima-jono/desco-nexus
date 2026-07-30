import { NextResponse, type NextRequest } from "next/server";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function middleware(req: NextRequest) {
  const suppliedRequestId = req.headers.get("x-request-id");
  const requestId = suppliedRequestId && /^[a-zA-Z0-9._-]{8,100}$/.test(suppliedRequestId)
    ? suppliedRequestId
    : crypto.randomUUID();
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-request-id", requestId);
  if (!MUTATING_METHODS.has(req.method)) {
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set("x-request-id", requestId);
    return response;
  }
  const origin = req.headers.get("origin");
  if (!origin) {
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set("x-request-id", requestId);
    return response;
  }
  try {
    if (new URL(origin).host === req.nextUrl.host) {
      const response = NextResponse.next({ request: { headers: requestHeaders } });
      response.headers.set("x-request-id", requestId);
      return response;
    }
  } catch {
    // Invalid origins are rejected below.
  }
  return NextResponse.json(
    { error: { code: "untrusted_origin", message: "Untrusted request origin", requestId } },
    { status: 403, headers: { "x-request-id": requestId } },
  );
}

export const config = {
  matcher: "/api/:path*",
};
