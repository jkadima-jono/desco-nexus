import type { Metadata } from "next";
import Link from "next/link";
import {
  InstitutionalCard,
  NumberedProcess,
  PageHero,
  QuietNotice,
  SectionHeading,
} from "@/components/public/PublicPrimitives";
import { getLocale } from "@/lib/i18n-server";
import { getMarketingCopy, getMarketingMetadata } from "@/lib/translations/marketing";
import { t } from "@/lib/i18n";
import { openSignupConfig } from "@/lib/openSignup";
import { accountCopy } from "@/lib/translations/account";

export async function generateMetadata(): Promise<Metadata> {
  return getMarketingMetadata(await getLocale(), "investors");
}

export default async function InvestorsPage() {
  const locale = await getLocale();
  const copy = getMarketingCopy(locale, "investors");
  const account = accountCopy(locale);
  const signupEnabled = openSignupConfig().enabled;
  const hero = copy.hero;
  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        body={hero.body}
        primary={signupEnabled ? { href: "/signup", label: account.createAccount } : { href: "/contact?topic=investor-access", label: hero.primary }}
        primaryNote={signupEnabled ? account.basicAccountNotice : t(locale, "access.investorQualifier")}
        secondary={{ href: "/opportunities", label: hero.secondary }}
        aside={
          <div className="briefing-card">
            <p className="eyebrow text-gold">{copy.preview}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {copy.mandateFields.map((field) => <div key={field} className="border-b border-ink/10 pb-2 text-xs font-semibold text-ink">{field}</div>)}
            </div>
            <p className="mt-5 text-xs leading-5 text-slate">{copy.matchingNote}</p>
          </div>
        }
      />
      <section className="bg-ivory py-14 lg:py-18">
        <div className="public-container">
          <SectionHeading eyebrow={copy.sectionEyebrow} title={copy.sectionTitle} />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {copy.cards.map((card) => <InstitutionalCard key={card.title} {...card} />)}
          </div>
          <div className="mt-10"><NumberedProcess items={copy.steps} /></div>
          <div className="mt-8"><QuietNotice>{copy.notice}</QuietNotice></div>
          <div className="mt-8 max-w-xl">
            <div className="flex flex-wrap gap-3">
              {signupEnabled && <Link href="/signup" className="button-primary">{account.createAccount}</Link>}
              <Link href="/contact?topic=investor-access" className={signupEnabled ? "button-secondary" : "button-primary"}>{copy.applyCta}</Link>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate">{t(locale, "access.investorQualifier")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
