export type DemoAuthEnvironment = {
  nodeEnv?: string;
  vercelEnv?: string;
  explicitFlag?: string;
};

/**
 * Demo access is open by default only for local development and Vercel
 * previews. Production remains fail-closed unless the project owner sets
 * DEMO_AUTH_ENABLED=true for that environment.
 */
export function isDemoAuthEnabled({
  nodeEnv,
  vercelEnv,
  explicitFlag,
}: DemoAuthEnvironment): boolean {
  if (explicitFlag === "true") return true;
  return nodeEnv !== "production" || vercelEnv === "preview";
}
