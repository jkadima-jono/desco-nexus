import type { Listing } from "./data";
import { fmtUsd } from "./data";

// Shared low-level Claude call. Returns null on any failure (missing key,
// network error, non-200, empty content) so every caller falls through to
// its own deterministic template — the product must work in offline demos.
async function callClaude(system: string, userContent: string): Promise<string | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      (process.env.ANTHROPIC_BASE_URL ?? "https://api.anthropic.com") + "/v1/messages",
      {
        method: "POST",
        headers: {
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-5",
          max_tokens: 1024,
          system,
          messages: [{ role: "user", content: userContent }],
        }),
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { content: { type: string; text?: string }[] };
    return data.content.find((b) => b.type === "text")?.text ?? null;
  } catch {
    return null;
  }
}

// Real Claude call when ANTHROPIC_API_KEY is set; deterministic template
// otherwise so the product works in offline demos. See docs/03 §5.
export async function generateTeaser(l: Listing): Promise<{
  teaser: string;
  source: "claude" | "template";
}> {
  const claudeText = await callClaude(
    "You write concise, factual one-page investment teasers. Never invent numbers; use only supplied facts. Label output as an AI draft requiring sponsor verification.",
    "Write an investment teaser (markdown, ~250 words) for:\n" +
      JSON.stringify({
        title: l.title,
        sponsor: l.org,
        sector: l.sector,
        country: l.country,
        raise: fmtUsd(l.raiseUsd),
        instrument: l.instrument,
        stage: l.stage,
        returnProfile: l.irr,
        summary: l.summary,
        highlights: l.highlights,
      })
  );
  if (claudeText) return { teaser: claudeText, source: "claude" };

  const teaser = [
    "# " + l.title,
    "*Confidential teaser — auto-generated from listing facts (offline template, no AI model used). Sponsor must verify all figures.*",
    "",
    "**Opportunity.** " + l.summary,
    "",
    "**Investment highlights**",
    ...l.highlights.map((h) => "- " + h),
    "",
    "**Terms sought.** " + fmtUsd(l.raiseUsd) + " via " + l.instrument +
      " · Target return " + l.irr + " · Stage: " + l.stage + ".",
    "",
    "**Sponsor.** " + l.org + " (" + l.flag + " " + l.country + ")" +
      (l.verified ? " — a DESCO evidence review is recorded; inspect its scope and limitations." : "."),
    "",
    "*Restricted project materials, where available, require project-specific approval.*",
  ].join("\n");
  return { teaser, source: "template" };
}

// Drafts a reply for a message thread. Same honesty contract as the
// teaser: real Claude call when configured, a plain templated reply
// otherwise — never a hardcoded string presented as AI regardless of
// whether a model actually ran.
export async function generateMessageDraft(
  threadName: string,
  org: string,
  recentMessages: { from: "them" | "me" | "system"; text: string }[]
): Promise<{ draft: string; source: "claude" | "template" }> {
  const claudeText = await callClaude(
    "You draft short, professional reply messages for an investment-platform conversation. Never invent facts, figures, dates, or commitments not present in the conversation. Write only the reply body, no preamble.",
    "Draft a reply to " + threadName + " (" + org + "). Recent messages:\n" +
      JSON.stringify(recentMessages.slice(-10))
  );
  if (claudeText) return { draft: claudeText, source: "claude" };

  const draft =
    "Hello " + threadName + ", thank you for the update. Could you confirm the next diligence milestone and any action required from our team?";
  return { draft, source: "template" };
}
