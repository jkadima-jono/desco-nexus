import type { Metadata } from "next";

const DEFAULT_SITE_ORIGIN = "https://compass.desco.global";
const SOCIAL_IMAGE = {
  url: "/brand/desco-coin.png",
  width: 400,
  height: 400,
  alt: "DESCO Compass seal",
};

function withProtocol(host: string) {
  return host.startsWith("http://") || host.startsWith("https://") ? host : `https://${host}`;
}

export function metadataBaseUrl() {
  const previewHost = process.env.VERCEL_ENV === "preview" ? process.env.VERCEL_URL : undefined;
  // The configured public origin is authoritative in production. Vercel's
  // project URL is a deployment host and may not be the domain users visit.
  const productionHost = process.env.VERCEL_ENV === "production"
    ? process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL
    : undefined;
  return new URL(withProtocol(previewHost || productionHost || process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_ORIGIN));
}

export function publicPageMetadata(
  title: string,
  description: string,
  options: { canonical?: string; openGraphTitle?: string } = {},
): Metadata {
  const openGraphTitle = options.openGraphTitle ?? title;
  return {
    title,
    description,
    ...(options.canonical ? { alternates: { canonical: options.canonical } } : {}),
    openGraph: {
      type: "website",
      siteName: "DESCO Compass",
      title: openGraphTitle,
      description,
      ...(options.canonical ? { url: options.canonical } : {}),
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary",
      title: openGraphTitle,
      description,
      images: [SOCIAL_IMAGE.url],
    },
  };
}
