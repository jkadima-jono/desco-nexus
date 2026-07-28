"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application route error", error.digest ?? error.name);
  }, [error]);
  return (
    <div className="public-container flex min-h-[55vh] items-center justify-center py-16">
      <div role="alert" className="max-w-xl rounded-2xl border border-charcoal/10 bg-white p-8 text-center shadow-[0_8px_30px_rgb(13_21_28/0.06)]">
        <p className="eyebrow text-brandred">Service interruption</p>
        <h1 className="mt-3 font-display text-2xl font-bold text-ink">This page could not be loaded.</h1>
        <p className="mt-3 text-sm leading-6 text-slate">No information was submitted. Retry the request, or return to the opportunity overview if the problem continues.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="button-primary">Retry</button>
          <a href="/opportunities" className="button-secondary">Review opportunities</a>
        </div>
      </div>
    </div>
  );
}
