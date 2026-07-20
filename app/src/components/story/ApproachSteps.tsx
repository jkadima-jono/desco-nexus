import Reveal from "./Reveal";

const STEPS = [
  {
    n: "01",
    title: "Secure Access",
    body: "We obtain lawful, structured access to concessions and operating rights through direct engagement with authorities and communities — not speculation.",
  },
  {
    n: "02",
    title: "Build Foundations",
    body: "We invest in enabling infrastructure — logistics, energy, water — that reduces execution risk before capital is asked to take it on.",
  },
  {
    n: "03",
    title: "Deploy Strategic Capital",
    body: "We introduce disciplined partners aligned with long-term value creation, transparent governance, and measurable impact.",
  },
];

export default function ApproachSteps() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {STEPS.map((s, i) => (
        <Reveal key={s.n} delay={i * 120}>
          <div className="bg-white rounded-2xl p-7 h-full shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
            <div className="font-display font-extrabold text-3xl text-gold mb-3">{s.n}</div>
            <h3 className="font-display font-bold text-lg mb-2">{s.title}</h3>
            <p className="text-sm text-wgray leading-relaxed">{s.body}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
