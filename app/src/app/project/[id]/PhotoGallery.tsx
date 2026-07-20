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
          {photos.map((p) => (
            <button
              key={p.id}
              onClick={() => setLightbox(p)}
              className="relative aspect-[4/3] rounded-xl overflow-hidden group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt={p.caption ?? ""}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </button>
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
