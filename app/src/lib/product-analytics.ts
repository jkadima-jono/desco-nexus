const CONTEXT_KEYS = new Set([
  "campaignMedium",
  "campaignName",
  "campaignSource",
  "draftCreated",
  "hasProject",
  "investorType",
  "listingId",
  "locale",
  "sector",
  "status",
  "topic",
]);

const EMAIL_LIKE = /\b[^\s@]+@[^\s@]+\.[^\s@]+\b/;
const SAFE_PATH = /^\/[A-Za-z0-9/_-]*$/;

export function sanitizeProductEventPath(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/")) return "/";
  let pathname: string;
  try {
    pathname = new URL(value, "https://compass.invalid").pathname;
  } catch {
    return "/";
  }
  if (!SAFE_PATH.test(pathname)) return "/redacted";
  return pathname.slice(0, 240) || "/";
}

export function sanitizeProductEventContext(value: unknown): Record<string, string | number | boolean> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key, item]) => CONTEXT_KEYS.has(key) && ["string", "number", "boolean"].includes(typeof item))
      .slice(0, 10)
      .flatMap(([key, item]) => {
        if (typeof item !== "string") return [[key, item]];
        const bounded = item.trim().slice(0, 120);
        if (!bounded || EMAIL_LIKE.test(bounded)) return [];
        return [[key, bounded]];
      }),
  );
}
