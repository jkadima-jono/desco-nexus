import Link from "next/link";
import {
  DisclosureChip,
  InstitutionalCard,
  PageHero,
  QuietNotice,
  SectionHeading,
} from "@/components/public/PublicPrimitives";

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

export default function PricingPage() {
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
            eyebrow="Before contracting"
            title="Commercial terms require an approved scope."
            body="DESCO must confirm the contracting entity, services, user roles, support, data handling, procurement requirements and any jurisdiction-specific restrictions before issuing a quotation."
          />
          <div className="mt-8 max-w-3xl">
            <QuietNotice>
              Public pricing will remain unpublished until currency, taxes, invoicing, renewal, cancellation, service levels, data retention and regulated compensation have been reviewed and approved.
            </QuietNotice>
          </div>
          <Link href="/contact?topic=commercial-model" className="button-primary mt-6">
            Discuss commercial scope
          </Link>
        </div>
      </section>
    </>
  );
}
