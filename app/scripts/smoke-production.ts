import { PUBLIC_OPPORTUNITY_IDS } from "../src/lib/public-listings";

async function main() {

const baseUrl = new URL(process.env.SMOKE_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "");

if (baseUrl.protocol !== "https:") {
  throw new Error("Set SMOKE_BASE_URL or NEXT_PUBLIC_SITE_URL to the HTTPS production origin.");
}

const publicRoutes = [
  "/",
  "/about",
  "/contact",
  "/diligence",
  "/opportunities",
  "/investors",
  "/legal",
  "/partners",
  "/pillars",
  "/pillars/agridesco",
  "/pillars/investdesco",
  "/pillars/phardesco",
  "/pillars/waterdesco",
  "/pricing",
  "/resources",
  "/sponsors",
  "/trust",
  ...PUBLIC_OPPORTUNITY_IDS.map((id) => `/project/${id}`),
  "/login",
  "/signup",
];

const routes = [
  ...publicRoutes,
  "/api/health/live",
  "/api/health/ready",
  "/robots.txt",
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
    if (route === "/") {
      for (const header of ["content-security-policy", "strict-transport-security", "x-content-type-options", "referrer-policy", "permissions-policy"]) {
        if (!response.headers.has(header)) failures.push(`${route}: ${header} response header missing`);
      }
    }
    if (route === "/investors" && (!body.includes("DESCO Compass") || body.includes("This page could not be loaded"))) {
      failures.push(`${route}: investor pathway content missing or error boundary rendered`);
    }
    if (route === "/project/kasaji-kisenge-solar-50mw" && !body.includes("Kasaji")) {
      failures.push(`${route}: Kasaji project content missing`);
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

for (const locale of ["en", "fr", "es", "pt", "zh"]) {
  for (const route of publicRoutes) {
    try {
      const response = await fetch(new URL(route, baseUrl), {
        redirect: "follow",
        headers: {
          cookie: `nexus_locale=${locale}`,
          "user-agent": "DESCO-Compass-release-check/1.0",
        },
      });
      const body = await response.text();
      if (!response.ok || /This page could not be loaded|Cette page n.a pas pu être chargée|Esta página no se pudo cargar|Esta página não pôde ser carregada|此页面无法加载/.test(body)) {
        failures.push(`${route} [${locale}]: HTTP ${response.status} or error boundary rendered`);
      }
    } catch (error) {
      failures.push(`${route} [${locale}]: ${error instanceof Error ? error.message : "request failed"}`);
    }
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
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
