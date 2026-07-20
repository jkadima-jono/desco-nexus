import Link from "next/link";
import { PILLARS } from "@/lib/pillars";
import Reveal from "@/components/story/Reveal";
import ApproachSteps from "@/components/story/ApproachSteps";
import PillarCard from "@/components/story/PillarCard";
import StatCounter from "@/components/story/StatCounter";

export const metadata = {
  title: "Our Pillars — DESCO Nexus | Integrated Solutions. Sustainable Impact.",
  description:
    "Nine integrated pillars structuring, securing, and developing real assets across Africa's high-potential regions — mining, agriculture, healthcare, water, infrastructure, and capital.",
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
            <p className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-4">
              Desco Global · Investdesco Pillar
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display font-extrabold text-4xl lg:text-6xl tracking-tight leading-[1.05]">
              Building strategic assets.
              <br />
              Enabling long-term growth.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-white/70 text-base lg:text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
              We structure, secure, and develop real assets across Africa&rsquo;s
              high-potential regions — at the intersection of community,
              government, and capital.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="flex flex-wrap gap-3 justify-center mt-8">
              <Link
                href="/login"
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
            A long-term strategic partner unlocking value in frontier and
            emerging markets.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="text-wgray mt-5 leading-relaxed max-w-2xl mx-auto">
            For over a decade, our team has operated on the ground in the
            Democratic Republic of Congo and across Southern Africa — building
            trusted relationships with regional authorities, local operators,
            and international partners. Nexus is how that trust becomes
            accessible to global capital.
          </p>
        </Reveal>
      </section>

      {/* Why Africa / Why DRC */}
      <section className="bg-charcoal text-white py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 grid gap-10 md:grid-cols-2">
          <Reveal>
            <div>
              <p className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-3">Why Africa</p>
              <h3 className="font-display font-bold text-xl mb-3">
                Where structure is the scarce resource, not capital.
              </h3>
              <p className="text-white/70 leading-relaxed text-sm">
                Africa holds the fastest-growing demand for infrastructure,
                minerals, and food security on Earth. What limits investment
                isn&rsquo;t opportunity — it&rsquo;s the absence of governed,
                de-risked entry points. We build those entry points first.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div>
              <p className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-3">Why the DRC</p>
              <h3 className="font-display font-bold text-xl mb-3">
                A decade of relationships that cannot be shortcut.
              </h3>
              <p className="text-white/70 leading-relaxed text-sm">
                The Democratic Republic of Congo holds generational mineral,
                agricultural, and hydrological wealth. Our founding team has
                worked directly with communities and authorities here since
                before it was an investment thesis — that history is the
                moat.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Approach */}
      <section className="max-w-5xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <Reveal>
          <div className="text-center mb-10">
            <p className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-3">Our approach</p>
            <h2 className="font-display font-extrabold text-2xl lg:text-3xl tracking-tight">
              We do not speculate. We structure. We secure. We execute.
            </h2>
          </div>
        </Reveal>
        <ApproachSteps />
      </section>

      {/* Impact stats */}
      <section className="bg-mist py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <Reveal><StatCounter value={9} label="Integrated pillars" /></Reveal>
          <Reveal delay={80}><StatCounter value={10} suffix="+" label="Years on the ground" /></Reveal>
          <Reveal delay={160}><StatCounter value={22} suffix="+" label="Communities engaged" /></Reveal>
          <Reveal delay={240}><StatCounter value={800000} label="Residents in water programs" /></Reveal>
        </div>
      </section>

      {/* Pillars grid */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <Reveal>
          <div className="text-center mb-10">
            <p className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-3">Integrated pillars</p>
            <h2 className="font-display font-extrabold text-2xl lg:text-3xl tracking-tight">
              Nine platforms. One structure.
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
            href="/login"
            className="inline-block mt-7 bg-gold text-ink font-display font-bold text-sm px-7 py-3.5 rounded-xl hover:brightness-110"
          >
            Partner with us
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
