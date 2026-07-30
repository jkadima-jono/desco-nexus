import type { Metadata } from "next";
import Link from "next/link";
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
  return getMarketingMetadata(await getLocale(), "sponsors");
}

export default async function SponsorsPage() {
  const copy = getMarketingCopy(await getLocale(), "sponsors");
  const hero = copy.hero;
  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        body={hero.body}
        primary={{ href: "/contact?topic=project-submission", label: hero.primary }}
        secondary={{ href: "/contact?topic=project-submission", label: hero.secondary }}
        aside={
          <div className="briefing-card">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-gold">{copy.framework}</p>
              <DisclosureChip tone="pending">{copy.underReview}</DisclosureChip>
            </div>
            <div className="mt-5 space-y-3">
              {copy.readiness.slice(0, 6).map((item) => (
                <div key={item} className="flex items-center gap-3 border-b border-ink/8 pb-3 text-sm">
                  <span aria-hidden="true" className="grid h-5 w-5 place-items-center rounded-full border border-teal/35 text-[10px] text-teal">✓</span>
                  <span>{item}</span>
                  <span className="ml-auto text-[10px] uppercase tracking-wider text-slate">{copy.required}</span>
                </div>
              ))}
            </div>
          </div>
        }
      />
      <section className="bg-ivory py-14 lg:py-18">
        <div className="public-container">
          <SectionHeading
            eyebrow={copy.sectionEyebrow}
            title={copy.sectionTitle}
            body={copy.sectionBody}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {copy.readiness.map((item) => <InstitutionalCard key={item} title={item} />)}
          </div>
          <div className="mt-10"><NumberedProcess items={copy.process} /></div>
          <div className="mt-8"><QuietNotice>{copy.notice}</QuietNotice></div>
          <Link href="/contact?topic=project-submission" className="button-primary mt-8">{copy.startCta}</Link>
        </div>
      </section>
    </>
  );
}
