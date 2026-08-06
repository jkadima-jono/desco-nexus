import type { Metadata } from "next";
import Link from "next/link";
import { InstitutionalCard, PageHero, QuietNotice, SectionHeading } from "@/components/public/PublicPrimitives";
import { getLocale } from "@/lib/i18n-server";
import { getMarketingCopy, getMarketingMetadata } from "@/lib/translations/marketing";
import { entityDisclosureCopy } from "@/lib/translations/entity-disclosure";

export async function generateMetadata(): Promise<Metadata> {
  return getMarketingMetadata(await getLocale(), "about");
}

export default async function AboutPage() {
  const locale = await getLocale();
  const copy = getMarketingCopy(locale, "about");
  const disclosure = entityDisclosureCopy(locale);
  const hero = copy.hero;
  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        body={hero.body}
        primary={{ href: "/contact?topic=institutional-partnership", label: hero.primary }}
        secondary={{ href: "/pillars", label: hero.secondary }}
        aside={<QuietNotice>{copy.notice}</QuietNotice>}
      />
      <section className="bg-ivory py-14 lg:py-18">
        <div className="public-container">
          <SectionHeading eyebrow={copy.sectionEyebrow} title={copy.sectionTitle} />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {copy.cards.map((card) => <InstitutionalCard key={card.title} {...card} />)}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/partners" className="button-secondary">{copy.partnersCta}</Link>
            <Link href="/contact?topic=institutional-partnership" className="button-primary">{copy.inquiryCta}</Link>
          </div>
        </div>
      </section>
      <section className="border-t border-ink/10 bg-white py-14 lg:py-18">
        <div className="public-container">
          <SectionHeading eyebrow={disclosure.eyebrow} title={disclosure.title} body={disclosure.body} />
          <dl className="mt-8 grid gap-px overflow-hidden rounded-xl border border-ink/10 bg-ink/10 md:grid-cols-2 lg:grid-cols-3">
            {disclosure.fields.map((field) => (
              <div key={field.label} className="bg-white p-5">
                <dt className="text-xs font-bold uppercase tracking-wider text-slate">{field.label}</dt>
                <dd className="mt-2 text-sm font-semibold text-ink">{field.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5">
            <InstitutionalCard title={disclosure.recordTitle}>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-slate">
                {disclosure.record.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </InstitutionalCard>
          </div>
          <div className="mt-6"><QuietNotice>{disclosure.note}</QuietNotice></div>
        </div>
      </section>
    </>
  );
}
