import type { Listing } from "./data";
import { fmtUsd } from "./data";

// Real Claude call when ANTHROPIC_API_KEY is set; deterministic template
// otherwise so the product works in offline demos. See docs/03 §5.
export async function generateTeaser(l: Listing): Promise<{
  teaser: string;
  source: "claude" | "template";
}> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (key) {
    const res = await fetch(
      (process.env.ANTHROPIC_BASE_URL ?? "https://api.anthropic.com") +
        "/v1/messages",
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
          system:
            "You write concise, factual one-page investment teasers. Never invent numbers; use only supplied facts. Label output as an AI draft requiring sponsor verification.",
          messages: [
            {
              role: "user",
              content:
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
                }),
            },
          ],
        }),
      }
    );
    if (res.ok) {
      const data = (await res.json()) as {
        content: { type: string; text?: string }[];
      };
      const text = data.content.find((b) => b.type === "text")?.text;
      if (text) return { teaser: text, source: "claude" };
    }
    // fall through to template on API failure
  }

  const teaser = [
    "# " + l.title,
    "*Confidential teaser — AI draft, sponsor must verify all figures.*",
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
      (l.verified ? " — verified on DESCO Nexus." : "."),
    "",
    "*Full information memorandum and data room available to verified investors on DESCO Nexus.*",
  ].join("\n");
  return { teaser, source: "template" };
}
