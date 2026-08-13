import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import { accountCopy, accountRequestReceived } from "@/lib/translations/account";
import AccountActions from "./AccountActions";

export const metadata: Metadata = { title: "Account settings — DESCO Compass", robots: { index: false, follow: false } };

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/account");
  const locale = await getLocale();
  const copy = accountCopy(locale);
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-8">
      <div className=" bg-white p-6  sm:p-10">
        <h1 className="font-display text-3xl font-bold text-ink">{copy.settingsTitle}</h1>
        <p className="mt-2 text-sm text-wgray">{copy.settingsIntro}</p>
        <dl className="mt-8  border border-charcoal/10 p-4">
          <dt className="text-xs font-bold uppercase tracking-wider text-wgray">{copy.accountEmail}</dt>
          <dd className="mt-1 break-all text-sm font-semibold text-ink">{user.email}</dd>
        </dl>
        <AccountActions copy={{ signOut: copy.signOut, signOutAll: copy.signOutAll, exportData: copy.exportData, deleteAccount: copy.deleteAccount, unavailableAction: copy.unavailableAction, requestReceived: accountRequestReceived(locale) }} />
      </div>
    </div>
  );
}
