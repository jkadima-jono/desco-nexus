export const PUBLIC_LISTING_STATUS = "public_teaser";

// Public publication is deliberately narrower than the internal catalogue.
// These opportunities have the strongest current source coverage after the
// July 2026 evidence review. All other records remain available to authorised
// workspace users as projects under preparation.
export const PUBLIC_OPPORTUNITY_IDS = [
  "kasaji-kisenge-solar-50mw",
  "waterdesco-grand-kasai",
  "energulf-lotshi-block",
  "ldc-integrated-housing-drc",
] as const;

export const publicListingWhere = {
  publicationStatus: PUBLIC_LISTING_STATUS,
  id: { in: [...PUBLIC_OPPORTUNITY_IDS] },
};

export function isPublicOpportunityId(id: string): boolean {
  return (PUBLIC_OPPORTUNITY_IDS as readonly string[]).includes(id);
}

export function orderPublicOpportunities<T extends { id: string }>(listings: T[]): T[] {
  const order = new Map(PUBLIC_OPPORTUNITY_IDS.map((id, index) => [id, index]));
  return [...listings].sort(
    (a, b) => (order.get(a.id as (typeof PUBLIC_OPPORTUNITY_IDS)[number]) ?? 999) -
      (order.get(b.id as (typeof PUBLIC_OPPORTUNITY_IDS)[number]) ?? 999),
  );
}
