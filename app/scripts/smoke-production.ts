export {};

const baseUrl = new URL(process.env.SMOKE_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "");

if (baseUrl.protocol !== "https:") {
  throw new Error("Set SMOKE_BASE_URL or NEXT_PUBLIC_SITE_URL to the HTTPS production origin.");
}

const routes = [
  "/",
  "/opportunities",
  "/project/agridesco-grand-kasai",
  "/login",
  "/sitemap.xml",
];

const failures: string[] = [];

for (const route of routes) {
  try {
    const response = await fetch(new URL(route, baseUrl), {
      redirect: "follow",
      headers: { "user-agent": "DESCO-Compass-release-check/1.0" },
    });
    const finalUrl = new URL(response.url);
    if (finalUrl.hostname.endsWith("vercel.com") && finalUrl.pathname.includes("login")) {
      failures.push(`${route}: blocked by Vercel authentication`);
      continue;
    }
    if (!response.ok) {
      failures.push(`${route}: HTTP ${response.status}`);
      continue;
    }
    const body = await response.text();
    if (route === "/" && !body.includes("DESCO Compass")) {
      failures.push(`${route}: DESCO Compass identity missing`);
    }
    if (route === "/project/agridesco-grand-kasai" && !body.includes("Agridesco")) {
      failures.push(`${route}: Agridesco project content missing`);
    }
  } catch (error) {
    failures.push(`${route}: ${error instanceof Error ? error.message : "request failed"}`);
  }
}

if (failures.length > 0) {
  throw new Error(`Production smoke check failed:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
}

console.log(`Production routes verified at ${baseUrl.origin}.`);
