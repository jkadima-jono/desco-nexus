import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { unauthorized } from "@/lib/authz";

export async function POST(
  _req: Request,
  _context: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  return NextResponse.json(
    {
      error:
        "Distribution operations are unavailable. DESCO Compass does not calculate returns or move investor funds.",
    },
    { status: 410 },
  );
}
