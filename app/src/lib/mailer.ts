// Outbound authentication email. Production supports Resend only and fails
// closed until a verified sending address and API key are configured.

export type MailerResult =
  | { ok: true; channel: "provider" | "console" }
  | { ok: false; reason: "not_configured" | "send_failed" };

export type LoginLinkMail = {
  to: string;
  url: string;
  expiresAt: Date;
  locale?: string;
};

export function isMailerConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(
    env.EMAIL_PROVIDER === "resend" &&
    env.EMAIL_PROVIDER_API_KEY &&
    env.EMAIL_FROM_ADDRESS,
  );
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

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]!);
}

async function sendViaProvider(mail: LoginLinkMail): Promise<void> {
  if (process.env.EMAIL_PROVIDER !== "resend") throw new Error("Unsupported email provider");
  const apiKey = process.env.EMAIL_PROVIDER_API_KEY;
  const from = process.env.EMAIL_FROM_ADDRESS;
  if (!apiKey || !from) throw new Error("Email provider is not configured");
  const safeUrl = escapeHtml(mail.url);
  const copy = {
    en: { subject: "Your secure DESCO Compass sign-in link", intro: "Confirm your DESCO Compass sign-in", action: "Confirm and continue", note: "This one-time link expires in 15 minutes. If you did not request it, ignore this email." },
    fr: { subject: "Votre lien sécurisé DESCO Compass", intro: "Confirmez votre connexion à DESCO Compass", action: "Confirmer et continuer", note: "Ce lien à usage unique expire dans 15 minutes. Si vous ne l’avez pas demandé, ignorez cet e-mail." },
    es: { subject: "Su enlace seguro de DESCO Compass", intro: "Confirme su inicio de sesión en DESCO Compass", action: "Confirmar y continuar", note: "Este enlace de un solo uso caduca en 15 minutos. Si no lo solicitó, ignore este correo." },
    pt: { subject: "O seu link seguro da DESCO Compass", intro: "Confirme o início de sessão na DESCO Compass", action: "Confirmar e continuar", note: "Este link de utilização única expira em 15 minutos. Se não o solicitou, ignore este e-mail." },
    zh: { subject: "DESCO Compass 安全登录链接", intro: "确认登录 DESCO Compass", action: "确认并继续", note: "此一次性链接将在 15 分钟后过期。如非本人申请，请忽略此邮件。" },
  }[mail.locale as "en" | "fr" | "es" | "pt" | "zh"] ?? null;
  const localized = copy ?? { subject: "Your secure DESCO Compass sign-in link", intro: "Confirm your DESCO Compass sign-in", action: "Confirm and continue", note: "This one-time link expires in 15 minutes. If you did not request it, ignore this email." };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [mail.to],
      subject: localized.subject,
      text: `${localized.intro}: ${mail.url}\n\n${localized.note}`,
      html: `<p>${escapeHtml(localized.intro)}:</p><p><a href="${safeUrl}">${escapeHtml(localized.action)}</a></p><p>${escapeHtml(localized.note)}</p>`,
    }),
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`Email provider returned ${response.status}`);
}
