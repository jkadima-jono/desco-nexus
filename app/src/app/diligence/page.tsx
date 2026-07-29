import type { Metadata } from "next";
import {
  DisclosureChip,
  InstitutionalCard,
  NumberedProcess,
  PageHero,
  QuietNotice,
  SectionHeading,
} from "@/components/public/PublicPrimitives";
import { getLocale } from "@/lib/i18n-server";
import { getMarketingCopy, getMarketingMetadata } from "@/lib/translations/marketing";

export async function generateMetadata(): Promise<Metadata> {
  return getMarketingMetadata(await getLocale(), "diligence");
}

export default async function DiligencePage() {
  const copy = getMarketingCopy(await getLocale(), "diligence");
  const hero = copy.hero;
  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        body={hero.body}
        primary={{ href: "/opportunities", label: hero.primary }}
        secondary={{ href: "/trust", label: hero.secondary }}
        aside={
          <div className="briefing-card">
            <p className="eyebrow text-gold">{copy.accessState}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <DisclosureChip tone="public">{copy.statuses[0]}</DisclosureChip>
              <DisclosureChip tone="pending">{copy.statuses[1]}</DisclosureChip>
              <DisclosureChip tone="restricted">{copy.statuses[2]}</DisclosureChip>
              <DisclosureChip tone="reviewed">{copy.statuses[3]}</DisclosureChip>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate">{copy.accessNote}</p>
          </div>
        }
      />
      <section className="bg-ivory py-14 lg:py-18">
        <div className="public-container">
          <SectionHeading eyebrow={copy.processEyebrow} title={copy.processTitle} />
          <div className="mt-8"><NumberedProcess items={copy.process} /></div>
          <SectionHeading eyebrow={copy.roomEyebrow} title={copy.roomTitle} body={copy.roomBody} />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {copy.folders.map((folder, index) => (
              <InstitutionalCard key={folder} eyebrow={`${copy.folderLabel} ${String(index + 1).padStart(2, "0")}`} title={folder} />
            ))}
          </div>
          <div className="mt-8"><QuietNotice>{copy.notice}</QuietNotice></div>
        </div>
      </section>
    </>
  );
}
