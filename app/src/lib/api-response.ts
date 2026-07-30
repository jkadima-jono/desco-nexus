import { NextResponse } from "next/server";

export function requestId(req: Request): string {
  return req.headers.get("x-request-id") ?? crypto.randomUUID();
}

export function apiError(
  req: Request,
  status: number,
  code: string,
  message: string,
  details?: Record<string, string | number | boolean>,
) {
  const id = requestId(req);
  return NextResponse.json(
    { error: { code, message, requestId: id, ...(details ? { details } : {}) } },
    { status, headers: { "x-request-id": id } },
  );
}

export function apiOk(req: Request, body: Record<string, unknown>, status = 200) {
  const id = requestId(req);
  return NextResponse.json(
    { ...body, requestId: id },
    { status, headers: { "x-request-id": id } },
  );
}
