"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import type { Listing } from "@/lib/data";
import type { Locale } from "@/lib/i18n";
import { investmentUi } from "@/lib/translations/investment-ui";

const LIMIT = 4;

export default function ComparisonGrid({ listings, locale }: { listings: Listing[]; locale: Locale }) {
  const ui = investmentUi(locale).compare;
  const [selected, setSelected] = useState<string[]>([]);
  const atLimit = selected.length >= LIMIT;

  const toggle = (listingId: string, checked: boolean) => {
    setSelected((current) => {
      if (!checked) return current.filter((id) => id !== listingId);
      if (current.includes(listingId) || current.length >= LIMIT) return current;
      return [...current, listingId];
    });
  };

  return (
    <form action="/saved/compare" method="get" className="mt-7">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p id="opportunity-results" className="text-sm text-slate">
            {ui.instruction}
          </p>
          <p aria-live="polite" className="mt-1 text-xs font-semibold text-ink">
            {ui.count(selected.length)}{atLimit ? ui.limit : ""}
          </p>
        </div>
        <button type="submit" disabled={selected.length === 0} className="button-secondary disabled:cursor-not-allowed disabled:opacity-50">
          {ui.button}
        </button>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {listings.map((listing, index) => {
          const checked = selected.includes(listing.id);
          return (
            <div key={listing.id} className="relative">
              <label className="absolute right-3 top-3 z-10 flex min-h-11 cursor-pointer items-center gap-2 rounded-md bg-white/95 px-3 text-xs font-bold text-ink shadow">
                <input
                  type="checkbox"
                  name="ids"
                  value={listing.id}
                  checked={checked}
                  disabled={!checked && atLimit}
                  onChange={(event) => toggle(listing.id, event.target.checked)}
                  className="h-4 w-4 accent-gold disabled:cursor-not-allowed"
                />
                {ui.checkbox}
              </label>
              <ProjectCard listing={listing} index={index} locale={locale} />
            </div>
          );
        })}
      </div>
    </form>
  );
}
