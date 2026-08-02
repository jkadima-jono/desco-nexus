import LoginClient from "@/app/login/LoginClient";
import { openSignupConfig } from "@/lib/openSignup";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create account — DESCO Compass", robots: { index: false, follow: false } };

export default function SignupPage() {
  return <LoginClient demoEnabled={false} adminEnabled={false} signupEnabled={openSignupConfig().enabled} mode="signup" />;
}
