import Link from "next/link";
import { PILLARS } from "@/lib/pillars";
import Reveal from "@/components/story/Reveal";
import ApproachSteps from "@/components/story/ApproachSteps";
import PillarCard from "@/components/story/PillarCard";
import StatCounter from "@/components/story/StatCounter";

export const metadata = {
  title: "Our Pillars — DESCO Nexus | Integrated Solutions. Sustainable Impact.",
  description:
    "Desco Global's four integrated pillars — Agridesco, Investdesco, Phardesco, and Waterdesco — transforming the Grand Kasai region of the DRC under Vision 2035.",
};

export default function PillarsIndex() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-ink text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, #B8953D 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, #00A550 0%, transparent 50%)",
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 py-20 lg:py-28 text-center">
          <Reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/desco-coin.png"
              alt="Desco Global"
              className="w-14 h-14 rounded-full mx-auto mb-6 shadow-[0_8px_24px_rgb(184_149_61/0.4)]"
            />
            <p className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-4">
              Desco Global · Vision 2035
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{ fontFamily: "var(--font-serif)" }} className="font-semibold text-4xl lg:text-6xl tracking-tight leading-[1.05]">
              Transforming Kasai.
              <br />
              Empowering the DRC.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-white/70 text-base lg:text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
              An integrated African developer and operator unlocking the
              potential of the Democratic Republic of Congo — a $750M Phase 1
              investment opportunity across agriculture, infrastructure,
              healthcare, and water.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="flex flex-wrap gap-3 justify-center mt-8">
              <Link
                href="/contact"
                className="bg-gold text-ink font-display font-bold text-sm px-6 py-3 rounded-xl hover:brightness-110"
              >
                Partner with us
              </Link>
              <Link
                href="/"
                className="border border-white/25 text-white font-display font-semibold text-sm px-6 py-3 rounded-xl hover:bg-white/10"
              >
                Explore live opportunities
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Who we are */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-16 lg:py-20 text-center">
        <Reveal>
          <p className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-3">Who we are</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display font-extrabold text-2xl lg:text-3xl tracking-tight max-w-2xl mx-auto">
            An integrated African developer &amp; operator.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="text-wgray mt-5 leading-relaxed max-w-2xl mx-auto">
            Founded in 2023 with its headquarters in South Africa, Desco
            Global is a purpose-driven holding company dedicated to unlocking
            the potential of the Democratic Republic of Congo. By integrating
            agriculture, infrastructure, healthcare, and water, we create
            self-reinforcing ecosystems that deliver sustainable financial
            returns and transformative social impact — governed by an
            independent board, international audit standards, and an
            IFC-aligned environmental and social management system.
          </p>
        </Reveal>
      </section>

      {/* How the pieces relate */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <Reveal>
          <p className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-3 text-center">How this fits together</p>
        </Reveal>
        <Reveal delay={80}>
          <div className="grid gap-5 sm:grid-cols-2 text-sm">
            <div className="bg-mist rounded-2xl p-5">
              <h3 className="font-display font-bold text-sm mb-1.5">Desco Global</h3>
              <p className="text-wgray leading-relaxed">The holding company. Owns and develops projects across four pillars in the DRC.</p>
            </div>
            <div className="bg-mist rounded-2xl p-5">
              <h3 className="font-display font-bold text-sm mb-1.5">DESCO Nexus</h3>
              <p className="text-wgray leading-relaxed">The platform you&rsquo;re using — where Desco Global and other sponsors list projects for investors to discover, evaluate, and act on.</p>
            </div>
            <div className="bg-mist rounded-2xl p-5">
              <h3 className="font-display font-bold text-sm mb-1.5">The four pillars</h3>
              <p className="text-wgray leading-relaxed">Agridesco, Investdesco, Phardesco, Waterdesco — Desco Global&rsquo;s four operating divisions, each behind a subset of the projects listed on Nexus.</p>
            </div>
            <div className="bg-mist rounded-2xl p-5">
              <h3 className="font-display font-bold text-sm mb-1.5">Project sponsors</h3>
              <p className="text-wgray leading-relaxed">Desco Global itself for pillar projects, or partner organizations (e.g. Comicordia Corporation) for co-developed ones — the party responsible for a listing&rsquo;s content.</p>
            </div>
            <div className="bg-mist rounded-2xl p-5">
              <h3 className="font-display font-bold text-sm mb-1.5">Investors</h3>
              <p className="text-wgray leading-relaxed">Register on Nexus, set a mandate, and review opportunities from any sponsor — not limited to Desco Global&rsquo;s own pillars.</p>
            </div>
            <div className="bg-mist rounded-2xl p-5">
              <h3 className="font-display font-bold text-sm mb-1.5">Advisors</h3>
              <p className="text-wgray leading-relaxed">Support investors or sponsors through discovery, matching, and due diligence on their clients&rsquo; behalf.</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Why Africa / Why DRC */}
      <section className="bg-charcoal text-white py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 grid gap-10 md:grid-cols-2">
          <Reveal>
            <div>
              <p className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-3">Why the Grand Kasai region</p>
              <h3 className="font-display font-bold text-xl mb-3">
                Untapped potential at Africa&rsquo;s heart.
              </h3>
              <p className="text-white/70 leading-relaxed text-sm">
                Located in the geographic center of the DRC, Grand Kasai is
                the nation&rsquo;s demographic engine and agricultural
                reservoir — over 15 million hectares of arable land, historic
                diamond fields and gold belts — yet remains historically
                isolated by infrastructure gaps. Kasai River access via Port
                de Ndomba and Lake Mweru access via Port de Kasenga turn that
                isolation into a central logistics hub between the Atlantic
                coast and the mineral-rich Katanga region.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div>
              <p className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-3">Why the DRC</p>
              <h3 className="font-display font-bold text-xl mb-3">
                The 3rd-largest population in Africa, still underserved.
              </h3>
              <p className="text-white/70 leading-relaxed text-sm">
                The DRC&rsquo;s 100M+ consumer base drives a $3.0B annual food
                import bill, chronic power and clean-water shortages, and one
                pharmacist for every 50,000 people in Kasai against a WHO
                benchmark of 1 per 2,000. Each Desco Global pillar targets one
                of these specific gaps.
              </p>
            </div>
          </Reveal>
        </div>
        <p className="max-w-5xl mx-auto px-6 lg:px-8 text-[11px] text-white/40 mt-10 leading-relaxed">
          Market figures above are drawn from Desco Global&rsquo;s own investor
          and market materials; Nexus has not independently verified the
          underlying trade, demographic, or WHO-benchmark data cited.
        </p>
      </section>

      {/* Approach */}
      <section className="max-w-5xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <Reveal>
          <div className="text-center mb-10">
            <p className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-3">Our approach</p>
            <h2 className="font-display font-extrabold text-2xl lg:text-3xl tracking-tight">
              How Desco Global develops a project, in three stages.
            </h2>
          </div>
        </Reveal>
        <ApproachSteps />
      </section>

      {/* Impact stats */}
      <section className="bg-mist py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <Reveal><StatCounter value={750} suffix="M" label="Phase 1 investment target" /></Reveal>
          <Reveal delay={80}><StatCounter value={17} suffix=".2%" label="Target Phase 1 program IRR" /></Reveal>
          <Reveal delay={160}><StatCounter value={100000} suffix="+" label="Projected jobs by 2035" /></Reveal>
          <Reveal delay={240}><StatCounter value={2500000} label="People targeted for clean water access" /></Reveal>
        </div>
        <p className="text-center text-[11px] text-wgray/70 max-w-lg mx-auto mt-8 leading-relaxed">
          Figures above are Desco Global&rsquo;s own investor-deck targets and
          projections, not independently verified or measured results.
        </p>
      </section>

      {/* Pillars grid */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <Reveal>
          <div className="text-center mb-10">
            <p className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-3">Integrated pillars</p>
            <h2 className="font-display font-extrabold text-2xl lg:text-3xl tracking-tight">
              Four pillars. One ecosystem.
            </h2>
          </div>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p, i) => (
            <PillarCard key={p.slug} pillar={p} index={i} />
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-ink text-white py-16 lg:py-20 text-center">
        <Reveal>
          <h2 className="font-display font-extrabold text-2xl lg:text-3xl tracking-tight max-w-xl mx-auto">
            The future of responsible resource development starts at the
            foundation.
          </h2>
          <Link
            href="/contact"
            className="inline-block mt-7 bg-gold text-ink font-display font-bold text-sm px-7 py-3.5 rounded-xl hover:brightness-110"
          >
            Partner with us
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
