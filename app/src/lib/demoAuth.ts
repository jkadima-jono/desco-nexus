export type DemoAuthEnvironment = {
  nodeEnv?: string;
  vercelEnv?: string;
  explicitFlag?: string;
};

/**
 * Demo access is limited to local development and Vercel previews.
 * Production remains fail-closed even if a stale environment flag is present.
 */
export function isDemoAuthEnabled({
  nodeEnv,
  vercelEnv,
}: DemoAuthEnvironment): boolean {
  if (vercelEnv === "production") return false;
  return nodeEnv !== "production" || vercelEnv === "preview";
}

export function isDemoAdminEnabled({
  nodeEnv,
  vercelEnv,
}: DemoAuthEnvironment): boolean {
  return nodeEnv !== "production" && !vercelEnv;
}
