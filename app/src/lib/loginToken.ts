import crypto from "crypto";
import { prisma } from "./db";

// Sign-in links are bearer credentials: anyone holding the raw token can
// become the account. The properties below are what keep that safe, and
// each one is unit-tested in tests/loginToken.test.ts.
//
//  - 32 bytes of CSPRNG entropy, base64url encoded (not Math.random).
//  - Only the SHA-256 hash is persisted, so a database read cannot be
//    replayed into a session.
//  - Short TTL, and single-use: consuming marks consumedAt.
//  - Lookup is by hash, so a token is found without ever comparing raw
//    secrets in the database.
export const LOGIN_TOKEN_TTL_MINUTES = 15;

const TOKEN_BYTES = 32;

export function createLoginTokenValue(): string {
  return crypto.randomBytes(TOKEN_BYTES).toString("base64url");
}

export function hashLoginToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export function loginTokenExpiry(now: Date = new Date()): Date {
  return new Date(now.getTime() + LOGIN_TOKEN_TTL_MINUTES * 60_000);
}

// Normalizing here (not at the call site) keeps "A@B.com" and "a@b.com"
// from issuing two independent tokens for the same mailbox.
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  const value = normalizeEmail(email);
  if (value.length < 3 || value.length > 254) return false;
  if (value.includes("..") || value.includes(" ")) return false;
  const at = value.indexOf("@");
  if (at <= 0 || at !== value.lastIndexOf("@")) return false;
  const domain = value.slice(at + 1);
  if (!domain.includes(".") || domain.startsWith(".") || domain.endsWith(".")) return false;
  if (domain.startsWith("-") || value.startsWith(".") || value[at - 1] === ".") return false;
  return true;
}

export type LoginTokenState = {
  expiresAt: Date;
  consumedAt: Date | null;
};

// Pure predicate so expiry/replay rules can be tested without a database.
export function isLoginTokenUsable(
  token: LoginTokenState | null | undefined,
  now: Date = new Date()
): boolean {
  if (!token) return false;
  if (token.consumedAt !== null) return false;
  return token.expiresAt.getTime() > now.getTime();
}

// ---------- database-backed operations ----------

export async function issueLoginToken(
  email: string,
  requestIp: string | null
): Promise<{ rawToken: string; expiresAt: Date }> {
  const normalized = normalizeEmail(email);
  const rawToken = createLoginTokenValue();
  const expiresAt = loginTokenExpiry();

  // Invalidate this address's outstanding links so a freshly requested
  // link is the only usable one.
  await prisma.loginToken.updateMany({
    where: { email: normalized, consumedAt: null },
    data: { consumedAt: new Date() },
  });

  await prisma.loginToken.create({
    data: { email: normalized, tokenHash: hashLoginToken(rawToken), expiresAt, requestIp },
  });

  return { rawToken, expiresAt };
}

// Atomically consumes a token. Returns the verified email, or null if the
// token is unknown, expired, or already used — the caller must not be able
// to distinguish these cases in its response.
export async function consumeLoginToken(rawToken: string): Promise<string | null> {
  const tokenHash = hashLoginToken(rawToken);
  const record = await prisma.loginToken.findUnique({ where: { tokenHash } });
  if (!isLoginTokenUsable(record)) return null;

  // Conditional update: if a concurrent request consumed it first, count
  // is 0 and this caller correctly gets nothing.
  const claimed = await prisma.loginToken.updateMany({
    where: { tokenHash, consumedAt: null },
    data: { consumedAt: new Date() },
  });
  if (claimed.count === 0) return null;

  return record!.email;
}
