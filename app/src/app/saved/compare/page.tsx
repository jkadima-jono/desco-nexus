import Link from "next/link";
import { prisma } from "@/lib/db";
import { fmtUsd } from "@/lib/data";
import CompareExportButton from "./CompareExportButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Compare Opportunities — DESCO Nexus",
};

const NOT_DISCLOSED = "Not disclosed";

// Fields the platform actually holds on a published Listing. Several rows
// the master spec asks for (revenue model, sponsor contribution, timetable)
// are captured on the owner's ProjectSubmission but are not copied onto the
// public Listing record, so they render as NOT_DISCLOSED here rather than
// being fabricated or silently dropped from the table.
type Row = {
  label: string;
  value: (l: NonNullable<Awaited<ReturnType<typeof getListings>>>[number]) => string;
};

async function getListings(ids: string[]) {
  if (ids.length === 0) return [];
  return prisma.listing.findMany({ where: { id: { in: ids } }, include: { org: true } });
}

const ROWS: Row[] = [
  { label: "Capital required", value: (l) => fmtUsd(l.raiseUsd) },
  { label: "Instrument", value: (l) => l.instrument },
  { label: "Geography", value: (l) => l.flag + " " + l.country },
  { label: "Stage", value: (l) => l.stage },
  { label: "Revenue model", value: () => NOT_DISCLOSED },
  { label: "Sponsor contribution", value: () => NOT_DISCLOSED },
  { label: "Return information", value: (l) => l.irr || NOT_DISCLOSED },
  { label: "Timetable", value: () => NOT_DISCLOSED },
  { label: "Verification", value: (l) => (l.verified ? "Verified" : "Not yet verified") },
  { label: "Risks", value: (l) => (l.risk ? "Risk score " + l.risk + "/100" : NOT_DISCLOSED) },
  { label: "ESG information", value: (l) => (l.esg ? "ESG score " + l.esg + "/100" : NOT_DISCLOSED) },
];

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids: idsParam } = await searchParams;
  const ids = (idsParam || "").split(",").map((s) => s.trim()).filter(Boolean);
  const listings = await getListings(ids);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-extrabold text-2xl tracking-tight">Compare Opportunities</h1>
          <p className="text-wgray text-sm mt-1 max-w-2xl">
            Side-by-side data only. Nexus does not recommend an investment or
            rank these opportunities against each other — review all fields,
            including any marked &quot;{NOT_DISCLOSED}&quot;, before deciding.
          </p>
        </div>
        <div className="flex gap-2">
          <CompareExportButton listings={listings} rows={ROWS.map((r) => r.label)} />
          <Link href="/saved" className="text-xs font-bold bg-mist px-4 py-2 rounded-lg self-start">Back to saved</Link>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-charcoal/10 mt-6">
          <p className="text-sm text-wgray">No opportunities selected. Go back to Saved and pick at least one to compare.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[640px]">
            <thead>
              <tr>
                <th className="text-left p-3 border-b border-charcoal/10 text-[10px] font-bold uppercase tracking-wider text-wgray w-40">Field</th>
                {listings.map((l) => (
                  <th key={l.id} className="text-left p-3 border-b border-charcoal/10">
                    <Link href={"/project/" + l.id} className="font-display font-bold hover:underline">{l.title}</Link>
                    <div className="text-[11px] text-wgray font-normal">{l.org.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label}>
                  <td className="p-3 border-b border-charcoal/5 text-xs font-bold text-wgray align-top">{row.label}</td>
                  {listings.map((l) => {
                    const v = row.value(l);
                    return (
                      <td key={l.id} className={"p-3 border-b border-charcoal/5 align-top " + (v === NOT_DISCLOSED ? "text-wgray italic" : "")}>
                        {v}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td className="p-3 text-xs font-bold text-wgray align-top">Missing data</td>
                {listings.map((l) => {
                  const missing = ROWS.filter((r) => r.value(l) === NOT_DISCLOSED).map((r) => r.label);
                  return (
                    <td key={l.id} className="p-3 align-top text-xs text-wgray">
                      {missing.length > 0 ? missing.join(", ") : "None — all fields disclosed"}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
