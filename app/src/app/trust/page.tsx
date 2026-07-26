import type { Metadata } from "next";
import {
  DisclosureChip,
  InstitutionalCard,
  PageHero,
  QuietNotice,
  SectionHeading,
} from "@/components/public/PublicPrimitives";

export const metadata: Metadata = {
  title: "Trust and disclosures — DESCO Nexus",
  description: "How DESCO Nexus labels project information, review status, restricted access and verification evidence.",
};

const STATUSES = [
  ["Sponsor-provided", "Information supplied by the project sponsor and not independently verified.", "pending"],
  ["DESCO reviewed", "Reviewed for structure, completeness and internal consistency.", "reviewed"],
  ["Independent verification pending", "No approved third-party validation has been recorded.", "pending"],
  ["Verified document", "A specific document has an approved verification record and stated scope.", "reviewed"],
  ["Restricted", "Only approved authenticated users may access the information.", "restricted"],
  ["Approved for public teaser", "An administrator has approved publication; this is not investment endorsement.", "public"],
] as const;

export default function TrustPage() {
  return (
    <>
      <PageHero
        eyebrow="Trust and disclosure architecture"
        title="Clear status. Defined scope. No implied endorsement."
        body="DESCO Nexus describes project information and access controls by what has actually occurred, who supplied the information and what evidence supports the status."
        primary={{ href: "/legal#verification", label: "Read the legal methodology" }}
        secondary={{ href: "/diligence", label: "How controlled access works" }}
        aside={<QuietNotice>Nothing on DESCO Nexus constitutes a securities offer, investment recommendation, financial guarantee or legal approval.</QuietNotice>}
      />
      <section className="bg-ivory py-14 lg:py-18">
        <div className="public-container">
          <SectionHeading eyebrow="Disclosure language" title="Statuses that remain understandable under scrutiny." />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {STATUSES.map(([title, body, tone]) => (
              <InstitutionalCard key={title} title={title} body={body}>
                <div className="mt-5"><DisclosureChip tone={tone}>{title}</DisclosureChip></div>
              </InstitutionalCard>
            ))}
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <InstitutionalCard title="Project information review" body="DESCO reviews submissions for structure, completeness and internal consistency before publication. This does not constitute independent investment verification." />
            <InstitutionalCard title="Listing status" body="Listing status is recorded and managed by DESCO administrators. It should not be interpreted as investment approval or endorsement." />
            <InstitutionalCard title="Data room access" body="Confidential documents are available only to approved users through permission-controlled access." />
            <InstitutionalCard title="Activity record" body="Material workspace activity and access decisions may be logged for operational oversight." />
          </div>
          <div className="mt-8"><QuietNotice>The platform does not claim completed AML or KYC checks, SOC 2 certification, GDPR compliance, government approval, guaranteed returns or independent verification unless supported by approved, scope-specific evidence.</QuietNotice></div>
        </div>
      </section>
    </>
  );
}
