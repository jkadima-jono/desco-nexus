import { test } from "node:test";
import assert from "node:assert/strict";
import { isDemoAdminEnabled, isDemoAuthEnabled } from "../src/lib/demoAuth";

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

test("an explicit flag cannot activate demo personas in production", () => {
  assert.equal(
    isDemoAuthEnabled({
      nodeEnv: "production",
      vercelEnv: "production",
      explicitFlag: "true",
    }),
    false
  );
});

test("the administrator persona is local-only", () => {
  assert.equal(isDemoAdminEnabled({ nodeEnv: "development" }), true);
  assert.equal(isDemoAdminEnabled({ nodeEnv: "production", vercelEnv: "preview" }), false);
  assert.equal(isDemoAdminEnabled({ nodeEnv: "production", vercelEnv: "production" }), false);
});
