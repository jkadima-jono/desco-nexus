import ContactForm from "./ContactForm";
import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n-server";
import { investmentUi } from "@/lib/translations/investment-ui";

export async function generateMetadata(): Promise<Metadata> {
  const ui = investmentUi(await getLocale()).contact;
  return { title: ui.metadataTitle, description: ui.metadataDescription };
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; project?: string }>;
}) {
  const { topic, project } = await searchParams;
  const locale = await getLocale();
  const ui = investmentUi(locale).contact;
  return (
    <div className="min-h-screen bg-ink text-white">
      <div className="max-w-2xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/desco-compass-logo.jpg"
            alt="Official DESCO Compass logo"
            className="mx-auto mb-5 h-24 w-24 rounded-full object-cover shadow-[0_8px_24px_rgb(184_149_61/0.4)]"
          />
          <h1 style={{ fontFamily: "var(--font-serif)" }} className="font-semibold text-3xl lg:text-4xl tracking-tight">
            {ui.title}
          </h1>
          <p className="text-white/70 mt-3 max-w-md mx-auto leading-relaxed">
            {ui.intro}
          </p>
        </div>
        <ContactForm initialTopic={topic} projectId={project} locale={locale} />
        <div className="mt-6 rounded-xl border border-white/15 p-5 text-xs leading-6 text-white/65">
          {ui.notice}
        </div>
      </div>
    </div>
  );
}
