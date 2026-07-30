import LoginClient from "./LoginClient";
import { isDemoAdminEnabled, isDemoAuthEnabled } from "@/lib/demoAuth";

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

  return <LoginClient demoEnabled={demoEnabled} adminEnabled={adminEnabled} />;
}
