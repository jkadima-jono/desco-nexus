import { spawnSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

const migrationName = "20260730213000_controlled_institutional_release";
const migrationFile = `prisma/migrations/${migrationName}/migration.sql`;

if (process.env.VERCEL_ENV !== "preview") {
  throw new Error("Preview migration refused outside Vercel Preview.");
}

if (
  !process.env.DATABASE_URL_UNPOOLED ||
  process.env.DIRECT_URL !== process.env.DATABASE_URL_UNPOOLED
) {
  throw new Error("Preview migration requires the isolated Neon unpooled connection.");
}

function runPrisma(args) {
  const executable = process.platform === "win32" ? "prisma.cmd" : "prisma";
  const result = spawnSync(executable, args, {
    env: process.env,
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

const prisma = new PrismaClient();

try {
  const [state] = await prisma.$queryRawUnsafe(`
    SELECT
      to_regclass('"_prisma_migrations"') IS NOT NULL AS "hasMigrationHistory",
      EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'Listing'
          AND column_name = 'currentCapitalAskUsd'
      ) AS "hasControlledRelease"
  `);

  if (!state.hasMigrationHistory) {
    if (!state.hasControlledRelease) {
      runPrisma([
        "db",
        "execute",
        "--file",
        migrationFile,
        "--schema",
        "prisma/schema.prisma",
      ]);
    }

    runPrisma(["migrate", "resolve", "--applied", migrationName]);
  }

  runPrisma(["migrate", "deploy"]);
} finally {
  await prisma.$disconnect();
}
