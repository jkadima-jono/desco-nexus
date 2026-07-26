"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";

type Photo = { id: string; url: string; caption: string | null };

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

  const upload = async (file: File) => {
    setBusy(true);
    setMsg(null);
    const form = new FormData();
    form.set("file", file);
    try {
      const res = await fetch("/api/listings/" + listingId + "/photos", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error ?? "Upload failed");
      } else {
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
          {busy ? t("photos.uploading") : "⇪ " + t("photos.add")}
        </button>}
      </div>
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
        <p className="text-sm text-wgray">{t("photos.empty")}</p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {photos.map((p, i) => (
            <div key={p.id} className="relative aspect-[4/3] rounded-xl overflow-hidden group">
              <button
                onClick={() => setLightbox(p)}
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
              {canUpload && (
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
          ))}
        </div>
      )}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-ink/90 flex items-center justify-center p-8 cursor-zoom-out"
          onClick={() => setLightbox(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.url}
            alt={lightbox.caption ?? ""}
            className="max-w-full max-h-full rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </section>
  );
}
