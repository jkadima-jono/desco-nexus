import assert from "node:assert/strict";
import test from "node:test";
import { PRIVATE_ROBOT_PATHS, PRIVATE_ROUTE_ROBOTS } from "../src/lib/private-metadata";

test("authenticated route boundaries are explicitly non-indexable", () => {
  assert.equal(PRIVATE_ROUTE_ROBOTS.index, false);
  assert.equal(PRIVATE_ROUTE_ROBOTS.follow, false);
  assert.equal(PRIVATE_ROUTE_ROBOTS.nocache, true);
  assert.deepEqual(PRIVATE_ROUTE_ROBOTS.googleBot, { index: false, follow: false, noimageindex: true });
});

test("robots exclusions cover authentication and workspace routes", () => {
  for (const path of ["/admin/", "/api/", "/deals/", "/mandates/", "/match/", "/messages/", "/portfolio/", "/saved/", "/sponsor/", "/submit-project/"]) {
    assert.ok(PRIVATE_ROBOT_PATHS.includes(path as never), path);
  }
});
