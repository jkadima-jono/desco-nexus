import Reveal from "./Reveal";

const DEFAULT_STEPS = [
  {
    n: "01",
    title: "Confirm project rights",
    body: "Document ownership, concessions, permits, counterparties and authority to transact.",
  },
  {
    n: "02",
    title: "Prepare the evidence base",
    body: "Organise technical, financial, legal, environmental and commercial information for review.",
  },
  {
    n: "03",
    title: "Structure the financing process",
    body: "Define the capital requirement, proposed instrument, governance terms and due-diligence pathway.",
  },
];

export default function ApproachSteps({ steps = DEFAULT_STEPS.map(({ title, body }) => [title, body]) }: { steps?: readonly (readonly string[])[] }) {
  const items = steps.map(([title = "", body = ""], index) => ({ n: String(index + 1).padStart(2, "0"), title, body }));
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((s, i) => (
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
