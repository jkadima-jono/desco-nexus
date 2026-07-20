import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import MessagesClient, { type UiThread } from "./MessagesClient";

export const dynamic = "force-dynamic";

export default async function Messages() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/messages");
  const rows = await prisma.thread.findMany({
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  const threads: UiThread[] = rows.map((t) => ({
    id: t.id,
    name: t.name,
    org: t.org,
    messages: t.messages.map((m) => ({
      from: m.sender as "them" | "me" | "system",
      text: m.text,
      time: m.createdAt.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    })),
  }));
  return <MessagesClient threads={threads} />;
}
