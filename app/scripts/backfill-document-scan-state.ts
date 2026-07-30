import { prisma } from "../src/lib/db";

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.split("=");
    return [key, rest.join("=")];
  }),
);
const ids = (args.get("--document-ids") ?? "").split(",").map((id) => id.trim()).filter(Boolean);
const status = args.get("--status");
const note = (args.get("--note") ?? "").trim();
const apply = args.has("--apply");

if (ids.length === 0) throw new Error("--document-ids=id1,id2 is required; bulk implicit classification is prohibited.");
if (status !== "pending" && status !== "not_required") {
  throw new Error("--status must be pending or not_required. This tool never marks a document clean.");
}
if (status === "not_required" && note.length < 20) {
  throw new Error("A specific --note of at least 20 characters is required for not_required.");
}

const documents = await prisma.document.findMany({
  where: { id: { in: ids } },
  select: { id: true, name: true, listingId: true, lifecycle: true, scanStatus: true, storageKey: true },
});
if (documents.length !== ids.length) throw new Error("One or more document IDs were not found; no changes made.");

console.log(JSON.stringify({ mode: apply ? "apply" : "preview", requestedStatus: status, documents }, null, 2));
if (!apply) {
  console.log("Preview only. Re-run with --apply after reviewing every document and recording the operator decision.");
} else {
  const result = await prisma.document.updateMany({
    where: { id: { in: ids } },
    data: {
      scanStatus: status,
      scanCheckedAt: status === "not_required" ? new Date() : null,
      scanNote: note || "Legacy document retained in quarantine pending an approved scan.",
    },
  });
  console.log(JSON.stringify({ updated: result.count }));
}

await prisma.$disconnect();
