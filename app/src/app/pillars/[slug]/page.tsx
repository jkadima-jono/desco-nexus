import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { PILLARS } from "@/lib/pillars";
import { pillarIcon } from "@/lib/theme";
import Reveal from "@/components/story/Reveal";
import StatCounter from "@/components/story/StatCounter";
import Timeline from "@/components/story/Timeline";
import { getLocale } from "@/lib/i18n-server";
import { getPillarsLegal } from "@/lib/translations/pillars-legal";
import Image from "next/image";
import { publicPageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return PILLARS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pillar = getPillarsLegal(await getLocale()).pillars.find((item) => item.slug === slug);
  if (!pillar) return {};
  return publicPageMetadata(pillar.name + " — DESCO Compass", pillar.summary, {
    canonical: `/pillars/${pillar.slug}`,
  });
}

export default async function PillarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const copy = getPillarsLegal(await getLocale());
  const pillar = copy.pillars.find((item) => item.slug === slug);
  if (!pillar) notFound();

  const others = copy.pillars.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div>
      <nav aria-label={copy.detail.breadcrumb} className="max-w-5xl mx-auto px-6 lg:px-8 pt-6">
        <Link href="/pillars" className="text-xs font-bold text-wgray hover:text-charcoal">
          ← {copy.detail.all}
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden mt-4">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, " + pillar.color + " 0%, #10161D 100%)",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 py-16 lg:py-24 text-white">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-white p-1.5 shadow-[0_4px_16px_rgb(0_0_0/0.25)]">
                <Image
                  src={pillarIcon(pillar.slug)}
                  alt=""
                  width={56}
                  height={56}
                  sizes="56px"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <p className="font-bold text-xs uppercase tracking-[0.2em] text-white/80">
                {pillar.shortName}
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display font-extrabold text-3xl lg:text-5xl tracking-tight max-w-2xl">
              {pillar.name}
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-white/85 text-base lg:text-lg mt-4 max-w-xl leading-relaxed">
              {pillar.tagline}
            </p>
          </Reveal>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12 lg:py-16 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          <Reveal>
            <section>
              <h2 className="font-display font-bold text-xl mb-3">{copy.detail.executive}</h2>
              <p className="text-wgray leading-relaxed">{pillar.summary}</p>
            </section>
          </Reveal>

          <Reveal>
            <section className="bg-gold-soft border-l-4 border-gold rounded-2xl p-6">
              <h2 className="font-display font-bold text-lg mb-2 text-gold">{copy.detail.thesis}</h2>
              <p className="text-sm leading-relaxed">{pillar.thesis}</p>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="font-display font-bold text-xl mb-3">{copy.detail.market}</h2>
              <p className="text-wgray leading-relaxed">{pillar.marketOpportunity}</p>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="font-display font-bold text-xl mb-1">{copy.detail.objectives}</h2>
              <p className="text-xs text-wgray mb-3">{copy.detail.objectivesNote}</p>
              <ul className="space-y-2.5">
                {pillar.objectives.map((o) => (
                  <li key={o} className="flex items-start gap-3 text-sm">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs shrink-0 mt-0.5"
                      style={{ background: pillar.color }}
                    >
                      ◦
                    </span>
                    {o}
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="font-display font-bold text-xl mb-6">{copy.detail.timeline}</h2>
              <Timeline milestones={pillar.milestones} pendingLabel={copy.detail.inProgress} />
            </section>
          </Reveal>
        </div>

        <div className="space-y-6">
          {pillar.impact.length > 0 && (
            <Reveal>
              <section className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
                <h2 className="font-display font-bold text-sm uppercase tracking-wider text-wgray mb-4">
                  {copy.detail.impact}
                </h2>
                <div className="grid grid-cols-1 gap-5">
                  {pillar.impact.map((s) => (
                    <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
                  ))}
                </div>
                <p className="text-[11px] text-wgray mt-4 pt-4 border-t border-charcoal/10 leading-relaxed">
                  {copy.detail.impactNote}
                </p>
              </section>
            </Reveal>
          )}

          <Reveal>
            <section className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
              <h2 className="font-display font-bold text-sm uppercase tracking-wider text-wgray mb-3">
                {copy.detail.geography}
              </h2>
              <ul className="space-y-2 text-sm">
                {pillar.geography.map((g) => (
                  <li key={g} className="flex items-center gap-2">
                    <span className="text-gold">◆</span> {g}
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-wgray mt-4 pt-4 border-t border-charcoal/10">
                {copy.detail.mapNote}
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section className="bg-ink text-white rounded-2xl p-6">
              <h2 className="font-display font-bold text-lg mb-2">
                {copy.detail.engage} {pillar.shortName}
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                {copy.detail.engageBody}
              </p>
              <Link
                href="/contact?topic=institutional-partnership"
                className="block text-center bg-gold text-ink font-display font-bold text-sm py-3 rounded-xl hover:brightness-110"
              >
                {copy.detail.signIn}
              </Link>
            </section>
          </Reveal>
        </div>
      </div>

      <section className="bg-mist py-14">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="font-display font-bold text-lg mb-5">{copy.detail.others}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {others.map((p) => (
              <Link
                key={p.slug}
                href={"/pillars/" + p.slug}
                className="bg-white rounded-xl p-4 shadow-[0_1px_3px_rgb(44_62_80/0.08)] hover:shadow-[0_4px_16px_rgb(44_62_80/0.10)] transition-shadow focus-visible:ring-2 focus-visible:ring-gold"
              >
                <div className="font-display font-bold text-sm">{p.name}</div>
                <div className="text-xs text-wgray mt-1">{p.tagline}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
