import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { FALLBACK_ICON, PILLAR_ICON } from "../src/lib/theme";

const publicRoot = join(process.cwd(), "public");
const runtimeAssets = [
  "/brand/desco-compass-logo.jpg",
  "/brand/desco-compass-192.png",
  "/brand/desco-compass-512.png",
  "/brand/desco-compass-apple.png",
  FALLBACK_ICON,
  ...Object.values(PILLAR_ICON),
];

test("every configured Compass and legacy pillar logo exists and is non-empty", () => {
  for (const asset of new Set(runtimeAssets)) {
    const path = join(publicRoot, asset.replace(/^\//, ""));
    assert.equal(existsSync(path), true, `${asset} must exist under public`);
    assert.ok(statSync(path).size > 1_000, `${asset} must contain a real image`);
  }
});

test("the four legacy pillar identities remain mapped to distinct assets", () => {
  assert.deepEqual(Object.keys(PILLAR_ICON).sort(), ["agridesco", "investdesco", "phardesco", "waterdesco"]);
  assert.equal(new Set(Object.values(PILLAR_ICON)).size, 4);
});
