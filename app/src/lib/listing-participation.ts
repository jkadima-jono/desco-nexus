import type { Listing, User } from "@prisma/client";
import { prisma } from "./db";
import { canManageListing } from "./authz";
import { hasDataRoomAccess } from "./dataroom";

export async function canParticipateInListing(user: User, listing: Listing): Promise<boolean> {
  if (canManageListing(user, listing)) return true;
  if (user.role === "investor") {
    const deal = await prisma.deal.findFirst({
      where: { listingId: listing.id, investorId: user.id },
      select: { id: true },
    });
    if (deal) return true;
  }
  if (user.role === "advisor") {
    const assignment = await prisma.advisorDealAssignment.findFirst({
      where: {
        advisorId: user.id,
        revokedAt: null,
        deal: { listingId: listing.id },
      },
      select: { id: true },
    });
    if (assignment) return true;
  }
  return hasDataRoomAccess(user, listing);
}
