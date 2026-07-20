"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/I18nProvider";

export type UiThread = {
  id: string;
  name: string;
  org: string;
  messages: { from: "them" | "me" | "system"; text: string; time: string }[];
};

export default function MessagesClient({ threads }: { threads: UiThread[] }) {
  const { t } = useI18n();
  const [activeId, setActiveId] = useState(threads[0]?.id ?? "");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [extra, setExtra] = useState<Record<string, { text: string; time: string }[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const active = threads.find((t) => t.id === activeId);
  const sent = extra[activeId] ?? [];
  const draft = drafts[activeId] ?? "";

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setAiOpen(true);
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  const send = async () => {
    const text = draft.trim();
    if (!text || !active) return;
    if (sending) return;
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId: active.id, text }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setExtra((e) => ({
        ...e,
        [activeId]: [...(e[activeId] ?? []), { text, time: "now" }],
      }));
      setDrafts((current) => ({ ...current, [activeId]: "" }));
    } catch {
      setError("Send failed — message not delivered. Retry.");
    } finally {
      setSending(false);
    }
  };

  if (!active) {
    return (
      <div className="p-12 text-center text-wgray text-sm">No threads yet.</div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-screen flex min-w-0">
      <div className={(mobileThreadOpen ? "hidden lg:block " : "block ") + "w-full lg:w-80 shrink-0 border-r border-charcoal/10 bg-white overflow-y-auto"}>
        <div className="px-5 pt-7 pb-4">
          <h1 className="font-display font-extrabold text-2xl tracking-tight">
            {t("messages.title")}
          </h1>
          <p className="text-[11px] text-wgray mt-1">{t("messages.subtitle")}</p>
        </div>
        {threads.map((t) => (
          <button
            key={t.id}
            onClick={() => { setActiveId(t.id); setMobileThreadOpen(true); setAiOpen(false); }}
            aria-pressed={t.id === activeId}
            className={
              "w-full text-left px-5 py-3.5 border-l-2 transition-colors " +
              (t.id === activeId
                ? "border-gold bg-mist"
                : "border-transparent hover:bg-mist/60")
            }
          >
            <div className="font-display font-bold text-sm">{t.name}</div>
            <div className="text-[11px] text-gold font-semibold">{t.org}</div>
            <div className="text-xs text-wgray truncate mt-0.5">
              {t.messages[t.messages.length - 1]?.text}
            </div>
          </button>
        ))}
      </div>

      <div className={(!mobileThreadOpen ? "hidden lg:flex " : "flex ") + "min-w-0 flex-1 flex-col bg-mist"}>
        <div className="bg-white border-b border-charcoal/10 px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3">
          <button type="button" onClick={() => setMobileThreadOpen(false)} className="lg:hidden min-w-10 min-h-10 rounded-lg border border-charcoal/10" aria-label="Back to conversations">←</button>
          <div><div className="font-display font-bold">{active.name}</div><div className="text-[11px] text-wgray">{active.org}</div></div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-5 space-y-3">
          {active.messages.map((m, i) =>
            m.from === "system" ? (
              <div key={i} className="text-center">
                <span className="inline-block text-[11px] bg-charcoal/5 text-wgray px-3 py-1 rounded-full">
                  ◆ {m.text}
                </span>
              </div>
            ) : (
              <div
                key={i}
                className={"flex " + (m.from === "me" ? "justify-end" : "justify-start")}
              >
                <div
                  className={
                    "max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed " +
                    (m.from === "me"
                      ? "bg-charcoal text-white rounded-br-md"
                      : "bg-white shadow-[0_1px_3px_rgb(44_62_80/0.08)] rounded-bl-md")
                  }
                >
                  {m.text}
                  <div
                    className={
                      "text-[10px] mt-1 " +
                      (m.from === "me" ? "text-white/50" : "text-wgray")
                    }
                  >
                    {m.time}
                  </div>
                </div>
              </div>
            )
          )}
          {sent.map((m, i) => (
            <div key={"x" + i} className="flex justify-end">
              <div className="max-w-md px-4 py-2.5 rounded-2xl rounded-br-md text-sm bg-charcoal text-white">
                {m.text}
                <div className="text-[10px] mt-1 text-white/50">{m.time}</div>
              </div>
            </div>
          ))}
        </div>
        {error && (
          <div className="px-6 py-2 text-xs text-brandred bg-brandred/10">{error}</div>
        )}
        {aiOpen && (
          <div className="mx-3 sm:mx-4 mb-2 rounded-xl border border-gold/40 bg-gold-soft p-3 text-sm">
            <div className="font-display font-bold mb-1">AI draft for {active.name}</div>
            <p className="text-xs text-wgray mb-3">Review every figure, date and commitment before sending. AI never sends automatically.</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setDrafts((d) => ({...d, [activeId]: `Hello ${active.name}, thank you for the update. Could you confirm the next diligence milestone and any action required from our team?`})); setAiOpen(false); }} className="bg-charcoal text-white px-3 py-2 rounded-lg text-xs font-bold">Insert draft</button>
              <button type="button" onClick={() => setAiOpen(false)} className="px-3 py-2 rounded-lg text-xs font-bold">Cancel</button>
            </div>
          </div>
        )}
        <div className="p-3 sm:p-4 bg-white border-t border-charcoal/10 flex items-end gap-2 sm:gap-3">
          <button type="button" onClick={() => setAiOpen(true)} className="min-w-11 min-h-11 rounded-xl border border-charcoal/10 text-gold font-bold" aria-label="Draft with AI">✦</button>
          <textarea
            value={draft}
            rows={1}
            onChange={(e) => setDrafts((current) => ({ ...current, [activeId]: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
            }}
            placeholder={t("messages.placeholder")}
            className="min-w-0 flex-1 resize-none bg-mist rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold"
          />
          <button
            onClick={send}
            disabled={!draft.trim() || sending}
            className="min-h-11 bg-gold text-ink font-display font-bold text-sm px-4 sm:px-5 rounded-xl hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {sending ? "…" : t("messages.send")}
          </button>
        </div>
      </div>
    </div>
  );
}
