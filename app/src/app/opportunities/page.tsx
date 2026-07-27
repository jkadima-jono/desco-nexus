import type { Metadata } from "next";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { PageHero, QuietNotice, SectionHeading } from "@/components/public/PublicPrimitives";
import { prisma, toListing } from "@/lib/db";
import { listings as sourceListings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Opportunities — DESCO Nexus",
  description: "Review structured African investment opportunity teasers by sector, geography, stage, instrument and capital requirement.",
};

type Params = {
  sector?: string;
  country?: string;
  stage?: string;
  instrument?: string;
  capital?: string;
  disclosure?: string;
  dataroom?: string;
  sort?: string;
};

function optionValues(values: string[]) {
  return ["All", ...Array.from(new Set(values)).sort()];
}

function matchesCapital(value: number, band: string) {
  if (band === "under-10") return value < 10_000_000;
  if (band === "10-50") return value >= 10_000_000 && value < 50_000_000;
  if (band === "50-100") return value >= 50_000_000 && value < 100_000_000;
  if (band === "100-plus") return value >= 100_000_000;
  return true;
}

export default async function Opportunities({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const {
    sector = "All",
    country = "All",
    stage = "All",
    instrument = "All",
    capital = "All",
    disclosure = "All",
    dataroom = "All",
    sort = "latest",
  } = params;

  const rows = await prisma.listing.findMany({
    include: { org: true, images: true, docs: true },
    orderBy: { updatedAt: "desc" },
  });
  const allListings = rows.length > 0 ? rows.map(toListing) : sourceListings;
  const sectors = optionValues(allListings.map((item) => item.sector));
  const countries = optionValues(allListings.map((item) => item.country));
  const stages = optionValues(allListings.map((item) => item.stage));
  const instruments = optionValues(allListings.map((item) => item.instrument));

  let listings = allListings.filter((item) => {
    if (sector !== "All" && item.sector !== sector) return false;
    if (country !== "All" && item.country !== country) return false;
    if (stage !== "All" && item.stage !== stage) return false;
    if (instrument !== "All" && item.instrument !== instrument) return false;
    if (!matchesCapital(item.raiseUsd, capital)) return false;
    if (disclosure === "reviewed" && !item.verified) return false;
    if (disclosure === "pending" && item.verified) return false;
    if (dataroom === "prepared" && item.docs.length === 0) return false;
    if (dataroom === "not-publicly-confirmed" && item.docs.length > 0) return false;
    return true;
  });

  if (sort === "capital") listings = [...listings].sort((a, b) => b.raiseUsd - a.raiseUsd);
  if (sort === "updated") listings = [...listings].sort((a, b) => Number(b.updatedAt ?? 0) - Number(a.updatedAt ?? 0));
  if (sort === "stage") listings = [...listings].sort((a, b) => a.stage.localeCompare(b.stage));

  const selectClass = "min-h-11 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-ink focus:border-gold";
  const labelClass = "mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate";

  return (
    <>
      <PageHero
        eyebrow="Opportunity desk"
        title="Structured opportunities for disciplined screening."
        body="Compare public project teasers before deciding whether restricted diligence is justified."
        primary={{ href: "/contact?topic=investor-access", label: "Apply for investor access" }}
        secondary={{ href: "/diligence", label: "How access works" }}
        aside={
          <div className="analytical-panel p-6 text-ink">
            <p className="eyebrow text-teal">Screening principle</p>
            <p className="mt-4 font-serif text-2xl leading-tight">Public value before gated diligence.</p>
            <p className="mt-4 text-sm leading-6 text-slate">Missing disclosure remains visible and should influence whether deeper review is warranted.</p>
          </div>
        }
      />

      <section className="bg-ivory py-12 lg:py-16" aria-labelledby="opportunity-results">
        <div className="public-container">
          <SectionHeading
            eyebrow="Browse and compare"
            title={`${listings.length} public ${listings.length === 1 ? "opportunity" : "opportunities"}`}
            body="Figures and project claims remain sponsor-provided unless a module expressly identifies reviewed or independently verified evidence."
          />

          <form method="get" className="mt-8 rounded-lg border border-ink/10 bg-white p-4" aria-label="Filter opportunities">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["sector", "Sector", sector, sectors],
                ["country", "Geography", country, countries],
                ["stage", "Project stage", stage, stages],
                ["instrument", "Instrument", instrument, instruments],
              ].map(([name, label, value, options]) => (
                <label key={name as string}>
                  <span className={labelClass}>{label as string}</span>
                  <select name={name as string} defaultValue={value as string} className={selectClass}>
                    {(options as string[]).map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
              ))}
              <label>
                <span className={labelClass}>Capital requirement</span>
                <select name="capital" defaultValue={capital} className={selectClass}>
                  <option value="All">All sizes</option>
                  <option value="under-10">Under $10M</option>
                  <option value="10-50">$10M–$50M</option>
                  <option value="50-100">$50M–$100M</option>
                  <option value="100-plus">$100M+</option>
                </select>
              </label>
              <label>
                <span className={labelClass}>Evidence review</span>
                <select name="disclosure" defaultValue={disclosure} className={selectClass}>
                  <option value="All">All statuses</option>
                  <option value="pending">Review pending</option>
                  <option value="reviewed">Evidence review recorded</option>
                </select>
              </label>
              <label>
                <span className={labelClass}>Data-room readiness</span>
                <select name="dataroom" defaultValue={dataroom} className={selectClass}>
                  <option value="All">All statuses</option>
                  <option value="prepared">Documents recorded</option>
                  <option value="not-publicly-confirmed">Not publicly confirmed</option>
                </select>
              </label>
              <label>
                <span className={labelClass}>Sort</span>
                <select name="sort" defaultValue={sort} className={selectClass}>
                  <option value="latest">Latest listed</option>
                  <option value="updated">Recently updated</option>
                  <option value="capital">Capital size</option>
                  <option value="stage">Project stage</option>
                </select>
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="button-primary" type="submit">Apply filters</button>
              <Link href="/opportunities" className="button-secondary">Clear filters</Link>
            </div>
          </form>

          <form action="/saved/compare" method="get" className="mt-7">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p id="opportunity-results" className="text-sm text-slate">Select up to four opportunities for a field-by-field comparison.</p>
              <button type="submit" className="button-secondary">Compare selected</button>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {listings.map((listing, index) => (
                <div key={listing.id} className="relative">
                  <label className="absolute right-3 top-3 z-10 flex min-h-11 cursor-pointer items-center gap-2 rounded-md bg-white/95 px-3 text-xs font-bold text-ink shadow">
                    <input type="checkbox" name="ids" value={listing.id} className="h-4 w-4 accent-gold" />
                    Compare
                  </label>
                  <ProjectCard listing={listing} index={index} />
                </div>
              ))}
            </div>
          </form>

          {listings.length === 0 && (
            <div className="mt-7">
              <QuietNotice>No public opportunity currently matches these filters. Clear one or more criteria to broaden the screening set.</QuietNotice>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
