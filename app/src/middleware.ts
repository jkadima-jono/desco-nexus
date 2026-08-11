import { NextResponse, type NextRequest } from "next/server";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function secureApiResponse(response: NextResponse, requestId: string) {
  response.headers.set("x-request-id", requestId);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export function middleware(req: NextRequest) {
  const suppliedRequestId = req.headers.get("x-request-id");
  const requestId = suppliedRequestId && /^[a-zA-Z0-9._-]{8,100}$/.test(suppliedRequestId)
    ? suppliedRequestId
    : crypto.randomUUID();
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-request-id", requestId);
  if (!MUTATING_METHODS.has(req.method)) {
    return secureApiResponse(
      NextResponse.next({ request: { headers: requestHeaders } }),
      requestId,
    );
  }
  const origin = req.headers.get("origin");
  if (!origin) {
    return secureApiResponse(
      NextResponse.next({ request: { headers: requestHeaders } }),
      requestId,
    );
  }
  try {
    if (new URL(origin).host === req.nextUrl.host) {
      return secureApiResponse(
        NextResponse.next({ request: { headers: requestHeaders } }),
        requestId,
      );
    }
  } catch {
    // Invalid origins are rejected below.
  }
  return secureApiResponse(
    NextResponse.json(
      { error: { code: "untrusted_origin", message: "Untrusted request origin", requestId } },
      { status: 403 },
    ),
    requestId,
  );
}

export const config = {
  matcher: "/api/:path*",
};
