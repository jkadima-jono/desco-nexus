import { spawnSync } from "node:child_process";

const env = { ...process.env };

// Vercel's Neon integration provides the unpooled connection under this name.
// Preserve an explicitly configured DIRECT_URL, including the production value.
env.DIRECT_URL ||= env.DATABASE_URL_UNPOOLED;

const steps = [
  ["prisma", ["generate"]],
  ["node", ["--import", "tsx", "scripts/predeploy-check.ts"]],
  ["next", ["build"]],
];

for (const [command, args] of steps) {
  const executable = process.platform === "win32" ? `${command}.cmd` : command;
  const result = spawnSync(executable, args, {
    env,
    stdio: "inherit",
    shell: false,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
