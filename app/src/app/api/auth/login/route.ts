import { NextResponse } from "next/server";
import { issueLoginToken, isValidEmail, normalizeEmail } from "@/lib/loginToken";
import { sendLoginLink } from "@/lib/mailer";
import { buildVerificationUrl, configuredSiteOrigin, normalizeRegistrationName, openSignupConfig } from "@/lib/openSignup";
import { sanitizeNextPath } from "@/lib/nextParam";
import { applyIdentifierRateLimit, applyRateLimit, clientIpHash, rejectUntrustedOrigin } from "@/lib/request-security";

const GENERIC_RESPONSE = {
  ok: true,
  message: "If the address can receive a DESCO Compass link, check its inbox.",
};

export async function POST(req: Request) {
  const originRejection = rejectUntrustedOrigin(req);
  if (originRejection) return originRejection;

  const config = openSignupConfig();
  const siteOrigin = configuredSiteOrigin();
  if (!config.emailAccessEnabled || !siteOrigin) {
    return NextResponse.json({ error: "Email account access is not configured." }, { status: 503 });
  }

  const ipLimited = await applyRateLimit(req, "auth-login-ip", 10, 15 * 60_000);
  if (ipLimited) return ipLimited;

  let body: { email?: unknown; fullName?: unknown; acceptedTerms?: unknown; next?: unknown; locale?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof body.email !== "string" || !isValidEmail(body.email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const email = normalizeEmail(body.email);
  const emailLimited = await applyIdentifierRateLimit(email, "auth-login-email", 5, 60 * 60_000);
  if (emailLimited) return emailLimited;

  const hasRegistrationInput = body.fullName !== undefined || body.acceptedTerms !== undefined;
  if (hasRegistrationInput && !config.enabled) {
    return NextResponse.json({ error: "New account registration is not available." }, { status: 403 });
  }
  const fullName = normalizeRegistrationName(body.fullName);
  if (hasRegistrationInput && (!fullName || body.acceptedTerms !== true)) {
    return NextResponse.json({ error: "Name and acceptance of the current terms are required to create an account." }, { status: 400 });
  }

  const requestIp = clientIpHash(req);
  const next = sanitizeNextPath(typeof body.next === "string" ? body.next : null);
  const issued = await issueLoginToken(
    email,
    requestIp,
    fullName
      ? { fullName, termsVersion: config.termsVersion, privacyVersion: config.privacyVersion }
      : undefined,
  );
  // Keep the bearer credential in the URL fragment. Fragments are not sent
  // to Vercel, application servers, reverse proxies or referrer headers.
  const url = buildVerificationUrl(siteOrigin, issued.rawToken, next);
  const locale = typeof body.locale === "string" && ["en", "fr", "es", "pt", "zh"].includes(body.locale) ? body.locale : "en";
  const sent = await sendLoginLink({ to: email, url, expiresAt: issued.expiresAt, locale });
  if (!sent.ok) {
    // Do not vary this error by account existence. The operational failure is
    // configuration/delivery-wide and the issued token remains undisclosed.
    return NextResponse.json({ error: "Email delivery is temporarily unavailable." }, { status: 503 });
  }

  return NextResponse.json(GENERIC_RESPONSE, {
    status: 202,
    headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" },
  });
}
