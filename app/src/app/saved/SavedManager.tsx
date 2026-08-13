"use client";

import Button from "@/components/ui/Button";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fmtUsd } from "@/lib/data";
import { projectHref } from "@/lib/project-slugs";

type SavedItem = {
  id: string;
  listingId: string;
  notes: string;
  tags: string;
  collectionId: string | null;
  listing: { title: string; sector: string; country: string; flag: string; currentCapitalAskUsd: number | null; instrument: string; org: { name: string } };
};
type Collection = { id: string; name: string };

const parseTags = (raw: string): string[] => {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};

export default function SavedManager() {
  const router = useRouter();
  const [saved, setSaved] = useState<SavedItem[] | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [newCollectionName, setNewCollectionName] = useState("");

  const load = async () => {
    const [savedRes, colRes] = await Promise.all([fetch("/api/saved"), fetch("/api/collections")]);
    if (savedRes.ok) setSaved((await savedRes.json()).saved);
    if (colRes.ok) setCollections((await colRes.json()).collections);
  };
  useEffect(() => { load(); }, []);

  const patch = async (id: string, body: Record<string, unknown>) => {
    await fetch("/api/saved/" + id, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  };

  const unsave = async (id: string) => {
    await fetch("/api/saved/" + id, { method: "DELETE" });
    await load();
  };

  const createCollection = async () => {
    if (!newCollectionName.trim()) return;
    await fetch("/api/collections", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newCollectionName.trim() }) });
    setNewCollectionName("");
    await load();
  };

  const toggleSelect = (listingId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(listingId)) next.delete(listingId);
      else next.add(listingId);
      return next;
    });
  };

  const compare = () => {
    router.push("/saved/compare?ids=" + [...selected].join(","));
  };

  if (saved === null) {
    return <div role="status" aria-live="polite" className="mt-8 text-sm text-wgray">Loading your saved opportunities…</div>;
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          placeholder="New collection name"
          aria-label="New collection name"
          className="bg-mist  px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold"
        />
        <Button onClick={createCollection} className="text-xs font-bold bg-charcoal text-white px-3 py-2 ">Create collection</Button>
        {selected.size > 0 && (
          <Button onClick={compare} className="ml-auto text-xs font-bold bg-gold text-ink px-4 py-2 ">
            Compare selected ({selected.size})
          </Button>
        )}
      </div>

      {saved.length === 0 ? (
        <div className="bg-white  p-10 text-center border border-charcoal/10">
          <p className="text-sm text-wgray">Nothing saved yet. Save an opportunity from any project page or card.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {saved.map((s) => (
            <div key={s.id} className="bg-white  p-5 border border-charcoal/10">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selected.has(s.listingId)}
                  onChange={() => toggleSelect(s.listingId)}
                  aria-label={"Select " + s.listing.title + " for comparison"}
                  className="mt-1.5 w-4 h-4"
                />
                <div className="flex-1 min-w-0">
                  <a href={projectHref(s.listingId)} className="font-display font-bold hover:underline">{s.listing.title}</a>
                  <div className="text-xs text-wgray mt-0.5">
                    {s.listing.flag} {s.listing.country} · {s.listing.sector} · {s.listing.currentCapitalAskUsd ? fmtUsd(s.listing.currentCapitalAskUsd) : "Current ask not disclosed"} · {s.listing.org.name}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label htmlFor={"notes-" + s.id} className="block text-[10px] font-bold uppercase tracking-wider text-wgray mb-1">Notes</label>
                      <textarea
                        id={"notes-" + s.id}
                        rows={2}
                        defaultValue={s.notes}
                        onBlur={(e) => patch(s.id, { notes: e.target.value })}
                        className="w-full bg-mist  px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-gold resize-none"
                      />
                    </div>
                    <div>
                      <label htmlFor={"tags-" + s.id} className="block text-[10px] font-bold uppercase tracking-wider text-wgray mb-1">Tags (comma-separated)</label>
                      <input
                        id={"tags-" + s.id}
                        defaultValue={parseTags(s.tags).join(", ")}
                        onBlur={(e) => patch(s.id, { tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
                        className="w-full bg-mist  px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-gold"
                      />
                      <label htmlFor={"col-" + s.id} className="sr-only">Collection</label>
                      <select
                        id={"col-" + s.id}
                        defaultValue={s.collectionId ?? ""}
                        onChange={(e) => patch(s.id, { collectionId: e.target.value || null })}
                        className="w-full bg-mist  px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-gold mt-1.5"
                      >
                        <option value="">No collection</option>
                        {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <Button onClick={() => unsave(s.id)} className="text-[11px] font-bold text-brandred shrink-0">Unsave</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
