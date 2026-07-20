import { NextResponse } from "next/server";
import { prisma, toListing } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import type { Listing } from "@/lib/data";

const SECTOR_MAP: [string, string][] = [
  ["renewable", "Renewable Energy"], ["solar", "Renewable Energy"],
  ["energy", "Renewable Energy"], ["agri", "Agriculture"],
  ["farm", "Agriculture"], ["infra", "Infrastructure"],
  ["port", "Infrastructure"], ["ppp", "Infrastructure"],
  ["health", "Healthcare"], ["clinic", "Healthcare"],
  ["water", "Water"], ["fintech", "Fintech"], ["payment", "Fintech"],
];

const containsTerm = (query: string, term: string) => {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped.replace(/\\ /g, "\\s+")}\\b`, "i").test(query);
};

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.toLowerCase() ?? "";
  if (!q.trim()) {
    return NextResponse.json({ error: "q parameter required" }, { status: 400 });
  }

  const user = await getSessionUser();
  const rows = await prisma.listing.findMany({ include: { org: true, images: true } });
  let results: Listing[] = rows.map(toListing).map((l) =>
    user ? l : { ...l, whyMatch: "", docs: [] }
  );
  const parts: string[] = [];

  const sectors = [...new Set(SECTOR_MAP.filter(([k]) => containsTerm(q, k)).map(([, v]) => v))];
  if (sectors.length) {
    results = results.filter((l) => sectors.includes(l.sector));
    parts.push("sector: " + sectors.join("/"));
  }

  const money = [...q.matchAll(/\$?\s?(\d+(?:\.\d+)?)\s?m/g)].map((m) => parseFloat(m[1]) * 1e6);
  if (money.length >= 2) {
    const [min, max] = [Math.min(...money), Math.max(...money)];
    results = results.filter((l) => l.raiseUsd >= min && l.raiseUsd <= max);
    parts.push("ticket: $" + min / 1e6 + "M–$" + max / 1e6 + "M");
  } else if (containsTerm(q, "under") && money.length === 1) {
    results = results.filter((l) => l.raiseUsd <= money[0]);
    parts.push("ticket: ≤$" + money[0] / 1e6 + "M");
  }

  if (["government", "gov-backed", "sovereign"].some((term) => containsTerm(q, term))) {
    results = results.filter((l) => l.governmentBacked);
    parts.push("government-backed only");
  }
  if (["esg", "impact"].some((term) => containsTerm(q, term))) {
    results = results.filter((l) => l.scores.esg >= 85);
    parts.push("ESG ≥ 85");
  }
  if (containsTerm(q, "verified")) {
    results = results.filter((l) => l.verified);
    parts.push("verified only");
  }
  if (containsTerm(q, "west africa")) {
    results = results.filter((l) => ["Nigeria", "Senegal"].includes(l.country));
    parts.push("region: West Africa");
  } else if (containsTerm(q, "africa")) {
    parts.push("region: Africa");
  }

  const understood = parts.length > 0;
  if (!understood) results = [];
  // Concept guard: if nothing recognizable was parsed, do not return the
  // entire corpus — surface that the query has no supported criteria.
  if (parts.length === 0) {
    return NextResponse.json({
      results: [],
      interpretation:
        "No recognized investment criteria (sector, geography, ticket size, backing, ESG). Try e.g. \"renewable energy in Africa between $20M and $100M\".",
      unrecognized: true,
      originalQuery: q,
    });
  }

  results.sort((a, b) => b.scores.match - a.scores.match);
  return NextResponse.json({
    results,
    interpretation: parts.length
      ? parts.join(" · ")
      : "No reliable investment criteria detected. Refine the sector, geography, ticket size, or structure.",
    needsClarification: !understood,
  });
}
