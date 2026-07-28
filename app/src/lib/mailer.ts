// Outbound email. No provider is wired up yet: DESCO has not selected one
// and no sending domain is verified, so this module deliberately FAILS
// CLOSED. It must never report success for mail it did not send, because
// the sign-in flow treats "sent" as "the user can now receive a link".
//
// To enable, implement sendViaProvider() against the chosen provider and
// set the environment variables it needs. Everything else — token issue,
// expiry, single-use, rate limiting — already works and is tested.

export type MailerResult =
  | { ok: true; channel: "provider" | "console" }
  | { ok: false; reason: "not_configured" | "send_failed" };

export type LoginLinkMail = {
  to: string;
  url: string;
  expiresAt: Date;
};

export function isMailerConfigured(): boolean {
  return Boolean(process.env.EMAIL_PROVIDER_API_KEY && process.env.EMAIL_FROM_ADDRESS);
}

// Development convenience only: with no provider configured and not in
// production, print the link to the server log so the flow is testable
// locally. Never enabled in production — there, unconfigured means failure.
function allowConsoleFallback(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.VERCEL_ENV !== "production";
}

export async function sendLoginLink(mail: LoginLinkMail): Promise<MailerResult> {
  if (!isMailerConfigured()) {
    if (allowConsoleFallback()) {
      // eslint-disable-next-line no-console
      console.info(
        `[mailer] no provider configured — login link for ${mail.to}: ${mail.url} (expires ${mail.expiresAt.toISOString()})`
      );
      return { ok: true, channel: "console" };
    }
    return { ok: false, reason: "not_configured" };
  }

  try {
    await sendViaProvider(mail);
    return { ok: true, channel: "provider" };
  } catch {
    return { ok: false, reason: "send_failed" };
  }
}

// Intentionally unimplemented. Throwing (rather than silently resolving)
// means a half-finished integration surfaces as send_failed instead of
// pretending a link was delivered.
async function sendViaProvider(_mail: LoginLinkMail): Promise<void> {
  throw new Error("No email provider implementation is wired up yet");
}
