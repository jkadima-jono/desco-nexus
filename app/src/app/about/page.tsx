import type { Metadata } from "next";
import Link from "next/link";
import { InstitutionalCard, PageHero, QuietNotice, SectionHeading } from "@/components/public/PublicPrimitives";

export const metadata: Metadata = {
  title: "About DESCO Global — DESCO Nexus",
  description: "DESCO Global's role in connecting structured projects, capital providers and strategic partners.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About DESCO Global"
        title="Connecting structured projects, capital and strategic partners."
        body="DESCO Global operates DESCO Nexus as an investment opportunity and diligence platform focused initially on the Democratic Republic of Congo, with the capacity to support selected African markets."
        primary={{ href: "/contact?intent=partner", label: "Contact DESCO Global" }}
        secondary={{ href: "/pillars", label: "Review investment pillars" }}
        aside={<QuietNotice>This page does not claim an investment track record, client list, transaction history, office network or regulatory status that has not been supplied and approved by DESCO Global.</QuietNotice>}
      />
      <section className="bg-ivory py-14 lg:py-18">
        <div className="public-container">
          <SectionHeading eyebrow="Platform rationale" title="A clearer interface between project preparation and investor review." />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <InstitutionalCard title="Project structure" body="Help sponsors organise public and restricted information into a consistent review format." />
            <InstitutionalCard title="Capital screening" body="Help investors compare disclosed opportunities against explicit mandate criteria." />
            <InstitutionalCard title="Controlled diligence" body="Give sponsors permission controls over confidential information and access decisions." />
            <InstitutionalCard title="Strategic coordination" body="Support meetings, communication and next steps between authorised organisations." />
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/partners" className="button-secondary">Partners and advisors</Link>
            <Link href="/contact" className="button-primary">Route an inquiry</Link>
          </div>
        </div>
      </section>
    </>
  );
}
