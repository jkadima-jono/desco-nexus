import assert from "node:assert/strict";
import test from "node:test";
import { buildVerificationUrl, configuredSiteOrigin, normalizeRegistrationName, openSignupConfig } from "../src/lib/openSignup";
import { clientIpHash } from "../src/lib/request-security";

test("open signup is fail-closed without its explicit flag and legal versions", () => {
  assert.equal(openSignupConfig({ NODE_ENV: "production" }).enabled, false);
  assert.equal(openSignupConfig({
    NODE_ENV: "production",
    OPEN_SIGNUP_ENABLED: "true",
    ACCOUNT_TERMS_VERSION: "terms-1",
    PRIVACY_NOTICE_VERSION: "privacy-1",
  }).enabled, false);
});

test("production signup requires configured mail delivery", () => {
  const config = openSignupConfig({
    NODE_ENV: "production",
    OPEN_SIGNUP_ENABLED: "true",
    ACCOUNT_TERMS_VERSION: "terms-1",
    PRIVACY_NOTICE_VERSION: "privacy-1",
    EMAIL_PROVIDER: "resend",
    EMAIL_PROVIDER_API_KEY: "secret",
    EMAIL_FROM_ADDRESS: "access@compass.desco.global",
  });
  assert.equal(config.enabled, true);
  assert.equal(config.emailAccessEnabled, true);
  assert.equal(config.termsVersion, "terms-1");
  assert.equal(config.privacyVersion, "privacy-1");
  assert.equal(openSignupConfig({
    NODE_ENV: "production",
    OPEN_SIGNUP_ENABLED: "true",
    ACCOUNT_TERMS_VERSION: "terms-1",
    PRIVACY_NOTICE_VERSION: "privacy-1",
    EMAIL_PROVIDER: "unsupported",
    EMAIL_PROVIDER_API_KEY: "secret",
    EMAIL_FROM_ADDRESS: "access@compass.desco.global",
  }).enabled, false);
});

test("existing-account email access remains available when registration is paused", () => {
  const config = openSignupConfig({
    NODE_ENV: "production",
    EMAIL_PROVIDER: "resend",
    EMAIL_PROVIDER_API_KEY: "secret",
    EMAIL_FROM_ADDRESS: "access@compass.desco.global",
  });
  assert.equal(config.enabled, false);
  assert.equal(config.emailAccessEnabled, true);
});

test("site origin rejects unsafe production origins and strips paths", () => {
  assert.equal(configuredSiteOrigin({ NODE_ENV: "production", NEXT_PUBLIC_SITE_URL: "http://compass.desco.global" }), null);
  assert.equal(
    configuredSiteOrigin({ NODE_ENV: "production", NEXT_PUBLIC_SITE_URL: "https://compass.desco.global/some/path" }),
    "https://compass.desco.global",
  );
  assert.equal(configuredSiteOrigin({ NODE_ENV: "development", NEXT_PUBLIC_SITE_URL: "http://localhost:3000" }), "http://localhost:3000");
});

test("registration names are normalized and bounded", () => {
  assert.equal(normalizeRegistrationName("  Amara   Diallo "), "Amara Diallo");
  assert.equal(normalizeRegistrationName("A"), null);
  assert.equal(normalizeRegistrationName("x".repeat(101)), null);
});

test("verification bearer tokens stay out of server-visible query parameters", () => {
  const value = buildVerificationUrl("https://compass.desco.global", "secret-token", "/mandates");
  const url = new URL(value);
  assert.equal(url.searchParams.get("token"), null);
  assert.equal(url.searchParams.get("next"), "/mandates");
  assert.equal(new URLSearchParams(url.hash.slice(1)).get("token"), "secret-token");
});

test("client addresses are reduced to stable non-reversible hashes", () => {
  const request = new Request("https://compass.desco.global/api/auth/login", {
    headers: { "x-real-ip": "203.0.113.8", "x-forwarded-for": "198.51.100.4" },
  });
  const value = clientIpHash(request);
  assert.match(value, /^[a-f0-9]{64}$/);
  assert.equal(value.includes("203.0.113.8"), false);
  assert.equal(value, clientIpHash(request));
});
