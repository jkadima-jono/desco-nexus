// Single source of truth for Desco brand color tokens and pillar→logo
// mapping. Every component that renders a pillar color or icon must import
// from here — no hardcoded hex values or icon paths elsewhere.

export const DESCO_COLORS = {
  brandred: "#C41E3A",
  gold: "#B8953D",
  emerald: "#00A550",
  blue: "#0066CC",
  deepblue: "#0047AB",
  orange: "#FF8C00",
  charcoal: "#2C3E50",
  wgray: "#7F8C8D",
} as const;

// Official Desco Global pillar icons (only these four exist as real assets).
export const PILLAR_ICON: Record<string, string> = {
  agridesco: "/brand/pillars/agri.png",
  phardesco: "/brand/pillars/phar.png",
  waterdesco: "/brand/pillars/water.png",
  investdesco: "/brand/pillars/invest.png",
};

// Every pillar/sector without a dedicated icon falls back to the Desco
// coin — never a placeholder letter, never a mismatched borrowed icon.
export const FALLBACK_ICON = "/brand/desco-coin.png";

// Listing "sector" strings map to the pillar they belong to, so a sector
// always resolves to the correct brand color and icon. Mining and
// Infrastructure both resolve to Investdesco — per Desco Global's own
// investor deck: "Investdesco serves as the dedicated mining investment
// pillar of Desco Global" and "Investdesco builds and operates the
// critical logistics and industrial infrastructure." There is no
// separate "Mining" or "Infrastructure" pillar in the real organization.
export const SECTOR_TO_PILLAR: Record<string, string> = {
  Agriculture: "agridesco",
  Healthcare: "phardesco",
  Water: "waterdesco",
  Mining: "investdesco",
  Infrastructure: "investdesco",
};

export function pillarIcon(pillarSlug: string): string {
  return PILLAR_ICON[pillarSlug] ?? FALLBACK_ICON;
}
