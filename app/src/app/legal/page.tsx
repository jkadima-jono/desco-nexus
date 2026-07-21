export const metadata = {
  title: "Legal & Security — DESCO Nexus",
  description: "Privacy, terms, and security information for the DESCO Nexus platform.",
};

const SECTIONS = [
  {
    title: "Demonstration status",
    body: "DESCO Nexus is currently a demonstration environment. User accounts, deals, and messages shown are fictional demo data. Opportunities reference real Desco Global projects, but nothing on this platform is a live securities offer, and no real transactions or solicitations occur here.",
  },
  {
    title: "Privacy Policy",
    body: "Full privacy notice — covering what data Nexus collects, why, retention periods, your rights (access, export, deletion), and cross-border transfer — is pending Desco Global legal review before publication. Do not rely on this page as a substitute.",
    pending: true,
  },
  {
    title: "Terms of Service",
    body: "Binding terms governing platform use, investor and sponsor obligations, and dispute resolution are pending Desco Global legal review before publication.",
    pending: true,
  },
  {
    title: "Security",
    body: "Sessions use httpOnly, secure cookies; passwords are not used in this demo build (production auth is planned to use magic links and passkeys). Confidential documents and data-room access require an authenticated session — see the platform's authorization policy. A full security disclosure (infrastructure, encryption at rest/in transit, incident response) is pending Desco Global review.",
  },
  {
    title: "Verification scope",
    body: "\"Verified\" badges on this platform indicate a specific, disclosed check (see each badge's own explanation) — never a guarantee that every claim on a listing has been independently confirmed. Financial and market figures are labeled by source (sponsor-provided, Desco Global investor materials, or platform-illustrative) wherever shown.",
  },
  {
    title: "Regulatory status",
    body: "DESCO Nexus does not claim compliance with securities law, AML/KYC, SOC 2, or any other regulatory or audit standard. Any such compliance work requires DESCO Global's legal and compliance teams to define and implement the underlying controls before such a claim could be made.",
  },
];

export default function Legal() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-10 lg:py-12">
      <h1 className="font-display font-extrabold text-3xl tracking-tight mb-2">
        Legal &amp; Security
      </h1>
      <p className="text-sm text-wgray leading-relaxed mb-8">
        This page discloses DESCO Nexus&rsquo;s current legal and security
        status. Sections marked &ldquo;pending review&rdquo; are placeholders
        awaiting Desco Global legal sign-off, not published policy.
      </p>
      <div className="space-y-6">
        {SECTIONS.map((s) => (
          <section key={s.title} className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
            <h2 className="font-display font-bold text-base mb-2 flex items-center gap-2">
              {s.title}
              {s.pending && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-wgray/15 text-wgray">
                  Pending DESCO review
                </span>
              )}
            </h2>
            <p className="text-sm text-wgray leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>
      <p className="text-sm text-wgray leading-relaxed mt-8">
        Questions about this page or a specific claim on the platform:{" "}
        <a className="text-gold font-bold" href="mailto:support@desco.global">
          support@desco.global
        </a>
      </p>
    </div>
  );
}
