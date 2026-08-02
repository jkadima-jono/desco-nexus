import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DESCO Compass",
    short_name: "Compass",
    description: "Structured investment-opportunity screening and controlled diligence.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f5ee",
    theme_color: "#111b24",
    icons: [
      { src: "/brand/desco-compass-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/desco-compass-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
