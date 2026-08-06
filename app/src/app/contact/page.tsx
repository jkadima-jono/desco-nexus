import ContactForm from "./ContactForm";
import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n-server";
import { contactPausedPageCopy, investmentUi } from "@/lib/translations/investment-ui";
import BrandMark from "@/components/BrandMark";
import { publicPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const ui = investmentUi(await getLocale()).contact;
  return publicPageMetadata(ui.metadataTitle, ui.metadataDescription, { canonical: "/contact" });
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; project?: string }>;
}) {
  const { topic, project } = await searchParams;
  const locale = await getLocale();
  const ui = investmentUi(locale).contact;
  const collectionEnabled =
    process.env.NODE_ENV !== "production" ||
    process.env.ENABLE_PUBLIC_FORM_COLLECTION === "true";
  const paused = contactPausedPageCopy(locale);
  return (
    <div className="min-h-screen bg-ink text-white">
      <div className="max-w-2xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-10">
          <div className="mb-5 flex justify-center"><BrandMark size={96} showName={false} /></div>
          <h1 style={{ fontFamily: "var(--font-serif)" }} className="font-semibold text-3xl lg:text-4xl tracking-tight">
            {collectionEnabled ? ui.title : paused.title}
          </h1>
          <p className="text-white/70 mt-3 max-w-md mx-auto leading-relaxed">
            {collectionEnabled ? ui.intro : paused.intro}
          </p>
        </div>
        <ContactForm
          initialTopic={topic}
          projectId={project}
          locale={locale}
          collectionEnabled={collectionEnabled}
        />
        <div className="mt-6 rounded-xl border border-white/15 p-5 text-xs leading-6 text-white/65">
          {collectionEnabled ? ui.notice : paused.notice}
        </div>
      </div>
    </div>
  );
}
