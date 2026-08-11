import assert from "node:assert/strict";
import test from "node:test";
import { boundedString, sanitizeStringArray } from "../src/lib/mandate-input";

test("mandate text fields reject non-strings and enforce their storage boundary", () => {
  assert.equal(boundedString({ unexpected: true }, 20), "");
  assert.equal(boundedString(`  ${"x".repeat(30)}  `, 20), "x".repeat(20));
});

test("mandate criteria accept only bounded non-empty strings", () => {
  const values = ["  infrastructure  ", "", 42, "x".repeat(200), ...Array(25).fill("water")];
  const sanitized = sanitizeStringArray(values, undefined, 40);
  assert.equal(sanitized[0], "infrastructure");
  assert.equal(sanitized[1], "x".repeat(40));
  assert.equal(sanitized.length, 20);
  assert.ok(sanitized.every((value) => value.length <= 40));
});

test("mandate allowlists are enforced after normalization", () => {
  assert.deepEqual(sanitizeStringArray([" Energy ", "Unknown"], ["Energy"]), ["Energy"]);
});
