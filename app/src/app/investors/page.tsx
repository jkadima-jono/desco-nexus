import type { Metadata } from "next";
import Link from "next/link";
import {
  InstitutionalCard,
  NumberedProcess,
  PageHero,
  QuietNotice,
  SectionHeading,
} from "@/components/public/PublicPrimitives";
import { getLocale } from "@/lib/i18n-server";
import { getMarketingCopy, getMarketingMetadata } from "@/lib/translations/marketing";

export async function generateMetadata(): Promise<Metadata> {
  return getMarketingMetadata(await getLocale(), "investors");
}

export default async function InvestorsPage() {
  const copy = getMarketingCopy(await getLocale(), "investors");
  const hero = copy.hero;
  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        body={hero.body}
        primary={{ href: "/contact?topic=investor-access", label: hero.primary }}
        secondary={{ href: "/opportunities", label: hero.secondary }}
        aside={
          <div className="briefing-card">
            <p className="eyebrow text-gold">{copy.preview}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {copy.mandateFields.map((field) => <div key={field} className="border-b border-ink/10 pb-2 text-xs font-semibold text-ink">{field}</div>)}
            </div>
            <p className="mt-5 text-xs leading-5 text-slate">{copy.matchingNote}</p>
          </div>
        }
      />
      <section className="bg-ivory py-14 lg:py-18">
        <div className="public-container">
          <SectionHeading eyebrow={copy.sectionEyebrow} title={copy.sectionTitle} />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {copy.cards.map((card) => <InstitutionalCard key={card.title} {...card} />)}
          </div>
          <div className="mt-10"><NumberedProcess items={copy.steps} /></div>
          <div className="mt-8"><QuietNotice>{copy.notice}</QuietNotice></div>
          <Link href="/contact?topic=investor-access" className="button-primary mt-8">{copy.applyCta}</Link>
        </div>
      </section>
    </>
  );
}
