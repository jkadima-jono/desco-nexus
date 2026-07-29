import type { Metadata } from "next";
import {
  DisclosureChip,
  InstitutionalCard,
  PageHero,
  QuietNotice,
  SectionHeading,
} from "@/components/public/PublicPrimitives";
import { getLocale } from "@/lib/i18n-server";
import { getMarketingCopy, getMarketingMetadata } from "@/lib/translations/marketing";

export async function generateMetadata(): Promise<Metadata> {
  return getMarketingMetadata(await getLocale(), "trust");
}

export default async function TrustPage() {
  const copy = getMarketingCopy(await getLocale(), "trust");
  const hero = copy.hero;
  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        body={hero.body}
        primary={{ href: "/legal#verification", label: hero.primary }}
        secondary={{ href: "/diligence", label: hero.secondary }}
        aside={<QuietNotice>{copy.heroNotice}</QuietNotice>}
      />
      <section className="bg-ivory py-14 lg:py-18">
        <div className="public-container">
          <SectionHeading eyebrow={copy.sectionEyebrow} title={copy.sectionTitle} />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {copy.statuses.map(({ title, body, tone }) => (
              <InstitutionalCard key={title} title={title} body={body}>
                <div className="mt-5"><DisclosureChip tone={tone}>{title}</DisclosureChip></div>
              </InstitutionalCard>
            ))}
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {copy.controls.map((card) => <InstitutionalCard key={card.title} {...card} />)}
          </div>
          <div className="mt-8"><QuietNotice>{copy.notice}</QuietNotice></div>
        </div>
      </section>
    </>
  );
}
