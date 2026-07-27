"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";

type Photo = { id: string; url: string; caption: string | null; isExample?: boolean };

export default function PhotoGallery({
  listingId,
  photos,
  canUpload,
}: {
  listingId: string;
  photos: Photo[];
  canUpload: boolean;
}) {
  const router = useRouter();
  const { t } = useI18n();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const [caption, setCaption] = useState("");

  const upload = async (file: File) => {
    setBusy(true);
    setMsg(null);
    const form = new FormData();
    form.set("file", file);
    form.set("caption", caption.trim() || "Sponsor-provided project image");
    try {
      const res = await fetch("/api/listings/" + listingId + "/photos", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error ?? "Upload failed");
      } else {
        setCaption("");
        router.refresh();
      }
    } catch {
      setMsg("Network error — retry.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removePhoto = async (photoId: string) => {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/listings/" + listingId + "/photos/" + photoId, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMsg(data.error ?? "Remove failed");
      } else {
        router.refresh();
      }
    } catch {
      setMsg("Network error — retry.");
    } finally {
      setBusy(false);
    }
  };

  const setCover = async (photoId: string) => {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/listings/" + listingId + "/photos/" + photoId, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set_cover" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMsg(data.error ?? "Update failed");
      } else {
        router.refresh();
      }
    } catch {
      setMsg("Network error — retry.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-lg">{t("photos.title")}</h2>
        {canUpload && <button
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="text-sm font-display font-bold text-gold hover:brightness-90 disabled:opacity-50"
        >
          {busy ? t("photos.uploading") : "⇪ " + (photos.some((photo) => photo.isExample) ? "Replace example" : t("photos.add"))}
        </button>}
      </div>
      {canUpload && (
        <div className="mb-4 rounded-xl border border-charcoal/10 bg-mist p-3">
          <label htmlFor="project-image-caption" className="block text-[11px] font-bold uppercase tracking-wider text-slate">
            Image caption and source
          </label>
          <input
            id="project-image-caption"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            maxLength={200}
            placeholder="What the image shows · source or owner · month/year"
            className="mt-2 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm"
          />
          <p className="mt-2 text-xs text-slate">
            Uploading an approved sponsor image replaces the example visual across project cards and this page.
          </p>
        </div>
      )}
      {canUpload && <input
        ref={fileRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
        }}
      />}
      {msg && <div className="text-xs text-brandred mb-3">{msg}</div>}
      {photos.length === 0 ? (
        <p className="text-sm text-wgray">
          {canUpload ? t("photos.empty") : "No approved public project imagery is available."}
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {photos.map((p, i) => (
            <figure key={p.id} className="relative overflow-hidden rounded-xl border border-charcoal/10">
              <div className="relative aspect-[4/3] overflow-hidden group">
              <button
                onClick={() => setLightbox(p)}
                aria-label={"Preview " + (p.caption || "project image")}
                className="absolute inset-0 w-full h-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.url}
                  alt={p.caption ?? ""}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </button>
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 text-[9px] font-bold uppercase tracking-wider bg-ink/80 text-white px-2 py-0.5 rounded-full pointer-events-none">
                  {t("photos.cover")}
                </span>
              )}
              {p.isExample && (
                <span className="absolute bottom-1.5 left-1.5 rounded-full bg-ink/85 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white pointer-events-none">
                  Example · replaceable
                </span>
              )}
              {canUpload && !p.isExample && (
                <div className="absolute inset-x-0 bottom-0 p-1.5 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-ink/70 to-transparent">
                  {i !== 0 ? (
                    <button
                      disabled={busy}
                      onClick={() => setCover(p.id)}
                      className="text-[10px] font-bold text-white hover:text-gold disabled:opacity-50"
                    >
                      {t("photos.setCover")}
                    </button>
                  ) : <span />}
                  <button
                    disabled={busy}
                    onClick={() => removePhoto(p.id)}
                    aria-label={t("photos.remove") + " " + (p.caption ?? "photo")}
                    className="text-[10px] font-bold text-white hover:text-brandred disabled:opacity-50"
                  >
                    {t("photos.remove")}
                  </button>
                </div>
              )}
              </div>
              <figcaption className="min-h-11 px-3 py-2 text-xs leading-5 text-slate">
                {p.caption || "Sponsor-provided project image"}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Project image preview"
          className="fixed inset-0 z-50 bg-ink/90 flex items-center justify-center p-8 cursor-zoom-out"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 min-h-11 min-w-11 rounded-full bg-white text-ink text-xl"
            aria-label="Close image preview"
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.url}
            alt={lightbox.caption ?? ""}
            className="max-w-full max-h-full rounded-2xl shadow-2xl"
          />
          {lightbox.caption && (
            <p className="absolute inset-x-8 bottom-4 rounded-lg bg-ink/85 px-4 py-2 text-center text-xs text-white">
              {lightbox.caption}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
