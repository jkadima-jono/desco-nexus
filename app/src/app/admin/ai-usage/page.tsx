import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminAiUsage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/");

  const logs = await prisma.aiGenerationLog.findMany({
    include: { user: { select: { fullName: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  const claudeCount = logs.filter((l) => l.source === "claude").length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <h1 className="font-display font-extrabold text-3xl tracking-tight">AI Usage</h1>
      <p className="text-wgray text-sm mt-1 mb-6">
        {logs.length} generations logged (most recent 200) · {claudeCount} via Claude API · {logs.length - claudeCount} offline template fallback.
        Every AI-assisted teaser or message draft is logged here — who generated it, from what, and whether a real model actually ran.
      </p>

      {logs.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
          <p className="text-sm text-wgray">No AI-assisted generations yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgb(44_62_80/0.08)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-bold uppercase tracking-wider text-wgray border-b border-charcoal/10">
                <th className="px-4 py-2.5">User</th>
                <th className="px-4 py-2.5">Kind</th>
                <th className="px-4 py-2.5">Source</th>
                <th className="px-4 py-2.5">Target</th>
                <th className="px-4 py-2.5">When</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-b border-charcoal/5 last:border-0">
                  <td className="px-4 py-2.5">{l.user.fullName}<div className="text-[11px] text-wgray">{l.user.email}</div></td>
                  <td className="px-4 py-2.5">{l.kind === "teaser" ? "Investment teaser" : "Message draft"}</td>
                  <td className="px-4 py-2.5">
                    <span className={"text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full " + (l.source === "claude" ? "bg-emerald-p/10 text-emerald-p" : "bg-mist text-wgray")}>
                      {l.source === "claude" ? "Claude API" : "Template"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-wgray text-xs">{l.listingId ?? l.threadId ?? "—"}</td>
                  <td className="px-4 py-2.5 text-wgray text-xs">{l.createdAt.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
