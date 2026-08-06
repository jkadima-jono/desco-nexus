import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import SubmissionManager from "./SubmissionManager";
import { getLocale } from "@/lib/i18n-server";
import { submissionCopy } from "@/lib/translations/submissions";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const ui = submissionCopy(await getLocale());
  return { title: ui.metadataTitle, description: ui.metadataDescription };
}

export default async function SubmitProjectPage() {
  const user = await getSessionUser();
  if (!user) redirect("/contact?topic=project-submission");
  const ui = submissionCopy(await getLocale());

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      <h1 className="font-display font-extrabold text-2xl tracking-tight">{ui.pageTitle}</h1>
      <p className="text-wgray text-sm mt-2 max-w-xl">{ui.pageIntro}</p>
      <SubmissionManager />
    </div>
  );
}
