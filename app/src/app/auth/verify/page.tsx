import VerifyClient from "./VerifyClient";
import { openSignupConfig } from "@/lib/openSignup";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Confirm sign-in — DESCO Compass", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default function VerifyPage() {
  return <VerifyClient enabled={openSignupConfig().enabled} />;
}
