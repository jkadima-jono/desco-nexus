import { isMailerConfigured } from "./mailer";

export type OpenSignupConfig = {
  enabled: boolean;
  termsVersion: string;
  privacyVersion: string;
};

export function openSignupConfig(env: NodeJS.ProcessEnv = process.env): OpenSignupConfig {
  return {
    enabled:
      env.OPEN_SIGNUP_ENABLED === "true" &&
      Boolean(env.ACCOUNT_TERMS_VERSION?.trim()) &&
      Boolean(env.PRIVACY_NOTICE_VERSION?.trim()) &&
      (env.NODE_ENV !== "production" || isMailerConfigured(env)),
    termsVersion: env.ACCOUNT_TERMS_VERSION?.trim() ?? "",
    privacyVersion: env.PRIVACY_NOTICE_VERSION?.trim() ?? "",
  };
}

export function configuredSiteOrigin(env: NodeJS.ProcessEnv = process.env): string | null {
  const raw = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const localDevelopment = env.NODE_ENV !== "production" && ["localhost", "127.0.0.1"].includes(url.hostname);
    if (url.protocol !== "https:" && !localDevelopment) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function normalizeRegistrationName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/\s+/g, " ");
  if (normalized.length < 2 || normalized.length > 100) return null;
  return normalized;
}

export function buildVerificationUrl(siteOrigin: string, rawToken: string, next: string): string {
  const url = new URL("/auth/verify", siteOrigin);
  url.searchParams.set("next", next);
  url.hash = `token=${encodeURIComponent(rawToken)}`;
  return url.toString();
}
