import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import InquiryRow from "./InquiryRow";

export const dynamic = "force-dynamic";

export default async function AdminInquiries() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/");

  const inquiries = await prisma.contactInquiry.findMany({
    include: {
      crmContact: { include: { owner: true } },
      crmOpportunity: true,
      project: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <h1 className="font-display font-extrabold text-3xl tracking-tight">Contact Inquiries</h1>
      <p className="text-wgray text-sm mt-1 mb-6">
        {inquiries.length} total · {inquiries.filter((i) => i.status === "new").length} new
      </p>

      {inquiries.length === 0 ? (
        <div className="bg-white  p-10 text-center ">
          <p className="text-sm text-wgray">No inquiries yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((i) => (
            <InquiryRow key={i.id} inquiry={i} />
          ))}
        </div>
      )}
    </div>
  );
}
