import Button from "@/components/ui/Button";
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
  pathTone = "shared",
}: {
  eyebrow: string;
  title: string;
  body: string;
  primary?: { href: string; label: string };
  primaryNote?: string;
  secondary?: { href: string; label: string };
  aside?: ReactNode;
  pathTone?: "shared" | "investor" | "owner";
}) {
  return (
    <header className={`institutional-hero path-hero path-hero-${pathTone}`}>
      <div className="public-container grid min-h-[32rem] gap-10 py-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(19rem,.85fr)] lg:items-end lg:py-20">
        <div>
          <nav aria-label={eyebrow} className="mb-7 flex items-center gap-2 text-xs font-semibold text-white/65">
            <LocalizedHomeLink />
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-white/72">{eyebrow}</span>
          </nav>
          <p className="eyebrow path-accent-text">{eyebrow}</p>
          <h1 className="editorial-display mt-4 max-w-4xl text-[30px] text-white lg:text-[50px]">
            {title}
          </h1>
          <p className="mt-6 max-w-[70ch] text-[21px] leading-[1.5] text-white">
            {body}
          </p>
          {(primary || secondary) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {primary && <Button href={primary.href} variant="ghost-light">{primary.label}</Button>}
              {secondary && <Button href={secondary.href} className="button-on-dark">{secondary.label}</Button>}
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
  id,
  eyebrow,
  title,
  body,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="max-w-[70ch]">
      {eyebrow && <p className="eyebrow text-gold">{eyebrow}</p>}
      <h2 id={id} className="editorial-heading mt-3 text-[30px] text-black lg:text-[40px]">{title}</h2>
      {body && <p className="mt-4 max-w-[70ch] text-[21px] leading-[1.5] text-desco-slate">{body}</p>}
    </div>
  );
}

export function DisclosureChip({
  children,
  tone = "reviewed",
}: {
  children: ReactNode;
  tone?: "verified" | "reviewed" | "sponsor" | "pending" | "restricted" | "public";
}) {
  return <span className={`disclosure-chip disclosure-${tone}`}>{children}</span>;
}

export function NumberedProcess({
  items,
  pathTone = "shared",
}: {
  items: { title: string; body: string }[];
  pathTone?: "shared" | "investor" | "owner";
}) {
  return (
    <ol className={`process-grid process-${pathTone} list-none`}>
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
