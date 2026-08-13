import Button from "@/components/ui/Button";
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
import InvestorMandatePreview from "./InvestorMandatePreview";
import { prisma, toListing } from "@/lib/db";
import { publicListingWhere } from "@/lib/public-listings";
import { localizeListing } from "@/lib/translations/listing-content";
import { projectHref } from "@/lib/project-slugs";
import { instrumentCategory, instrumentCategoryCopy } from "@/lib/translations/investment-ui";
import { pathwayCopy } from "@/lib/translations/pathways";

export async function generateMetadata(): Promise<Metadata> {
  return getMarketingMetadata(await getLocale(), "investors");
}

export default async function InvestorsPage() {
  const locale = await getLocale();
  const copy = getMarketingCopy(locale, "investors");
  const account = accountCopy(locale);
  const signupEnabled = openSignupConfig().enabled;
  const hero = copy.hero;
  const paths = pathwayCopy(locale);
  const rows = await prisma.listing.findMany({ where: publicListingWhere, include: { org: true, images: true }, orderBy: { updatedAt: "desc" } });
  const opportunities = rows.map(toListing).map((listing) => {
    const localized = localizeListing(listing, locale);
    return {
      id: localized.id,
      title: localized.title,
      sector: localized.sector,
      stage: localized.stage,
      instrument: instrumentCategoryCopy(locale, instrumentCategory(listing.instrument)),
      href: projectHref(localized.id),
    };
  });
  return (
    <>
      <PageHero
        pathTone="investor"
        eyebrow={hero.eyebrow}
        title={hero.title}
        body={hero.body}
        primary={signupEnabled ? { href: "/signup", label: account.createAccount } : { href: "/contact?topic=investor-access", label: hero.primary }}
        primaryNote={signupEnabled ? account.basicAccountNotice : t(locale, "access.investorQualifier")}
        secondary={{ href: "/opportunities", label: hero.secondary }}
        aside={
          <InvestorMandatePreview opportunities={opportunities} copy={copy.previewCopy} />
        }
      />
      <section className="bg-ivory py-14 lg:py-18">
        <div className="public-container">
          <SectionHeading eyebrow={copy.sectionEyebrow} title={copy.sectionTitle} />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {copy.cards.map((card) => <InstitutionalCard key={card.title} {...card} />)}
          </div>
          <div className="mt-10"><NumberedProcess items={copy.steps} pathTone="investor" /></div>
          <div className="mt-8"><QuietNotice>{copy.notice}</QuietNotice></div>
          <div className="mt-8 max-w-xl">
            <div className="flex flex-wrap gap-3">
              {signupEnabled && <Button href="/signup" className="button-primary">{account.createAccount}</Button>}
              <Button href="/contact?topic=investor-access" className={signupEnabled ? "button-secondary" : "button-primary"}>{copy.applyCta}</Button>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate">{t(locale, "access.investorQualifier")}</p>
          </div>
          <p className="mt-10 border-t border-ink/10 pt-7 text-sm text-slate">
            {paths.ownerCrossLink} <Link href="/sponsors" className="font-bold text-desco-slate underline decoration-desco-emerald underline-offset-4">{t(locale, "home.sponsorCta")} →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
