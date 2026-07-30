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
if (siteUrl.hostname === "desco.global" || siteUrl.hostname === "www.desco.global") {
  throw new Error("NEXT_PUBLIC_SITE_URL must use the Compass application domain, not the corporate website.");
}

if (environment === "production" && process.env.DEMO_AUTH_ENABLED === "true") {
  throw new Error("DEMO_AUTH_ENABLED must not be true in production.");
}
if (
  process.env.CONFIDENTIAL_UPLOADS_ENABLED === "true" &&
  !process.env.DOCUMENT_SCANNER_PROVIDER?.trim()
) {
  throw new Error("Confidential uploads require a configured DOCUMENT_SCANNER_PROVIDER.");
}

console.log(`${environment} configuration verified for ${siteUrl.origin}.`);
