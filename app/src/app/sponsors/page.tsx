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
import { sponsorReadinessCopy } from "@/lib/translations/sponsor-readiness";

export async function generateMetadata(): Promise<Metadata> {
  return getMarketingMetadata(await getLocale(), "sponsors");
}

export default async function SponsorsPage() {
  const locale = await getLocale();
  const copy = getMarketingCopy(locale, "sponsors");
  const readiness = sponsorReadinessCopy(locale);
  const hero = copy.hero;
  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        body={hero.body}
        primary={{ href: "/trust", label: readiness.standardCta }}
        secondary={{ href: "/contact?topic=project-submission", label: readiness.emailCta }}
        aside={
          <div className="briefing-card">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-gold">{copy.framework}</p>
              <DisclosureChip tone="public">{readiness.requiredInputs}</DisclosureChip>
            </div>
            <div className="mt-5 space-y-3">
              {readiness.areas.slice(0, 6).map((item) => (
                <div key={item.title} className="flex items-center gap-3 border-b border-ink/8 pb-3 text-sm">
                  <span aria-hidden="true" className="text-gold">•</span>
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        }
      />
      <section className="bg-ivory py-14 lg:py-18">
        <div className="public-container">
          <SectionHeading
            eyebrow={readiness.standardEyebrow}
            title={readiness.standardTitle}
            body={readiness.standardBody}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {readiness.areas.map((item) => <InstitutionalCard key={item.title} title={item.title} body={item.body} />)}
          </div>
          <div className="mt-10"><NumberedProcess items={copy.process} /></div>
          <div className="mt-8"><QuietNotice>{copy.notice}</QuietNotice></div>
        </div>
      </section>
      <section className="border-t border-ink/10 bg-white py-14 lg:py-18">
        <div className="public-container">
          <SectionHeading eyebrow={readiness.engagementEyebrow} title={readiness.engagementTitle} body={readiness.engagementBody} />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {readiness.engagement.map((item) => <InstitutionalCard key={item.title} title={item.title} body={item.body} />)}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/resources" className="button-secondary">{readiness.standardCta}</Link>
            <Link href="/resources/model-file" className="button-secondary">{readiness.modelCta}</Link>
            <Link href="/contact?topic=project-submission" className="button-primary">{readiness.emailCta}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
