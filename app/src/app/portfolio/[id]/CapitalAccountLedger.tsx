import { fmtUsd } from "@/lib/data";

type Call = { id: string; callNumber: number; amountUsd: number; purpose: string; dueDate: Date; status: string };
type Dist = { id: string; amountUsd: number; kind: string; paymentDate: Date };

const STATUS_COLOR: Record<string, string> = {
  issued: "text-charcoal bg-charcoal/10",
  paid: "text-emerald-700 bg-emerald-50",
  overdue: "text-brandred bg-brandred/10",
};

export default function CapitalAccountLedger({
  calls,
  distributions,
}: {
  calls: Call[];
  distributions: Dist[];
}) {
  type Row = { date: Date; label: string; amount: number; meta: React.ReactNode };
  const rows: Row[] = [
    ...calls.map((c) => ({
      date: c.dueDate,
      label: "Capital call #" + c.callNumber + " — " + c.purpose,
      amount: c.amountUsd,
      meta: (
        <span className={"text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full " + (STATUS_COLOR[c.status] ?? "")}>
          {c.status}
        </span>
      ),
    })),
    ...distributions.map((d) => ({
      date: d.paymentDate,
      label: "Distribution — " + d.kind.replace("-", " "),
      amount: -d.amountUsd,
      meta: null,
    })),
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  if (rows.length === 0) {
    return <p className="text-sm text-wgray">No capital calls or distributions recorded yet.</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-[11px] text-wgray uppercase tracking-wider text-left">
          <th className="pb-2 font-bold">Date</th>
          <th className="pb-2 font-bold">Description</th>
          <th className="pb-2 font-bold text-right tabular-nums">Amount</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-t border-charcoal/10">
            <td className="py-2.5 text-wgray whitespace-nowrap">{r.date.toLocaleDateString()}</td>
            <td className="py-2.5">
              {r.label} {r.meta}
            </td>
            <td className={"py-2.5 text-right tabular-nums font-semibold " + (r.amount < 0 ? "text-gold" : "")}>
              {r.amount < 0 ? "+" : ""}{fmtUsd(Math.abs(r.amount))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
