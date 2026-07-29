import type { Metadata } from "next";
import Link from "next/link";
import { InstitutionalCard, PageHero, QuietNotice, SectionHeading } from "@/components/public/PublicPrimitives";
import { getLocale } from "@/lib/i18n-server";
import { getMarketingCopy, getMarketingMetadata } from "@/lib/translations/marketing";

export async function generateMetadata(): Promise<Metadata> {
  return getMarketingMetadata(await getLocale(), "partners");
}

export default async function PartnersPage() {
  const copy = getMarketingCopy(await getLocale(), "partners");
  const hero = copy.hero;
  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        body={hero.body}
        primary={{ href: "/contact?topic=institutional-partnership", label: hero.primary }}
        secondary={{ href: "/diligence", label: hero.secondary }}
      />
      <section className="bg-ivory py-14 lg:py-18">
        <div className="public-container">
          <SectionHeading eyebrow={copy.sectionEyebrow} title={copy.sectionTitle} />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {copy.cards.map((card) => <InstitutionalCard key={card.title} {...card} />)}
          </div>
          <div className="mt-8"><QuietNotice>{copy.notice}</QuietNotice></div>
          <Link href="/contact?topic=institutional-partnership" className="button-primary mt-8">{copy.startCta}</Link>
        </div>
      </section>
    </>
  );
}
