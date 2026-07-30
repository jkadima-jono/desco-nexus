import Link from "next/link";
import type { Pillar } from "@/lib/pillars";
import { pillarIcon } from "@/lib/theme";
import Reveal from "./Reveal";
import Image from "next/image";

export default function PillarCard({ pillar, index = 0, learnMore = "Learn more" }: { pillar: Pillar; index?: number; learnMore?: string }) {
  return (
    <Reveal delay={index * 60}>
      <Link
        href={"/pillars/" + pillar.slug}
        className="group block bg-white rounded-2xl p-6 h-full shadow-[0_1px_3px_rgb(44_62_80/0.08)] hover:shadow-[0_12px_32px_rgb(44_62_80/0.14)] transition-shadow focus-visible:ring-2 focus-visible:ring-gold"
      >
        <div
          className="relative mb-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full p-1.5"
          style={{ background: pillar.color }}
        >
          <Image
            src={pillarIcon(pillar.slug)}
            alt=""
            width={48}
            height={48}
            sizes="48px"
            className="h-full w-full rounded-full bg-white object-cover"
          />
        </div>
        <h3 className="font-display font-bold text-lg mb-1.5">{pillar.name}</h3>
        <p className="text-sm text-wgray leading-relaxed mb-4">{pillar.tagline}</p>
        <span className="text-xs font-bold uppercase tracking-wider text-gold group-hover:underline">
          {learnMore} →
        </span>
      </Link>
    </Reveal>
  );
}
