// Single source of truth for Desco brand color tokens and pillar→logo
// mapping. Every component that renders a pillar color or icon must import
// from here — no hardcoded hex values or icon paths elsewhere.

export const DESCO_COLORS = {
  brandred: "#C41E3A",
  gold: "#B8953D",
  emerald: "#00A550",
  skyblue: "#0066CC",
  blue: "#0066CC",
  deepblue: "#0047AB",
  orange: "#FF8C00",
  charcoal: "#2C3E50",
  wgray: "#7F8C8D",
} as const;

// Official public colour assignment for Desco Global's four pillars.
// Keep sector and pillar colours aligned through this map instead of
// assigning colours independently in cards, forms, and story pages.
export const PILLAR_COLOR: Record<string, string> = {
  agridesco: DESCO_COLORS.emerald,
  investdesco: DESCO_COLORS.brandred,
  phardesco: DESCO_COLORS.gold,
  waterdesco: DESCO_COLORS.skyblue,
};

// Official Desco Global pillar icons (only these four exist as real assets).
export const PILLAR_ICON: Record<string, string> = {
  agridesco: "/brand/pillars/agri.png",
  phardesco: "/brand/pillars/phar.png",
  waterdesco: "/brand/pillars/water.png",
  investdesco: "/brand/pillars/invest.png",
};

// Every pillar/sector without a dedicated icon falls back to the official
// DESCO Compass emblem — never a placeholder letter or borrowed icon.
export const FALLBACK_ICON = "/brand/desco-compass-logo.jpg";

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
  Energy: "investdesco",
};

export function pillarIcon(pillarSlug: string): string {
  return PILLAR_ICON[pillarSlug] ?? FALLBACK_ICON;
}

export function pillarColor(pillarSlug: string): string {
  return PILLAR_COLOR[pillarSlug] ?? DESCO_COLORS.charcoal;
}

export function sectorColor(sector: string): string {
  return pillarColor(SECTOR_TO_PILLAR[sector] ?? "");
}

// Gold, green, and sky blue need dark text to meet contrast requirements.
// Investdesco red is dark enough to retain white text.
export function pillarForeground(pillarSlug: string): string {
  return pillarSlug === "investdesco" ? "#FFFFFF" : "#353535";
}

export function sectorForeground(sector: string): string {
  return pillarForeground(SECTOR_TO_PILLAR[sector] ?? "");
}
