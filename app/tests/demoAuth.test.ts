import { test } from "node:test";
import assert from "node:assert/strict";
import { isDemoAuthEnabled } from "../src/lib/demoAuth";

test("demo authentication is available in development and preview", () => {
  assert.equal(isDemoAuthEnabled({ nodeEnv: "development" }), true);
  assert.equal(
    isDemoAuthEnabled({ nodeEnv: "production", vercelEnv: "preview" }),
    true
  );
});

test("production demo authentication stays disabled without explicit approval", () => {
  assert.equal(
    isDemoAuthEnabled({ nodeEnv: "production", vercelEnv: "production" }),
    false
  );
  assert.equal(
    isDemoAuthEnabled({
      nodeEnv: "production",
      vercelEnv: "production",
      explicitFlag: "false",
    }),
    false
  );
});

test("the explicit flag activates demo personas in production", () => {
  assert.equal(
    isDemoAuthEnabled({
      nodeEnv: "production",
      vercelEnv: "production",
      explicitFlag: "true",
    }),
    true
  );
});
