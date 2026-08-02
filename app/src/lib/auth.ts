import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./db";

export const SESSION_COOKIE = "nexus_session";

const DEVELOPMENT_SECRET = "nexus-dev-secret-do-not-use-in-production";
const SESSION_ISSUER = "desco-compass";
const SESSION_AUDIENCE = "desco-compass-web";

function sessionSecret(): Uint8Array {
  const configured = process.env.SESSION_SECRET;
  if (
    process.env.NODE_ENV === "production" &&
    (!configured || configured === DEVELOPMENT_SECRET || configured.length < 32)
  ) {
    throw new Error("SESSION_SECRET must be set to at least 32 characters in production");
  }
  return new TextEncoder().encode(configured ?? DEVELOPMENT_SECRET);
}

export async function createSessionToken(userId: string): Promise<string> {
  const session = await prisma.session.create({ data: { userId } });
  return new SignJWT({ sub: userId, jti: session.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setExpirationTime("7d")
    .sign(sessionSecret());
}

// Revokes the session tied to the current request's cookie, so the token
// stops being accepted immediately rather than staying valid until it
// naturally expires. No-op if there is no session (already signed out).
export async function revokeCurrentSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return;
  try {
    const { payload } = await jwtVerify(token, sessionSecret(), {
      algorithms: ["HS256"],
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    });
    if (typeof payload.jti === "string") {
      await prisma.session.update({ where: { id: payload.jti }, data: { revokedAt: new Date() } });
    }
  } catch {
    // Invalid/expired token — nothing to revoke.
  }
}

export async function revokeAllSessions(userId: string): Promise<void> {
  await prisma.session.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function getSessionUser() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, sessionSecret(), {
      algorithms: ["HS256"],
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    });
    if (typeof payload.sub !== "string" || typeof payload.jti !== "string") return null;
    const session = await prisma.session.findUnique({ where: { id: payload.jti } });
    if (!session || session.revokedAt !== null || session.userId !== payload.sub) return null;
    return prisma.user.findUnique({ where: { id: payload.sub } });
  } catch {
    return null;
  }
}
