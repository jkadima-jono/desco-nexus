import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://compass.desco.global";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/", "/deals/", "/messages/", "/portfolio/", "/saved/"] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
