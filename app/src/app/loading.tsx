import { getLocale } from "@/lib/i18n-server";

const loadingCopy = { en: "Loading page", fr: "Chargement de la page", es: "Cargando la página", pt: "A carregar a página", zh: "页面加载中" } as const;

export default async function Loading() {
  const locale = await getLocale();
  return (
    <div role="status" aria-live="polite" className="min-h-[55vh] bg-ivory">
      <div className="public-container py-12">
        <div className="h-3 w-28 animate-pulse rounded-full bg-gold/35" />
        <div className="mt-5 h-9 w-full max-w-xl animate-pulse rounded-md bg-ink/10" />
        <div className="mt-3 h-4 w-full max-w-md animate-pulse rounded bg-ink/8" />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="h-48 animate-pulse rounded-xl border border-charcoal/8 bg-white" />
          <div className="h-48 animate-pulse rounded-xl border border-charcoal/8 bg-white" />
        </div>
        <span className="sr-only">{loadingCopy[locale]}</span>
      </div>
    </div>
  );
}
