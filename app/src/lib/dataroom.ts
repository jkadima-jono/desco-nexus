import type { User, Listing } from "@prisma/client";
import { prisma } from "./db";
import { canManageListing } from "./authz";
import { institutionalAccessDecision, validNdaExecution } from "./institutional-access";

// Confidential documents are gated on this, not on "signed in" — the org
// that owns the listing (or admin) always has access; any other user needs
// an explicit, active DataRoomAccess grant for that specific listing.
export async function hasDataRoomAccess(user: User | null, listing: Listing): Promise<boolean> {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (canManageListing(user, listing)) return true;
  const decision = await institutionalAccessDecision(user.id);
  if (!decision.eligible) return false;
  const nda = await validNdaExecution(user.id, listing.id);
  if (!nda) return false;
  const grant = await prisma.dataRoomAccess.findUnique({
    where: { listingId_userId: { listingId: listing.id, userId: user.id } },
  });
  return !!grant && grant.revokedAt === null && grant.ndaExecutionId === nda.id;
}
