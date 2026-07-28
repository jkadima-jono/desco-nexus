"use client";

import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/components/I18nProvider";

type CommentNode = {
  id: string;
  body: string;
  createdAt: string;
  author: { id: string; fullName: string; title: string | null };
  likeCount: number;
  likedByMe: boolean;
  replies?: CommentNode[];
};

function timeAgo(iso: string): string {
  const s = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return s + "s";
  if (s < 3600) return Math.round(s / 60) + "m";
  if (s < 86400) return Math.round(s / 3600) + "h";
  return Math.round(s / 86400) + "d";
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-charcoal text-white font-display font-bold text-xs flex items-center justify-center shrink-0">
      {name.charAt(0)}
    </div>
  );
}

export default function Comments({
  listingId,
  initialViewer,
}: {
  listingId: string;
  initialViewer: { id: string; fullName: string };
}) {
  const { t } = useI18n();
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [viewer, setViewer] = useState(initialViewer);
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/comments?listingId=" + listingId);
      if (!res.ok) {
        setError("Discussion could not be refreshed. Retry in a moment.");
        return;
      }
      const data = await res.json();
      setComments(data.comments);
      setViewer(data.viewer);
    } catch {
      /* keep last state; surface errors only on user actions */
    }
  }, [listingId]);

  useEffect(() => {
    load();
  }, [load]);

  const post = async (text: string, parentId?: string) => {
    if (!text.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, text, parentId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Post failed");
        return;
      }
      setDraft("");
      setReplyDraft("");
      setReplyTo(null);
      await load();
    } catch {
      setError("Network error — retry.");
    } finally {
      setBusy(false);
    }
  };

  const toggleLike = async (id: string) => {
    setError(null);
    const res = await fetch("/api/comments/" + id + "/like", { method: "POST" });
    if (res.status === 401) {
      setError("Sign in to like and comment.");
      return;
    }
    if (res.ok) await load();
  };

  const Row = ({ c, isReply = false }: { c: CommentNode; isReply?: boolean }) => (
    <div className={isReply ? "ml-11 mt-3" : "mt-5 first:mt-0"}>
      <div className="flex gap-3">
        <Avatar name={c.author.fullName} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-sm">{c.author.fullName}</span>
            {c.author.title && (
              <span className="text-[11px] text-gold font-semibold truncate">
                ✓ {c.author.title}
              </span>
            )}
            <span className="text-[11px] text-wgray">{timeAgo(c.createdAt)}</span>
          </div>
          <p className="text-sm text-charcoal/85 leading-relaxed mt-0.5 whitespace-pre-wrap">
            {c.body}
          </p>
          <div className="flex items-center gap-4 mt-1.5 text-[11px] font-bold">
            <button
              onClick={() => toggleLike(c.id)}
              className={
                (c.likedByMe ? "text-brandred" : "text-wgray") + " hover:text-brandred"
              }
            >
              {c.likedByMe ? "♥" : "♡"} {c.likeCount > 0 ? c.likeCount : t("comments.like")}
            </button>
            {!isReply && (
              <button
                onClick={() => {
                  setReplyTo(replyTo === c.id ? null : c.id);
                  setReplyDraft("");
                }}
                className="text-wgray hover:text-charcoal"
              >
                {t("comments.reply")}
              </button>
            )}
          </div>
          {replyTo === c.id && (
            <div className="flex gap-2 mt-2">
              <input
                value={replyDraft}
                onChange={(e) => setReplyDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && post(replyDraft, c.id)}
                placeholder={"Reply to " + c.author.fullName + "…"}
                autoFocus
                className="flex-1 bg-mist rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold"
              />
              <button
                onClick={() => post(replyDraft, c.id)}
                disabled={busy}
                className="bg-charcoal text-white font-display font-bold text-xs px-4 rounded-lg hover:bg-ink disabled:opacity-50"
              >
                {t("comments.reply")}
              </button>
            </div>
          )}
        </div>
      </div>
      {c.replies?.map((r) => (
        <Row key={r.id} c={r} isReply />
      ))}
    </div>
  );

  const total = comments.reduce((a, c) => a + 1 + (c.replies?.length ?? 0), 0);

  return (
    <section className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-lg">{t("comments.title")}</h2>
        <span className="text-[11px] font-bold text-wgray uppercase tracking-wider">
          {total} {t("comments.count")}
        </span>
      </div>

      {viewer ? (
        <div className="flex gap-3 mb-2">
          <Avatar name={viewer.fullName} />
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && post(draft)}
            placeholder={t("comments.placeholder")}
            className="flex-1 bg-mist rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold"
          />
          <button
            onClick={() => post(draft)}
            disabled={busy}
            className="bg-gold text-ink font-display font-bold text-sm px-5 rounded-xl hover:brightness-110 disabled:opacity-50"
          >
            {t("comments.post")}
          </button>
        </div>
      ) : (
        <div className="bg-mist rounded-xl px-4 py-3 text-sm text-wgray mb-2">
          <a href="/login" className="text-gold font-bold">{t("comments.signIn")}</a>{" "}
          {t("comments.signInSuffix")}
        </div>
      )}
      {error && <div className="text-xs text-brandred mb-2">{error}</div>}

      <div>
        {comments.map((c) => (
          <Row key={c.id} c={c} />
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-wgray mt-3">
            {t("comments.none")}
          </p>
        )}
      </div>
    </section>
  );
}
