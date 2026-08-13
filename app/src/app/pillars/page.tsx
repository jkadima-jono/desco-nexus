import Link from "next/link";
import Button from "@/components/ui/Button";
import Reveal from "@/components/story/Reveal";
import ApproachSteps from "@/components/story/ApproachSteps";
import PillarCard from "@/components/story/PillarCard";
import StatCounter from "@/components/story/StatCounter";
import { getLocale } from "@/lib/i18n-server";
import { getPillarsLegal } from "@/lib/translations/pillars-legal";
import type { Metadata } from "next";
import { publicPageMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/db";
import { publicListingWhere } from "@/lib/public-listings";

export async function generateMetadata(): Promise<Metadata> {
  const copy = getPillarsLegal(await getLocale());
  return publicPageMetadata(copy.metadataTitle, copy.metadataDescription, { canonical: "/pillars" });
}

export default async function PillarsIndex() {
  const copy = getPillarsLegal(await getLocale());
  const publicOpportunityCount = await prisma.listing.count({ where: publicListingWhere });
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-ink text-white overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 py-20 lg:py-28 text-center">
          <Reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/desco-coin.png"
              alt="Official DESCO Compass logo"
              className="mx-auto mb-6 h-28 w-28 rounded-full object-cover"
            />
            <div className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-4">
              {copy.vision}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-serif)" }} className="font-semibold text-4xl lg:text-6xl tracking-tight leading-[1.05]">
              {copy.heroTitle}
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-white/70 text-base lg:text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
              {copy.heroBody}
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="flex flex-wrap gap-3 justify-center mt-8">
              <Button
                href="/contact"
                variant="ghost-light"
              >
                {copy.partner}
              </Button>
              <Link
                href="/opportunities"
                className="border border-white/25 text-white font-display font-semibold text-sm px-6 py-3  hover:bg-white/10"
              >
                {copy.opportunities}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Who we are */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-16 lg:py-20 text-center">
        <Reveal>
          <div className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-3">{copy.who}</div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display font-extrabold text-2xl lg:text-3xl tracking-tight max-w-2xl mx-auto">
            {copy.profile}
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="text-wgray mt-5 leading-relaxed max-w-2xl mx-auto">
            {copy.profileBody}
          </p>
        </Reveal>
      </section>

      {/* How the pieces relate */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <Reveal>
          <div className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-3 text-center">{copy.fit}</div>
        </Reveal>
        <Reveal delay={80}>
          <div className="grid gap-5 sm:grid-cols-2 text-sm">
            {copy.roles.map(([title, body]) => <div key={title} className="bg-mist  p-5"><h3 className="font-display font-bold text-sm mb-1.5">{title}</h3><p className="text-wgray leading-relaxed">{body}</p></div>)}
          </div>
        </Reveal>
      </section>

      {/* Why Africa / Why DRC */}
      <section className="bg-charcoal text-white py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 grid gap-10 md:grid-cols-2">
          <Reveal>
            <div>
              <div className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-3">{copy.region}</div>
              <h3 className="font-display font-bold text-xl mb-3">
                {copy.regionTitle}
              </h3>
              <p className="text-white/70 leading-relaxed text-sm">
                {copy.regionBody}
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div>
              <div className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-3">{copy.drc}</div>
              <h3 className="font-display font-bold text-xl mb-3">
                {copy.drcTitle}
              </h3>
              <p className="text-white/70 leading-relaxed text-sm">
                {copy.drcBody}
              </p>
            </div>
          </Reveal>
        </div>
        <p className="mx-auto mt-10 max-w-5xl px-6 text-xs leading-relaxed text-white/65 lg:px-8">
          {copy.marketQualifier}
        </p>
      </section>

      {/* Approach */}
      <section className="max-w-5xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <Reveal>
          <div className="text-center mb-10">
            <div className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-3">{copy.approach}</div>
            <h2 className="font-display font-extrabold text-2xl lg:text-3xl tracking-tight">
              {copy.approachTitle}
            </h2>
          </div>
        </Reveal>
        <ApproachSteps steps={copy.steps} />
      </section>

      {/* Impact stats */}
      <section className="bg-mist py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <Reveal><StatCounter value={4} label={copy.stats[0]} /></Reveal>
          <Reveal delay={80}><StatCounter value={publicOpportunityCount} label={copy.stats[1]} /></Reveal>
          <Reveal delay={160}><StatCounter value={5} label={copy.stats[2]} /></Reveal>
          <Reveal delay={240}><StatCounter value={900000} label={copy.stats[3]} /></Reveal>
        </div>
        <p className="text-center text-[11px] text-wgray/70 max-w-lg mx-auto mt-8 leading-relaxed">
          {copy.statsQualifier}
        </p>
      </section>

      {/* Pillars grid */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <Reveal>
          <div className="text-center mb-10">
            <div className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-3">{copy.integrated}</div>
            <h2 className="font-display font-extrabold text-2xl lg:text-3xl tracking-tight">
              {copy.four}
            </h2>
          </div>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {copy.pillars.map((p, i) => (
            <PillarCard key={p.slug} pillar={p} index={i} learnMore={copy.detail.learn} />
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-ink text-white py-16 lg:py-20 text-center">
        <Reveal>
          <h2 className="font-display font-extrabold text-2xl lg:text-3xl tracking-tight max-w-xl mx-auto">
            {copy.closing}
          </h2>
          <Button
            href="/contact"
            variant="ghost-dark"
            className="mt-7"
          >
            {copy.partner}
          </Button>
        </Reveal>
      </section>
    </div>
  );
}
