import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

const ACTIONS = new Set(["interested", "pass", "saved", "follow"]);

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  let body: { listingId?: string; action?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { listingId, action } = body;
  if (!listingId || !action || !ACTIONS.has(action)) {
    return NextResponse.json(
      { error: "listingId and action (interested|pass|saved|follow) required" },
      { status: 400 }
    );
  }

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  await prisma.matchAction.create({
    data: {
      userId: user.id,
      listingId,
      action,
      matchScore: listing.matchScore,
    },
  });

  // Product loop: "interested" opens a pipeline deal at Screening.
  let dealCreated = false;
  if (action === "interested") {
    const amount =
      "$" + Math.round(listing.raiseUsd / 1_000_000) + "M";
    const existing = await prisma.deal.findUnique({
      where: { listingId_title: { listingId, title: listing.title } },
    });
    if (!existing) {
      await prisma.deal.create({
        data: {
          listingId,
          title: listing.title,
          flag: listing.flag,
          amount,
          stage: "Screening",
          owner: "AK",
          nextStep: "Intro call",
        },
      });
      dealCreated = true;
    }
  }

  return NextResponse.json({ ok: true, dealCreated });
}
