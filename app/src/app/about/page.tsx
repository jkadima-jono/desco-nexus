import type { Metadata } from "next";
import Link from "next/link";
import { InstitutionalCard, PageHero, QuietNotice, SectionHeading } from "@/components/public/PublicPrimitives";
import { getLocale } from "@/lib/i18n-server";
import { getMarketingCopy, getMarketingMetadata } from "@/lib/translations/marketing";

export async function generateMetadata(): Promise<Metadata> {
  return getMarketingMetadata(await getLocale(), "about");
}

export default async function AboutPage() {
  const copy = getMarketingCopy(await getLocale(), "about");
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
    </>
  );
}
