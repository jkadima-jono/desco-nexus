import { notFound, redirect } from "next/navigation";
import { capitalPresentation, fmtUsd, returnPresentation } from "@/lib/data";
import { prisma, toListing } from "@/lib/db";
import { UploadDoc, TeaserGenerator } from "./RoomTools";
import Comments from "./Comments";
import PhotoGallery from "./PhotoGallery";
import HeroVisual from "@/components/HeroVisual";
import SectorBadge from "@/components/SectorBadge";
import { getLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";
import { getSessionUser } from "@/lib/auth";
import { canManageListing as canManage } from "@/lib/authz";
import TrustBadges from "./TrustBadges";
import Link from "next/link";
import { computeMatchExplanation, parseJsonArray, type MandateCriteria } from "@/lib/matching";
import MatchFeedback from "./MatchFeedback";
import RequestInfoButton from "./RequestInfoButton";
import OpportunityViewTracker from "./OpportunityViewTracker";
import DataRoomAccessPanel from "./DataRoomAccessPanel";
import MeetingsPanel from "./MeetingsPanel";
import { hasDataRoomAccess } from "@/lib/dataroom";
import type { Metadata } from "next";
import { getInvestmentEvidence, normalizeStage, summarizeEvidence } from "@/lib/investment-evidence";
import { sectorForeground } from "@/lib/theme";
import { investmentUi } from "@/lib/translations/investment-ui";
import { localizeInvestmentEvidence, localizeListing } from "@/lib/translations/listing-content";
import { internalProjectId, projectHref, publicProjectId } from "@/lib/project-slugs";

export const dynamic = "force-dynamic";

// Metadata is built from public-safe fields only (title, sector, country,
// stage, capital sought) — never docs, whyMatch, or anything confidential.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: requestedId } = await params;
  const id = internalProjectId(requestedId);
  const metadataUi = investmentUi(await getLocale()).project;
  const row = await prisma.listing.findUnique({ where: { id } });
  if (!row) return {};
  const capital = row.raiseUsd > 0
    ? `${fmtUsd(row.raiseUsd)} ${metadataUi.sought}`
    : metadataUi.capitalNotDisclosed;
  const description = `${row.sector} ${metadataUi.opportunityIn} ${row.country} — ${capital} · ${row.instrument}. ${normalizeStage(row.stage)}.`;
  return {
    title: row.title + " — DESCO Compass",
    description,
    alternates: { canonical: projectHref(row.id) },
    openGraph: { title: row.title, description, url: projectHref(row.id), type: "website" },
  };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: requestedId } = await params;
  const id = internalProjectId(requestedId);
  if (requestedId !== publicProjectId(id)) redirect(projectHref(id));
  const locale = await getLocale();
  const ui = investmentUi(locale).project;
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
  const full = localizeListing(toListing(row), locale);
  const l = { ...full, docs: [], whyMatch: "" };
  const docs = row.docs;
  const roomAccess = await hasDataRoomAccess(user, row);
  const localizedEvidence = localizeInvestmentEvidence(getInvestmentEvidence(l), locale);
  const evidence = { ...localizedEvidence, thesis: locale === "en" ? localizedEvidence.thesis : l.summary };
  const evidenceSummary = summarizeEvidence(evidence);
  const capital = capitalPresentation(l);
  const returns = returnPresentation(l);

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
        { sector: full.sector, country: full.country, raiseUsd: full.raiseUsd, instrument: full.instrument, governmentBacked: full.governmentBacked, esgEvidenceAvailable: false }
      )
    : null;

  return (
    <div className="pb-24 lg:pb-0">
      <OpportunityViewTracker listingId={l.id} sector={l.sector} />
      <div className="relative bg-ink text-white overflow-hidden">
        <HeroVisual listing={l} className="absolute inset-0 opacity-40" overlay={false} locale={locale} />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/40" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider mb-3">
            <span
              className="px-2 py-0.5 rounded-full"
              style={{ background: l.sectorColor, color: sectorForeground(l.sector) }}
            >
              {l.sector}
            </span>
            <span className="text-white/60">
              {l.flag} {l.country} · {l.stage}
            </span>
            <TrustBadges verified={l.verified} verifiedBy={row.verifiedBy} verifiedAt={row.verifiedAt ? row.verifiedAt.toISOString() : null} verificationNote={row.verificationNote} governmentBacked={l.governmentBacked} govMechanism={row.govMechanism} sponsor={l.org} />
            <span className="ml-auto"><SectorBadge sector={l.sector} size={34} /></span>
          </div>
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8">
            <div>
              <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
                {ui.publicBriefing}
              </div>
              <h1 className="font-display font-extrabold text-3xl tracking-tight max-w-xl">
                {l.title}
              </h1>
              <p className="text-white/70 mt-3 max-w-xl">{l.summary}</p>
            </div>
            <div className="text-left lg:text-right shrink-0">
              <div className="font-display font-extrabold text-4xl text-gold">
                {capital.value}
              </div>
              <div className="mt-1 text-xs font-semibold text-white/70">{capital.label}</div>
              <div className="mt-2 text-xs text-white/65">
                {l.instrument}
                <br />
                {returns.label}: {returns.value}
              </div>
              <div className="mt-1.5 text-xs text-white/65">{ui.sponsorFigures}</div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/15 pt-4 text-[11px] text-white/60">
            <span>{ui.lastUpdated} {new Date(row.updatedAt).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" })}</span>
            <span>{ui.sponsor}: {l.org}</span>
            <span>{ui.publicRestricted}</span>
          </div>
        </div>
      </div>

      <section aria-label={ui.publicEvidence} className="border-b border-charcoal/10 bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px bg-charcoal/10 sm:grid-cols-4">
          {[
            [ui.publicEvidence, `${evidenceSummary.disclosed}/${evidenceSummary.total} ${ui.fieldsDisclosed}`],
            [ui.principalRisks, `${evidenceSummary.risksDisclosed}/${evidenceSummary.risksTotal} ${ui.categoriesDisclosed}`],
            [ui.evidenceDate, evidence.provenance.sourceDate],
            [ui.projectRoom, docs.length > 0 ? ui.restrictedDocs : ui.readinessNotPublic],
          ].map(([label, value]) => (
            <div key={label} className="bg-white px-4 py-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-wgray">{label}</p>
              <p className="mt-1 text-xs font-semibold leading-5 text-charcoal">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <section id="investment-evidence" className="scroll-mt-6 bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
            <div className="mb-5 border-l-2 border-gold pl-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">{ui.thesis}</div>
              <p className="mt-2 text-sm leading-6 text-charcoal">{evidence.thesis}</p>
            </div>
            <h2 className="font-display font-bold text-lg mb-1">{t(locale, "project.highlights")}</h2>
            <p className="text-xs text-wgray mb-4">{ui.figuresNote}</p>
            <ul className="space-y-2.5">
              {l.highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 text-sm">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0"
                    style={{ background: l.sectorColor, color: sectorForeground(l.sector) }}
                  >
                    ▸
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
            <h2 className="font-display font-bold text-lg">{ui.publicInvestmentEvidence}</h2>
            <p className="mt-1 text-xs leading-5 text-wgray">
              {ui.missingVisible}
            </p>
            <dl className="mt-5 divide-y divide-charcoal/10">
              {evidence.fields.map((field) => (
                <div key={field.label} className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-5">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-wgray">{field.label}</dt>
                  <dd>
                    <div className={field.status === "not-disclosed" ? "text-sm italic text-wgray" : "text-sm text-charcoal"}>{field.value}</div>
                    {field.source && <div className="mt-1 text-[10px] text-wgray">{ui.source}: {field.source}</div>}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
            <h2 className="font-display font-bold text-lg">{ui.riskDisclosure}</h2>
            <p className="mt-1 text-xs leading-5 text-wgray">
              {ui.riskNote}
            </p>
            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              {evidence.risks.map((risk) => (
                <div key={risk.label} className="rounded-lg border border-charcoal/10 bg-mist p-4">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-charcoal">{risk.label}</dt>
                  <dd className="mt-2 text-sm italic text-wgray">{risk.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {(l.useOfFunds || l.fundingSecuredUsd != null || l.sponsorContributionUsd != null) && (
            <section className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
              <h2 className="font-display font-bold text-lg mb-1">{ui.financialStructure}</h2>
              <p className="text-xs text-wgray mb-4">{ui.figuresNote}</p>
              <dl className="space-y-3 text-sm">
                {l.useOfFunds && (
                  <div>
                    <dt className="text-[11px] font-bold text-wgray uppercase tracking-wider mb-1">{ui.useOfFunds}</dt>
                    <dd className="leading-relaxed">{l.useOfFunds}</dd>
                  </div>
                )}
                {l.fundingSecuredUsd != null && (
                  <div>
                    <dt className="text-[11px] font-bold text-wgray uppercase tracking-wider mb-1">{ui.fundingSecured}</dt>
                    <dd>{fmtUsd(l.fundingSecuredUsd)}</dd>
                  </div>
                )}
                {l.sponsorContributionUsd != null && (
                  <div>
                    <dt className="text-[11px] font-bold text-wgray uppercase tracking-wider mb-1">{ui.sponsorContribution}</dt>
                    <dd>{fmtUsd(l.sponsorContributionUsd)}</dd>
                  </div>
                )}
              </dl>
            </section>
          )}

          <div id="project-photos" className="scroll-mt-6">
            <PhotoGallery listingId={l.id} photos={l.photos ?? []} canUpload={canManageListing} />
          </div>

          <section id="data-room" className="scroll-mt-6 bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg">{t(locale, "project.dataRoom")}</h2>
              <span className="text-[11px] font-bold text-wgray uppercase tracking-wider">
                {t(locale, "project.roomBadge")}
              </span>
            </div>
            {roomAccess && folders.length > 0 ? folders.map((f) => (
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
                      title={d.storageKey ? ui.download : ui.demoDocument}
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
            )) : roomAccess ? (
              <div className="rounded-xl bg-mist p-5 text-sm text-wgray">
                {ui.roomEmpty}
              </div>
            ) : user ? (
              <div className="rounded-xl bg-mist p-5 text-sm text-wgray">
                {ui.roomLocked}
                <ul className="mt-3 space-y-1 text-xs">
                  {ui.roomBullets.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
            ) : (
              <div className="rounded-xl bg-mist p-5 text-sm text-wgray">
                {ui.roomLockedPublic}
                <ul className="mt-3 space-y-1 text-xs">
                  {ui.roomBullets.map((item) => <li key={item}>• {item}</li>)}
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
              <p className="text-sm text-wgray">{ui.meetingLocked}</p>
            )}
          </section>

          {user && <Comments listingId={l.id} initialViewer={{ id: user.id, fullName: user.fullName }} />}
        </div>

        <div className="min-w-0 space-y-6">
          <section className="hidden lg:block sticky top-4 bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
            <h2 className="font-display font-bold text-sm uppercase tracking-wider text-wgray mb-3">{ui.actions}</h2>
            {canManageListing ? (
              <div className="space-y-2">
                <a href="#investment-evidence" className="block w-full rounded-xl bg-gold py-2.5 text-center font-display text-sm font-bold text-ink hover:brightness-110">{ui.reviewEvidence}</a>
                <a href="#data-room" className="block w-full rounded-xl border border-charcoal/15 py-2.5 text-center font-display text-sm font-semibold text-charcoal hover:bg-mist">{ui.manageRoom}</a>
                <a href="#meetings" className="block w-full rounded-xl border border-charcoal/15 py-2.5 text-center font-display text-sm font-semibold text-charcoal hover:bg-mist">{ui.reviewMeetings}</a>
              </div>
            ) : user ? (
              <div className="space-y-2">
                <RequestInfoButton listingId={l.id} action="dataroom_requested" className="w-full bg-gold text-ink font-display font-bold text-sm py-2.5 rounded-xl hover:brightness-110" label={t(locale, "project.requestRoom")} doneLabel={"✓ " + ui.requested} />
                <RequestInfoButton listingId={l.id} className="w-full border border-charcoal/15 text-charcoal font-display font-semibold text-sm py-2.5 rounded-xl hover:bg-mist" label={ui.requestInformation} />
                <a href="#meetings" className="block w-full text-center border border-charcoal/15 text-charcoal font-display font-semibold text-sm py-2.5 rounded-xl hover:bg-mist">{t(locale, "project.schedule")}</a>
                <RequestInfoButton listingId={l.id} action="saved" className="w-full border border-charcoal/15 text-charcoal font-display font-semibold text-sm py-2.5 rounded-xl hover:bg-mist" label={"⌁ " + t(locale, "project.save")} doneLabel={"✓ " + ui.saved} />
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm leading-6 text-wgray">{ui.workspaceAccess}</p>
                <Link href={`/contact?topic=investor-access&project=${l.id}`} className="block text-center bg-gold text-ink font-display font-bold text-sm py-2.5 rounded-xl">{ui.applyAccess}</Link>
              </div>
            )}
          </section>

          {canManageListing && <TeaserGenerator listingId={l.id} />}
          {user && matchExplanation && (
            <section className={"rounded-2xl p-5 border-l-4 " + (matchExplanation.confidence === "excluded" ? "bg-brandred/5 border-brandred" : "bg-gold-soft border-gold")}>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                <span className={matchExplanation.confidence === "excluded" ? "text-brandred" : "text-gold"}>
                  ✦ Match vs. &ldquo;{activeMandate!.name}&rdquo;
                </span>
                <span className="text-wgray normal-case font-semibold">
                  {matchExplanation.confidence} confidence · {matchExplanation.dataCompleteness}% of mandate dimensions configured
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
            <section className="rounded-2xl border-l-4 border-gold bg-gold-soft p-5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gold">Mandate fit not calculated</div>
              <p className="mt-2 text-sm leading-relaxed">Create an investment mandate to evaluate sector, geography, ticket size, instrument and stated ESG criteria against this opportunity.</p>
              <Link href="/mandates" className="button-secondary mt-4">Create or select a mandate</Link>
            </section>
          )}

          <section className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)] text-sm">
            <h2 className="font-display font-bold text-lg mb-3">{t(locale, "project.sponsor")}</h2>
            <div className="font-semibold">{l.org}</div>
            {user && <div className="text-wgray text-xs mt-1">
              {ui.noSponsorHistory}
            </div>}
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)] text-sm">
            <h2 className="font-display font-bold text-lg mb-3">{ui.provenance}</h2>
            <dl className="space-y-3 text-xs">
              <div><dt className="font-bold uppercase tracking-wider text-wgray">{ui.classification}</dt><dd className="mt-1">{evidence.provenance.classification}</dd></div>
              <div><dt className="font-bold uppercase tracking-wider text-wgray">{ui.source}</dt><dd className="mt-1">{evidence.provenance.source}</dd></div>
              <div><dt className="font-bold uppercase tracking-wider text-wgray">{ui.sourceDate}</dt><dd className="mt-1 italic text-wgray">{evidence.provenance.sourceDate}</dd></div>
              <div><dt className="font-bold uppercase tracking-wider text-wgray">{ui.reviewStatus}</dt><dd className="mt-1">{evidence.provenance.reviewStatus}</dd></div>
            </dl>
          </section>
        </div>
      </div>

      {/* Mobile bottom action bar */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 bg-white border-t border-charcoal/10 px-3 py-2.5 flex gap-2 pb-[calc(0.625rem+env(safe-area-inset-bottom))]">
        {canManageListing ? (
          <>
            <a href="#investment-evidence" className="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-gold px-2 text-center font-display text-xs font-bold text-ink">{ui.reviewEvidenceShort}</a>
            <a href="#data-room" className="flex min-h-11 flex-1 items-center justify-center rounded-xl border border-charcoal/15 px-2 text-center font-display text-xs font-semibold text-charcoal">{ui.manageRoomShort}</a>
            <a href="#meetings" className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-charcoal/15 px-2 text-center font-display text-xs font-semibold text-charcoal">{ui.meetings}</a>
          </>
        ) : user ? (
          <>
            <RequestInfoButton listingId={l.id} action="dataroom_requested" className="flex-1 min-h-11 bg-gold text-ink font-display font-bold text-xs rounded-xl" label={t(locale, "project.requestRoom")} doneLabel="✓ Requested" />
            <RequestInfoButton listingId={l.id} className="flex-1 min-h-11 border border-charcoal/15 text-charcoal font-display font-semibold text-xs rounded-xl" label={ui.requestInfo} />
            <RequestInfoButton listingId={l.id} action="saved" className="min-w-11 min-h-11 border border-charcoal/15 rounded-xl" label="⌁" doneLabel="✓" ariaLabel={t(locale, "project.save")} />
          </>
        ) : (
          <Link href={`/contact?topic=investor-access&project=${l.id}`} className="flex-1 min-h-11 flex items-center justify-center bg-gold text-ink font-display font-bold text-xs rounded-xl">{ui.applyAccess}</Link>
        )}
      </div>
      <div className="h-[calc(4rem+env(safe-area-inset-bottom))] lg:hidden" aria-hidden="true" />
    </div>
  );
}
