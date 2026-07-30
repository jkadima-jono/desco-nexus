import type { Listing } from "./data";
import { capitalPresentation } from "./data";
import { logOperationalEvent } from "./observability";

// Shared low-level Claude call. Returns null on any failure (missing key,
// network error, non-200, empty content) so every caller falls through to
// its own deterministic template — the product must work in offline demos.
async function callClaude(system: string, userContent: string): Promise<string | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  const timeoutMs = Math.max(2_000, Number(process.env.AI_REQUEST_TIMEOUT_MS) || 8_000);
  const model = process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-5";
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const startedAt = Date.now();
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
          signal: AbortSignal.timeout(timeoutMs),
          body: JSON.stringify({
            model,
            max_tokens: 1024,
            system,
            messages: [{ role: "user", content: userContent }],
          }),
        },
      );
      if (res.ok) {
        const data = (await res.json()) as { content: { type: string; text?: string }[] };
        logOperationalEvent("info", "ai.request.completed", { model, attempt, durationMs: Date.now() - startedAt });
        return data.content.find((block) => block.type === "text")?.text ?? null;
      }
      const transient = res.status === 429 || res.status >= 500;
      logOperationalEvent(transient ? "warn" : "error", "ai.request.rejected", {
        model, attempt, status: res.status, durationMs: Date.now() - startedAt,
      });
      if (!transient || attempt === 2) return null;
    } catch (error) {
      logOperationalEvent("warn", "ai.request.failed", {
        model,
        attempt,
        durationMs: Date.now() - startedAt,
        errorType: error instanceof Error ? error.name : "unknown",
      });
      if (attempt === 2) return null;
    }
    await new Promise((resolve) => setTimeout(resolve, 250 * attempt));
  }
  return null;
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
        raise: capitalPresentation(l).value,
        instrument: l.instrument,
        stage: l.stage,
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
    "**Terms sought.** " + capitalPresentation(l).value + " (" + capitalPresentation(l).label + ") via " + l.instrument +
      " · Stage: " + l.stage + ". No public return projection is published.",
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
