import type { Metadata } from "next";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { PageHero, QuietNotice, SectionHeading } from "@/components/public/PublicPrimitives";
import { prisma, toListing } from "@/lib/db";
import { listings as sourceListings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Opportunities — DESCO Nexus",
  description: "Review structured African investment opportunity teasers by sector, stage and capital requirement.",
};

const SECTORS = ["All", "Infrastructure", "Mining", "Agriculture", "Healthcare"];

export default async function Opportunities({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string; sort?: string }>;
}) {
  const { sector = "All", sort = "latest" } = await searchParams;
  const rows = await prisma.listing.findMany({ include: { org: true, images: true }, orderBy: { updatedAt: "desc" } });
  let listings = rows.length > 0 ? rows.map(toListing) : sourceListings;
  if (SECTORS.includes(sector) && sector !== "All") listings = listings.filter((item) => item.sector === sector);
  if (sort === "capital") listings = [...listings].sort((a, b) => b.raiseUsd - a.raiseUsd);
  if (sort === "maturity") listings = [...listings].sort((a, b) => b.scores.readiness - a.scores.readiness);

  return (
    <>
      <PageHero
        eyebrow="Opportunity desk"
        title="Structured opportunities for disciplined screening."
        body="Compare public project teasers by sector, geography, stage, instrument, capital requirement and disclosure status before requesting restricted material."
        primary={{ href: "/mandates", label: "Define an investment mandate" }}
        secondary={{ href: "/diligence", label: "How access works" }}
        aside={
          <div className="analytical-panel p-6 text-ink">
            <p className="eyebrow text-teal">Screening principle</p>
            <p className="mt-4 font-serif text-2xl leading-tight">Public value before gated diligence.</p>
            <p className="mt-4 text-sm leading-6 text-slate">Every teaser should provide enough information to decide whether deeper review is justified.</p>
          </div>
        }
      />

      <main className="bg-ivory py-12 lg:py-16">
        <div className="public-container">
          <SectionHeading
            eyebrow="Browse and compare"
            title={`${listings.length} public ${listings.length === 1 ? "opportunity" : "opportunities"}`}
            body="Figures and project claims remain sponsor-provided unless a module expressly identifies reviewed or independently verified evidence."
          />

          <div className="mt-8 rounded-lg border border-ink/10 bg-white p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <nav aria-label="Filter opportunities by sector" className="flex gap-2 overflow-x-auto pb-1">
                {SECTORS.map((item) => (
                  <Link
                    key={item}
                    href={item === "All" ? "/opportunities" : `/opportunities?sector=${encodeURIComponent(item)}&sort=${sort}`}
                    aria-current={sector === item ? "page" : undefined}
                    className={`shrink-0 rounded-full border px-3 py-2 text-xs font-bold ${
                      sector === item ? "border-ink bg-ink text-white" : "border-ink/12 text-slate hover:border-gold"
                    }`}
                  >
                    {item}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold uppercase tracking-wider text-slate">Sort</span>
                {[
                  ["latest", "Latest"],
                  ["capital", "Capital size"],
                  ["maturity", "Project maturity"],
                ].map(([value, label]) => (
                  <Link
                    key={value}
                    href={`/opportunities?sector=${encodeURIComponent(sector)}&sort=${value}`}
                    className={sort === value ? "font-bold text-gold" : "text-slate hover:text-ink"}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            {listings.map((listing, index) => (
              <ProjectCard key={listing.id} listing={listing} index={index} />
            ))}
          </div>

          {listings.length === 0 && (
            <div className="mt-7">
              <QuietNotice>No public opportunity currently matches this filter. Adjust the sector or create an investment mandate for future screening.</QuietNotice>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
