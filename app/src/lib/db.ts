import { PrismaClient, type Listing as DbListing, type Document, type ListingImage } from "@prisma/client";
import type { Listing } from "./data";
import { normalizeHighlights, normalizeStage, normalizeSummary } from "./investment-evidence";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Stub session until real auth lands (see docs/03 §7): single seeded demo user.
export const DEMO_USER_ID = "demo-amara";

export function toListing(
  row: DbListing & {
    docs?: Document[];
    org?: { name: string } | null;
    images?: ListingImage[];
  }
): Listing {
  return {
    id: row.id,
    title: row.title,
    org: row.org?.name ?? "",
    sector: row.sector,
    sectorColor: row.sectorColor,
    country: row.country,
    flag: row.flag,
    raiseUsd: row.raiseUsd,
    instrument: row.instrument,
    stage: normalizeStage(row.stage),
    irr: row.irr,
    summary: normalizeSummary(row.id, row.summary),
    verified: row.verified,
    governmentBacked: row.governmentBacked,
    scores: {
      match: row.matchScore,
      readiness: row.readiness,
      esg: row.esg,
      risk: row.risk,
    },
    highlights: normalizeHighlights(JSON.parse(row.highlights) as string[]),
    docs: (row.docs ?? []).map((d) => ({
      name: d.name,
      size: d.size,
      folder: d.folder,
    })),
    whyMatch: row.whyMatch,
    updatedAt: row.updatedAt,
    useOfFunds: row.useOfFunds,
    fundingSecuredUsd: row.fundingSecuredUsd,
    sponsorContributionUsd: row.sponsorContributionUsd,
    photos: (row.images ?? [])
      .sort((a, b) => a.position - b.position)
      .map((i) => ({
        id: i.id,
        url: i.storageKey,
        caption: i.caption,
      })),
  };
}
