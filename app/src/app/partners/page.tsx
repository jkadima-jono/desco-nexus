import type { Metadata } from "next";
import Link from "next/link";
import { InstitutionalCard, PageHero, QuietNotice, SectionHeading } from "@/components/public/PublicPrimitives";
import { getLocale } from "@/lib/i18n-server";
import { getPublicHero } from "@/lib/public-copy";

export const metadata: Metadata = {
  title: "Partners and advisors — DESCO Nexus",
  description: "Routes for legal, financial, technical, government and development partners supporting structured opportunities.",
};

const PARTNERS = [
  ["Legal and transaction advisors", "Support legal structuring, disclosure, document review and transaction execution."],
  ["Financial advisors and lenders", "Support financial modelling, capital structure, credit review and investor engagement."],
  ["Technical and ESG specialists", "Support feasibility, engineering, environmental, social and operational review."],
  ["Government and development institutions", "Support public-sector coordination, policy context and development alignment."],
];

export default async function PartnersPage() {
  const hero = getPublicHero(await getLocale(), "partners");
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
          <SectionHeading eyebrow="Participation model" title="Defined roles, authorised access and clear accountability." />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {PARTNERS.map(([title, body]) => <InstitutionalCard key={title} title={title} body={body} />)}
          </div>
          <div className="mt-8"><QuietNotice>No advisor, government body, development institution or commercial partner should be displayed as affiliated with DESCO Nexus without approved source evidence.</QuietNotice></div>
          <Link href="/contact?topic=institutional-partnership" className="button-primary mt-8">Start a partnership inquiry</Link>
        </div>
      </section>
    </>
  );
}
