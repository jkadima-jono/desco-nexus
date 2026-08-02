import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import { PageHero, QuietNotice, SectionHeading } from "@/components/public/PublicPrimitives";
import { getLocale } from "@/lib/i18n-server";
import { publicPageMetadata } from "@/lib/metadata";
import { metadataBaseUrl } from "@/lib/metadata";
import { resourceCopy } from "@/lib/translations/resources";
import PrintResourceButton from "./PrintResourceButton";

export async function generateMetadata(): Promise<Metadata> {
  const copy = resourceCopy(await getLocale());
  return publicPageMetadata(copy.metadataTitle, copy.metadataDescription, { canonical: "/resources" });
}

function Checklist({ title, body, items }: { title: string; body: string; items: string[] }) {
  return (
    <article className="rounded-xl border border-ink/10 bg-white p-6 shadow-[0_8px_30px_rgb(13_21_28/0.045)]">
      <h2 className="editorial-heading text-2xl text-ink">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate">{body}</p>
      <ul className="mt-5 space-y-3">
        {items.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-ink"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />{item}</li>)}
      </ul>
    </article>
  );
}

export default async function ResourcesPage() {
  const copy = resourceCopy(await getLocale());
  const origin = metadataBaseUrl();
  return (
    <>
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "DESCO Compass", item: new URL("/", origin).toString() },
          { "@type": "ListItem", position: 2, name: copy.nav, item: new URL("/resources", origin).toString() },
        ],
      }} />
      <PageHero eyebrow={copy.eyebrow} title={copy.title} body={copy.body} primary={{ href: "/opportunities", label: copy.review }} secondary={{ href: "/contact?topic=project-submission", label: copy.discuss }} aside={<div className="briefing-card"><p className="eyebrow text-gold">{copy.updated}</p><p className="mt-4 text-sm leading-6 text-slate">{copy.caution}</p><div className="mt-5"><PrintResourceButton label={copy.print} /></div></div>} />
      <section className="bg-ivory py-14 lg:py-18">
        <div className="public-container">
          <SectionHeading eyebrow={copy.eyebrow} title={copy.updated} />
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <Checklist title={copy.investorTitle} body={copy.investorBody} items={copy.investorItems} />
            <Checklist title={copy.sponsorTitle} body={copy.sponsorBody} items={copy.sponsorItems} />
            <Checklist title={copy.publicTitle} body={copy.publicBody} items={copy.publicItems} />
            <Checklist title={copy.controlledTitle} body={copy.controlledBody} items={copy.controlledItems} />
          </div>
          <div className="mt-8"><QuietNotice>{copy.caution}</QuietNotice></div>
          <div className="mt-8 flex flex-wrap gap-3 print:hidden"><Link href="/opportunities" className="button-primary">{copy.review}</Link><Link href="/contact?topic=project-submission" className="button-secondary">{copy.discuss}</Link></div>
        </div>
      </section>
    </>
  );
}
