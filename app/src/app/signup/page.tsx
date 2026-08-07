import LoginClient from "@/app/login/LoginClient";
import { openSignupConfig } from "@/lib/openSignup";
import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n-server";
import { accountCopy } from "@/lib/translations/account";

export async function generateMetadata(): Promise<Metadata> {
  const copy = accountCopy(await getLocale());
  return {
    title: `${copy.createAccount} — DESCO Compass`,
    description: copy.unavailableBody,
    robots: { index: false, follow: false },
  };
}

export default function SignupPage() {
  const access = openSignupConfig();
  return <LoginClient demoEnabled={false} adminEnabled={false} signupEnabled={access.enabled} accessEnabled={access.emailAccessEnabled} mode="signup" />;
}
