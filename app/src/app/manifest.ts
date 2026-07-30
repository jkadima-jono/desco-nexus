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
      { src: "/brand/desco-globe.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/brand/desco-coin.png", sizes: "400x400", type: "image/png", purpose: "any" },
    ],
  };
}
