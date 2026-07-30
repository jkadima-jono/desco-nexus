import Link from "next/link";
import { prisma } from "@/lib/db";
import { capitalPresentation, returnPresentation } from "@/lib/data";
import CompareExportButton from "./CompareExportButton";
import { getInvestmentEvidence, normalizeStage } from "@/lib/investment-evidence";
import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n-server";
import { comparisonRegionLabel, comparisonScrollHint, investmentUi } from "@/lib/translations/investment-ui";
import { localizeInvestmentEvidence, localizeListing } from "@/lib/translations/listing-content";
import { projectHref } from "@/lib/project-slugs";
import { isPublicOpportunityId, publicListingWhere } from "@/lib/public-listings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return { title: investmentUi(await getLocale()).compare.metadataTitle };
}

const NOT_DISCLOSED = "Not disclosed";
const COMPARE_VALUE_COPY = {
  en: { reviewed: "DESCO evidence review recorded — inspect scope", pending: "Independent verification not recorded", risks: "See public project disclosure" },
  fr: { reviewed: "Examen DESCO enregistré — vérifier le périmètre", pending: "Aucune vérification indépendante enregistrée", risks: "Voir les risques publics du projet" },
  es: { reviewed: "Revisión DESCO registrada — examine el alcance", pending: "No consta verificación independiente", risks: "Consulte la divulgación pública del proyecto" },
  pt: { reviewed: "Análise DESCO registada — confirme o âmbito", pending: "Não existe registo de verificação independente", risks: "Consulte a divulgação pública do projeto" },
  zh: { reviewed: "已记录 DESCO 审查，请核对范围", pending: "未记录独立核实", risks: "请查看项目公开披露" },
} as const;

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
  const rows = await prisma.listing.findMany({
    where: {
      ...publicListingWhere,
      id: { in: ids.filter(isPublicOpportunityId) },
    },
    include: { org: true },
  });
  const order = new Map(ids.map((id, index) => [id, index]));
  return rows.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
}

