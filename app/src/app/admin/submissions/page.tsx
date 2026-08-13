import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import SubmissionReviewRow from "./SubmissionReviewRow";

export const dynamic = "force-dynamic";

export default async function AdminSubmissions() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/");

  const submissions = await prisma.projectSubmission.findMany({
    where: { status: { in: ["submitted", "under_review"] } },
    orderBy: { createdAt: "asc" },
    include: { owner: { select: { fullName: true, email: true } } },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <h1 className="font-display font-extrabold text-3xl tracking-tight">Project Submissions</h1>
      <p className="text-wgray text-sm mt-1 mb-6">{submissions.length} awaiting review</p>

      {submissions.length === 0 ? (
        <div className="bg-white  p-10 text-center ">
          <p className="text-sm text-wgray">Nothing in the review queue.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((s) => (
            <SubmissionReviewRow key={s.id} submission={s} />
          ))}
        </div>
      )}
    </div>
  );
}
