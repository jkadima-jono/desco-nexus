import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pricing — DESCO Nexus",
  description: "DESCO Nexus plans for investors and sponsors.",
};

const limitLabel = (n: number | null, unit: string) => (n === null ? "Unlimited " + unit + "s" : n + " " + unit + (n === 1 ? "" : "s"));

export default async function PricingPage() {
  const plans = await prisma.plan.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="font-display font-extrabold text-3xl lg:text-4xl tracking-tight">Plans</h1>
        <p className="text-wgray mt-3">
          Plans are assigned by our team — there is no self-serve checkout on Nexus.
          Contact us to discuss the right tier for your organization.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgb(44_62_80/0.08)] flex flex-col">
            <h2 className="font-display font-bold text-lg">{p.name}</h2>
            <div className="font-display font-extrabold text-3xl mt-2">
              ${p.priceUsdPerMonth}<span className="text-sm text-wgray font-normal">/mo</span>
            </div>
            <p className="text-sm text-wgray mt-3 flex-1">{p.description}</p>
            <ul className="text-xs text-wgray mt-4 space-y-1">
              <li>{limitLabel(p.maxActiveMandates, "active mandate")}</li>
              <li>{limitLabel(p.maxCollections, "saved collection")}</li>
            </ul>
            <Link href="/contact" className="mt-5 block text-center bg-gold text-ink font-display font-bold text-sm py-2.5 rounded-xl hover:brightness-110">
              Contact sales
            </Link>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-wgray mt-8">
        This is a demonstration environment — no payment is processed and no plan is billed.
      </p>
    </div>
  );
}
