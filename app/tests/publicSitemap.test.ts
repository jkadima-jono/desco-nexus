import assert from "node:assert/strict";
import test from "node:test";
import { PUBLIC_SITEMAP_ROUTES } from "../src/lib/public-sitemap";

test("public sitemap includes governed legal and preparation resources", () => {
  assert.ok(PUBLIC_SITEMAP_ROUTES.includes("/legal"));
  assert.ok(PUBLIC_SITEMAP_ROUTES.includes("/resources/model-file"));
  assert.equal(new Set(PUBLIC_SITEMAP_ROUTES).size, PUBLIC_SITEMAP_ROUTES.length);
});

test("public sitemap excludes authenticated workspace routes", () => {
  for (const route of ["/admin", "/deals", "/mandates", "/messages", "/portfolio", "/saved"]) {
    assert.ok(!PUBLIC_SITEMAP_ROUTES.includes(route as never), route);
  }
});
