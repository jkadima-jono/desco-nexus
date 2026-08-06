import type { MetadataRoute } from "next";
import { metadataBaseUrl } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  const base = metadataBaseUrl().origin;
  const isPublicProduction = process.env.VERCEL_ENV === "production";
  if (!isPublicProduction) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/", "/deals/", "/messages/", "/portfolio/", "/saved/"] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
