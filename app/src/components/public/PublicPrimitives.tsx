import Link from "next/link";
import type { ReactNode } from "react";
import LocalizedHomeLink from "./LocalizedHomeLink";

export function PageHero({
  eyebrow,
  title,
  body,
  primary,
  primaryNote,
  secondary,
  aside,
}: {
  eyebrow: string;
  title: string;
  body: string;
  primary?: { href: string; label: string };
  primaryNote?: string;
  secondary?: { href: string; label: string };
  aside?: ReactNode;
}) {
  return (
    <header className="institutional-hero">
      <div className="public-container grid gap-10 py-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(19rem,.85fr)] lg:items-center lg:py-20">
        <div>
          <nav aria-label={eyebrow} className="mb-7 flex items-center gap-2 text-xs font-semibold text-white/65">
            <LocalizedHomeLink />
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-white/72">{eyebrow}</span>
          </nav>
          <p className="eyebrow text-gold">{eyebrow}</p>
          <h1 className="editorial-display mt-4 max-w-4xl text-4xl text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 lg:text-lg">
            {body}
          </p>
          {(primary || secondary) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {primary && <Link href={primary.href} className="button-primary">{primary.label}</Link>}
              {secondary && <Link href={secondary.href} className="button-on-dark">{secondary.label}</Link>}
            </div>
          )}
          {primary && primaryNote && <p className="mt-3 max-w-xl text-xs leading-5 text-white/65">{primaryNote}</p>}
        </div>
        {aside && <div>{aside}</div>}
      </div>
    </header>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow && <p className="eyebrow text-gold">{eyebrow}</p>}
      <h2 className="editorial-heading mt-3 text-3xl text-ink lg:text-4xl">{title}</h2>
      {body && <p className="mt-4 max-w-2xl text-sm leading-7 text-slate lg:text-base">{body}</p>}
    </div>
  );
}

export function DisclosureChip({
  children,
  tone = "reviewed",
}: {
  children: ReactNode;
  tone?: "reviewed" | "pending" | "restricted" | "public";
}) {
  return <span className={`disclosure-chip disclosure-${tone}`}>{children}</span>;
}

export function NumberedProcess({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  return (
    <ol className="process-grid">
      {items.map((item, index) => (
        <li key={item.title} className="process-step">
          <span className="process-number">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="mt-5 font-display text-sm font-bold text-ink">{item.title}</h3>
          <p className="mt-2 text-xs leading-6 text-slate">{item.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function InstitutionalCard({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  children?: ReactNode;
}) {
  return (
    <article className="briefing-card">
      {eyebrow && <p className="eyebrow text-gold">{eyebrow}</p>}
      <h3 className="mt-3 font-display text-lg font-bold text-ink">{title}</h3>
      {body && <p className="mt-3 text-sm leading-6 text-slate">{body}</p>}
      {children}
    </article>
  );
}

export function QuietNotice({ children }: { children: ReactNode }) {
  return (
    <div className="restricted-panel">
      <span aria-hidden="true" className="restricted-mark">i</span>
      <p>{children}</p>
    </div>
  );
}
