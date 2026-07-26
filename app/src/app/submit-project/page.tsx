import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import SubmissionManager from "./SubmissionManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Submit a Project — DESCO Nexus",
  description: "Present your project to qualified capital with a structured, verifiable listing on DESCO Nexus.",
};

export default async function SubmitProjectPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/submit-project");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      <h1 className="font-display font-extrabold text-2xl tracking-tight">Submit a Project</h1>
      <p className="text-wgray text-sm mt-2 max-w-xl">
        Complete the sections below, then submit for DESCO review. A reviewer
        checks completeness and internal consistency before your project is
        published as a live opportunity — this is not an automatic listing.
      </p>
      <SubmissionManager />
    </div>
  );
}
