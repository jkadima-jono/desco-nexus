import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n-server";
import { getPillarsLegal } from "@/lib/translations/pillars-legal";
import { publicPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { legal } = getPillarsLegal(await getLocale());
  return publicPageMetadata(legal.metadataTitle, legal.metadataDescription, { canonical: "/legal" });
}

export default async function Legal() {
  const { legal } = getPillarsLegal(await getLocale());
  const sectionIds = ["platform-status", "privacy", "cookies", "terms", "security", "risk", "verification", "regulatory", "complaints"];
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-10 lg:py-12">
      <h1 className="font-display font-extrabold text-3xl tracking-tight mb-2">{legal.title}</h1>
      <p className="text-sm text-wgray leading-relaxed mb-8">{legal.intro}</p>
      <div className="space-y-6">
        {legal.sections.map(([title, body, pending], index) => (
          <section key={title} id={sectionIds[index]} className="bg-white  p-5  scroll-mt-20">
            <h2 className="font-display font-bold text-base mb-2 flex items-center gap-2">
              {title}
              {pending && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5  bg-wgray/15 text-wgray">{legal.pending}</span>}
            </h2>
            <p className="text-sm text-wgray leading-relaxed">{body}</p>
          </section>
        ))}
      </div>
      <p className="text-sm text-wgray leading-relaxed mt-8">
        {legal.questions}{" "}
        <a className="text-gold font-bold" href="mailto:support@desco.global">support@desco.global</a>
      </p>
    </div>
  );
}
