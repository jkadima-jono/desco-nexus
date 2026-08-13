import Button from "@/components/ui/Button";
import Link from "next/link";
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
  return getMarketingMetadata(await getLocale(), "pricing");
}

export default async function PricingPage() {
  const copy = getMarketingCopy(await getLocale(), "pricing");
  const hero = copy.hero;
  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        body={hero.body}
        primary={{ href: "/contact?topic=commercial-model", label: hero.primary }}
        secondary={{ href: "/investors", label: hero.secondary }}
        aside={
          <QuietNotice>
            {copy.heroNotice}
          </QuietNotice>
        }
      />

      <section className="bg-ivory py-14 lg:py-18">
        <div className="public-container">
          <SectionHeading
            eyebrow={copy.pathsEyebrow}
            title={copy.pathsTitle}
            body={copy.pathsBody}
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {copy.paths.map((path) => (
              <article key={path.title} className="flex flex-col  border border-charcoal/10 bg-white p-6 ">
                <div><DisclosureChip tone="pending">{path.audience}</DisclosureChip></div>
                <h2 className="mt-4 font-display text-xl font-bold text-ink">{path.title}</h2>
                <p className="mt-2 text-sm font-semibold text-teal">{path.model}</p>
                <ul className="mt-5 flex-1 space-y-3 text-sm leading-6 text-slate">
                  {path.includes.map((item) => <li key={item}>• {item}</li>)}
                </ul>
                <Button href="/contact?topic=commercial-model" className="button-secondary mt-6">
                  {copy.defineScope}
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-18">
        <div className="public-container">
          <SectionHeading
            eyebrow={copy.safeguardsEyebrow}
            title={copy.safeguardsTitle}
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {copy.principles.map((card) => <InstitutionalCard key={card.title} {...card} />)}
          </div>
        </div>
      </section>

      <section className="bg-mist py-14">
        <div className="public-container">
          <SectionHeading
            eyebrow={copy.beforeEyebrow}
            title={copy.beforeTitle}
            body={copy.beforeBody}
          />
          <div className="mt-8 max-w-3xl">
            <QuietNotice>
              {copy.beforeNotice}
            </QuietNotice>
          </div>
          <Button href="/contact?topic=commercial-model" className="button-primary mt-6">
            {copy.discussCta}
          </Button>
        </div>
      </section>
    </>
  );
}
