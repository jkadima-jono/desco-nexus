import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const config = readFileSync(new URL("../next.config.ts", import.meta.url), "utf8");

test("browser connections remain same-origin unless a reviewed client integration is added", () => {
  assert.match(config, /connect-src 'self';/);
  assert.doesNotMatch(config, /connect-src[^;]*(?:anthropic|vercel-insights)/i);
});

test("baseline browser security headers remain configured", () => {
  for (const header of [
    "Content-Security-Policy",
    "Referrer-Policy",
    "X-Content-Type-Options",
    "X-Frame-Options",
    "Permissions-Policy",
    "Cross-Origin-Opener-Policy",
    "Cross-Origin-Resource-Policy",
    "Strict-Transport-Security",
  ]) {
    assert.match(config, new RegExp(`key: "${header}"`), header);
  }
  assert.match(config, /X-Robots-Tag/);
  assert.match(config, /noindex, nofollow, noarchive/);
});
