import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { SECTORS, INSTRUMENTS, RISK_LEVELS, INVESTOR_TYPES, CO_INVEST_PREFERENCES } from "@/lib/mandateOptions";
import { effectivePlan } from "@/lib/plans";
import { boundedString, sanitizeStringArray, strictBoolean } from "@/lib/request-input";

type MandateBody = {
  name?: string;
  query?: string;
  criteria?: string[];
  threshold?: number;
  frequency?: string;
  investorType?: string;
  sectors?: string[];
  countries?: string[];
  ticketMinUsd?: number | null;
  ticketMaxUsd?: number | null;
  instruments?: string[];
  stagePreference?: string;
  targetReturn?: string;
  horizonYears?: number | null;
  riskTolerance?: string;
  currency?: string;
  esgRequired?: boolean;
  govSupportRequired?: boolean;
  excludedSectors?: string[];
  excludedCountries?: string[];
  coInvestPreference?: string;
};

function finiteNonNegative(input: unknown): number | null {
  return typeof input === "number" && Number.isFinite(input) ? Math.max(0, input) : null;
}

function buildMandateData(body: MandateBody) {
  const ticketMinUsd = finiteNonNegative(body.ticketMinUsd);
  const ticketMaxUsdRaw = finiteNonNegative(body.ticketMaxUsd);
  const ticketMaxUsd =
    ticketMinUsd !== null && ticketMaxUsdRaw !== null && ticketMaxUsdRaw < ticketMinUsd
      ? ticketMinUsd
      : ticketMaxUsdRaw;

  return {
    investorType: INVESTOR_TYPES.includes(body.investorType ?? "") ? body.investorType : null,
    sectors: JSON.stringify(sanitizeStringArray(body.sectors, SECTORS)),
    countries: JSON.stringify(sanitizeStringArray(body.countries)),
    ticketMinUsd,
    ticketMaxUsd,
    instruments: JSON.stringify(sanitizeStringArray(body.instruments, INSTRUMENTS)),
    stagePreference: boundedString(body.stagePreference, 60) || null,
    targetReturn: boundedString(body.targetReturn, 40) || null,
    horizonYears: typeof body.horizonYears === "number" && Number.isFinite(body.horizonYears) ? Math.max(0, Math.min(50, body.horizonYears)) : null,
    riskTolerance: RISK_LEVELS.includes(body.riskTolerance ?? "") ? body.riskTolerance : null,
    currency: boundedString(body.currency, 6) || "USD",
    esgRequired: strictBoolean(body.esgRequired),
    govSupportRequired: strictBoolean(body.govSupportRequired),
    excludedSectors: JSON.stringify(sanitizeStringArray(body.excludedSectors, SECTORS)),
    excludedCountries: JSON.stringify(sanitizeStringArray(body.excludedCountries)),
    coInvestPreference: CO_INVEST_PREFERENCES.includes(body.coInvestPreference ?? "")
      ? body.coInvestPreference
      : null,
  };
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const mandates = await prisma.standingMandate.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ mandates });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  let body: MandateBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const name = boundedString(body.name, 81);
  const query = boundedString(body.query, 501);
  if (!name || name.length > 80) {
    return NextResponse.json({ error: "name (1-80 chars) required" }, { status: 400 });
  }
  if (query.length > 500) {
    return NextResponse.json({ error: "query must be ≤500 chars" }, { status: 400 });
  }
  const plan = await effectivePlan(user);
  if (plan.maxActiveMandates !== null) {
    const activeCount = await prisma.standingMandate.count({ where: { userId: user.id, active: true } });
    if (activeCount >= plan.maxActiveMandates) {
      return NextResponse.json(
        { error: "Your current workspace allowance supports up to " + plan.maxActiveMandates + " active mandates. Request expanded access or deactivate one to add another." },
        { status: 402 }
      );
    }
  }
  const threshold = typeof body.threshold === "number" && Number.isFinite(body.threshold)
    ? Math.min(100, Math.max(0, body.threshold))
    : 70;
  const frequency = ["daily", "weekly"].includes(body.frequency ?? "") ? body.frequency! : "weekly";
  const mandate = await prisma.standingMandate.create({
    data: {
      userId: user.id,
      name,
      query,
      criteria: JSON.stringify(sanitizeStringArray(body.criteria, undefined, 160)),
      threshold,
      frequency,
      ...buildMandateData(body),
    },
  });
  return NextResponse.json({ ok: true, mandate });
}

export async function DELETE(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const mandate = await prisma.standingMandate.findUnique({ where: { id } });
  if (!mandate || mandate.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await prisma.standingMandate.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  let body: MandateBody & { id?: string; active?: boolean; duplicate?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const id = boundedString(body.id, 100);
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  if (body.active !== undefined && typeof body.active !== "boolean") {
    return NextResponse.json({ error: "active must be true or false" }, { status: 400 });
  }
  if (body.duplicate !== undefined && typeof body.duplicate !== "boolean") {
    return NextResponse.json({ error: "duplicate must be true or false" }, { status: 400 });
  }
  const mandate = await prisma.standingMandate.findUnique({ where: { id } });
  if (!mandate || mandate.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (body.duplicate === true) {
    const copy = await prisma.standingMandate.create({
      data: {
        userId: user.id,
        name: (mandate.name + " (copy)").slice(0, 80),
        query: mandate.query,
        criteria: mandate.criteria,
        threshold: mandate.threshold,
        frequency: mandate.frequency,
        investorType: mandate.investorType,
        sectors: mandate.sectors,
        countries: mandate.countries,
        ticketMinUsd: mandate.ticketMinUsd,
        ticketMaxUsd: mandate.ticketMaxUsd,
        instruments: mandate.instruments,
        stagePreference: mandate.stagePreference,
        targetReturn: mandate.targetReturn,
        horizonYears: mandate.horizonYears,
        riskTolerance: mandate.riskTolerance,
        currency: mandate.currency,
        esgRequired: mandate.esgRequired,
        govSupportRequired: mandate.govSupportRequired,
        excludedSectors: mandate.excludedSectors,
        excludedCountries: mandate.excludedCountries,
        coInvestPreference: mandate.coInvestPreference,
        active: false,
      },
    });
    return NextResponse.json({ ok: true, mandate: copy });
  }

  if (body.active === true && !mandate.active) {
    const plan = await effectivePlan(user);
    if (plan.maxActiveMandates !== null) {
      const activeCount = await prisma.standingMandate.count({ where: { userId: user.id, active: true } });
      if (activeCount >= plan.maxActiveMandates) {
        return NextResponse.json(
          { error: "Your current workspace allowance supports up to " + plan.maxActiveMandates + " active mandates. Request expanded access or deactivate one to reactivate this one." },
          { status: 402 }
        );
      }
    }
  }

  const hasStructuredEdits = [
    "investorType", "sectors", "countries", "ticketMinUsd", "ticketMaxUsd", "instruments",
    "stagePreference", "targetReturn", "horizonYears", "riskTolerance", "currency",
    "esgRequired", "govSupportRequired", "excludedSectors", "excludedCountries", "coInvestPreference",
  ].some((k) => k in body);

  const updated = await prisma.standingMandate.update({
    where: { id },
    data: {
      active: typeof body.active === "boolean" ? body.active : mandate.active,
      name: boundedString(body.name, 80) || mandate.name,
      ...(hasStructuredEdits ? buildMandateData({ ...mandate, ...body } as MandateBody) : {}),
    },
  });
  return NextResponse.json({ ok: true, mandate: updated });
}
