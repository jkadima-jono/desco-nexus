import Link from "next/link";
import type { Pillar } from "@/lib/pillars";
import Reveal from "./Reveal";

export default function PillarCard({ pillar, index = 0 }: { pillar: Pillar; index?: number }) {
  return (
    <Reveal delay={index * 60}>
      <Link
        href={"/pillars/" + pillar.slug}
        className="group block bg-white rounded-2xl p-6 h-full shadow-[0_1px_3px_rgb(44_62_80/0.08)] hover:shadow-[0_12px_32px_rgb(44_62_80/0.14)] transition-shadow focus-visible:ring-2 focus-visible:ring-gold"
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-display font-bold text-lg mb-4"
          style={{ background: pillar.color }}
        >
          {pillar.shortName.charAt(0)}
        </div>
        <h3 className="font-display font-bold text-lg mb-1.5">{pillar.name}</h3>
        <p className="text-sm text-wgray leading-relaxed mb-4">{pillar.tagline}</p>
        <span className="text-xs font-bold uppercase tracking-wider text-gold group-hover:underline">
          Learn more →
        </span>
      </Link>
    </Reveal>
  );
}
