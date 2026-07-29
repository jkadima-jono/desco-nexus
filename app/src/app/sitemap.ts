import type { MetadataRoute } from "next";
import { listings } from "@/lib/data";
import { PILLARS } from "@/lib/pillars";
import { projectHref } from "@/lib/project-slugs";

const PUBLIC_ROUTES = [
  "", "/about", "/contact", "/diligence", "/investors", "/opportunities",
  "/partners", "/pillars", "/pricing", "/sponsors", "/trust",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://compass.desco.global";
  const now = new Date();
  return [
    ...PUBLIC_ROUTES.map((route) => ({
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
