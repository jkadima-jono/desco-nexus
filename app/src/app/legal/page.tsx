export const metadata = {
  title: "Legal & Security — DESCO Nexus",
  description: "Terms, privacy, cookies, security, investment-risk disclosure, and verification methodology for the DESCO Nexus platform.",
  alternates: { canonical: "/legal" },
};

const SECTIONS = [
  {
    id: "platform-status",
    title: "Platform-status disclosure",
    body: "DESCO Nexus is currently a demonstration environment. User accounts, deals, and messages shown are fictional demo data. Opportunities reference real Desco Global projects, but nothing on this platform is a live securities offer, and no real transactions or solicitations occur here. Opportunities shown are not automatically public securities offers, and jurisdiction-specific restrictions on investment solicitation may apply.",
  },
  {
    id: "privacy",
    title: "Privacy notice",
    body: "Full privacy notice — covering what data Nexus collects, why, retention periods, your rights (access, export, deletion), and cross-border transfer — is pending Desco Global legal review before publication. Do not rely on this page as a substitute.",
    pending: true,
  },
  {
    id: "cookies",
    title: "Cookie notice",
    body: "Nexus sets a session cookie (authentication) and a locale-preference cookie. Neither is used for third-party advertising or cross-site tracking. A full cookie inventory and consent mechanism is pending Desco Global review.",
    pending: true,
  },
  {
    id: "terms",
    title: "Terms of use",
    body: "Binding terms governing platform use, investor and sponsor obligations, and dispute resolution are pending Desco Global legal review before publication.",
    pending: true,
  },
  {
    id: "security",
    title: "Security overview",
    body: "This demonstration uses fictional workspace identities. Production authentication has not been implemented or approved. In this build, confidential document and data-room requests are checked on the server for an authenticated and authorized session. A full security disclosure covering infrastructure, encryption, access controls and incident response is pending Desco Global review.",
  },
  {
    id: "risk",
    title: "Investment-risk disclosure",
    body: "DESCO Nexus does not guarantee project performance, returns, or exit outcomes. Project information may include sponsor-provided material that has not been independently verified. Users must conduct their own independent due diligence before making any investment decision — nothing on this platform is investment advice.",
  },
  {
    id: "verification",
    title: "Verification methodology",
    body: "\"Evidence reviewed\" labels indicate only the specific check explained beside the label. They do not mean that every listing claim has been independently confirmed. Financial and market figures are labeled by source (sponsor-provided, Desco Global investor materials, or platform-illustrative) wherever shown. Evidence review does not guarantee investment performance.",
  },
  {
    id: "regulatory",
    title: "Regulatory status",
    body: "DESCO Nexus does not claim compliance with securities law, AML/KYC, SOC 2, or any other regulatory or audit standard. Any such compliance work requires DESCO Global's legal and compliance teams to define and implement the underlying controls before such a claim could be made.",
  },
  {
    id: "complaints",
    title: "Complaints and reporting",
    body: "To report suspicious or inaccurate listing information, a security concern, or a complaint about platform conduct, contact support@desco.global. Reports are reviewed by a person, not resolved automatically.",
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
          <section key={s.id} id={s.id} className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgb(44_62_80/0.08)] scroll-mt-20">
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
        Questions about this page, a specific claim, or a complaint:{" "}
        <a className="text-gold font-bold" href="mailto:support@desco.global">
          support@desco.global
        </a>
      </p>
    </div>
  );
}
