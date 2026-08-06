import type { MetadataRoute } from "next";
import { metadataBaseUrl } from "@/lib/metadata";
import { PRIVATE_ROBOT_PATHS } from "@/lib/private-metadata";

export default function robots(): MetadataRoute.Robots {
  const base = metadataBaseUrl().origin;
  const isPublicProduction = process.env.VERCEL_ENV === "production";
  if (!isPublicProduction) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: [...PRIVATE_ROBOT_PATHS] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