const ROWS: Row[] = [
  { label: "Capital required", value: (l) => capitalPresentation(l).value },
  { label: "Instrument", value: (l) => l.instrument },
  { label: "Geography", value: (l) => l.flag + " " + l.country },
  { label: "Stage", value: (l) => normalizeStage(l.stage) },
  { label: "Revenue model", value: () => NOT_DISCLOSED },
  { label: "Use of funds", value: (l) => l.useOfFunds || NOT_DISCLOSED },
  { label: "Sponsor contribution", value: (l) => l.sponsorContributionUsd != null ? `$${l.sponsorContributionUsd.toLocaleString("en-US")}` : NOT_DISCLOSED },
  { label: "Funding secured", value: (l) => l.fundingSecuredUsd != null ? `$${l.fundingSecuredUsd.toLocaleString("en-US")}` : NOT_DISCLOSED },
  { label: "Return information", value: (l) => returnPresentation(l).value },
  { label: "Timetable", value: () => NOT_DISCLOSED },
  { label: "Evidence review", value: (l) => (l.verified ? "DESCO evidence review recorded — inspect scope" : "Independent verification not recorded") },
  { label: "Principal risks", value: (l) => getInvestmentEvidence(l).risks.every((risk) => risk.status === "not-disclosed") ? NOT_DISCLOSED : "See public project disclosure" },
  { label: "Evidence source date", value: (l) => getInvestmentEvidence(l).provenance.sourceDate },
];

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string | string[] }>;
}) {
  const { ids: idsParam } = await searchParams;
  const locale = await getLocale();
  const ui = investmentUi(locale).compare;
  const valueCopy = COMPARE_VALUE_COPY[locale];
  const rawIds = Array.isArray(idsParam) ? idsParam : (idsParam || "").split(",");
  const requestedIds = rawIds.map((s) => s.trim()).filter(Boolean);
  const truncated = requestedIds.length > 4;
  const ids = requestedIds.slice(0, 4);
  const rawListings = await getListings(ids);
  const listings = rawListings.map((listing) => localizeListing({ ...listing, org: listing.org.name, sectorColor: "", docs: [], flag: listing.flag, scores: { match: 0, readiness: 0, esg: 0, risk: 0 }, summary: listing.summary, highlights: JSON.parse(listing.highlights) as string[], whyMatch: listing.whyMatch, photos: [] }, locale));
  const comparisonRows = ROWS.map((row) => ({
    label: ui.rows[row.label] ?? row.label,
    values: listings.map((listing) => {
      const value = row.value(rawListings.find((item) => item.id === listing.id)!);
      if (value === NOT_DISCLOSED) return ui.notDisclosed;
      if (row.label === "Instrument") return listing.instrument;
      if (row.label === "Geography") return `${listing.flag} ${listing.country}`;
      if (row.label === "Stage") return listing.stage;
      if (row.label === "Return information") return returnPresentation(listing).value;
      if (row.label === "Evidence source date") return localizeInvestmentEvidence(getInvestmentEvidence(listing), locale).provenance.sourceDate;
      if (row.label === "Evidence review") return rawListings.find((item) => item.id === listing.id)!.verified ? valueCopy.reviewed : valueCopy.pending;
      if (row.label === "Principal risks" && value !== NOT_DISCLOSED) return valueCopy.risks;
      return value;
    }),
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-extrabold text-2xl tracking-tight">{ui.title}</h1>
          <p className="text-wgray text-sm mt-1 max-w-2xl">
            {ui.intro(ui.notDisclosed)}
          </p>
        </div>
        <div className="flex gap-2">
          <CompareExportButton titles={listings.map((listing) => listing.title)} rows={comparisonRows} label={ui.exportCsv} />
          <Link href="/saved" className="text-xs font-bold bg-mist px-4 py-2 rounded-lg self-start">{ui.back}</Link>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-charcoal/10 mt-6">
          <p className="text-sm text-wgray">{ui.none}</p>
        </div>
      ) : (
        <>
        {truncated && (
          <p role="status" className="mt-5 rounded-lg border border-gold/30 bg-gold-soft px-4 py-3 text-sm text-charcoal">
            {ui.truncated}
          </p>
        )}
        <p id="comparison-scroll-hint" className="mt-5 text-xs leading-5 text-wgray sm:hidden">
          {comparisonScrollHint(locale)}
        </p>
        <div
          className="mt-2 overflow-x-auto rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold sm:mt-6"
          role="region"
          aria-label={comparisonRegionLabel(locale)}
          aria-describedby="comparison-scroll-hint"
          tabIndex={0}
        >
          <table className="w-full text-sm border-collapse min-w-[640px]">
            <thead>
              <tr>
                <th className="w-40 border-b border-charcoal/10 p-3 text-left text-xs font-bold uppercase tracking-wide text-wgray">{ui.field}</th>
                {listings.map((l) => (
                  <th key={l.id} className="text-left p-3 border-b border-charcoal/10">
                    <Link href={projectHref(l.id)} className="font-display font-bold hover:underline">{l.title}</Link>
                    <div className="text-xs font-normal text-wgray">{l.org}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.label}>
                  <td className="p-3 border-b border-charcoal/5 text-xs font-bold text-wgray align-top">{row.label}</td>
                  {row.values.map((v, index) => {
                    return (
                      <td key={listings[index].id} className={"p-3 border-b border-charcoal/5 align-top " + (v === ui.notDisclosed ? "text-wgray italic" : "")}>
                        {v}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td className="p-3 text-xs font-bold text-wgray align-top">{ui.missing}</td>
                {listings.map((l) => {
                  const sourceListing = rawListings.find((item) => item.id === l.id)!;
                  const missing = ROWS.filter((r) => r.value(sourceListing) === NOT_DISCLOSED).map((r) => ui.rows[r.label] ?? r.label);
                  return (
                    <td key={l.id} className="p-3 align-top text-xs text-wgray">
                      {missing.length > 0 ? missing.join(", ") : ui.noneMissing}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}
