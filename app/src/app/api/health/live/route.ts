import { apiOk } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return apiOk(req, {
    ok: true,
    status: "live",
    release: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? "local",
    timestamp: new Date().toISOString(),
  });
}
