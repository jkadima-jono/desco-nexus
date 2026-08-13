import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DESCO Compass",
    short_name: "Compass",
    description: "Structured investment-opportunity screening and controlled diligence.",
    start_url: "/",
    display: "standalone",
    background_color: "#F2F3F3",
    theme_color: "#353535",
    icons: [
      { src: "/brand/desco-compass-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/desco-compass-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
