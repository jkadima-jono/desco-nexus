export type CampaignAttribution = {
  source: string | null;
  medium: string | null;
  campaign: string | null;
};

export const CAMPAIGN_STORAGE_KEY = "desco_campaign_attribution";

const EMAIL_LIKE = /\b[^\s@]+@[^\s@]+\.[^\s@]+\b/;

export function sanitizeCampaignValue(value: string | null): string | null {
  const normalized = value?.trim().slice(0, 120) ?? "";
  return normalized && !EMAIL_LIKE.test(normalized) ? normalized : null;
}

export function campaignAttributionFromSearch(search: string): CampaignAttribution {
  const params = new URLSearchParams(search);
  return {
    source: sanitizeCampaignValue(params.get("utm_source")),
    medium: sanitizeCampaignValue(params.get("utm_medium")),
    campaign: sanitizeCampaignValue(params.get("utm_campaign")),
  };
}

export function hasCampaignAttribution(value: CampaignAttribution): boolean {
  return Boolean(value.source || value.medium || value.campaign);
}

export function parseStoredCampaignAttribution(raw: string | null): CampaignAttribution | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<CampaignAttribution>;
    const value = {
      source: sanitizeCampaignValue(typeof parsed.source === "string" ? parsed.source : null),
      medium: sanitizeCampaignValue(typeof parsed.medium === "string" ? parsed.medium : null),
      campaign: sanitizeCampaignValue(typeof parsed.campaign === "string" ? parsed.campaign : null),
    };
    return hasCampaignAttribution(value) ? value : null;
  } catch {
    return null;
  }
}

export function sanitizeAttributionReferrer(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return `${url.origin}${url.pathname}`.slice(0, 500);
  } catch {
    return null;
  }
}

type SessionStorageLike = Pick<Storage, "getItem" | "setItem">;

export function readCampaignAttribution(storage: SessionStorageLike): CampaignAttribution | null {
  try {
    return parseStoredCampaignAttribution(storage.getItem(CAMPAIGN_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function storeCampaignAttribution(
  storage: SessionStorageLike,
  attribution: CampaignAttribution,
): boolean {
  if (!hasCampaignAttribution(attribution)) return false;
  try {
    storage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(attribution));
    return true;
  } catch {
    return false;
  }
}
