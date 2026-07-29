import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { STAGES, STAGE_PROBABILITY, amountUsd, type Stage } from "@/lib/deals";

export const dynamic = "force-dynamic";

function Tile({ value, label, href }: { value: string | number; label: string; href?: string }) {
  const content = (
    <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgb(44_62_80/0.08)] h-full">
      <div className="font-display font-extrabold text-2xl">{value}</div>
      <div className="text-[11px] text-wgray uppercase tracking-wider font-bold mt-1">{label}</div>
    </div>
  );
  return href ? <Link href={href} className="block hover:shadow-[0_4px_16px_rgb(44_62_80/0.10)] rounded-2xl transition-shadow">{content}</Link> : content;
}

export default async function AdminDashboard() {
  const admin = await getSessionUser();
  if (!admin) redirect("/login");
  if (admin.role !== "admin") redirect("/");

  const [
    listingCount,
    verifiedCount,
    raiseAgg,
    deals,
    pendingSubmissions,
    usersByRole,
    users,
    aiTotal,
    aiClaude,
    activeGrants,
    meetingsByStatus,
    newInquiries,
    activeContracts,
    productEvents30d,
    crmContacts,
    crmOpenOpportunities,
    crmOpenTasks,
  ] = await Promise.all([
    prisma.listing.count(),
    prisma.listing.count({ where: { verified: true } }),
    prisma.listing.aggregate({ _sum: { raiseUsd: true } }),
    prisma.deal.findMany({ select: { stage: true, amount: true, probability: true } }),
    prisma.projectSubmission.count({ where: { status: { in: ["submitted", "under_review"] } } }),
    prisma.user.groupBy({ by: ["role"], _count: true }),
    prisma.user.findMany({ include: { plan: true } }),
    prisma.aiGenerationLog.count(),
    prisma.aiGenerationLog.count({ where: { source: "claude" } }),
    prisma.dataRoomAccess.count({ where: { revokedAt: null } }),
    prisma.meeting.groupBy({ by: ["status"], _count: true }),
    prisma.contactInquiry.count({ where: { status: "new" } }),
    prisma.commercialContract.count({ where: { status: "active" } }),
    prisma.productEvent.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
    prisma.crmContact.count({ where: { status: { not: "inactive" } } }).catch(() => 0),
    prisma.crmOpportunity.count({ where: { status: "open" } }).catch(() => 0),
    prisma.crmTask.count({ where: { status: { in: ["open", "in-progress"] } } }).catch(() => 0),
  ]);

  const totalRaiseM = Math.round((raiseAgg._sum.raiseUsd ?? 0) / 1_000_000);
  const weightedForecastM = Math.round(
    deals.reduce((sum, d) => {
      const probability = d.probability ?? STAGE_PROBABILITY[d.stage as Stage] ?? 0;
      return sum + (amountUsd(d.amount) * probability) / 100;
    }, 0) / 1_000_000
  );
  const dealsByStage = STAGES.map((s) => ({ stage: s, count: deals.filter((d) => d.stage === s).length })).filter((s) => s.count > 0);
  const mrr = users.reduce((sum, u) => sum + (u.plan?.priceUsdPerMonth ?? 0), 0);
  const paidUserCount = users.filter((u) => u.planId).length;
  const meetingsPending = meetingsByStatus.find((m) => m.status === "requested")?._count ?? 0;
  const meetingsConfirmed = meetingsByStatus.find((m) => m.status === "confirmed")?._count ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <h1 className="font-display font-extrabold text-3xl tracking-tight">Administration</h1>
      <p className="text-wgray text-sm mt-1 mb-6">
        Operational records, sponsor-reported project aggregates and commercial-model simulations are separated below. No external analytics or audit provider is connected.
      </p>

      <h2 className="text-[11px] font-bold uppercase tracking-wider text-wgray mb-2">Sponsor-reported portfolio</h2>
      <p className="mb-3 text-xs text-wgray">Project totals and capital requirements are supplied through listing records and are not audited aggregates.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <Tile value={listingCount} label="Published listings" href="/" />
        <Tile value={verifiedCount + " / " + listingCount} label="Evidence reviews recorded" href="/admin/verification" />
        <Tile value={"$" + totalRaiseM + "M"} label="Sponsor-reported capital sought" />
      </div>

      <h2 className="text-[11px] font-bold uppercase tracking-wider text-wgray mb-2">Operational workflow</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Tile value={"$" + weightedForecastM + "M"} label="Stage-weighted deal amount" href="/deals" />
        <Tile value={pendingSubmissions} label="Submissions awaiting review" href="/admin/submissions" />
        <Tile value={activeGrants} label="Active data-room grants" />
        <Tile value={meetingsPending + " pending / " + meetingsConfirmed + " confirmed"} label="Meeting records" />
      </div>

      {dealsByStage.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgb(44_62_80/0.08)] mb-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-wgray mb-3">Deals by stage</div>
          <div className="flex flex-wrap gap-2 text-xs">
            {dealsByStage.map((s) => (
              <span key={s.stage} className="bg-mist rounded-full px-3 py-1.5">{s.stage}: <strong>{s.count}</strong></span>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-[11px] font-bold uppercase tracking-wider text-wgray mb-2">Review and support queues</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mb-6">
        <Tile value={newInquiries} label="New contact inquiries" href="/admin/inquiries" />
        <Tile value={aiTotal + " (" + aiClaude + " via Claude)"} label="Recorded AI generations" href="/admin/ai-usage" />
        <Tile value={productEvents30d} label="Product events · 30 days" href="/admin/analytics" />
        <Tile value={activeContracts} label="Active organization contracts" href="/admin/contracts" />
      </div>

      <h2 className="text-[11px] font-bold uppercase tracking-wider text-wgray mb-2">Relationship management</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <Tile value={crmContacts} label="Active CRM relationships" href="/admin/crm" />
        <Tile value={crmOpenOpportunities} label="Open CRM opportunities" href="/admin/crm" />
        <Tile value={crmOpenTasks} label="CRM follow-ups due" href="/admin/crm" />
      </div>

      <h2 className="text-[11px] font-bold uppercase tracking-wider text-wgray mb-2">Demo entitlement and commercial scenarios</h2>
      <p className="mb-3 text-xs text-wgray">The following values describe demo identities and internal entitlement assignments. They are not contracts, invoices, MRR, ARR or collected revenue.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <Tile value={users.length} label="Demo workspace identities" href="/admin/users" />
        <Tile value={paidUserCount} label="Plan assignments" href="/admin/users" />
        <Tile value={"$" + mrr.toLocaleString()} label="Assigned monthly scenario value" href="/admin/users" />
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
        <div className="text-[11px] font-bold uppercase tracking-wider text-wgray mb-3">Users by role</div>
        <div className="flex flex-wrap gap-2 text-xs">
          {usersByRole.map((r) => (
            <span key={r.role} className="bg-mist rounded-full px-3 py-1.5">{r.role}: <strong>{r._count}</strong></span>
          ))}
        </div>
      </div>
    </div>
  );
}
