import type { Metadata } from "next";
import {
  DisclosureChip,
  InstitutionalCard,
  NumberedProcess,
  PageHero,
  QuietNotice,
  SectionHeading,
} from "@/components/public/PublicPrimitives";

export const metadata: Metadata = {
  title: "How diligence works — DESCO Nexus",
  description: "Understand public screening, access requests, restricted documents and sponsor engagement on DESCO Nexus.",
};

const INVESTOR = [
  { title: "Review public teaser", body: "Read the project thesis, sponsor, stage, capital requirement, risks and disclosure summary." },
  { title: "Evaluate mandate fit", body: "Compare disclosed fields against your organisation’s investment criteria." },
  { title: "Request controlled access", body: "Explain your interest and request the restricted material needed for deeper review." },
  { title: "Review confidential material", body: "Access only the folders and documents covered by the sponsor’s permission." },
  { title: "Meet the sponsor", body: "Coordinate a meeting when the available information supports further engagement." },
  { title: "Progress independently", body: "Conduct professional diligence and negotiate any transaction outside the platform." },
];

const FOLDERS = [
  "Executive overview", "Corporate and sponsor information", "Financial information", "Technical studies",
  "Legal and regulatory", "Land, permits and concessions", "ESG and community", "Commercial agreements",
  "Risk and insurance", "Transaction documents",
];

export default function DiligencePage() {
  return (
    <>
      <PageHero
        eyebrow="Controlled diligence"
        title="Information access should follow a justified screening decision."
        body="DESCO Nexus separates public screening information from permission-controlled financial, technical, legal and transaction material."
        primary={{ href: "/opportunities", label: "Review public opportunities" }}
        secondary={{ href: "/trust", label: "Read disclosure standards" }}
        aside={
          <div className="briefing-card">
            <p className="eyebrow text-gold">Access state</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <DisclosureChip tone="public">Public teaser</DisclosureChip>
              <DisclosureChip tone="pending">Request pending</DisclosureChip>
              <DisclosureChip tone="restricted">Restricted</DisclosureChip>
              <DisclosureChip tone="reviewed">Approved access</DisclosureChip>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate">Access decisions should identify the user, organisation, project, permission scope and decision record.</p>
          </div>
        }
      />
      <section className="bg-ivory py-14 lg:py-18">
        <div className="public-container">
          <SectionHeading eyebrow="Investor process" title="From public screening to controlled review." />
          <div className="mt-8"><NumberedProcess items={INVESTOR} /></div>
          <SectionHeading eyebrow="Data room structure" title="A predictable document architecture." body="Folder availability depends on sponsor submission and approved access." />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {FOLDERS.map((folder, index) => (
              <InstitutionalCard key={folder} eyebrow={`Folder ${String(index + 1).padStart(2, "0")}`} title={folder} />
            ))}
          </div>
          <div className="mt-8"><QuietNotice>DESCO Nexus supports screening, controlled information exchange and engagement. It does not replace legal, financial, technical, tax, ESG or commercial due diligence.</QuietNotice></div>
        </div>
      </section>
    </>
  );
}
