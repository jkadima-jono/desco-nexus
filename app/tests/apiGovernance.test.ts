import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import test from "node:test";

const apiRoot = new URL("../src/app/api/", import.meta.url);

function routeFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return routeFiles(path);
    return entry.name === "route.ts" ? [path] : [];
  });
}

const unauthenticatedMutationRoutes = new Set([
  "auth/demo/route.ts",
  "auth/login/route.ts",
  "auth/logout/route.ts",
  "auth/verify/route.ts",
  "events/route.ts",
]);

test("every API mutation is authenticated or explicitly governed as a public write", () => {
  for (const file of routeFiles(apiRoot.pathname)) {
    const source = readFileSync(file, "utf8");
    if (!/export async function (?:POST|PUT|PATCH|DELETE)/.test(source)) continue;
    const route = relative(apiRoot.pathname, file);
    const authenticated = /getSessionUser\(|isDemoAuthEnabled\(/.test(source);
    assert.ok(authenticated || unauthenticatedMutationRoutes.has(route), route);
    if (!authenticated) {
      assert.match(source, /rejectUntrustedOrigin\(req\)/, `${route} origin control`);
      if (route !== "auth/logout/route.ts") {
        assert.match(source, /apply(?:Identifier)?RateLimit\(/, `${route} rate limit`);
      }
    }
  }
});

test("every mutating admin route enforces an administrator review boundary", () => {
  for (const file of routeFiles(join(apiRoot.pathname, "admin"))) {
    const source = readFileSync(file, "utf8");
    if (!/export async function (?:POST|PUT|PATCH|DELETE)/.test(source)) continue;
    assert.match(source, /canReviewSubmissions\(|role !== "admin"/, relative(apiRoot.pathname, file));
  }
});

test("global middleware applies origin enforcement to every API route", () => {
  const middleware = readFileSync(new URL("../src/middleware.ts", import.meta.url), "utf8");
  assert.match(middleware, /matcher:\s*"\/api\/:path\*"/);
  assert.match(middleware, /MUTATING_METHODS/);
  assert.match(middleware, /untrusted_origin/);
});
