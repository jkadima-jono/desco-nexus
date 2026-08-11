import assert from "node:assert/strict";
import test from "node:test";
import { boundedInteger, boundedString, nonNegativeFiniteNumber, sanitizeStringArray, strictBoolean } from "../src/lib/request-input";

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

test("integer guards protect database number ranges", () => {
  assert.equal(boundedInteger(12.6, 1, 100), 13);
  assert.equal(boundedInteger(-5, 1, 100), 1);
  assert.equal(boundedInteger(500, 1, 100), 100);
  assert.equal(boundedInteger(Number.NaN, 1, 100), null);
});

test("boolean guards never treat the string false as true", () => {
  assert.equal(strictBoolean(true), true);
  assert.equal(strictBoolean(false), false);
  assert.equal(strictBoolean("true"), false);
  assert.equal(strictBoolean("false"), false);
  assert.equal(strictBoolean(1), false);
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
