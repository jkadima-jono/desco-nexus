const required = [
  "DATABASE_URL",
  "DIRECT_URL",
  "SESSION_SECRET",
  "BLOB_READ_WRITE_TOKEN",
  "NEXT_PUBLIC_SITE_URL",
] as const;

const missing = required.filter((name) => !process.env[name]?.trim());
if (missing.length > 0) {
  throw new Error(`Production configuration missing: ${missing.join(", ")}`);
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

if (process.env.VERCEL_ENV === "production" && process.env.DEMO_AUTH_ENABLED !== "true") {
  throw new Error("Production has no usable sign-in path. Set DEMO_AUTH_ENABLED=true until verified email sign-in is approved.");
}

console.log(`Production configuration verified for ${siteUrl.origin}.`);
