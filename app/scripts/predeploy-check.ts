const required = [
  "DATABASE_URL",
  "DIRECT_URL",
  "SESSION_SECRET",
  "BLOB_READ_WRITE_TOKEN",
  "NEXT_PUBLIC_SITE_URL",
] as const;
const environment = process.env.VERCEL_ENV?.trim() || "local";
const productionRequired = environment === "production" ? ["CRON_SECRET"] as const : [];

const missing = [...required, ...productionRequired].filter((name) => !process.env[name]?.trim());
if (missing.length > 0) {
  throw new Error(`${environment} configuration missing: ${missing.join(", ")}`);
}

if ((process.env.SESSION_SECRET?.length ?? 0) < 32) {
  throw new Error("SESSION_SECRET must contain at least 32 characters.");
}

const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL!);
if (siteUrl.protocol !== "https:") {
  throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS.");
}
if (environment === "production" && siteUrl.hostname !== "compass.desco.global") {
  throw new Error("Production NEXT_PUBLIC_SITE_URL must be https://compass.desco.global.");
}

if (environment === "production" && process.env.DEMO_AUTH_ENABLED === "true") {
  throw new Error("DEMO_AUTH_ENABLED must not be true in production.");
}
if (environment === "production" && process.env.ENABLE_PUBLIC_FORM_COLLECTION === "true") {
  throw new Error("Public form collection must remain disabled until CRM derivative-data retention is enforced.");
}
if (process.env.OPEN_SIGNUP_ENABLED === "true") {
  if (environment === "production") {
    throw new Error("Open signup must remain disabled until approved versioned terms and privacy documents are published on the site.");
  }
  const signupRequired = [
    "EMAIL_PROVIDER_API_KEY",
    "EMAIL_FROM_ADDRESS",
    "ACCOUNT_TERMS_VERSION",
    "PRIVACY_NOTICE_VERSION",
    "ACCOUNT_TERMS_APPROVED",
    "PRIVACY_NOTICE_APPROVED",
  ] as const;
  const signupMissing = signupRequired.filter((name) => !process.env[name]?.trim());
  if (signupMissing.length > 0) {
    throw new Error(`Open signup configuration missing: ${signupMissing.join(", ")}`);
  }
  if (process.env.EMAIL_PROVIDER !== "resend") {
    throw new Error('Open signup requires EMAIL_PROVIDER="resend".');
  }
  if (process.env.ACCOUNT_TERMS_APPROVED !== "true" || process.env.PRIVACY_NOTICE_APPROVED !== "true") {
    throw new Error("Open signup requires explicitly approved account terms and privacy notice.");
  }
}
if (
  process.env.CONFIDENTIAL_UPLOADS_ENABLED === "true" &&
  !process.env.DOCUMENT_SCANNER_PROVIDER?.trim()
) {
  throw new Error("Confidential uploads require a configured DOCUMENT_SCANNER_PROVIDER.");
}

console.log(`${environment} configuration verified for ${siteUrl.origin}.`);
