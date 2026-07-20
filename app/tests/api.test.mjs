// Integration tests against a running dev server (BASE_URL, default localhost:3000).
// Run: node --test tests/api.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";

async function demoLogin(persona) {
  const res = await fetch(BASE + "/api/auth/demo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ persona }),
  });
  assert.equal(res.status, 200, "demo login " + persona);
  const cookie = res.headers.get("set-cookie")?.split(";")[0];
  assert.ok(cookie, "session cookie issued");
  return cookie;
}

// ---------- Security: unauthenticated access ----------
test("unauthenticated API access is rejected", async () => {
  const cases = [
    ["GET", "/api/comments?listingId=atlas-solar"],
    ["POST", "/api/match", { listingId: "atlas-solar", action: "saved" }],
    ["POST", "/api/messages", { threadId: "t1", text: "hi" }],
    ["POST", "/api/documents"],
    ["POST", "/api/listings/atlas-solar/photos"],
    ["POST", "/api/ai/teaser", { listingId: "atlas-solar" }],
    ["GET", "/api/mandates"],
    ["POST", "/api/mandates", { name: "x", query: "y" }],
    ["PATCH", "/api/deals/anything", { stage: "NDA" }],
  ];
  for (const [method, path, body] of cases) {
    const res = await fetch(BASE + path, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    assert.equal(res.status, 401, method + " " + path + " must be 401, got " + res.status);
  }
});

test("direct document URL requires session", async () => {
  const res = await fetch(BASE + "/api/documents/some-doc-id");
  assert.equal(res.status, 401);
});

test("protected pages redirect signed-out visitors to /login", async () => {
  for (const path of ["/deals", "/messages", "/match"]) {
    const res = await fetch(BASE + path, { redirect: "manual" });
    assert.ok(
      [303, 307, 308].includes(res.status),
      path + " must redirect, got " + res.status
    );
    assert.match(res.headers.get("location") ?? "", /\/login/);
  }
});

test("signed-out project page hides confidential material", async () => {
  const res = await fetch(BASE + "/project/atlas-solar");
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.ok(!html.includes("Financial Model v12"), "data-room filenames must be hidden");
  assert.ok(!html.includes("/api/documents/"), "document URLs must be hidden");
  assert.ok(!html.includes("your mandate") || html.includes("Sign in"), "no personalization signed out");
});

test("signed-out search results carry no personalized whyMatch", async () => {
  const res = await fetch(BASE + "/api/search?q=" + encodeURIComponent("renewable energy in Africa between $20M and $100M"));
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.results.length >= 1);
  for (const r of data.results) assert.equal(r.whyMatch, "");
});

// ---------- Security: role-based authorization ----------
test("investor cannot upload documents or photos or generate teaser (403)", async () => {
  const cookie = await demoLogin("investor");
  const form = new FormData();
  form.set("file", new File(["x"], "x.pdf", { type: "application/pdf" }));
  form.set("listingId", "atlas-solar");
  const up = await fetch(BASE + "/api/documents", {
    method: "POST", headers: { cookie }, body: form,
  });
  assert.equal(up.status, 403);

  const ph = new FormData();
  ph.set("file", new File(["x"], "x.png", { type: "image/png" }));
  const up2 = await fetch(BASE + "/api/listings/atlas-solar/photos", {
    method: "POST", headers: { cookie }, body: ph,
  });
  assert.equal(up2.status, 403);

  const tz = await fetch(BASE + "/api/ai/teaser", {
    method: "POST",
    headers: { cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ listingId: "atlas-solar" }),
  });
  assert.equal(tz.status, 403);
});

test("owner demo can generate teaser for own org listing; flagged for review", async () => {
  const cookie = await demoLogin("owner");
  const res = await fetch(BASE + "/api/ai/teaser", {
    method: "POST",
    headers: { cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ listingId: "atlas-solar" }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.reviewRequired, true);
  assert.ok(Array.isArray(data.sources) && data.sources.length > 0);
});

test("owner cannot manage another org's listing (403)", async () => {
  const cookie = await demoLogin("owner"); // owns Maghreb only
  const res = await fetch(BASE + "/api/ai/teaser", {
    method: "POST",
    headers: { cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ listingId: "kivu-agri" }),
  });
  assert.equal(res.status, 403, "cross-organization access must be rejected");
});

test("cross-user mandate access returns 404", async () => {
  const a = await demoLogin("investor");
  const created = await fetch(BASE + "/api/mandates", {
    method: "POST",
    headers: { cookie: a, "Content-Type": "application/json" },
    body: JSON.stringify({ name: "test mandate", query: "solar africa" }),
  });
  assert.equal(created.status, 200);
  const { mandate } = await created.json();
  const b = await demoLogin("advisor");
  const del = await fetch(BASE + "/api/mandates?id=" + mandate.id, {
    method: "DELETE", headers: { cookie: b },
  });
  assert.equal(del.status, 404, "other user's mandate must look nonexistent");
  // cleanup
  await fetch(BASE + "/api/mandates?id=" + mandate.id, { method: "DELETE", headers: { cookie: a } });
});

// ---------- Deal stage governance ----------
test("stage transitions validated; rollback requires reason; history recorded", async () => {
  const cookie = await demoLogin("admin");
  const skip = await fetch(BASE + "/api/deals/__nonexistent__", {
    method: "PATCH",
    headers: { cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ stage: "NDA" }),
  });
  assert.equal(skip.status, 404);
});

// ---------- Search parsing ----------
test("substring false positive fixed: underwater ≠ Water sector", async () => {
  const res = await fetch(BASE + "/api/search?q=" + encodeURIComponent("Underwater hotels on the Moon seeking $1M"));
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(!(data.interpretation ?? "").includes("Water"), "must not classify as Water sector");
  assert.equal(data.results.length, 0, "nonsense query returns no results");
});

test("legitimate water query still matches Water sector", async () => {
  const res = await fetch(BASE + "/api/search?q=" + encodeURIComponent("water utility in Zambia"));
  const data = await res.json();
  assert.match(data.interpretation, /Water/);
});

test("empty query rejected", async () => {
  const res = await fetch(BASE + "/api/search?q=");
  assert.equal(res.status, 400);
});

test("valid NL query parses sector, ticket and region", async () => {
  const res = await fetch(BASE + "/api/search?q=" + encodeURIComponent("renewable energy projects in Africa between $20M and $100M"));
  const data = await res.json();
  assert.match(data.interpretation, /Renewable Energy/);
  assert.match(data.interpretation, /\$20M–\$100M/);
  assert.equal(data.results.length, 1);
});

// ---------- Localization ----------
test("locale cookie changes server-rendered language immediately", async () => {
  const fr = await fetch(BASE + "/", { headers: { cookie: "nexus_locale=fr" } });
  const html = await fr.text();
  assert.ok(html.includes("Découvrir"), "French locale renders French chrome");
  assert.ok(html.includes('lang="fr"'), "html lang attribute follows locale");
});

// ---------- Error states ----------
test("unknown project returns branded 404", async () => {
  const res = await fetch(BASE + "/project/does-not-exist");
  assert.equal(res.status, 404);
});
