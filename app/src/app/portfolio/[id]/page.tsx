import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LegacyPositionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const { id } = await params;
  const deal = await prisma.deal.findUnique({
    where: { id },
    select: { listingId: true, investorId: true },
  });
  if (!deal) notFound();
  if (user.role !== "admin" && deal.investorId !== user.id) notFound();
  redirect(`/project/${deal.listingId}`);
}
