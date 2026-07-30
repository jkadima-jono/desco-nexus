import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { canReviewSubmissions, unauthorized, forbidden } from "@/lib/authz";
import { GOV_MECHANISMS } from "@/lib/verification";

type HistoryEntry = {
  by: string;
  action: "verified" | "unverified" | "gov_mechanism_updated";
  note: string;
  governmentBacked?: boolean;
  govMechanism?: string | null;
  at: string;
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  if (!canReviewSubmissions(user)) return forbidden();
  const { id } = await params;
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  return NextResponse.json({
    verified: listing.verified,
    verifiedBy: listing.verifiedBy,
    verifiedAt: listing.verifiedAt,
    verificationNote: listing.verificationNote,
    governmentBacked: listing.governmentBacked,
    govMechanism: listing.govMechanism,
    history: JSON.parse(listing.verificationHistory || "[]") as HistoryEntry[],
  });
}

type Body = {
  action?: "verify" | "unverify" | "set_gov_mechanism";
  note?: string;
  governmentBacked?: boolean;
  govMechanism?: string | null;
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  if (!canReviewSubmissions(user)) return forbidden();
  const { id } = await params;
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const history = JSON.parse(listing.verificationHistory || "[]") as HistoryEntry[];
  const note = body.note?.trim() ?? "";
  const invalidatePublication = {
    publicationStatus: "internal_review",
    designation: "candidate",
    publishedBy: null,
    lastPublishedAt: null,
    contentVersion: { increment: 1 },
  } as const;

  if (body.action === "verify") {
    if (!note) return NextResponse.json({ error: "A verification note (evidence reviewed) is required" }, { status: 400 });
    history.push({ by: user.fullName, action: "verified", note, at: new Date().toISOString() });
    const updated = await prisma.listing.update({
      where: { id },
      data: {
        verified: true,
        verifiedBy: user.fullName,
        verifiedAt: new Date(),
        verificationNote: note,
        verificationHistory: JSON.stringify(history),
        ...invalidatePublication,
      },
    });
    return NextResponse.json({ ok: true, listing: updated });
  }

  if (body.action === "unverify") {
    if (!note) return NextResponse.json({ error: "A reason for unverifying is required" }, { status: 400 });
    history.push({ by: user.fullName, action: "unverified", note, at: new Date().toISOString() });
    const updated = await prisma.listing.update({
      where: { id },
      data: {
        verified: false,
        verifiedBy: null,
        verifiedAt: null,
        verificationNote: "",
        verificationHistory: JSON.stringify(history),
        ...invalidatePublication,
      },
    });
    return NextResponse.json({ ok: true, listing: updated });
  }

  if (body.action === "set_gov_mechanism") {
    if (!note) return NextResponse.json({ error: "A note explaining this classification is required" }, { status: 400 });
    const governmentBacked = !!body.governmentBacked;
    if (governmentBacked && !GOV_MECHANISMS.includes(body.govMechanism as (typeof GOV_MECHANISMS)[number])) {
      return NextResponse.json({ error: "govMechanism must be one of: " + GOV_MECHANISMS.join(", ") }, { status: 400 });
    }
    const govMechanism = governmentBacked ? body.govMechanism! : null;
    history.push({ by: user.fullName, action: "gov_mechanism_updated", note, governmentBacked, govMechanism, at: new Date().toISOString() });
    const updated = await prisma.listing.update({
      where: { id },
      data: {
        governmentBacked,
        govMechanism,
        verificationHistory: JSON.stringify(history),
        ...invalidatePublication,
      },
    });
    return NextResponse.json({ ok: true, listing: updated });
  }

  return NextResponse.json({ error: "action must be verify|unverify|set_gov_mechanism" }, { status: 400 });
}
