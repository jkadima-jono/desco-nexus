// Unit tests for the email sign-in token rules. These deliberately avoid
// the database and any mail provider: every property asserted here is a
// security property of the token itself.
// Run: npx tsx --test tests/loginToken.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  LOGIN_TOKEN_TTL_MINUTES,
  createLoginTokenValue,
  hashLoginToken,
  isLoginTokenUsable,
  isValidEmail,
  loginTokenExpiry,
  normalizeEmail,
} from "../src/lib/loginToken";
import { isMailerConfigured, sendLoginLink } from "../src/lib/mailer";

test("tokens carry enough entropy and never repeat", () => {
  const seen = new Set<string>();
  for (let i = 0; i < 500; i += 1) seen.add(createLoginTokenValue());
  assert.equal(seen.size, 500, "every generated token must be unique");

  const sample = createLoginTokenValue();
  // 32 random bytes -> 43 base64url chars, URL-safe (no +, /, =).
  assert.match(sample, /^[A-Za-z0-9_-]{43}$/);
});

test("only the hash is suitable for storage: it is stable and not the token", () => {
  const raw = createLoginTokenValue();
  const hash = hashLoginToken(raw);
  assert.equal(hash, hashLoginToken(raw), "hashing must be deterministic");
  assert.notEqual(hash, raw, "raw token must never equal its stored form");
  assert.match(hash, /^[a-f0-9]{64}$/, "sha-256 hex digest");
  assert.notEqual(hash, hashLoginToken(createLoginTokenValue()));
});

test("a fresh token is usable and expires after the TTL", () => {
  const now = new Date("2026-07-24T12:00:00.000Z");
  const expiresAt = loginTokenExpiry(now);
  assert.equal(expiresAt.getTime() - now.getTime(), LOGIN_TOKEN_TTL_MINUTES * 60_000);

  assert.equal(isLoginTokenUsable({ expiresAt, consumedAt: null }, now), true);

  const justBefore = new Date(expiresAt.getTime() - 1);
  assert.equal(isLoginTokenUsable({ expiresAt, consumedAt: null }, justBefore), true);

  const atExpiry = new Date(expiresAt.getTime());
  assert.equal(isLoginTokenUsable({ expiresAt, consumedAt: null }, atExpiry), false, "expiry is exclusive");

  const afterExpiry = new Date(expiresAt.getTime() + 1000);
  assert.equal(isLoginTokenUsable({ expiresAt, consumedAt: null }, afterExpiry), false);
});

test("a consumed token cannot be replayed, even before it expires", () => {
  const now = new Date("2026-07-24T12:00:00.000Z");
  const expiresAt = loginTokenExpiry(now);
  assert.equal(
    isLoginTokenUsable({ expiresAt, consumedAt: new Date("2026-07-24T12:00:01.000Z") }, now),
    false
  );
});

test("a missing token is never usable", () => {
  assert.equal(isLoginTokenUsable(null), false);
  assert.equal(isLoginTokenUsable(undefined), false);
});

test("email normalization prevents duplicate links for one mailbox", () => {
  assert.equal(normalizeEmail("  Investor@Desco.Global "), "investor@desco.global");
});

test("email validation rejects malformed addresses", () => {
  for (const good of ["a@b.co", "investor@desco.global", "first.last@sub.example.com"]) {
    assert.equal(isValidEmail(good), true, `${good} should be accepted`);
  }
  for (const bad of [
    "", "no-at-sign", "@example.com", "user@", "user@@example.com",
    "user@example", "user@.com", "user@example.", "user name@example.com",
    "user..name@example.com", "user@exa..mple.com", ".user@example.com",
  ]) {
    assert.equal(isValidEmail(bad), false, `${bad} should be rejected`);
  }
});

test("mailer reports unconfigured rather than faking a send in production", async () => {
  assert.equal(isMailerConfigured(), false, "no provider is wired up yet");

  const previousVercelEnv = process.env.VERCEL_ENV;
  try {
    process.env.VERCEL_ENV = "production";
    const result = await sendLoginLink({
      to: "investor@desco.global",
      url: "https://example.invalid/auth/verify?token=x",
      expiresAt: new Date(),
    });
    assert.deepEqual(result, { ok: false, reason: "not_configured" });
  } finally {
    if (previousVercelEnv === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previousVercelEnv;
  }
});
