import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  DisclosureChip,
  InstitutionalCard,
  PageHero,
  QuietNotice,
  SectionHeading,
} from "@/components/public/PublicPrimitives";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Commercial model — DESCO Nexus",
  description: "How DESCO Nexus proposes to structure investor, sponsor and institutional-partner access.",
};

const PATHS = [
  {
    audience: "Investors",
    title: "Institutional workspace",
    model: "Proposed annual organization licence",
    includes: [
      "Mandate configuration and opportunity screening",
      "Comparison, saved research and team workflow",
      "Project-specific restricted-access requests",
      "Onboarding and support scope agreed by organization",
    ],
  },
  {
    audience: "Project sponsors",
    title: "Readiness and controlled diligence",
    model: "Proposed scope-based engagement",
    includes: [
      "Project intake and disclosure-gap assessment",
      "Structured public opportunity preparation",
      "Controlled document-room and inquiry workflow",
      "Additional advisory work contracted separately",
    ],
  },
  {
    audience: "DFIs, governments and partners",
    title: "Programme workspace",
    model: "Custom programme agreement",
    includes: [
      "Portfolio or corridor-level configuration",
      "Governance, reporting and access design",
      "Defined implementation and support services",
      "Commercial terms based on approved scope",
    ],
  },
];

const PRINCIPLES = [
  ["Organization-level contracting", "Institutional use should be contracted with an organization and defined user roles, not represented as an individual consumer subscription."],
  ["Access is separate from investment outcome", "Workspace fees must not imply project approval, allocation, investment performance or access to every restricted room."],
  ["Advisory scope is explicit", "Project preparation, transaction support or specialist diligence should use a separate statement of work with named deliverables."],
  ["Success fees require legal approval", "No transaction, placement or success fee should be offered until the activity, jurisdiction, permissions and conflicts framework have been approved."],
];

const limitLabel = (n: number | null, unit: string) =>
  n === null ? `Unlimited ${unit}s in the demo scenario` : `${n} ${unit}${n === 1 ? "" : "s"} in the demo scenario`;

export default async function PricingPage() {
  const plans = await prisma.plan.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      <PageHero
        eyebrow="Commercial model"
        title="Institutional access should be scoped, contracted and evidence-led."
        body="DESCO Nexus does not currently process payments, issue invoices or offer self-serve subscriptions. The pathways below describe a proposed sales-assisted model for discussion, not binding prices or an offer."
        primary={{ href: "/contact?topic=commercial-model", label: "Discuss commercial scope" }}
        secondary={{ href: "/investors", label: "Review the investor pathway" }}
        aside={
          <QuietNotice>
            No payment processor is connected. No displayed workspace configuration is billed, collected revenue or an approved commercial quotation.
          </QuietNotice>
        }
      />

      <section className="bg-ivory py-14 lg:py-18">
        <div className="public-container">
          <SectionHeading
            eyebrow="Proposed pathways"
            title="Different users require different commercial structures."
            body="The public product should explain who pays, what the fee covers, what remains project-specific, and which services require a separate mandate."
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {PATHS.map((path) => (
              <article key={path.title} className="flex flex-col rounded-xl border border-charcoal/10 bg-white p-6 shadow-[0_8px_24px_rgb(13_21_28/0.05)]">
                <div><DisclosureChip tone="pending">{path.audience}</DisclosureChip></div>
                <h2 className="mt-4 font-display text-xl font-bold text-ink">{path.title}</h2>
                <p className="mt-2 text-sm font-semibold text-teal">{path.model}</p>
                <ul className="mt-5 flex-1 space-y-3 text-sm leading-6 text-slate">
                  {path.includes.map((item) => <li key={item}>• {item}</li>)}
                </ul>
                <Link href="/contact?topic=commercial-model" className="button-secondary mt-6">
                  Define scope
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-18">
        <div className="public-container">
          <SectionHeading
            eyebrow="Commercial safeguards"
            title="Charges must remain distinct from access decisions and investment claims."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {PRINCIPLES.map(([title, body]) => (
              <InstitutionalCard key={title} title={title} body={body} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mist py-14">
        <div className="public-container">
          <SectionHeading
            eyebrow="Demonstration entitlements"
            title="Internal configurations used to test product limits."
            body="These configurations are retained for workflow testing. Their database price values are scenario inputs only and are deliberately not presented as public quotations."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.id} className="rounded-xl border border-charcoal/10 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display font-bold text-ink">{plan.name}</h3>
                  <DisclosureChip tone="pending">Demo configuration</DisclosureChip>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate">{plan.description}</p>
                <ul className="mt-4 space-y-2 text-xs text-slate">
                  <li>{limitLabel(plan.maxActiveMandates, "active mandate")}</li>
                  <li>{limitLabel(plan.maxCollections, "saved collection")}</li>
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <QuietNotice>
              Before launch, DESCO must approve contracting entity, currency, taxes, invoicing, renewal, cancellation, service levels, support, data retention, refunds, procurement requirements and any regulated transaction-based compensation.
            </QuietNotice>
          </div>
        </div>
      </section>
    </>
  );
}
