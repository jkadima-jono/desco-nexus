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

export const dynamic = "force-dynamic";

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
            <TrustBadges verified={l.verified} governmentBacked={l.governmentBacked} govMechanism={row.govMechanism} sponsor={l.org} stage={l.stage} />
            <span className="ml-auto"><SectorBadge sector={l.sector} size={34} /></span>
          </div>
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8">
            <div>
              <h1 className="font-display font-extrabold text-3xl tracking-tight max-w-xl">
                {l.title}
              </h1>
              <p className="text-white/70 mt-3 max-w-xl">{l.summary}</p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                {user ? <>
                  <button className="bg-gold text-ink font-display font-bold text-sm px-5 py-2.5 rounded-xl hover:brightness-110">{t(locale, "project.requestRoom")}</button>
                  <button className="border border-white/25 text-white font-display font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/10">{t(locale, "project.schedule")}</button>
                  <button className="border border-white/25 text-white font-display font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/10">⌁ {t(locale, "project.save")}</button>
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
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
            <h2 className="font-display font-bold text-lg mb-4">{t(locale, "project.highlights")}</h2>
            <ul className="space-y-2.5">
              {l.highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 text-sm">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs shrink-0"
                    style={{ background: l.sectorColor }}
                  >
                    ✓
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </section>

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
            {user ? folders.map((f) => (
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
            )) : (
              <div className="rounded-xl bg-mist p-5 text-sm text-wgray">
                Confidential filenames and documents are hidden. <Link href={`/login?next=/project/${l.id}`} className="font-bold text-gold">Sign in to request access.</Link>
              </div>
            )}
            {canManageListing && <UploadDoc listingId={l.id} />}
          </section>

          {user && <Comments listingId={l.id} />}
        </div>

        <div className="space-y-6">
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
              {matchExplanation.unmetCriteria.length > 0 && (
                <ul className="text-sm space-y-1">
                  {matchExplanation.unmetCriteria.map((x) => <li key={x} className="text-wgray">✕ {x}</li>)}
                </ul>
              )}
              <div className="text-[10px] text-wgray mt-2">
                Calculated {new Date(matchExplanation.calculatedAt).toLocaleDateString()} · <Link href="/mandates" className="underline">edit this mandate</Link>
              </div>
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
    </div>
  );
}
