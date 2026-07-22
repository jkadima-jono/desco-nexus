import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import SavedManager from "./SavedManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Saved Opportunities — DESCO Nexus",
  description: "Your saved opportunities, organized into collections with notes and tags.",
};

export default async function SavedPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/saved");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      <h1 className="font-display font-extrabold text-2xl tracking-tight">Saved Opportunities</h1>
      <p className="text-wgray text-sm mt-2 max-w-xl">
        Organize saved opportunities into collections, add notes and tags, and
        select any to compare side by side. Saving here does not imply Nexus
        recommends an investment.
      </p>
      <SavedManager />
    </div>
  );
}
