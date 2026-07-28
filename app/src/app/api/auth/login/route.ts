import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Email login is disabled because this build does not yet verify email ownership.",
    },
    { status: 410 }
  );
}
