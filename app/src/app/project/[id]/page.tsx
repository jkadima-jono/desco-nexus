import { notFound, redirect } from "next/navigation";
import { capitalPresentation, fmtUsd, materialFactPresentation } from "@/lib/data";
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
import { inaccurateInformationLabel, investmentUi, localizedCapitalPresentation, localizedReturnValue, materialFactCopy, pageUpdatedLabel, relatedPartyDisclosure } from "@/lib/translations/investment-ui";
import { localizeInvestmentEvidence, localizeListing, organizationPresentation } from "@/lib/translations/listing-content";
import { localizedMatchReason, matchPanelCopy } from "@/lib/translations/matching";
import { internalProjectId, projectHref, publicProjectId } from "@/lib/project-slugs";
import { PUBLIC_LISTING_STATUS, isPublicOpportunityId, publicListingWhere } from "@/lib/public-listings";
import { sharedCopy } from "@/lib/translations/shared";
import DisclosureCompleteness from "@/components/DisclosureCompleteness";
import { publicPageMetadata } from "@/lib/metadata";
import { relatedPartyMetadata } from "@/lib/related-parties";

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
  const locale = await getLocale();
  const metadataUi = investmentUi(locale).project;
  if (!isPublicOpportunityId(id)) return {};
  const row = await prisma.listing.findFirst({
    where: { publicationStatus: PUBLIC_LISTING_STATUS, id },
  });
  if (!row) return {};
  const localized = localizeListing(toListing({ ...row, docs: [], images: [], org: { name: "" } }), locale);
  const capital = localizedCapitalPresentation(locale, capitalPresentation(row));
  const capitalDescription = capital.amountUsd != null
    ? `${capital.value} — ${capital.label}`
    : metadataUi.capitalNotDisclosed;
  const description = `${localized.sector} ${metadataUi.opportunityIn} ${localized.country} — ${capitalDescription} · ${localized.instrument}. ${localized.stage}.`;
  return publicPageMetadata(localized.title + " — DESCO Compass", description, {
    canonical: projectHref(row.id),
    openGraphTitle: localized.title + " — DESCO Compass",
  });
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
  const shared = sharedCopy(locale);
  const matchUi = matchPanelCopy(locale);
  const user = await getSessionUser();
  const row = await prisma.listing.findUnique({
    where: { id },
    include: { docs: true, org: true, images: true },
  });
  if (!row) notFound();
  if (
    (row.publicationStatus !== PUBLIC_LISTING_STATUS || !isPublicOpportunityId(row.id)) &&
    !(user?.role === "admin" || (user?.role === "owner" && user.orgId === row.orgId))
  ) {
    notFound();
  }
  const canManageListing = canManage(user, row);
  // Presentation object: confidential fields never leave the server for
  // unauthenticated visitors, and docs/whyMatch are never serialized into
  // client-component props regardless of session (rendered server-side only).
  const full = localizeListing(toListing(row), locale);
  const sectorKey = full.sectorKey ?? row.sector;
  const l = { ...full, docs: [], whyMatch: "" };
  const organization = organizationPresentation(l.id, locale);
  const docs = canManageListing
    ? row.docs
    : row.docs.filter(
        (document) =>
          document.visibility === "restricted" &&
          document.lifecycle === "approved" &&
          !!document.storageKey,
      );
  const approvedRestrictedDocs = row.docs.filter(
    (document) =>
      document.visibility === "restricted" &&
      document.lifecycle === "approved" &&
      !!document.storageKey,
  );
  const roomAccess = await hasDataRoomAccess(user, row);
  const localizedEvidence = localizeInvestmentEvidence(getInvestmentEvidence(l), locale);
  const evidence = { ...localizedEvidence, thesis: locale === "en" ? localizedEvidence.thesis : l.summary };
  const evidenceSummary = summarizeEvidence(evidence);
  const materialFact = materialFactPresentation(l, evidence.provenance.sourceDate);
  const materialCopy = materialFactCopy(locale, materialFact.kind, materialFact.sourceDate);
  const relationship = relatedPartyMetadata(l.id);

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
        { sector: row.sector, country: row.country, currentCapitalAskUsd: row.currentCapitalAskUsd, instrument: row.instrument, governmentBacked: row.governmentBacked, esgEvidenceAvailable: false }
      )
    : null;
  const matchReason = (reason: Parameters<typeof localizedMatchReason>[1]) =>
    localizedMatchReason(locale, reason, { sector: l.sector, country: l.country, instrument: l.instrument });

  return (
    <div className="pb-24 lg:pb-0">
      <OpportunityViewTracker listingId={l.id} sector={sectorKey} />
      <div className="relative bg-ink text-white overflow-hidden">
        <HeroVisual listing={l} className="absolute inset-0 opacity-40" overlay={false} locale={locale} priority />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/40" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <Link href="/opportunities" className="mb-5 inline-flex min-h-11 items-center text-sm font-semibold text-white/75 underline decoration-white/30 underline-offset-4 hover:text-gold">
            ← {shared.backToOpportunities}
          </Link>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider mb-3">
            <span
              className="px-2 py-0.5 rounded-full"
              style={{ background: l.sectorColor, color: sectorForeground(sectorKey) }}
            >
              {l.sector}
            </span>
            <span className="text-white/60">
              {l.flag} {l.country} · {l.stage}
            </span>
            <TrustBadges locale={locale} verified={l.verified} verifiedBy={row.verifiedBy} verifiedAt={row.verifiedAt ? row.verifiedAt.toISOString() : null} verificationNote={row.verificationNote} governmentBacked={l.governmentBacked} govMechanism={row.govMechanism} sponsor={l.org} />
            <span className="ml-auto"><SectorBadge sector={sectorKey} size={34} /></span>
          </div>
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] lg:gap-10">
            <div className="min-w-0">
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-gold">
                {ui.publicBriefing}
              </div>
              <h1 className="max-w-xl break-words font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                {l.title}
              </h1>
              <p className="mt-3 max-w-xl break-words text-white/70">{l.summary}</p>
            </div>
            <div className="min-w-0 text-left lg:text-right">
              <div className={materialFact.kind === "not_disclosed" ? "break-words text-sm font-semibold text-white/70" : materialFact.kind === "physical_scale" ? "break-words font-display text-3xl font-extrabold leading-tight text-gold sm:text-4xl" : "break-words font-display text-4xl font-extrabold leading-tight text-gold"}>
                {materialFact.value}
              </div>
              {materialFact.kind !== "not_disclosed" && <div className="mt-1 text-xs font-semibold text-white/70">{materialCopy.label}</div>}
              {materialFact.kind === "estimated_cost" && <div className="mt-2 text-sm text-white/70">{materialCopy.capitalGap}</div>}
              <div className="mt-2 text-xs text-white/65">
                {l.instrument}
                <br />
                {ui.returnInformation}: {localizedReturnValue(locale)}
              </div>
              <div className="mt-1.5 text-xs text-white/65">{ui.sponsorFigures}</div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/15 pt-4 text-xs text-white/70">
            <span>{pageUpdatedLabel(locale)} {new Date(row.updatedAt).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" })}</span>
            <span>{ui.sourceDate}: {evidence.provenance.sourceDate}</span>
            <span>{organization?.role ?? ui.sponsor}: {l.org}</span>
            {organization?.context && <span>{organization.context}</span>}
            <span>{ui.publicRestricted}</span>
          </div>
          {relationship.relatedParty && (
            <p className="mt-4 max-w-3xl border-l-2 border-gold pl-3 text-xs leading-5 text-white/75">
              {relatedPartyDisclosure(locale, relationship.relatedPartyType)}
            </p>
          )}
        </div>
      </div>

      <section aria-label={ui.publicEvidence} className="border-b border-charcoal/10 bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-px bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [ui.publicEvidence, <DisclosureCompleteness key="disclosure-completeness" evidence={evidence} locale={locale} compact />],
            [ui.principalRisks, evidenceSummary.risksSupported > 0 ? ui.riskDisclosure : ui.readinessNotPublic],
            [ui.evidenceDate, evidence.provenance.sourceDate],
            [ui.projectRoom, approvedRestrictedDocs.length > 0 ? ui.restrictedDocs : ui.readinessNotPublic],
          ].map(([label, value]) => (
            <div key={String(label)} className="bg-white px-4 py-4">
              <p className="text-xs font-bold uppercase tracking-wider text-wgray">{label}</p>
              <div className="mt-1 text-xs font-semibold leading-5 text-charcoal">{value}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <div className="flex justify-end">
            <Link href={`/contact?topic=inaccurate-information&project=${encodeURIComponent(publicProjectId(l.id))}`} className="inline-flex min-h-11 items-center text-sm font-semibold text-slate underline underline-offset-4 hover:text-ink">
              {inaccurateInformationLabel(locale)}
            </Link>
          </div>
          <section id="investment-evidence" className="scroll-mt-6 bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
            <div className="mb-5 border-l-2 border-gold pl-4">
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-gold">{ui.thesis}</div>
              <p className="mt-2 text-sm leading-6 text-charcoal">{evidence.thesis}</p>
            </div>
            <h2 className="font-display font-bold text-lg mb-1">{t(locale, "project.highlights")}</h2>
            <p className="text-xs text-wgray mb-4">{ui.figuresNote}</p>
            <ul className="space-y-2.5">
              {l.highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 text-sm">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0"
                    style={{ background: l.sectorColor, color: sectorForeground(sectorKey) }}
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
                  <dt className="text-xs font-bold uppercase tracking-wider text-wgray">{field.label}</dt>
                  <dd>
                    <div className={field.status === "not-disclosed" ? "text-sm italic text-wgray" : "text-sm text-charcoal"}>{field.value}</div>
                    {field.source && <div className="mt-1 text-xs leading-5 text-wgray">{ui.source}: {field.source}</div>}
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
                  <dt className="text-xs font-bold uppercase tracking-wider text-charcoal">{risk.label}</dt>
                  <dd className="mt-2 text-sm italic text-wgray">{risk.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {canManageListing && (l.useOfFunds || l.fundingSecuredUsd != null || l.sponsorContributionUsd != null) && (
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
                    <div key={d.id} className="rounded-lg hover:bg-mist">
                      <a
                        href={"/api/documents/" + d.id}
                        className="flex items-center justify-between px-3 py-2 text-sm"
                        title={d.storageKey ? ui.download : ui.demoDocument}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="text-gold">▤</span> {d.name}
                          {d.storageKey && <span className="text-xs text-wgray">↓</span>}
                        </span>
                        <span className="text-wgray text-xs">{d.size}</span>
                      </a>
                      <div className="px-3 pb-2 text-xs leading-5 text-wgray">
                        {[d.documentType.replaceAll("_", " "), d.sourceDate?.toLocaleDateString(locale), d.issuer]
                          .filter(Boolean)
                          .join(" · ")}
                        {canManageListing && d.reviewNote ? <div>{d.reviewNote}</div> : null}
                      </div>
                    </div>
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
                <p className="text-xs leading-5 text-wgray">{t(locale, "access.investorQualifier")}</p>
              </div>
            )}
          </section>

          {canManageListing && <TeaserGenerator listingId={l.id} />}
          {user && matchExplanation && (
            <section className={"rounded-2xl p-5 border-l-4 " + (matchExplanation.confidence === "excluded" ? "bg-brandred/5 border-brandred" : "bg-gold-soft border-gold")}>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                <span className={matchExplanation.confidence === "excluded" ? "text-brandred" : "text-gold"}>
                  ✦ {matchUi.match} &ldquo;{activeMandate!.name}&rdquo;
                </span>
                <span className="text-wgray normal-case font-semibold">
                  {matchUi.confidence[matchExplanation.confidence]} · {matchUi.configured(matchExplanation.dataCompleteness)}
                </span>
              </div>
              {matchExplanation.hardExclusions.length > 0 && (
                <ul className="text-sm text-brandred space-y-1 mb-2">
                  {matchExplanation.hardExclusions.map((x, index) => <li key={x.code + index}>⊘ {matchReason(x)}</li>)}
                </ul>
              )}
              {matchExplanation.metCriteria.length > 0 && (
                <ul className="text-sm space-y-1 mb-2">
                  {matchExplanation.metCriteria.map((x, index) => <li key={x.code + index} className="text-emerald-p">✓ {matchReason(x)}</li>)}
                </ul>
              )}
              {matchExplanation.partiallyMetCriteria.length > 0 && (
                <ul className="text-sm space-y-1 mb-2">
                  {matchExplanation.partiallyMetCriteria.map((x, index) => <li key={x.code + index} className="text-gold">◐ {matchReason(x)}</li>)}
                </ul>
              )}
              {matchExplanation.unmetCriteria.length > 0 && (
                <ul className="text-sm space-y-1">
                  {matchExplanation.unmetCriteria.map((x, index) => <li key={x.code + index} className="text-wgray">✕ {matchReason(x)}</li>)}
                </ul>
              )}
              {matchExplanation.missingProjectData.length > 0 && (
                <ul className="text-sm space-y-1 mt-2">
                  {matchExplanation.missingProjectData.map((x, index) => <li key={x.code + index} className="text-wgray italic">? {matchReason(x)}</li>)}
                </ul>
              )}
              <div className="mt-3 border-t border-charcoal/10 pt-2 text-xs leading-5 text-wgray">
                <span className="font-bold">{matchUi.sources}:</span> {matchExplanation.dataSources.map((source) => matchUi.source[source]).join(" · ")}
              </div>
              <div className="mt-1 text-xs leading-5 text-wgray">
                {matchUi.calculated} {new Date(matchExplanation.calculatedAt).toLocaleDateString(locale)} · <Link href="/mandates" className="underline">{matchUi.edit}</Link>
              </div>
              <MatchFeedback listingId={l.id} mandateId={activeMandate!.id} />
            </section>
          )}
          {user && !matchExplanation && (
            <section className="rounded-2xl border-l-4 border-gold bg-gold-soft p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-gold">{matchUi.unavailable}</div>
              <p className="mt-2 text-sm leading-relaxed">{matchUi.unavailableBody}</p>
              <Link href="/mandates" className="button-secondary mt-4">{matchUi.create}</Link>
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
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2 border-t border-charcoal/10 bg-white px-3 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] lg:hidden">
        {canManageListing ? (
          <>
            <a href="#investment-evidence" className="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-gold px-2 text-center font-display text-xs font-bold text-ink">{ui.reviewEvidenceShort}</a>
            <a href="#data-room" className="flex min-h-11 flex-1 items-center justify-center rounded-xl border border-charcoal/15 px-2 text-center font-display text-xs font-semibold text-charcoal">{ui.manageRoomShort}</a>
            <a href="#meetings" className="col-span-2 flex min-h-11 items-center justify-center rounded-xl border border-charcoal/15 px-2 text-center font-display text-xs font-semibold text-charcoal">{ui.meetings}</a>
          </>
        ) : user ? (
          <>
            <RequestInfoButton listingId={l.id} action="dataroom_requested" className="min-h-11 rounded-xl bg-gold px-2 font-display text-xs font-bold leading-4 text-ink" label={t(locale, "project.requestRoom")} doneLabel={"✓ " + ui.requested} />
            <RequestInfoButton listingId={l.id} className="min-h-11 rounded-xl border border-charcoal/15 px-2 font-display text-xs font-semibold leading-4 text-charcoal" label={ui.requestInfo} />
            <RequestInfoButton listingId={l.id} action="saved" className="col-span-2 min-h-11 rounded-xl border border-charcoal/15" label={"⌁ " + t(locale, "project.save")} doneLabel={"✓ " + ui.saved} ariaLabel={t(locale, "project.save")} />
          </>
        ) : (
          <Link href={`/contact?topic=investor-access&project=${l.id}`} className="col-span-2 flex min-h-11 items-center justify-center rounded-xl bg-gold px-3 text-center font-display text-xs font-bold text-ink">{ui.applyAccess}</Link>
        )}
      </div>
      <div className="h-[calc(7.5rem+env(safe-area-inset-bottom))] lg:hidden" aria-hidden="true" />
    </div>
  );
}
