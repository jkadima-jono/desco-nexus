import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { isDemoAdminEnabled, isDemoAuthEnabled } from "@/lib/demoAuth";
import { applyRateLimit, rejectUntrustedOrigin } from "@/lib/request-security";

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
    org: "Desco Global (Agridesco)",
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
  const demoEnabled = isDemoAuthEnabled({
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    explicitFlag: process.env.DEMO_AUTH_ENABLED,
  });
  if (!demoEnabled) {
    return NextResponse.json({ error: "Demo authentication is disabled" }, { status: 404 });
  }
  const originRejection = rejectUntrustedOrigin(req);
  if (originRejection) return originRejection;
  const limited = await applyRateLimit(req, "auth-demo-ip", 20, 15 * 60_000);
  if (limited) return limited;

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
  if (
    body.persona === "admin" &&
    !isDemoAdminEnabled({
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
    })
  ) {
    return NextResponse.json({ error: "Administrator demo is available only in local development" }, { status: 404 });
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
  if (body.persona === "investor") {
    await prisma.institutionalAccessProfile.upsert({
      where: { userId: user.id },
      update: {
        authorizedRepresentativeStatus: "demo_verified",
        kybStatus: "demo_verified",
        kycStatus: "demo_verified",
        screeningStatus: "demo_clear",
        investorClassification: "institutional",
        classificationJurisdiction: "DEMO",
        riskRating: "low",
        reviewedBy: "demo-environment",
        reviewedAt: new Date(),
      },
      create: {
        userId: user.id,
        legalEntityName: "Fictional demo institution",
        jurisdiction: "DEMO",
        authorizedRepresentativeStatus: "demo_verified",
        kybStatus: "demo_verified",
        kycStatus: "demo_verified",
        screeningStatus: "demo_clear",
        investorClassification: "institutional",
        classificationJurisdiction: "DEMO",
        riskRating: "low",
        reviewedBy: "demo-environment",
        reviewedAt: new Date(),
      },
    });
  }
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
