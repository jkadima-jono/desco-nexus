"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Note = { by: string; note: string; at: string };

export default function DealMeta({
  dealId,
  dueDate,
  notes,
}: {
  dealId: string;
  dueDate: string | null;
  notes: Note[];
}) {
  const router = useRouter();
  const [dueDateInput, setDueDateInput] = useState(dueDate ? dueDate.slice(0, 10) : "");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const saveDueDate = async () => {
    setBusy(true);
    try {
      await fetch("/api/deals/" + dealId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dueDate: dueDateInput || null }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const addNote = async () => {
    if (!note.trim()) return;
    setBusy(true);
    try {
      await fetch("/api/deals/" + dealId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
      setNote("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="due-date" className="block text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">Due date</label>
        <div className="flex gap-2">
          <input
            id="due-date"
            type="date"
            value={dueDateInput}
            onChange={(e) => setDueDateInput(e.target.value)}
            className="flex-1 bg-mist rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold"
          />
          <button disabled={busy} onClick={saveDueDate} className="text-xs font-bold bg-charcoal text-white px-3 py-2 rounded-lg disabled:opacity-50">Save</button>
        </div>
      </div>

      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-wgray mb-1.5">Decision notes</div>
        {notes.length === 0 ? (
          <p className="text-xs text-wgray">No decision notes recorded yet.</p>
        ) : (
          <ul className="space-y-2 mb-3">
            {[...notes].reverse().map((n, i) => (
              <li key={i} className="text-xs bg-mist rounded-lg px-3 py-2">
                <div>{n.note}</div>
                <div className="text-wgray mt-1">{n.by} · {new Date(n.at).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2">
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a decision note…"
            className="flex-1 bg-mist rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-gold resize-none"
          />
          <button disabled={busy || !note.trim()} onClick={addNote} className="text-xs font-bold bg-charcoal text-white px-3 py-2 rounded-lg disabled:opacity-50 self-start">Add</button>
        </div>
      </div>
    </div>
  );
}
