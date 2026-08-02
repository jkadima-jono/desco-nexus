export type CampaignAttribution = {
  source: string | null;
  medium: string | null;
  campaign: string | null;
};

export const CAMPAIGN_STORAGE_KEY = "desco_campaign_attribution";

function bounded(value: string | null): string | null {
  const normalized = value?.trim().slice(0, 120) ?? "";
  return normalized || null;
}

export function campaignAttributionFromSearch(search: string): CampaignAttribution {
  const params = new URLSearchParams(search);
  return {
    source: bounded(params.get("utm_source")),
    medium: bounded(params.get("utm_medium")),
    campaign: bounded(params.get("utm_campaign")),
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
      source: bounded(typeof parsed.source === "string" ? parsed.source : null),
      medium: bounded(typeof parsed.medium === "string" ? parsed.medium : null),
      campaign: bounded(typeof parsed.campaign === "string" ? parsed.campaign : null),
    };
    return hasCampaignAttribution(value) ? value : null;
  } catch {
    return null;
  }
}
