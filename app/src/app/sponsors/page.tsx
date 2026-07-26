import type { Metadata } from "next";
import Link from "next/link";
import {
  DisclosureChip,
  InstitutionalCard,
  NumberedProcess,
  PageHero,
  QuietNotice,
  SectionHeading,
} from "@/components/public/PublicPrimitives";

export const metadata: Metadata = {
  title: "For project sponsors — DESCO Nexus",
  description: "Prepare a structured project listing and manage controlled investor diligence.",
};

const READINESS = [
  "Sponsor information", "Project structure", "Market case", "Technical readiness", "Financial model",
  "Legal and regulatory position", "Land and permits", "ESG and community", "Risk disclosure", "Supporting documents",
];

const PROCESS = [
  { title: "Assess readiness", body: "Identify gaps across sponsor, project, market, financial, legal, ESG and document information." },
  { title: "Prepare structured information", body: "Turn fragmented material into consistent fields, evidence references and clear disclosure." },
  { title: "Complete DESCO review", body: "Resolve completeness and internal-consistency questions before publication." },
  { title: "Publish a public teaser", body: "Provide enough public value for investors to screen without exposing restricted material." },
  { title: "Review access requests", body: "Approve or decline qualified users and retain control over confidential information." },
  { title: "Coordinate engagement", body: "Manage meetings, documents, messages and next steps through the workspace." },
];

export default function SponsorsPage() {
  return (
    <>
      <PageHero
        eyebrow="Sponsor pathway"
        title="Prepare your project for serious investor review."
        body="Move from fragmented project information to a structured institutional listing, a clear public teaser and permission-controlled diligence."
        primary={{ href: "/submit-project", label: "Assess project readiness" }}
        secondary={{ href: "/contact?intent=sponsor", label: "Discuss sponsor support" }}
        aside={
          <div className="briefing-card">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-gold">Readiness framework</p>
              <DisclosureChip tone="pending">Under review</DisclosureChip>
            </div>
            <div className="mt-5 space-y-3">
              {READINESS.slice(0, 6).map((item, index) => (
                <div key={item}>
                  <div className="flex justify-between text-[11px]"><span>{item}</span><span className="text-slate">{index < 3 ? "Information supplied" : "Evidence pending"}</span></div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-stone"><div className="h-full bg-teal" style={{ width: `${index < 3 ? 78 : 36}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        }
      />
      <section className="bg-ivory py-14 lg:py-18">
        <div className="public-container">
          <SectionHeading
            eyebrow="Sponsor transformation"
            title="Structure the public case, then control the deeper review."
            body="The sponsor route covers readiness, submission, disclosure, listing preparation, confidential documents, access decisions and investor engagement."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {READINESS.map((item) => <InstitutionalCard key={item} title={item} />)}
          </div>
          <div className="mt-10"><NumberedProcess items={PROCESS} /></div>
          <div className="mt-8"><QuietNotice>DESCO review addresses structure, completeness and internal consistency. It does not constitute legal approval, project endorsement or independent investment verification.</QuietNotice></div>
          <Link href="/submit-project" className="button-primary mt-8">Start a structured submission</Link>
        </div>
      </section>
    </>
  );
}
