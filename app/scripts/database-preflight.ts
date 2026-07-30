import { PrismaClient } from "@prisma/client";

const url = process.env.TEST_DATABASE_URL?.trim();
if (!url || process.env.TEST_DATABASE_ISOLATED !== "true") {
  throw new Error("Set TEST_DATABASE_URL and TEST_DATABASE_ISOLATED=true for an approved isolated restore.");
}

let parsed: URL;
try {
  parsed = new URL(url);
} catch {
  throw new Error("TEST_DATABASE_URL must be a valid URL.");
}
if (!["postgres:", "postgresql:"].includes(parsed.protocol)) {
  throw new Error("TEST_DATABASE_URL must use Postgres.");
}
const identity = `${parsed.hostname}${parsed.pathname}`.toLowerCase();
if (/(^|[._/-])(prod|production|primary|live)([._/-]|$)/.test(identity)) {
  throw new Error("Refusing preflight: TEST_DATABASE_URL appears to identify production.");
}
if (process.env.DATABASE_URL?.trim() !== url) {
  throw new Error("DATABASE_URL must exactly match TEST_DATABASE_URL for this read-only preflight.");
}

async function main() {
  const prisma = new PrismaClient();
  try {
  const columns = await prisma.$queryRaw<Array<{ table_name: string; column_name: string }>>`
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name IN ('ListingImage', 'Document')
  `;
  const present = new Set(columns.map(({ table_name, column_name }) => `${table_name}.${column_name}`));

  const output: Record<string, unknown> = {
    mode: "read_only",
    checkedAt: new Date().toISOString(),
    schema: {
      listingImagePosition: present.has("ListingImage.listingId") && present.has("ListingImage.position"),
      documentScanState:
        present.has("Document.scanStatus") &&
        present.has("Document.lifecycle") &&
        present.has("Document.blobUploadedAt"),
    },
  };

  if (present.has("ListingImage.listingId") && present.has("ListingImage.position")) {
    output.duplicateListingImagePositions = await prisma.$queryRaw<
      Array<{ listingId: string; position: number; duplicateCount: bigint }>
    >`
      SELECT "listingId", "position", COUNT(*)::bigint AS "duplicateCount"
      FROM "ListingImage"
      GROUP BY "listingId", "position"
      HAVING COUNT(*) > 1
      ORDER BY COUNT(*) DESC, "listingId", "position"
    `;
  } else {
    output.duplicateListingImagePositions = "not_checked_missing_columns";
  }

  if (
    present.has("Document.scanStatus") &&
    present.has("Document.lifecycle") &&
    present.has("Document.blobUploadedAt")
  ) {
    output.documentScanStates = await prisma.$queryRaw<
      Array<{ scanStatus: string; lifecycle: string; blobState: string; documentCount: bigint }>
    >`
      SELECT
        "scanStatus",
        "lifecycle",
        CASE WHEN "blobUploadedAt" IS NULL THEN 'not_confirmed' ELSE 'confirmed' END AS "blobState",
        COUNT(*)::bigint AS "documentCount"
      FROM "Document"
      GROUP BY "scanStatus", "lifecycle", "blobState"
      ORDER BY "scanStatus", "lifecycle", "blobState"
    `;
  } else {
    output.documentScanStates = "not_checked_missing_columns";
  }

  console.log(JSON.stringify(output, (_key, value) => typeof value === "bigint" ? value.toString() : value, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Database preflight failed.");
  process.exitCode = 1;
});
