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
  "/api/health/live",
  "/api/health/ready",
  "/legal",
  "/contact",
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
    if (route === "/api/health/live" && !body.includes('"status":"live"')) {
      failures.push(`${route}: liveness contract missing`);
    }
    if (route === "/api/health/ready" && !body.includes('"status":"ready"')) {
      failures.push(`${route}: readiness contract missing`);
    }
  } catch (error) {
    failures.push(`${route}: ${error instanceof Error ? error.message : "request failed"}`);
  }
}

try {
  const response = await fetch(new URL("/api/auth/demo", baseUrl), {
    method: "POST",
    headers: { "content-type": "application/json", "user-agent": "DESCO-Compass-release-check/1.0" },
    body: JSON.stringify({ persona: "admin" }),
  });
  if (response.status !== 404) failures.push(`/api/auth/demo: administrator demo returned HTTP ${response.status}, expected 404`);
} catch (error) {
  failures.push(`/api/auth/demo: ${error instanceof Error ? error.message : "request failed"}`);
}

if (failures.length > 0) {
  throw new Error(`Production smoke check failed:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
}

console.log(`Production routes verified at ${baseUrl.origin}.`);
