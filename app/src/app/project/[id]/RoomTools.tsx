"use client";

import Button from "@/components/ui/Button";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";

export function UploadDoc({ listingId }: { listingId: string }) {
  const { t } = useI18n();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const upload = async (file: File) => {
    setBusy(true);
    setMsg(null);
    const form = new FormData();
    form.set("file", file);
    form.set("listingId", listingId);
    try {
      const res = await fetch("/api/documents", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error ?? "Upload failed");
      } else {
        setMsg("Uploaded " + data.document.name);
        router.refresh();
      }
    } catch {
      setMsg("Network error — retry.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-charcoal/10">
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.xlsx,.docx,.pptx,.png,.jpg,.jpeg,.csv"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
        }}
      />
      <Button
        onClick={() => fileRef.current?.click()}
        disabled={busy}
        className="text-sm font-display font-bold text-gold hover:brightness-90 disabled:opacity-50"
      >
        {busy ? t("project.uploading") : "⇪ " + t("project.upload")}
      </Button>
      {msg && <span className="ml-3 text-xs text-wgray">{msg}</span>}
    </div>
  );
}

export function TeaserGenerator({ listingId }: { listingId: string }) {
  const { t } = useI18n();
  const [teaser, setTeaser] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/teaser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Generation failed");
      } else {
        setTeaser(data.teaser);
        setSource(data.source);
      }
    } catch {
      setError("Network error — retry.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="bg-white  p-6 ">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-bold text-lg">
          <span className="text-gold">✦</span> {t("project.teaser")}
        </h2>
        <Button
          onClick={generate}
          disabled={busy}
          className="bg-charcoal text-white font-display font-bold text-xs px-4 py-2  hover:bg-ink disabled:opacity-50"
        >
          {busy ? t("project.generating") : teaser ? t("project.regenerate") : t("project.generate")}
        </Button>
      </div>
      {error && <div className="text-xs text-brandred mb-2">{error}</div>}
      {teaser ? (
        <>
          <pre className="whitespace-pre-wrap font-body text-xs leading-relaxed bg-mist  p-4 max-h-72 overflow-y-auto">
            {teaser}
          </pre>
          <div className="text-[10px] text-wgray mt-2">
            {source === "claude"
              ? "Source: Claude API · AI draft — sponsor must verify before distribution."
              : "Source: offline template (no AI model — Claude API key not configured) · sponsor must verify before distribution."}
          </div>
        </>
      ) : (
        <p className="text-xs text-wgray">{t("project.teaserHint")}</p>
      )}
    </section>
  );
}
