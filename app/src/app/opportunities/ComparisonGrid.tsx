"use client";

import Button from "@/components/ui/Button";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import type { Listing } from "@/lib/data";
import type { Locale } from "@/lib/i18n";
import { investmentUi } from "@/lib/translations/investment-ui";

const LIMIT = 4;

export default function ComparisonGrid({ listings, locale, showReviewStatus = true }: { listings: Listing[]; locale: Locale; showReviewStatus?: boolean }) {
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
        <Button type="submit" disabled={selected.length === 0} className="button-secondary disabled:cursor-not-allowed disabled:opacity-50">
          {ui.button}
        </Button>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {listings.map((listing, index) => {
          const checked = selected.includes(listing.id);
          return (
            <div key={listing.id} className="overflow-hidden  border border-charcoal/10 bg-white">
              <label className="flex min-h-11 cursor-pointer items-center justify-end gap-2 border-b border-charcoal/10 bg-mist px-4 text-sm font-bold text-ink">
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
              <div className="[&> [&>article]:border-0">
                <ProjectCard listing={listing} index={index} locale={locale} showReviewStatus={showReviewStatus} />
              </div>
            </div>
          );
        })}
      </div>
    </form>
  );
}
