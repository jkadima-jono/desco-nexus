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

// Listing "sector" strings (mock data) map to the pillar they belong to,
// so a sector always resolves to the correct brand color and icon.
export const SECTOR_TO_PILLAR: Record<string, string> = {
  Agriculture: "agridesco",
  Healthcare: "phardesco",
  Water: "waterdesco",
  Fintech: "investdesco",
  Infrastructure: "infrastructure",
  "Renewable Energy": "infrastructure",
};

export function pillarIcon(pillarSlug: string): string {
  return PILLAR_ICON[pillarSlug] ?? FALLBACK_ICON;
}
