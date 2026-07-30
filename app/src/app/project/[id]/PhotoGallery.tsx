"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";
import { imageManagementCopy, investmentUi } from "@/lib/translations/investment-ui";
import Image from "next/image";

type Photo = {
  id: string;
  url: string;
  caption: string | null;
  isExample?: boolean;
  kind?: "example" | "regional";
};

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
  const { t, locale } = useI18n();
  const imageUi = investmentUi(locale).images;
  const managementUi = imageManagementCopy(locale);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    if (!lightbox) return;
    closeRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [lightbox]);

  const upload = async (file: File) => {
    setBusy(true);
    setMsg(null);
    const form = new FormData();
    form.set("file", file);
    form.set("caption", caption.trim() || imageUi.sponsorImage);
    try {
      const res = await fetch("/api/listings/" + listingId + "/photos", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        setMsg(managementUi.uploadFailed);
      } else {
        setCaption("");
        router.refresh();
      }
    } catch {
      setMsg(managementUi.network);
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
        setMsg(managementUi.removeFailed);
      } else {
        router.refresh();
      }
    } catch {
      setMsg(managementUi.network);
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
        setMsg(managementUi.updateFailed);
      } else {
        router.refresh();
      }
    } catch {
      setMsg(managementUi.network);
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
            {busy ? t("photos.uploading") : "⇪ " + (photos.some((photo) => photo.isExample) ? imageUi.replaceVisual : t("photos.add"))}
        </button>}
      </div>
      {canUpload && (
        <div className="mb-4 rounded-xl border border-charcoal/10 bg-mist p-3">
          <label htmlFor="project-image-caption" className="block text-xs font-bold uppercase tracking-wide text-slate">
            {imageUi.captionSource}
          </label>
          <input
            id="project-image-caption"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            maxLength={200}
            placeholder={imageUi.captionPlaceholder}
            className="mt-2 min-h-11 w-full rounded-lg border border-charcoal/15 bg-white px-3 text-sm"
          />
          <p className="mt-2 text-xs text-slate">
            {imageUi.uploadHelp}
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
      <div aria-live="polite" aria-atomic="true">
        {msg && <div role="alert" className="mb-3 text-xs text-brandred">{msg}</div>}
      </div>
      {photos.length === 0 ? (
        <p className="text-sm text-wgray">
          {canUpload ? t("photos.empty") : imageUi.noApproved}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((p, i) => (
            <figure key={p.id} className="relative overflow-hidden rounded-xl border border-charcoal/10">
              <div className="relative aspect-[4/3] overflow-hidden group">
              <button
                onClick={(event) => {
                  triggerRef.current = event.currentTarget;
                  setLightbox(p);
                }}
                aria-label={imageUi.preview + " " + (p.caption || imageUi.sponsorImage)}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={p.url}
                  alt={p.caption ?? ""}
                  fill
                  sizes="(min-width: 640px) 14rem, 50vw"
                  unoptimized={/^https?:\/\//.test(p.url)}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
              {i === 0 && (
                <span className="pointer-events-none absolute left-1.5 top-1.5 rounded-full bg-ink/80 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
                  {t("photos.cover")}
                </span>
              )}
              {p.isExample && (
                <span className="pointer-events-none absolute bottom-1.5 left-1.5 rounded-full bg-ink/85 px-2 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  {p.kind === "regional" ? imageUi.regional : imageUi.example}
                </span>
              )}
              {canUpload && !p.isExample && (
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-ink/80 to-transparent p-1.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                  {i !== 0 ? (
                    <button
                      disabled={busy}
                      onClick={() => setCover(p.id)}
                      className="min-h-11 px-1 text-[10px] font-bold text-white hover:text-gold disabled:opacity-50"
                    >
                      {t("photos.setCover")}
                    </button>
                  ) : <span />}
                  <button
                    disabled={busy}
                    onClick={() => removePhoto(p.id)}
                    aria-label={t("photos.remove") + " " + (p.caption ?? imageUi.sponsorImage)}
                    className="min-h-11 px-1 text-[10px] font-bold text-white hover:text-brandred disabled:opacity-50"
                  >
                    {t("photos.remove")}
                  </button>
                </div>
              )}
              </div>
              <figcaption className="min-h-11 px-3 py-2 text-xs leading-5 text-slate">
                {p.caption || imageUi.sponsorImage}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      {lightbox && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={imageUi.previewDialog}
          className="fixed inset-0 z-50 bg-ink/90 flex items-center justify-center p-8 cursor-zoom-out"
          onClick={() => setLightbox(null)}
        >
          <button
            ref={closeRef}
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 min-h-11 min-w-11 rounded-full bg-white text-ink text-xl"
            aria-label={imageUi.closePreview}
          >
            ×
          </button>
          <div className="relative h-[min(78vh,48rem)] w-[min(90vw,72rem)]">
            <Image
              src={lightbox.url}
              alt={lightbox.caption ?? ""}
              fill
              sizes="90vw"
              unoptimized={/^https?:\/\//.test(lightbox.url)}
              className="rounded-2xl object-contain shadow-2xl"
            />
          </div>
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
