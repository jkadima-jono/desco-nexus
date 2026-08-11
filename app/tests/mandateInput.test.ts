import assert from "node:assert/strict";
import test from "node:test";
import { boundedString, nonNegativeFiniteNumber, sanitizeStringArray } from "../src/lib/request-input";

test("mandate text fields reject non-strings and enforce their storage boundary", () => {
  assert.equal(boundedString({ unexpected: true }, 20), "");
  assert.equal(boundedString(`  ${"x".repeat(30)}  `, 20), "x".repeat(20));
});

test("public request text guards reject object and numeric payloads", () => {
  assert.equal(boundedString(42, 150), "");
  assert.equal(boundedString(["unexpected"], 150), "");
  assert.equal(boundedString("  valid text  ", 150), "valid text");
});

test("financial input guards accept only finite non-negative numbers", () => {
  assert.equal(nonNegativeFiniteNumber(1250000), 1250000);
  assert.equal(nonNegativeFiniteNumber(-50), 0);
  assert.equal(nonNegativeFiniteNumber(Number.POSITIVE_INFINITY), null);
  assert.equal(nonNegativeFiniteNumber("1250000"), null);
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
