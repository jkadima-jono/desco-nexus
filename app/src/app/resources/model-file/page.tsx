import Button from "@/components/ui/Button";
import type { Metadata } from "next";
import Link from "next/link";
import { DisclosureChip, InstitutionalCard, PageHero, QuietNotice, SectionHeading } from "@/components/public/PublicPrimitives";
import { getLocale } from "@/lib/i18n-server";
import { publicPageMetadata } from "@/lib/metadata";
import { modelFileCopy } from "@/lib/translations/model-file";

export async function generateMetadata(): Promise<Metadata> {
  const copy = modelFileCopy(await getLocale());
  return publicPageMetadata(copy.metadataTitle, copy.metadataDescription, { canonical: "/resources/model-file" });
}

export default async function ModelFilePage() {
  const copy = modelFileCopy(await getLocale());
  return <>
    <PageHero eyebrow={copy.eyebrow} title={copy.title} body={copy.body} primary={{ href: "/sponsors", label: copy.back }} secondary={{ href: "/contact?topic=project-submission", label: copy.email }} aside={<QuietNotice>{copy.warning}</QuietNotice>} />
    <section className="bg-ivory py-14 lg:py-18"><div className="public-container">
      <DisclosureChip tone="reviewed">{copy.status}</DisclosureChip>
      <div className="mt-8"><SectionHeading title={copy.fieldsTitle} /></div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{copy.fields.map((item) => <InstitutionalCard key={item.title} title={item.title} body={item.body} />)}</div>
    </div></section>
    <section className="bg-white py-14 lg:py-18"><div className="public-container">
      <SectionHeading title={copy.risksTitle} />
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{copy.risks.map((item) => <InstitutionalCard key={item.title} title={item.title} body={item.body} />)}</div>
      <div className="mt-10"><SectionHeading title={copy.sourcesTitle} /></div>
      <ul className="mt-6 space-y-3">{copy.sources.map((source) => <li key={source} className=" border border-ink/10 bg-mist p-4 text-sm text-slate">{source}</li>)}</ul>
      <div className="mt-8 flex flex-wrap gap-3"><Button href="/sponsors" className="button-secondary">{copy.back}</Button><Button href="/contact?topic=project-submission" className="button-primary">{copy.email}</Button></div>
    </div></section>
  </>;
}
