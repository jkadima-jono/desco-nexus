import LoginClient from "./LoginClient";
import { isDemoAdminEnabled, isDemoAuthEnabled } from "@/lib/demoAuth";
import { openSignupConfig } from "@/lib/openSignup";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign in — DESCO Compass", robots: { index: false, follow: false } };

export default function LoginPage() {
  const demoEnabled = isDemoAuthEnabled({
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    explicitFlag: process.env.DEMO_AUTH_ENABLED,
  });
  const adminEnabled = isDemoAdminEnabled({
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  });

  const access = openSignupConfig();
  return <LoginClient demoEnabled={demoEnabled} adminEnabled={adminEnabled} signupEnabled={access.enabled} accessEnabled={access.emailAccessEnabled} />;
}
