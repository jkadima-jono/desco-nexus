import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  return NextResponse.json(
    { error: "The legacy capital-account API is unavailable. Use monitored opportunities." },
    { status: 410 },
  );
}
