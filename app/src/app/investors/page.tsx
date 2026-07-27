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
import { getPublicHero } from "@/lib/public-copy";

export const metadata: Metadata = {
  title: "For investors — DESCO Nexus",
  description: "Screen structured opportunities against an investment mandate before committing resources to deeper diligence.",
};

const STEPS = [
  { title: "Define investment criteria", body: "Record sectors, geographies, ticket size, instrument, stage and exclusions." },
  { title: "Review public opportunities", body: "Compare project theses, capital requirements, sponsors, risks and disclosure status." },
  { title: "Assess mandate fit", body: "See which explicit criteria are met, partially met, excluded or missing." },
  { title: "Request access", body: "Ask for financial, technical and legal material when the public case supports deeper review." },
  { title: "Collaborate", body: "Save opportunities, compare them and coordinate meetings, messages and next steps." },
  { title: "Progress independently", body: "Complete your own diligence and investment decision outside the platform." },
];

const MANDATE_FIELDS = [
  "Preferred sectors", "Geographic focus", "Ticket size", "Investment instrument",
  "Project stage", "Impact requirements", "Risk tolerance", "Control preference",
];

export default async function InvestorsPage() {
  const hero = getPublicHero(await getLocale(), "investors");
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
            <p className="eyebrow text-gold">Mandate builder preview</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {MANDATE_FIELDS.map((field) => <div key={field} className="border-b border-ink/10 pb-2 text-xs font-semibold text-ink">{field}</div>)}
            </div>
            <p className="mt-5 text-xs leading-5 text-slate">Matching uses disclosed project fields and deterministic criteria. It is a screening aid, not investment advice.</p>
          </div>
        }
      />
      <section className="bg-ivory py-14 lg:py-18">
        <div className="public-container">
          <SectionHeading eyebrow="Investor operating model" title="Three outcomes, one controlled review path." />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <InstitutionalCard title="Review qualified opportunities" body="Start with comparison-ready public teasers, clear sponsors and visible disclosure status." />
            <InstitutionalCard title="Match against your mandate" body="Use explicit sector, geography, ticket, instrument and exclusion criteria." />
            <InstitutionalCard title="Unlock diligence when justified" body="Request restricted material and sponsor engagement only after initial screening." />
          </div>
          <div className="mt-10"><NumberedProcess items={STEPS} /></div>
          <div className="mt-8"><QuietNotice>Investors remain responsible for legal, financial, tax, technical, ESG and commercial due diligence. A platform status is not investment approval.</QuietNotice></div>
          <Link href="/contact?topic=investor-access" className="button-primary mt-8">Apply for an investor workspace</Link>
        </div>
      </section>
    </>
  );
}
