import type { Milestone } from "@/lib/pillars";
import Reveal from "./Reveal";

export default function Timeline({ milestones, pendingLabel = "In progress" }: { milestones: Milestone[]; pendingLabel?: string }) {
  return (
    <ol className="relative ml-3 list-none space-y-8 border-l-2 border-charcoal/10">
      {milestones.map((m, i) => (
        <Reveal key={m.year} delay={i * 100}>
          <li className="ml-6 relative">
            <span
              className={
                "absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full border-2 " +
                (m.done ? "bg-gold border-gold" : "bg-white border-charcoal/30")
              }
              aria-hidden="true"
            />
            <div className="text-[11px] font-bold uppercase tracking-wider text-wgray">
              {m.year} {!m.done && `· ${pendingLabel}`}
            </div>
            <div className="text-sm font-semibold mt-0.5">{m.label}</div>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}
