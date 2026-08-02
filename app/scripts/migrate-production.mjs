import { spawnSync } from "node:child_process";
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
process.exit(deployment.status);
