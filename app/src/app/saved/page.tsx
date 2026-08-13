import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { effectivePlan } from "@/lib/plans";
import SavedManager from "./SavedManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Saved Opportunities — DESCO Compass",
  description: "Your saved opportunities, organized into collections with notes and tags.",
};

export default async function SavedPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/saved");

  const [plan, count] = await Promise.all([
    effectivePlan(user),
    prisma.collection.count({ where: { userId: user.id } }),
  ]);
  const atLimit = plan.maxCollections !== null && count >= plan.maxCollections;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      <h1 className="font-display font-extrabold text-2xl tracking-tight">Saved Opportunities</h1>
      <p className="text-wgray text-sm mt-2 max-w-xl">
        Organize saved opportunities into collections, add notes and tags, and
        select any to compare side by side. Saving here does not imply Compass
        recommends an investment.
      </p>
      <div className={"mt-4  px-4 py-2.5 text-xs font-semibold flex items-center justify-between gap-3 " + (atLimit ? "bg-brandred/10 text-brandred" : "bg-mist text-wgray")}>
        <span>
          {plan.maxCollections === null
            ? "Current organization access — unlimited collections"
            : count + " of " + plan.maxCollections + " collection(s) used under current organization access"}
        </span>
        {atLimit && <Link href="/contact?topic=commercial-model" className="underline shrink-0">Request expanded access</Link>}
      </div>
      <SavedManager />
    </div>
  );
}
