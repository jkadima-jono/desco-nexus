import { NextResponse } from "next/server";
import { prisma, toListing } from "@/lib/db";
import type { Listing } from "@/lib/data";
import { sanitizePublicListing } from "@/lib/data";
import { publicListingWhere } from "@/lib/public-listings";

// Matches Desco Global's real four pillars only (see lib/theme.ts
// SECTOR_TO_PILLAR) — no invented sectors like "Renewable Energy" or
// "Fintech" that no real listing carries.
const SECTOR_MAP: [string, string][] = [
  ["agri", "Agriculture"], ["farm", "Agriculture"], ["cassava", "Agriculture"],
  ["crop", "Agriculture"], ["food", "Agriculture"], ["agriculture", "Agriculture"],
  ["agricultura", "Agriculture"], ["農業", "Agriculture"], ["农业", "Agriculture"],
  ["infra", "Infrastructure"], ["port", "Infrastructure"], ["logistics", "Infrastructure"],
  ["gateway", "Infrastructure"], ["road", "Infrastructure"], ["infrastructure", "Infrastructure"],
  ["infraestructura", "Infrastructure"], ["infraestrutura", "Infrastructure"], ["基础设施", "Infrastructure"],
  ["energy", "Energy"], ["solar", "Energy"], ["power", "Energy"], ["electricity", "Energy"],
  ["énergie", "Energy"], ["energía", "Energy"], ["energia", "Energy"], ["能源", "Energy"],
  ["mining", "Mining"], ["mine", "Mining"], ["gold", "Mining"],
  ["diamond", "Mining"], ["concession", "Mining"], ["cobalt", "Mining"], ["copper", "Mining"],
  ["mines", "Mining"], ["minería", "Mining"], ["mineração", "Mining"], ["采矿", "Mining"],
  ["health", "Healthcare"], ["clinic", "Healthcare"], ["pharma", "Healthcare"],
  ["hospital", "Healthcare"], ["medicine", "Healthcare"], ["santé", "Healthcare"],
  ["salud", "Healthcare"], ["saúde", "Healthcare"], ["医疗", "Healthcare"],
  ["water", "Water"], ["sanitation", "Water"], ["eau", "Water"], ["agua", "Water"], ["água", "Water"], ["水务", "Water"],
];

const containsTerm = (query: string, term: string) => {
  if (/[^\x00-\x7F]/.test(term) && !/[A-Za-zÀ-ÿ]/.test(term)) {
    return query.includes(term.toLowerCase());
  }
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped.replace(/\\ /g, "\\s+")}\\b`, "i").test(query);
};

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.toLowerCase() ?? "";
  if (!q.trim()) {
    return NextResponse.json({ error: "q parameter required" }, { status: 400 });
  }

  const rows = await prisma.listing.findMany({ where: publicListingWhere, include: { org: true, images: true } });
  let results: Listing[] = rows.map(toListing).map(sanitizePublicListing);
  const parts: string[] = [];

  const sectors = [...new Set(SECTOR_MAP.filter(([k]) => containsTerm(q, k)).map(([, v]) => v))];
  if (sectors.length) {
    results = results.filter((l) => sectors.includes(l.sector));
    parts.push("sector: " + sectors.join("/"));
  }

  const money = [...q.matchAll(/\$?\s?(\d+(?:\.\d+)?)\s?m/g)].map((m) => parseFloat(m[1]) * 1e6);
  if (money.length >= 2) {
    const [min, max] = [Math.min(...money), Math.max(...money)];
    results = results.filter((l) => l.currentCapitalAskUsd != null && l.currentCapitalAskUsd >= min && l.currentCapitalAskUsd <= max);
    parts.push("ticket: $" + min / 1e6 + "M–$" + max / 1e6 + "M");
  } else if (["under", "moins", "menos", "abaixo"].some((term) => containsTerm(q, term)) && money.length === 1) {
    results = results.filter((l) => l.currentCapitalAskUsd != null && l.currentCapitalAskUsd > 0 && l.currentCapitalAskUsd <= money[0]);
    parts.push("ticket: ≤$" + money[0] / 1e6 + "M");
  }

  if (["government", "gov-backed", "sovereign"].some((term) => containsTerm(q, term))) {
    results = results.filter((l) => l.governmentBacked);
    parts.push("government-backed only");
  }
  if (["esg", "impact"].some((term) => containsTerm(q, term))) {
    results = [];
    parts.push("ESG evidence: structured public evidence unavailable");
  }
  if (containsTerm(q, "verified")) {
    results = results.filter((l) => l.verified);
    parts.push("verified only");
  }
  if (["drc", "rdc", "congo", "kasai", "kasaï", "刚果"].some((term) => containsTerm(q, term))) {
    results = results.filter((l) => l.country === "DR Congo");
    parts.push("region: DR Congo");
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
        "No recognized investment criteria (sector, geography, ticket size, backing, ESG). Try e.g. \"infrastructure in DR Congo between $20M and $100M\".",
      unrecognized: true,
      originalQuery: q,
    });
  }

  results.sort((a, b) => Number(b.updatedAt ?? 0) - Number(a.updatedAt ?? 0) || a.title.localeCompare(b.title));
  return NextResponse.json({
    results,
    interpretation: parts.length
      ? parts.join(" · ")
      : "No reliable investment criteria detected. Refine the sector, geography, ticket size, or structure.",
    needsClarification: !understood,
  });
}
