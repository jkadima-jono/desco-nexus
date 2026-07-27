import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";

// Clearly fictional, isolated demo identities. This endpoint is available only
// in development, preview deployments, or when explicitly enabled.
const PERSONAS: Record<
  string,
  { email: string; fullName: string; title: string; role: string; org?: string }
> = {
  investor: {
    email: "investor@demo.invalid",
    fullName: "Demo Investor",
    title: "Demo · Family Office",
    role: "investor",
  },
  owner: {
    email: "owner@demo.invalid",
    fullName: "Demo Sponsor",
    title: "Demo · Project Owner",
    role: "owner",
    org: "Comicordia Corporation",
  },
  advisor: {
    email: "advisor@demo.invalid",
    fullName: "Demo Advisor",
    title: "Demo · M&A Advisory",
    role: "advisor",
  },
  admin: {
    email: "admin@demo.invalid",
    fullName: "Demo Administrator",
    title: "Demo · Platform Admin",
    role: "admin",
  },
};

export async function POST(req: Request) {
  const demoEnabled =
    process.env.NODE_ENV !== "production" ||
    process.env.VERCEL_ENV === "preview" ||
    process.env.DEMO_AUTH_ENABLED === "true";
  if (!demoEnabled || process.env.VERCEL_ENV === "production") {
    return NextResponse.json({ error: "Demo authentication is disabled" }, { status: 404 });
  }

  let body: { persona?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const p = PERSONAS[body.persona ?? ""];
  if (!p) {
    return NextResponse.json(
      { error: "persona must be investor|owner|advisor|admin" },
      { status: 400 }
    );
  }
  const org = p.org
    ? await prisma.organization.findUnique({ where: { name: p.org } })
    : null;
  const user = await prisma.user.upsert({
    where: { email: p.email },
    update: { role: p.role, orgId: org?.id ?? null },
    create: {
      email: p.email,
      fullName: p.fullName,
      title: p.title,
      role: p.role,
      orgId: org?.id ?? null,
    },
  });
  const token = await createSessionToken(user.id);
  const res = NextResponse.json({ ok: true, role: user.role });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
