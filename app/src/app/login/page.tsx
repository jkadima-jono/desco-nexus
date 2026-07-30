import LoginClient from "./LoginClient";

export default function LoginPage() {
  const demoEnabled =
    process.env.VERCEL_ENV !== "production" &&
    process.env.ENABLE_DEMO_AUTH !== "false";

  return <LoginClient demoEnabled={demoEnabled} />;
}
