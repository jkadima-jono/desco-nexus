import { spawnSync } from "node:child_process";

const legacyMigration = "20260730213000_controlled_institutional_release";
const env = { ...process.env };
env.DIRECT_URL ||= env.DATABASE_URL_UNPOOLED;

function runPrisma(args) {
  const executable = process.platform === "win32" ? "prisma.cmd" : "prisma";
  const result = spawnSync(executable, args, {
    env,
    encoding: "utf8",
    shell: false,
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) throw result.error;

  return {
    status: result.status ?? 1,
    output: `${result.stdout ?? ""}\n${result.stderr ?? ""}`,
  };
}

const deployment = runPrisma(["migrate", "deploy"]);
if (deployment.status === 0) process.exit(0);

// The live database predates Prisma's migration ledger. Only baseline the
// documented legacy migration, and only when Prisma reports that exact state.
if (!deployment.output.includes("P3005")) process.exit(deployment.status);

console.log(`Baselining existing production schema at ${legacyMigration}.`);
const baseline = runPrisma(["migrate", "resolve", "--applied", legacyMigration]);
if (baseline.status !== 0) process.exit(baseline.status);

const retry = runPrisma(["migrate", "deploy"]);
process.exit(retry.status);
