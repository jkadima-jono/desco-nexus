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
  "/resources/model-file",
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
const canonicalUrls = new Set<string>();

function canonicalFromHtml(body: string): string | null {
  return body.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1]
    ?? body.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1]
    ?? null;
}

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
    if (publicRoutes.includes(route) && route !== "/login" && route !== "/signup") {
      const canonical = canonicalFromHtml(body);
      if (!canonical) failures.push(`${route}: canonical link missing`);
      else canonicalUrls.add(canonical);
    }
    if (route === "/") {
      for (const header of ["content-security-policy", "strict-transport-security", "x-content-type-options", "referrer-policy", "permissions-policy"]) {
        if (!response.headers.has(header)) failures.push(`${route}: ${header} response header missing`);
      }
      for (const href of ["/investors", "/contact?topic=project-submission", "/diligence"]) {
        if (!body.includes(`href="${href.replace("&", "&amp;")}"`)) failures.push(`${route}: CTA target ${href} missing`);
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
    if (route === "/contact" && !body.includes("mailto:support@desco.global")) {
      failures.push(`${route}: paused-form email fallback missing`);
    }
  } catch (error) {
    failures.push(`${route}: ${error instanceof Error ? error.message : "request failed"}`);
  }
}

for (const canonical of canonicalUrls) {
  try {
    const canonicalUrl = new URL(canonical, baseUrl);
    const response = await fetch(canonicalUrl, {
      redirect: "follow",
      headers: { "user-agent": "DESCO-Compass-release-check/1.0" },
    });
    if (!response.ok) failures.push(`canonical ${canonicalUrl}: HTTP ${response.status}`);
  } catch (error) {
    failures.push(`canonical ${canonical}: ${error instanceof Error ? error.message : "request failed"}`);
  }
}

try {
  const response = await fetch(new URL("/submit-project", baseUrl), {
    redirect: "follow",
    headers: { "user-agent": "DESCO-Compass-release-check/1.0" },
  });
  const finalUrl = new URL(response.url);
  if (!response.ok || finalUrl.pathname !== "/contact" || finalUrl.searchParams.get("topic") !== "project-submission") {
    failures.push(`/submit-project: expected redirect to /contact?topic=project-submission, received ${finalUrl.pathname}${finalUrl.search}`);
  }
} catch (error) {
  failures.push(`/submit-project: ${error instanceof Error ? error.message : "request failed"}`);
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

  try {
    const response = await fetch(new URL("/not-a-real-route", baseUrl), {
      redirect: "manual",
      headers: {
        cookie: `nexus_locale=${locale}`,
        "user-agent": "DESCO-Compass-release-check/1.0",
      },
    });
    const body = await response.text();
    const expected404 = {
      en: "Page not found",
      fr: "Page introuvable",
      es: "Página no encontrada",
      pt: "Página não encontrada",
      zh: "页面未找到",
    }[locale];
    if (!expected404 || response.status !== 404 || !body.includes(expected404) || !body.includes(`<html lang="${locale}"`)) {
      failures.push(`/not-a-real-route [${locale}]: localized 404 contract failed`);
    }
  } catch (error) {
    failures.push(`/not-a-real-route [${locale}]: ${error instanceof Error ? error.message : "request failed"}`);
  }
}

for (const route of ["/api/account", "/api/saved", "/api/mandates"]) {
  try {
    const response = await fetch(new URL(route, baseUrl), {
      headers: { "user-agent": "DESCO-Compass-release-check/1.0" },
    });
    if (response.status !== 401) failures.push(`${route}: unauthenticated request returned HTTP ${response.status}, expected 401`);
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
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
