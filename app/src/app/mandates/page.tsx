import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { effectivePlan } from "@/lib/plans";
import MandateManager from "./MandateManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your Mandates — DESCO Nexus",
  description: "Create and manage standing investment mandates to personalize opportunity matching.",
};

export default async function MandatesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/mandates");
  if (user.role === "owner") redirect("/");

  const [plan, activeCount] = await Promise.all([
    effectivePlan(user),
    prisma.standingMandate.count({ where: { userId: user.id, active: true } }),
  ]);
  const atLimit = plan.maxActiveMandates !== null && activeCount >= plan.maxActiveMandates;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      <h1 className="font-display font-extrabold text-2xl tracking-tight">Your Mandates</h1>
      <p className="text-wgray text-sm mt-2 max-w-xl">
        A mandate is the criteria Nexus compares every opportunity against. Save one to
        get transparent, evidence-based match explanations instead of an unexplained score —
        every opportunity page will show exactly which of your criteria were met and which were not.
      </p>
      <div className={"mt-4 rounded-xl px-4 py-2.5 text-xs font-semibold flex items-center justify-between gap-3 " + (atLimit ? "bg-brandred/10 text-brandred" : "bg-mist text-wgray")}>
        <span>
          {plan.maxActiveMandates === null
            ? plan.name + " plan — unlimited active mandates"
            : activeCount + " of " + plan.maxActiveMandates + " active mandates used (" + plan.name + " plan)"}
        </span>
        {atLimit && <Link href="/pricing" className="underline shrink-0">Upgrade</Link>}
      </div>
      <MandateManager />
    </div>
  );
}
