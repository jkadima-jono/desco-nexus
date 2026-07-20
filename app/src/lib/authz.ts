import { NextResponse } from "next/server";
import type { User, Listing } from "@prisma/client";
import { getSessionUser } from "./auth";

export type Role = "investor" | "owner" | "advisor" | "admin";

// Single policy source. Confidential material (data rooms, documents,
// discussions, personalized scores) requires an authenticated session.
// Managing a listing (uploads, photos, teaser) requires org ownership or admin.
export function canViewConfidential(user: User | null): boolean {
  return !!user;
}

export function canManageListing(user: User | null, listing: Listing): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  return user.role === "owner" && !!user.orgId && user.orgId === listing.orgId;
}

export function canRequestDataRoom(user: User | null): boolean {
  return !!user && (user.role === "investor" || user.role === "admin");
}

export function canManageDeal(user: User | null, deal: { listing: Listing }): boolean {
  return canManageListing(user, deal.listing);
}

export const unauthorized = () =>
  NextResponse.json({ error: "Sign in required" }, { status: 401 });
export const forbidden = () =>
  NextResponse.json({ error: "Not permitted for your role" }, { status: 403 });

export async function requireUser() {
  const user = await getSessionUser();
  return user;
}
