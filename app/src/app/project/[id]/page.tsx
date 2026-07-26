import { notFound } from "next/navigation";
import { fmtUsd } from "@/lib/data";
import { prisma, toListing } from "@/lib/db";
import { UploadDoc, TeaserGenerator } from "./RoomTools";
import Comments from "./Comments";
import PhotoGallery from "./PhotoGallery";
import HeroVisual from "@/components/HeroVisual";
import SectorBadge from "@/components/SectorBadge";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";
import MatchRing from "@/components/MatchRing";
import ScoreBars from "@/components/ScoreBars";
import { getSessionUser } from "@/lib/auth";
import { canManageListing as canManage } from "@/lib/authz";
import TrustBadges from "./TrustBadges";
import ScoreInfo from "./ScoreInfo";
import Link from "next/link";
import { computeMatchExplanation, parseJsonArray, type MandateCriteria } from "@/lib/matching";
import MatchFeedback from "./MatchFeedback";
import RequestInfoButton from "./RequestInfoButton";
import DataRoomAccessPanel from "./DataRoomAccessPanel";
import MeetingsPanel from "./MeetingsPanel";
import { hasDataRoomAccess } from "@/lib/dataroom";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

// Metadata is built from public-safe fields only (title, sector, country,
// stage, capital sought) — never docs, whyMatch, or anything confidential.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const row = await prisma.listing.findUnique({ where: { id } });
  if (!row) return {};
  const description = `${row.sector} opportunity in ${row.country} — ${fmtUsd(row.raiseUsd)} sought via ${row.instrument}. ${row.stage} stage.`;
  return {
    title: row.title + " — DESCO Nexus",
    description,
    alternates: { canonical: "/project/" + row.id },
    openGraph: { title: row.title, description, url: "/project/" + row.id, type: "website" },
  };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const user = await getSessionUser();
  const row = await prisma.listing.findUnique({
    where: { id },
    include: { docs: true, org: true, images: true },
  });
  if (!row) notFound();
  const canManageListing = canManage(user, row);
  // Presentation object: confidential fields never leave the server for
  // unauthenticated visitors, and docs/whyMatch are never serialized into
  // client-component props regardless of session (rendered server-side only).
  const full = toListing(row);
  const l = { ...full, docs: [], whyMatch: "" };
  const whyMatch = user ? full.whyMatch : "";
  const docs = row.docs;
  const roomAccess = await hasDataRoomAccess(user, row);

  const folders = [...new Set(docs.map((d) => d.folder))];

  const activeMandate = user
    ? await prisma.standingMandate.findFirst({
        where: { userId: user.id, active: true },
        orderBy: { createdAt: "desc" },
      })
    : null;
  const matchExplanation = activeMandate
    ? computeMatchExplanation(
        {
          sectors: parseJsonArray(activeMandate.sectors),
          countries: parseJsonArray(activeMandate.countries),
          ticketMinUsd: activeMandate.ticketMinUsd,
          ticketMaxUsd: activeMandate.ticketMaxUsd,
          instruments: parseJsonArray(activeMandate.instruments),
          esgRequired: activeMandate.esgRequired,
          govSupportRequired: activeMandate.govSupportRequired,
          excludedSectors: parseJsonArray(activeMandate.excludedSectors),
          excludedCountries: parseJsonArray(activeMandate.excludedCountries),
        } satisfies MandateCriteria,
        { sector: full.sector, country: full.country, raiseUsd: full.raiseUsd, instrument: full.instrument, governmentBacked: full.governmentBacked, scores: { esg: full.scores.esg } }
      )
    : null;

  return (
    <div>
      <div className="relative bg-ink text-white overflow-hidden">
        <HeroVisual listing={l} className="absolute inset-0 opacity-40" overlay={false} />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/40" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider mb-3">
            <span
              className="px-2 py-0.5 rounded-full text-white"
              style={{ background: l.sectorColor }}
            >
              {l.sector}
            </span>
            <span className="text-white/60">
              {l.flag} {l.country} · {l.stage}
            </span>
            <TrustBadges verified={l.verified} verifiedBy={row.verifiedBy} verifiedAt={row.verifiedAt ? row.verifiedAt.toISOString() : null} verificationNote={row.verificationNote} governmentBacked={l.governmentBacked} govMechanism={row.govMechanism} sponsor={l.org} stage={l.stage} />
            <span className="ml-auto"><SectorBadge sector={l.sector} size={34} /></span>
          </div>
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8">
            <div>
              <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
                Public opportunity briefing
              </div>
              <h1 className="font-display font-extrabold text-3xl tracking-tight max-w-xl">
                {l.title}
              </h1>
              <p className="text-white/70 mt-3 max-w-xl">{l.summary}</p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                {user ? <>
                  <RequestInfoButton listingId={l.id} action="dataroom_requested" className="bg-gold text-ink font-display font-bold text-sm px-5 py-2.5 rounded-xl hover:brightness-110" label={t(locale, "project.requestRoom")} doneLabel="✓ Requested" />
                  <a href="#meetings" className="border border-white/25 text-white font-display font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/10 inline-flex items-center">{t(locale, "project.schedule")}</a>
                  <RequestInfoButton listingId={l.id} action="saved" className="border border-white/25 text-white font-display font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/10" label={"⌁ " + t(locale, "project.save")} doneLabel="✓ Saved" />
                </> : <Link href={`/login?next=/project/${l.id}`} className="inline-flex justify-center bg-gold text-ink font-display font-bold text-sm px-5 py-2.5 rounded-xl">Sign in to request access</Link>}
              </div>
            </div>
            <div className="text-left lg:text-right shrink-0">
              <div className="font-display font-extrabold text-4xl text-gold">
                {fmtUsd(l.raiseUsd)}
              </div>
              <div className="text-xs text-white/60 mt-1">
                {l.instrument}
                <br />
                {l.irr}
              </div>
              <div className="text-[10px] text-white/40 mt-1.5">Sponsor-provided figures</div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/15 pt-4 text-[11px] text-white/60">
            <span>Last updated {new Date(row.updatedAt).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" })}</span>
            <span>Sponsor: {l.org}</span>
            <span>Public disclosure · confidential documents restricted</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
            <div className="mb-5 border-l-2 border-gold pl-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">Investment thesis</div>
              <p className="mt-2 text-sm leading-6 text-charcoal">{l.summary}</p>
            </div>
            <h2 className="font-display font-bold text-lg mb-1">{t(locale, "project.highlights")}</h2>
            <p className="text-xs text-wgray mb-4">Sponsor-provided figures, not independently verified unless stated otherwise.</p>
            <ul className="space-y-2.5">
              {l.highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 text-sm">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs shrink-0"
                    style={{ background: l.sectorColor }}
                  >
                    ▸
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </section>

          {(l.useOfFunds || l.fundingSecuredUsd != null || l.sponsorContributionUsd != null) && (
            <section className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
              <h2 className="font-display font-bold text-lg mb-1">Financial structure</h2>
              <p className="text-xs text-wgray mb-4">Sponsor-provided at submission, not independently verified unless stated otherwise.</p>
              <dl className="space-y-3 text-sm">
                {l.useOfFunds && (
                  <div>
                    <dt className="text-[11px] font-bold text-wgray uppercase tracking-wider mb-1">Use of funds</dt>
                    <dd className="leading-relaxed">{l.useOfFunds}</dd>
                  </div>
                )}
                {l.fundingSecuredUsd != null && (
                  <div>
                    <dt className="text-[11px] font-bold text-wgray uppercase tracking-wider mb-1">Funding already secured</dt>
                    <dd>{fmtUsd(l.fundingSecuredUsd)}</dd>
                  </div>
                )}
                {l.sponsorContributionUsd != null && (
                  <div>
                    <dt className="text-[11px] font-bold text-wgray uppercase tracking-wider mb-1">Sponsor contribution</dt>
                    <dd>{fmtUsd(l.sponsorContributionUsd)}</dd>
                  </div>
                )}
              </dl>
            </section>
          )}

          <PhotoGallery
            listingId={l.id}
            photos={l.photos ?? []}
            canUpload={canManageListing}
          />

          <section className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg">{t(locale, "project.dataRoom")}</h2>
              <span className="text-[11px] font-bold text-wgray uppercase tracking-wider">
                {t(locale, "project.roomBadge")}
              </span>
            </div>
            {roomAccess ? folders.map((f) => (
              <div key={f} className="mb-3">
                <div className="text-[11px] font-bold text-wgray uppercase tracking-wider mb-1.5">
                  {f}
                </div>
                {docs
                  .filter((d) => d.folder === f)
                  .map((d) => (
                    <a
                      key={d.id}
                      href={"/api/documents/" + d.id}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-mist text-sm"
                      title={d.storageKey ? "Download" : "Demo document (no file)"}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="text-gold">▤</span> {d.name}
                        {d.storageKey && (
                          <span className="text-[10px] text-wgray">↓</span>
                        )}
                      </span>
                      <span className="text-wgray text-xs">{d.size}</span>
                    </a>
                  ))}
              </div>
            )) : user ? (
              <div className="rounded-xl bg-mist p-5 text-sm text-wgray">
                Confidential filenames and documents are hidden until the sponsor grants
                data-room access. Use &ldquo;{t(locale, "project.requestRoom")}&rdquo; above if you haven&apos;t already.
                <ul className="mt-3 space-y-1 text-xs">
                  <li>• Sponsor-approved diligence documents</li>
                  <li>• Financial, legal, technical and impact evidence where supplied</li>
                  <li>• Access that the sponsor can grant or revoke</li>
                </ul>
              </div>
            ) : (
              <div className="rounded-xl bg-mist p-5 text-sm text-wgray">
                Confidential filenames and documents are hidden. <Link href={`/login?next=/project/${l.id}`} className="font-bold text-gold">Sign in to request access.</Link>
                <ul className="mt-3 space-y-1 text-xs">
                  <li>• Sponsor-approved diligence documents</li>
                  <li>• Financial, legal, technical and impact evidence where supplied</li>
                  <li>• Access that the sponsor can grant or revoke</li>
                </ul>
              </div>
            )}
            {canManageListing && <UploadDoc listingId={l.id} />}
            {canManageListing && <DataRoomAccessPanel listingId={l.id} />}
          </section>

          <section id="meetings" className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
            <h2 className="font-display font-bold text-lg mb-2">{t(locale, "project.schedule")}</h2>
            {user ? (
              <MeetingsPanel listingId={l.id} canManage={canManageListing} />
            ) : (
              <p className="text-sm text-wgray"><Link href={`/login?next=/project/${l.id}`} className="font-bold text-gold">Sign in</Link> to request a meeting with the sponsor.</p>
            )}
          </section>

          {user && <Comments listingId={l.id} />}
        </div>

        <div className="space-y-6">
          <section className="hidden lg:block sticky top-4 bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
            <h2 className="font-display font-bold text-sm uppercase tracking-wider text-wgray mb-3">Actions</h2>
            {user ? (
              <div className="space-y-2">
                <RequestInfoButton listingId={l.id} action="dataroom_requested" className="w-full bg-gold text-ink font-display font-bold text-sm py-2.5 rounded-xl hover:brightness-110" label={t(locale, "project.requestRoom")} doneLabel="✓ Requested" />
                <RequestInfoButton listingId={l.id} className="w-full border border-charcoal/15 text-charcoal font-display font-semibold text-sm py-2.5 rounded-xl hover:bg-mist" label="Request information" />
                <a href="#meetings" className="block w-full text-center border border-charcoal/15 text-charcoal font-display font-semibold text-sm py-2.5 rounded-xl hover:bg-mist">{t(locale, "project.schedule")}</a>
                <RequestInfoButton listingId={l.id} action="saved" className="w-full border border-charcoal/15 text-charcoal font-display font-semibold text-sm py-2.5 rounded-xl hover:bg-mist" label={"⌁ " + t(locale, "project.save")} doneLabel="✓ Saved" />
              </div>
            ) : (
              <Link href={`/login?next=/project/${l.id}`} className="block text-center bg-gold text-ink font-display font-bold text-sm py-2.5 rounded-xl">Sign in to act on this opportunity</Link>
            )}
          </section>

          {canManageListing && <TeaserGenerator listingId={l.id} />}
          {user ? <section className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
            <div className="flex items-center gap-4 mb-4">
              <MatchRing score={l.scores.match} size={64} />
              <div>
                <div className="font-display font-bold">{t(locale, "project.aiMatch")}</div>
                <div className="text-[11px] text-wgray">Illustrative platform scores, not mandate-specific</div>
              </div>
            </div>
            <ScoreBars scores={l.scores} />
            <ScoreInfo />
          </section> : <section className="bg-white rounded-2xl p-6 text-sm text-wgray">Sign in to see mandate fit, readiness, ESG and risk analysis.</section>}

          {user && matchExplanation && (
            <section className={"rounded-2xl p-5 border-l-4 " + (matchExplanation.confidence === "excluded" ? "bg-brandred/5 border-brandred" : "bg-gold-soft border-gold")}>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                <span className={matchExplanation.confidence === "excluded" ? "text-brandred" : "text-gold"}>
                  ✦ Match vs. &ldquo;{activeMandate!.name}&rdquo;
                </span>
                <span className="text-wgray normal-case font-semibold">
                  {matchExplanation.confidence} confidence · {matchExplanation.dataCompleteness}% of your mandate evaluated
                </span>
              </div>
              {matchExplanation.hardExclusions.length > 0 && (
                <ul className="text-sm text-brandred space-y-1 mb-2">
                  {matchExplanation.hardExclusions.map((x) => <li key={x}>⊘ {x}</li>)}
                </ul>
              )}
              {matchExplanation.metCriteria.length > 0 && (
                <ul className="text-sm space-y-1 mb-2">
                  {matchExplanation.metCriteria.map((x) => <li key={x} className="text-emerald-p">✓ {x}</li>)}
                </ul>
              )}
              {matchExplanation.partiallyMetCriteria.length > 0 && (
                <ul className="text-sm space-y-1 mb-2">
                  {matchExplanation.partiallyMetCriteria.map((x) => <li key={x} className="text-gold">◐ {x}</li>)}
                </ul>
              )}
              {matchExplanation.unmetCriteria.length > 0 && (
                <ul className="text-sm space-y-1">
                  {matchExplanation.unmetCriteria.map((x) => <li key={x} className="text-wgray">✕ {x}</li>)}
                </ul>
              )}
              {matchExplanation.missingProjectData.length > 0 && (
                <ul className="text-sm space-y-1 mt-2">
                  {matchExplanation.missingProjectData.map((x) => <li key={x} className="text-wgray italic">? {x}</li>)}
                </ul>
              )}
              <div className="text-[10px] text-wgray mt-3 pt-2 border-t border-charcoal/10">
                <span className="font-bold">Sources:</span> {matchExplanation.dataSources.join(" · ")}
              </div>
              <div className="text-[10px] text-wgray mt-1">
                Calculated {new Date(matchExplanation.calculatedAt).toLocaleDateString()} · <Link href="/mandates" className="underline">edit this mandate</Link>
              </div>
              <MatchFeedback listingId={l.id} mandateId={activeMandate!.id} />
            </section>
          )}
          {user && !matchExplanation && (
            <section className="bg-gold-soft border-l-4 border-gold rounded-2xl p-5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gold mb-1.5">
                ✦ {t(locale, "project.why")}
              </div>
              <p className="text-sm leading-relaxed">{whyMatch}</p>
              <div className="text-[10px] text-wgray mt-2">
                General sponsor-provided rationale — <Link href="/mandates" className="underline">save a mandate</Link> for a criteria-by-criteria match explanation.
              </div>
            </section>
          )}

          <section className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)] text-sm">
            <h2 className="font-display font-bold text-lg mb-3">{t(locale, "project.sponsor")}</h2>
            <div className="font-semibold">{l.org}</div>
            {user && <div className="text-wgray text-xs mt-1">
              No response-time or transaction-history data collected yet on Nexus for this sponsor.
            </div>}
          </section>
        </div>
      </div>

      {/* Mobile bottom action bar */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 bg-white border-t border-charcoal/10 px-3 py-2.5 flex gap-2 pb-[calc(0.625rem+env(safe-area-inset-bottom))]">
        {user ? (
          <>
            <RequestInfoButton listingId={l.id} action="dataroom_requested" className="flex-1 min-h-11 bg-gold text-ink font-display font-bold text-xs rounded-xl" label={t(locale, "project.requestRoom")} doneLabel="✓ Requested" />
            <RequestInfoButton listingId={l.id} className="flex-1 min-h-11 border border-charcoal/15 text-charcoal font-display font-semibold text-xs rounded-xl" label="Request info" />
            <RequestInfoButton listingId={l.id} action="saved" className="min-w-11 min-h-11 border border-charcoal/15 rounded-xl" label="⌁" doneLabel="✓" ariaLabel={t(locale, "project.save")} />
          </>
        ) : (
          <Link href={`/login?next=/project/${l.id}`} className="flex-1 min-h-11 flex items-center justify-center bg-gold text-ink font-display font-bold text-xs rounded-xl">Sign in to act on this opportunity</Link>
        )}
      </div>
      <div className="lg:hidden h-16" aria-hidden="true" />
    </div>
  );
}
