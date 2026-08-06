import type { MetadataRoute } from "next";
import { PILLARS } from "@/lib/pillars";
import { projectHref } from "@/lib/project-slugs";
import { publicListingWhere } from "@/lib/public-listings";
import { prisma } from "@/lib/db";
import { metadataBaseUrl } from "@/lib/metadata";
import { PUBLIC_SITEMAP_ROUTES } from "@/lib/public-sitemap";

// Public project URLs depend on governed database state. Generate this route
// at request time so builds never require a live production database.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = metadataBaseUrl().origin;
  const now = new Date();
  const listings = await prisma.listing.findMany({
    where: publicListingWhere,
    select: { id: true, updatedAt: true },
  });
  return [
    ...PUBLIC_SITEMAP_ROUTES.map((route) => ({
      url: `${base}${route}`,
      lastModified: now,
      changeFrequency: route === "" || route === "/opportunities" ? "weekly" as const : "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...PILLARS.map((pillar) => ({
      url: `${base}/pillars/${pillar.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...listings.map((listing) => ({
      url: `${base}${projectHref(listing.id)}`,
      lastModified: listing.updatedAt ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
