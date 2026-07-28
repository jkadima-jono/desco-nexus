import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProductAnalyticsPage() {
  const admin = await getSessionUser();
  if (!admin) redirect("/login");
  if (admin.role !== "admin") redirect("/");
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [total, byEvent, byPath] = await Promise.all([
    prisma.productEvent.count({ where: { createdAt: { gte: since } } }),
    prisma.productEvent.groupBy({ by: ["event"], where: { createdAt: { gte: since } }, _count: true }),
    prisma.productEvent.groupBy({ by: ["path"], where: { createdAt: { gte: since }, event: "page_view" }, _count: true }),
  ]);
  byEvent.sort((a, b) => b._count - a._count);
  byPath.sort((a, b) => b._count - a._count);
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Product analytics</h1>
      <p className="mb-6 mt-1 text-sm text-wgray">Privacy-minimised events from the last 30 days. Counts describe activity, not unique people or organizations.</p>
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
        <div className="font-display text-3xl font-extrabold">{total}</div>
        <div className="text-xs font-bold uppercase tracking-wider text-wgray">Recorded events</div>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
          <h2 className="font-display font-bold">Journey events</h2>
          <div className="mt-4 space-y-2">
            {byEvent.map((row) => <div key={row.event} className="flex justify-between rounded-lg bg-mist px-3 py-2 text-sm"><span>{row.event.replaceAll("_", " ")}</span><strong>{row._count}</strong></div>)}
            {byEvent.length === 0 && <p className="text-sm text-wgray">No events recorded.</p>}
          </div>
        </section>
        <section className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgb(44_62_80/0.08)]">
          <h2 className="font-display font-bold">Most-viewed paths</h2>
          <div className="mt-4 space-y-2">
            {byPath.slice(0, 20).map((row) => <div key={row.path} className="flex gap-3 rounded-lg bg-mist px-3 py-2 text-sm"><span className="min-w-0 flex-1 truncate">{row.path}</span><strong>{row._count}</strong></div>)}
            {byPath.length === 0 && <p className="text-sm text-wgray">No page views recorded.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
