import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact — DESCO Nexus",
  description: "Get in touch with Desco Global about investment opportunities, partnerships, or platform access.",
};

export default function ContactPage() {
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
          <h1 className="font-display font-extrabold text-3xl lg:text-4xl tracking-tight">
            Get in touch
          </h1>
          <p className="text-white/70 mt-3 max-w-md mx-auto leading-relaxed">
            Investor inquiries, partnership discussions, or platform access —
            tell us what you&rsquo;re looking for and the right person at
            Desco Global will follow up.
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
