import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact — DESCO Nexus",
  description: "Get in touch with Desco Global about investment opportunities, partnerships, or platform access.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; project?: string }>;
}) {
  const { topic, project } = await searchParams;
  return (
    <div className="min-h-screen bg-ink text-white">
      <div className="max-w-2xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/desco-coin.png"
            alt="Desco Global"
            className="w-16 h-16 rounded-full mx-auto mb-5 shadow-[0_8px_24px_rgb(184_149_61/0.4)]"
          />
          <h1 style={{ fontFamily: "var(--font-serif)" }} className="font-semibold text-3xl lg:text-4xl tracking-tight">
            Get in touch
          </h1>
          <p className="text-white/70 mt-3 max-w-md mx-auto leading-relaxed">
            Select the purpose of your inquiry so it can be reviewed through the appropriate investor, sponsor, partnership or support workflow.
          </p>
        </div>
        <ContactForm initialTopic={topic} projectId={project} />
        <div className="mt-6 rounded-xl border border-white/15 p-5 text-xs leading-6 text-white/65">
          Workspace approval and project-specific data-room access are separate decisions. Submitting this form does not grant access or constitute investor qualification.
        </div>
      </div>
    </div>
  );
}
