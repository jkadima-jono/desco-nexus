import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      <h1 className="font-display font-extrabold text-2xl tracking-tight">Your Mandates</h1>
      <p className="text-wgray text-sm mt-2 max-w-xl">
        A mandate is the criteria Nexus compares every opportunity against. Save one to
        get transparent, evidence-based match explanations instead of an unexplained score —
        every opportunity page will show exactly which of your criteria were met and which were not.
      </p>
      <MandateManager />
    </div>
  );
}
