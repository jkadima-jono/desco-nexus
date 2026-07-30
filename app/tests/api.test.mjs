// Integration tests against a running dev server (BASE_URL, default localhost:3000).
// Run: node --test tests/api.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL?.trim();
const destructiveApproval = process.env.API_TEST_ALLOW_ISOLATED_DB === "I_UNDERSTAND_THIS_MUTATES_DATA";

function assertIsolatedTestEnvironment() {
  if (!TEST_DATABASE_URL || !destructiveApproval) {
    throw new Error(
      "API tests mutate data. Set TEST_DATABASE_URL and API_TEST_ALLOW_ISOLATED_DB=I_UNDERSTAND_THIS_MUTATES_DATA for an approved disposable database.",
    );
  }
  let databaseUrl;
  let baseUrl;
  try {
    databaseUrl = new URL(TEST_DATABASE_URL);
    baseUrl = new URL(BASE);
  } catch {
    throw new Error("TEST_DATABASE_URL and BASE_URL must be valid URLs.");
  }
  if (!["postgres:", "postgresql:"].includes(databaseUrl.protocol)) {
    throw new Error("TEST_DATABASE_URL must use an isolated Postgres database.");
  }
  const databaseIdentity = `${databaseUrl.hostname}${databaseUrl.pathname}`.toLowerCase();
  if (/(^|[._/-])(prod|production|primary|live)([._/-]|$)/.test(databaseIdentity)) {
    throw new Error("Refusing API tests: TEST_DATABASE_URL appears to identify a production database.");
  }
  if (!["localhost", "127.0.0.1", "::1"].includes(baseUrl.hostname)) {
    throw new Error("Refusing API tests: BASE_URL must be a local server.");
  }
  if (process.env.DATABASE_URL?.trim() !== TEST_DATABASE_URL) {
    throw new Error("DATABASE_URL must exactly match TEST_DATABASE_URL in the API-test process.");
  }
  if (process.env.TEST_DATABASE_ISOLATED !== "true") {
    throw new Error("Set TEST_DATABASE_ISOLATED=true only after confirming the database is disposable and has no production traffic.");
  }
}

assertIsolatedTestEnvironment();
const prisma = new PrismaClient();

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

async function prismaDealLookup(adminCookie, listingId) {
  const res = await fetch(BASE + "/api/deals?listingId=" + listingId, { headers: { cookie: adminCookie } });
  assert.equal(res.status, 200);
  const { deals } = await res.json();
  assert.ok(deals.length > 0, "expected a deal to exist for " + listingId);
  return deals[0];
}

// ---------- Security: unauthenticated access ----------
test("unverified email login is disabled", async () => {
  const res = await fetch(BASE + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "victim@example.com", fullName: "Impersonator" }),
  });
  assert.equal(res.status, 410);
  assert.equal(res.headers.get("set-cookie"), null);
});

test("unauthenticated API access is rejected", async () => {
  const cases = [
    ["GET", "/api/comments?listingId=port-de-ndomba"],
    ["POST", "/api/match", { listingId: "port-de-ndomba", action: "saved" }],
    ["POST", "/api/messages", { threadId: "t1", text: "hi" }],
    ["POST", "/api/documents"],
    ["POST", "/api/listings/port-de-ndomba/photos"],
    ["POST", "/api/ai/teaser", { listingId: "port-de-ndomba" }],
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
  const res = await fetch(BASE + "/project/port-de-ndomba");
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.ok(!html.includes("Investdesco Confidential Investment Memorandum"), "data-room filenames must be hidden");
  assert.ok(!html.includes("/api/documents/"), "document URLs must be hidden");
  assert.ok(!html.includes("your mandate") || html.includes("Sign in"), "no personalization signed out");
});

test("signed-out search results carry no personalized whyMatch", async () => {
  const res = await fetch(BASE + "/api/search?q=" + encodeURIComponent("port projects in DR Congo between $20M and $100M"));
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
  form.set("listingId", "port-de-ndomba");
  const up = await fetch(BASE + "/api/documents", {
    method: "POST", headers: { cookie }, body: form,
  });
  assert.equal(up.status, 403);

  const ph = new FormData();
  ph.set("file", new File(["x"], "x.png", { type: "image/png" }));
  const up2 = await fetch(BASE + "/api/listings/port-de-ndomba/photos", {
    method: "POST", headers: { cookie }, body: ph,
  });
  assert.equal(up2.status, 403);

  const tz = await fetch(BASE + "/api/ai/teaser", {
    method: "POST",
    headers: { cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ listingId: "port-de-ndomba" }),
  });
  assert.equal(tz.status, 403);
});

test("owner demo can generate teaser for own org listing; flagged for review", async () => {
  const cookie = await demoLogin("owner");
  const res = await fetch(BASE + "/api/ai/teaser", {
    method: "POST",
    headers: { cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ listingId: "comicordia-mining" }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.reviewRequired, true);
  assert.ok(Array.isArray(data.sources) && data.sources.length > 0);
});

test("owner cannot manage another org's listing (403)", async () => {
  const cookie = await demoLogin("owner"); // Comicordia Corporation only
  const res = await fetch(BASE + "/api/ai/teaser", {
    method: "POST",
    headers: { cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ listingId: "port-de-ndomba" }), // owned by Desco Global (Investdesco)
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

// ---------- Deal stage governance (Phase 4: 12-stage lifecycle) ----------
test("stage transitions validated against a nonexistent deal", async () => {
  const cookie = await demoLogin("admin");
  const skip = await fetch(BASE + "/api/deals/__nonexistent__", {
    method: "PATCH",
    headers: { cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ stage: "Interested" }),
  });
  assert.equal(skip.status, 404);
});

test("investor match action auto-advances a deal through the pipeline forward-only", async () => {
  // This test and the next drive a real Deal through a full forward
  // pipeline (Saved -> Interested -> ... -> Passed or Withdrawn), so
  // re-running the suite against the same dev.db without a reset finds
  // the deal already terminal. Reset first so both tests are idempotent
  // across repeated runs, not just within a single run.
  await prisma.deal.deleteMany({ where: { listingId: "port-de-kasenga" } });
  const investor = await demoLogin("investor");
  await fetch(BASE + "/api/match", {
    method: "POST", headers: { cookie: investor, "Content-Type": "application/json" },
    body: JSON.stringify({ listingId: "port-de-kasenga", action: "saved" }),
  });
  const interested = await fetch(BASE + "/api/match", {
    method: "POST", headers: { cookie: investor, "Content-Type": "application/json" },
    body: JSON.stringify({ listingId: "port-de-kasenga", action: "interested" }),
  });
  assert.equal(interested.status, 200);

  const admin = await demoLogin("admin");
  const deals = await prismaDealLookup(admin, "port-de-kasenga");
  assert.equal(deals.stage, "Interested", "deal should have advanced from Saved to Interested, not stayed or reset");

  // Re-sending "saved" (an earlier stage) must not regress a deal that's
  // already further along.
  await fetch(BASE + "/api/match", {
    method: "POST", headers: { cookie: investor, "Content-Type": "application/json" },
    body: JSON.stringify({ listingId: "port-de-kasenga", action: "saved" }),
  });
  const dealsAfter = await prismaDealLookup(admin, "port-de-kasenga");
  assert.equal(dealsAfter.stage, "Interested", "a later 'saved' action must not regress an already-Interested deal");
});

test("deal stage PATCH requires ownership authorization (not just any signed-in user)", async () => {
  const admin = await demoLogin("admin");
  const deal = await prismaDealLookup(admin, "port-de-kasenga");

  const outsider = await demoLogin("advisor");
  const res = await fetch(BASE + "/api/deals/" + deal.id, {
    method: "PATCH", headers: { cookie: outsider, "Content-Type": "application/json" },
    body: JSON.stringify({ stage: "Information Requested" }),
  });
  assert.equal(res.status, 403, "a user with no ownership relation to this deal's listing must be refused");
});

test("forward stage transitions advance one stage at a time; rollback and closed-lost require a reason", async () => {
  const admin = await demoLogin("admin");
  const deal = await prismaDealLookup(admin, "port-de-kasenga");

  const skipAhead = await fetch(BASE + "/api/deals/" + deal.id, {
    method: "PATCH", headers: { cookie: admin, "Content-Type": "application/json" },
    body: JSON.stringify({ stage: "Term Sheet" }),
  });
  assert.equal(skipAhead.status, 422, "cannot skip stages forward");

  const properStep = await fetch(BASE + "/api/deals/" + deal.id, {
    method: "PATCH", headers: { cookie: admin, "Content-Type": "application/json" },
    body: JSON.stringify({ stage: "Information Requested" }),
  });
  assert.equal(properStep.status, 200);

  const rollbackNoReason = await fetch(BASE + "/api/deals/" + deal.id, {
    method: "PATCH", headers: { cookie: admin, "Content-Type": "application/json" },
    body: JSON.stringify({ stage: "Interested" }),
  });
  assert.equal(rollbackNoReason.status, 422, "rollback without a reason must be refused");

  const droppedNoReason = await fetch(BASE + "/api/deals/" + deal.id, {
    method: "PATCH", headers: { cookie: admin, "Content-Type": "application/json" },
    body: JSON.stringify({ stage: "Passed or Withdrawn" }),
  });
  assert.equal(droppedNoReason.status, 422, "closed-lost outcome without a reason must be refused");

  const dropped = await fetch(BASE + "/api/deals/" + deal.id, {
    method: "PATCH", headers: { cookie: admin, "Content-Type": "application/json" },
    body: JSON.stringify({ stage: "Passed or Withdrawn", reason: "Sponsor unresponsive after 30 days" }),
  });
  assert.equal(dropped.status, 200, "Passed or Withdrawn must be reachable directly from an early active stage, not only adjacent ones");
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

test("ESG search does not rank projects using illustrative seed scores", async () => {
  const res = await fetch(
    BASE + "/api/search?q=" + encodeURIComponent("high ESG agriculture"),
  );
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.results.length, 0);
  assert.match(data.interpretation, /structured public evidence unavailable/i);
});

test("empty query rejected", async () => {
  const res = await fetch(BASE + "/api/search?q=");
  assert.equal(res.status, 400);
});

test("valid NL query parses sector, ticket and region", async () => {
  const res = await fetch(BASE + "/api/search?q=" + encodeURIComponent("port projects in DR Congo between $80M and $90M"));
  const data = await res.json();
  assert.match(data.interpretation, /Infrastructure/);
  assert.match(data.interpretation, /\$80M–\$90M/);
  assert.equal(data.results.length, 1); // Port de Ndomba ($85M) only, "port" keyword matches Infrastructure sector
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

// ---------- Portfolio & capital calls (docs/10 backlog) ----------
test("portfolio requires session", async () => {
  const res = await fetch(BASE + "/api/portfolio");
  assert.equal(res.status, 401);
});

test("capital call creation is sponsor-only and cross-org denied", async () => {
  const investor = await demoLogin("investor");
  const deniedNoDeal = await fetch(BASE + "/api/deals/anything/capital-calls", {
    method: "POST",
    headers: { cookie: investor, "Content-Type": "application/json" },
    body: JSON.stringify({ amountUsd: 1000000, purpose: "test", dueDate: "2026-12-01" }),
  });
  assert.equal(deniedNoDeal.status, 410);

  const owner = await demoLogin("owner"); // Comicordia Corporation
  const sanity = await fetch(BASE + "/api/portfolio", { headers: { cookie: owner } });
  assert.equal(sanity.status, 200); // session itself is valid
});

test("capital call rejects invalid amount and missing fields", async () => {
  const owner = await demoLogin("owner");
  const dealsRes = await fetch(BASE + "/api/portfolio", { headers: { cookie: owner } });
  assert.equal(dealsRes.status, 200);
  // Validation runs before the deal lookup would matter for a bogus id:
  const res = await fetch(BASE + "/api/deals/does-not-exist/capital-calls", {
    method: "POST",
    headers: { cookie: owner, "Content-Type": "application/json" },
    body: JSON.stringify({ amountUsd: -5, purpose: "", dueDate: "not-a-date" }),
  });
  assert.equal(res.status, 410);
});

test("sponsor investor CRM requires owner/admin role", async () => {
  const investor = await demoLogin("investor");
  const res = await fetch(BASE + "/api/sponsor/investors", { headers: { cookie: investor } });
  assert.equal(res.status, 403);
});

test("position detail 404s for a user with no position (no cross-user leakage)", async () => {
  const advisor = await demoLogin("advisor");
  const res = await fetch(BASE + "/api/portfolio/some-random-id", { headers: { cookie: advisor } });
  assert.equal(res.status, 404);
});

// ---------- Project submissions (Phase 1: project-owner onboarding) ----------
test("unauthenticated submission API access is rejected", async () => {
  const get = await fetch(BASE + "/api/submissions");
  assert.equal(get.status, 401);
  const post = await fetch(BASE + "/api/submissions", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "x" }),
  });
  assert.equal(post.status, 401);
});

test("cross-user submission access returns 404, and only admin can list the review queue", async () => {
  const a = await demoLogin("owner");
  const created = await fetch(BASE + "/api/submissions", {
    method: "POST", headers: { cookie: a, "Content-Type": "application/json" },
    body: JSON.stringify({ orgName: "Test Org", title: "Test Project" }),
  });
  assert.equal(created.status, 200);
  const { submission } = await created.json();

  const b = await demoLogin("advisor");
  const getAsB = await fetch(BASE + "/api/submissions/" + submission.id, { headers: { cookie: b } });
  assert.equal(getAsB.status, 404, "another user's submission must look nonexistent");
  const patchAsB = await fetch(BASE + "/api/submissions/" + submission.id, {
    method: "PATCH", headers: { cookie: b, "Content-Type": "application/json" }, body: JSON.stringify({ title: "hijacked" }),
  });
  assert.equal(patchAsB.status, 404);

  const investorQueue = await fetch(BASE + "/api/admin/submissions", { headers: { cookie: b } });
  assert.equal(investorQueue.status, 403, "non-admin cannot see the review queue");

  // cleanup
  await fetch(BASE + "/api/submissions/" + submission.id, { method: "DELETE", headers: { cookie: a } });
});

test("submission cannot be submitted for review until required fields are complete", async () => {
  const owner = await demoLogin("owner");
  const created = await fetch(BASE + "/api/submissions", {
    method: "POST", headers: { cookie: owner, "Content-Type": "application/json" },
    body: JSON.stringify({ orgName: "Incomplete Org" }),
  });
  const { submission } = await created.json();

  const submitAttempt = await fetch(BASE + "/api/submissions/" + submission.id, {
    method: "PATCH", headers: { cookie: owner, "Content-Type": "application/json" }, body: JSON.stringify({ action: "submit" }),
  });
  assert.equal(submitAttempt.status, 400);
  const body = await submitAttempt.json();
  assert.ok(Array.isArray(body.missing) && body.missing.length > 0);

  await fetch(BASE + "/api/submissions/" + submission.id, { method: "DELETE", headers: { cookie: owner } });
});

test("admin approval publishes a real listing; rejection requires a reason", async () => {
  // Approval publishes a real Listing row with no admin delete-listing
  // endpoint to retract it. This test writes to whatever DATABASE_URL the
  // server is running against, which may be the same shared database as a
  // live deployment — so it must clean up its own Listing/Organization
  // rows via Prisma directly rather than leaving them behind.
  const owner = await demoLogin("owner");
  const created = await fetch(BASE + "/api/submissions", {
    method: "POST", headers: { cookie: owner, "Content-Type": "application/json" },
    body: JSON.stringify({
      orgName: "Regression Test Sponsor " + Date.now(),
      ownershipStatement: "Sole developer of this test project.",
      title: "Regression Test Project " + Date.now(),
      country: "DR Congo", sector: "Agriculture", stage: "Feasibility complete",
      raiseUsd: 1_000_000, instrument: "equity",
      useOfFunds: "Equipment and working capital.",
      keyRisks: "Market and execution risk.",
      managementTeam: "Test management team.",
    }),
  });
  const { submission } = await created.json();
  const submitRes = await fetch(BASE + "/api/submissions/" + submission.id, {
    method: "PATCH", headers: { cookie: owner, "Content-Type": "application/json" }, body: JSON.stringify({ action: "submit" }),
  });
  assert.equal(submitRes.status, 200);

  const admin = await demoLogin("admin");
  const rejectNoReason = await fetch(BASE + "/api/admin/submissions/" + submission.id, {
    method: "PATCH", headers: { cookie: admin, "Content-Type": "application/json" }, body: JSON.stringify({ action: "reject" }),
  });
  assert.equal(rejectNoReason.status, 400, "rejection without a reason must be refused");

  const approve = await fetch(BASE + "/api/admin/submissions/" + submission.id, {
    method: "PATCH", headers: { cookie: admin, "Content-Type": "application/json" }, body: JSON.stringify({ action: "approve" }),
  });
  assert.equal(approve.status, 200);
  const { listingId } = await approve.json();
  assert.ok(listingId);
  const publicPage = await fetch(BASE + "/project/" + listingId);
  assert.equal(publicPage.status, 200, "approved submission is publicly viewable as a real listing");

  const publishedListing = await prisma.listing.findUnique({ where: { id: listingId } });
  await prisma.listing.delete({ where: { id: listingId } });
  await prisma.organization.delete({ where: { id: publishedListing.orgId } });
});

// ---------- Phase 2: transparent matching ----------
test("unauthenticated match-feedback is rejected", async () => {
  const res = await fetch(BASE + "/api/match/feedback", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ listingId: "port-de-ndomba", reason: "too small" }),
  });
  assert.equal(res.status, 401);
});

test("match feedback cannot be attributed to another user's mandate", async () => {
  const owner = await demoLogin("investor");
  const mandateRes = await fetch(BASE + "/api/mandates", {
    method: "POST", headers: { cookie: owner, "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Feedback test mandate", query: "" }),
  });
  const { mandate } = await mandateRes.json();

  const other = await demoLogin("advisor");
  const feedbackRes = await fetch(BASE + "/api/match/feedback", {
    method: "POST", headers: { cookie: other, "Content-Type": "application/json" },
    body: JSON.stringify({ listingId: "port-de-ndomba", mandateId: mandate.id, reason: "Ticket size too small for our fund" }),
  });
  assert.equal(feedbackRes.status, 200);
  const { feedback } = await feedbackRes.json();
  assert.equal(feedback.mandateId, null, "mandateId owned by a different user must be silently dropped, not trusted");

  await fetch(BASE + "/api/mandates?id=" + mandate.id, { method: "DELETE", headers: { cookie: owner } });
});

test("info_requested is a valid match action distinct from interested/pass/saved", async () => {
  const investor = await demoLogin("investor");
  const res = await fetch(BASE + "/api/match", {
    method: "POST", headers: { cookie: investor, "Content-Type": "application/json" },
    body: JSON.stringify({
      listingId: "port-de-ndomba",
      action: "info_requested",
      acknowledgedRestrictedAccess: true,
      noticeVersion: "restricted-access-2026-07-30",
    }),
  });
  assert.equal(res.status, 200);

  // info_requested maps to its own pipeline stage (ACTION_STAGE in
  // /api/match/route.ts), same as interested/saved/dataroom_requested —
  // it opens/advances a deal, just into "Information Requested" rather
  // than being coalesced into "Interested".
  const admin = await demoLogin("admin");
  const deal = await prismaDealLookup(admin, "port-de-ndomba");
  assert.equal(deal.stage, "Information Requested", "info_requested must land the deal on its own distinct stage");
});

// ---------- Phase 3: saved opportunities & collections ----------
test("unauthenticated access to saved/collections is rejected", async () => {
  const cases = [
    ["GET", "/api/saved"],
    ["PATCH", "/api/saved/anything", { notes: "x" }],
    ["DELETE", "/api/saved/anything"],
    ["GET", "/api/collections"],
    ["POST", "/api/collections", { name: "x" }],
    ["DELETE", "/api/collections?id=anything"],
  ];
  for (const [method, path, body] of cases) {
    const res = await fetch(BASE + path, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    assert.equal(res.status, 401, method + " " + path + " must require auth");
  }
});

test("saving via /api/match upserts a SavedOpportunity, listed and editable via /api/saved", async () => {
  const investor = await demoLogin("investor");
  const saveRes = await fetch(BASE + "/api/match", {
    method: "POST", headers: { cookie: investor, "Content-Type": "application/json" },
    body: JSON.stringify({ listingId: "comicordia-agri", action: "saved" }),
  });
  assert.equal(saveRes.status, 200);

  const listRes = await fetch(BASE + "/api/saved", { headers: { cookie: investor } });
  assert.equal(listRes.status, 200);
  const { saved } = await listRes.json();
  const entry = saved.find((s) => s.listingId === "comicordia-agri");
  assert.ok(entry, "saved opportunity must appear in GET /api/saved");

  const patchRes = await fetch(BASE + "/api/saved/" + entry.id, {
    method: "PATCH", headers: { cookie: investor, "Content-Type": "application/json" },
    body: JSON.stringify({ notes: "Follow up next quarter", tags: ["priority", "infra"] }),
  });
  assert.equal(patchRes.status, 200);
  const { saved: updated } = await patchRes.json();
  assert.equal(updated.notes, "Follow up next quarter");
  assert.deepEqual(JSON.parse(updated.tags), ["priority", "infra"]);

  const delRes = await fetch(BASE + "/api/saved/" + entry.id, { method: "DELETE", headers: { cookie: investor } });
  assert.equal(delRes.status, 200);
  const listAfter = await (await fetch(BASE + "/api/saved", { headers: { cookie: investor } })).json();
  assert.ok(!listAfter.saved.find((s) => s.listingId === "comicordia-agri"), "unsave must remove the row");
});

test("saved opportunities and collections are isolated per user (404, not leaked)", async () => {
  const owner = await demoLogin("investor");
  const saveRes = await fetch(BASE + "/api/match", {
    method: "POST", headers: { cookie: owner, "Content-Type": "application/json" },
    body: JSON.stringify({ listingId: "comicordia-agri", action: "saved" }),
  });
  assert.equal(saveRes.status, 200);
  const { saved } = await (await fetch(BASE + "/api/saved", { headers: { cookie: owner } })).json();
  const entry = saved.find((s) => s.listingId === "comicordia-agri");

  const colRes = await fetch(BASE + "/api/collections", {
    method: "POST", headers: { cookie: owner, "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Isolation test collection" }),
  });
  const { collection } = await colRes.json();

  const outsider = await demoLogin("advisor");
  const patchAttempt = await fetch(BASE + "/api/saved/" + entry.id, {
    method: "PATCH", headers: { cookie: outsider, "Content-Type": "application/json" },
    body: JSON.stringify({ notes: "hijacked" }),
  });
  assert.equal(patchAttempt.status, 404, "another user must not be able to PATCH someone else's saved opportunity");

  const deleteAttempt = await fetch(BASE + "/api/collections?id=" + collection.id, {
    method: "DELETE", headers: { cookie: outsider },
  });
  assert.equal(deleteAttempt.status, 404, "another user must not be able to delete someone else's collection");

  await fetch(BASE + "/api/saved/" + entry.id, { method: "DELETE", headers: { cookie: owner } });
  await fetch(BASE + "/api/collections?id=" + collection.id, { method: "DELETE", headers: { cookie: owner } });
});

test("creating a collection with a name that already exists returns the existing one, not a duplicate", async () => {
  const investor = await demoLogin("investor");
  const first = await (await fetch(BASE + "/api/collections", {
    method: "POST", headers: { cookie: investor, "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Dedup test collection" }),
  })).json();
  const second = await (await fetch(BASE + "/api/collections", {
    method: "POST", headers: { cookie: investor, "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Dedup test collection" }),
  })).json();
  assert.equal(first.collection.id, second.collection.id, "duplicate collection name must dedup, not create a second row");

  await fetch(BASE + "/api/collections?id=" + first.collection.id, { method: "DELETE", headers: { cookie: investor } });
});

test("deleting a collection un-groups its saved items instead of deleting them", async () => {
  const investor = await demoLogin("investor");
  const { collection } = await (await fetch(BASE + "/api/collections", {
    method: "POST", headers: { cookie: investor, "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Cascade test collection" }),
  })).json();

  await fetch(BASE + "/api/match", {
    method: "POST", headers: { cookie: investor, "Content-Type": "application/json" },
    body: JSON.stringify({ listingId: "comicordia-agri", action: "saved" }),
  });
  const { saved } = await (await fetch(BASE + "/api/saved", { headers: { cookie: investor } })).json();
  const entry = saved.find((s) => s.listingId === "comicordia-agri");
  await fetch(BASE + "/api/saved/" + entry.id, {
    method: "PATCH", headers: { cookie: investor, "Content-Type": "application/json" },
    body: JSON.stringify({ collectionId: collection.id }),
  });

  await fetch(BASE + "/api/collections?id=" + collection.id, { method: "DELETE", headers: { cookie: investor } });

  const after = await (await fetch(BASE + "/api/saved", { headers: { cookie: investor } })).json();
  const survivingEntry = after.saved.find((s) => s.listingId === "comicordia-agri");
  assert.ok(survivingEntry, "the saved opportunity must survive its collection being deleted");
  assert.equal(survivingEntry.collectionId, null, "the saved opportunity must be un-grouped, not orphaned with a dangling collectionId");

  await fetch(BASE + "/api/saved/" + entry.id, { method: "DELETE", headers: { cookie: investor } });
});

// ---------- Phase 5: secure data rooms ----------
test("unauthenticated access to data-room endpoints is rejected", async () => {
  const cases = [
    ["GET", "/api/listings/comicordia-agri/dataroom"],
    ["POST", "/api/listings/comicordia-agri/dataroom", { userId: "x" }],
    ["DELETE", "/api/listings/comicordia-agri/dataroom?userId=x"],
    ["GET", "/api/listings/comicordia-agri/dataroom/log"],
    ["GET", "/api/documents/anything"],
  ];
  for (const [method, path, body] of cases) {
    const res = await fetch(BASE + path, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    assert.equal(res.status, 401, method + " " + path + " must require auth");
  }
});

test("only the listing's own org (or admin) can manage its data room", async () => {
  const outsider = await demoLogin("advisor");
  const getRes = await fetch(BASE + "/api/listings/comicordia-agri/dataroom", { headers: { cookie: outsider } });
  assert.equal(getRes.status, 403);
  const postRes = await fetch(BASE + "/api/listings/comicordia-agri/dataroom", {
    method: "POST", headers: { cookie: outsider, "Content-Type": "application/json" },
    body: JSON.stringify({ userId: "someone" }),
  });
  assert.equal(postRes.status, 403);
  const logRes = await fetch(BASE + "/api/listings/comicordia-agri/dataroom/log", { headers: { cookie: outsider } });
  assert.equal(logRes.status, 403);
});

test("only investor/admin roles may trigger a data-room request", async () => {
  const owner = await demoLogin("owner");
  const res = await fetch(BASE + "/api/match", {
    method: "POST", headers: { cookie: owner, "Content-Type": "application/json" },
    body: JSON.stringify({ listingId: "port-de-ndomba", action: "dataroom_requested" }),
  });
  assert.equal(res.status, 403, "an owner-role user requesting data-room access on someone else's listing must be refused");
});

test("restricted information actions require the current explicit acknowledgement", async () => {
  const investor = await demoLogin("investor");
  const missing = await fetch(BASE + "/api/match", {
    method: "POST",
    headers: { cookie: investor, "Content-Type": "application/json" },
    body: JSON.stringify({ listingId: "comicordia-agri", action: "dataroom_requested" }),
  });
  assert.equal(missing.status, 428);
  const stale = await fetch(BASE + "/api/match", {
    method: "POST",
    headers: { cookie: investor, "Content-Type": "application/json" },
    body: JSON.stringify({
      listingId: "comicordia-agri",
      action: "dataroom_requested",
      acknowledgedRestrictedAccess: true,
      noticeVersion: "stale-notice",
    }),
  });
  assert.equal(stale.status, 428);
});

test("data-room access is request-then-grant, not automatic, and is per-investor", async () => {
  const investor = await demoLogin("investor");
  const requestRes = await fetch(BASE + "/api/match", {
    method: "POST", headers: { cookie: investor, "Content-Type": "application/json" },
    body: JSON.stringify({
      listingId: "comicordia-agri",
      action: "dataroom_requested",
      acknowledgedRestrictedAccess: true,
      noticeVersion: "restricted-access-2026-07-30",
    }),
  });
  assert.equal(requestRes.status, 200);

  // Requesting alone must not grant access — an anonymous document lookup
  // would still be 403 (auth boundary), proven indirectly via the owner's
  // requester list showing "granted: false" until an explicit grant happens.
  const owner = await demoLogin("owner");
  const listRes = await fetch(BASE + "/api/listings/comicordia-agri/dataroom", { headers: { cookie: owner } });
  assert.equal(listRes.status, 200);
  const { requesters } = await listRes.json();
  const entry = requesters.find((r) => r.email === "investor@demo.invalid");
  assert.ok(entry, "the requesting investor must appear in the sponsor's requester list");
  assert.equal(entry.granted, false, "a bare request must not auto-grant access");

  const grantRes = await fetch(BASE + "/api/listings/comicordia-agri/dataroom", {
    method: "POST", headers: { cookie: owner, "Content-Type": "application/json" },
    body: JSON.stringify({ userId: entry.userId }),
  });
  assert.equal(grantRes.status, 200);

  const afterGrant = await (await fetch(BASE + "/api/listings/comicordia-agri/dataroom", { headers: { cookie: owner } })).json();
  assert.equal(afterGrant.requesters.find((r) => r.userId === entry.userId).granted, true);

  const revokeRes = await fetch(BASE + "/api/listings/comicordia-agri/dataroom?userId=" + entry.userId, {
    method: "DELETE", headers: { cookie: owner },
  });
  assert.equal(revokeRes.status, 200);

  const afterRevoke = await (await fetch(BASE + "/api/listings/comicordia-agri/dataroom", { headers: { cookie: owner } })).json();
  const revoked = afterRevoke.requesters.find((r) => r.userId === entry.userId);
  assert.equal(revoked.granted, false, "revoke must turn off access, not just log it");
  assert.equal(revoked.revoked, true);
});

// ---------- Phase 6: meeting scheduling ----------
test("unauthenticated access to meeting endpoints is rejected", async () => {
  const cases = [
    ["GET", "/api/meetings?listingId=comicordia-agri"],
    ["POST", "/api/meetings", { listingId: "comicordia-agri", proposedSlots: ["2027-01-01T10:00:00.000Z"] }],
    ["PATCH", "/api/meetings/anything", { status: "confirmed" }],
  ];
  for (const [method, path, body] of cases) {
    const res = await fetch(BASE + path, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    assert.equal(res.status, 401, method + " " + path + " must require auth");
  }
});

test("meeting request → sponsor confirm cycle, with isolation and terminal-state guards", async () => {
  await prisma.listing.update({
    where: { id: "waterdesco-grand-kasai" },
    data: { publicationStatus: "public_teaser" },
  });
  const investor = await demoLogin("investor");
  const slot = "2027-03-15T14:00:00.000Z";
  const createRes = await fetch(BASE + "/api/meetings", {
    method: "POST", headers: { cookie: investor, "Content-Type": "application/json" },
    body: JSON.stringify({
      listingId: "waterdesco-grand-kasai",
      proposedSlots: [slot, "2027-03-16T09:00:00.000Z"],
      note: "Kickoff call",
      acknowledgedRestrictedAccess: true,
      noticeVersion: "restricted-access-2026-07-30",
    }),
  });
  assert.equal(createRes.status, 200);
  const { meeting } = await createRes.json();
  assert.equal(meeting.status, "requested");

  // An unrelated investor must not see this request in their own list.
  const outsider = await demoLogin("advisor");
  const outsiderList = await (await fetch(BASE + "/api/meetings?listingId=waterdesco-grand-kasai", { headers: { cookie: outsider } })).json();
  assert.ok(!outsiderList.meetings.find((m) => m.id === meeting.id), "a non-sponsor, non-requester must not see another user's meeting request");

  // A non-sponsor cannot confirm it.
  const outsiderConfirm = await fetch(BASE + "/api/meetings/" + meeting.id, {
    method: "PATCH", headers: { cookie: outsider, "Content-Type": "application/json" },
    body: JSON.stringify({ status: "confirmed", confirmedSlot: slot }),
  });
  assert.equal(outsiderConfirm.status, 403);

  const owner = await demoLogin("admin");
  const ownerList = await (await fetch(BASE + "/api/meetings?listingId=waterdesco-grand-kasai", { headers: { cookie: owner } })).json();
  assert.ok(ownerList.meetings.find((m) => m.id === meeting.id), "the sponsor must see the request");

  // Confirming with a slot that wasn't proposed must be rejected.
  const badSlot = await fetch(BASE + "/api/meetings/" + meeting.id, {
    method: "PATCH", headers: { cookie: owner, "Content-Type": "application/json" },
    body: JSON.stringify({ status: "confirmed", confirmedSlot: "2099-01-01T00:00:00.000Z" }),
  });
  assert.equal(badSlot.status, 400);

  const confirmRes = await fetch(BASE + "/api/meetings/" + meeting.id, {
    method: "PATCH", headers: { cookie: owner, "Content-Type": "application/json" },
    body: JSON.stringify({ status: "confirmed", confirmedSlot: slot }),
  });
  assert.equal(confirmRes.status, 200);
  const { meeting: confirmed } = await confirmRes.json();
  assert.equal(confirmed.status, "confirmed");
  assert.equal(new Date(confirmed.confirmedSlot).toISOString(), slot);

  // A confirmed meeting is terminal — no further transitions.
  const doubleConfirm = await fetch(BASE + "/api/meetings/" + meeting.id, {
    method: "PATCH", headers: { cookie: owner, "Content-Type": "application/json" },
    body: JSON.stringify({ status: "declined" }),
  });
  assert.equal(doubleConfirm.status, 422);
});

// ---------- Deal pipeline visibility (cross-org leak fix) ----------
// /deals and /deals/[id] previously showed every sponsor's pipeline to
// any signed-in user regardless of role or org (owner names, next-step
// notes, amounts, due dates, decision notes). These tests prove that's
// closed: an unrelated org/role no longer sees another sponsor's deals,
// while the sponsor, the engaged investor, and admin still can.
test("/deals only shows sponsor-owned, investor-owned or explicitly assigned deals", async () => {
  const investor = await demoLogin("investor");
  await fetch(BASE + "/api/match", {
    method: "POST", headers: { cookie: investor, "Content-Type": "application/json" },
    body: JSON.stringify({ listingId: "port-de-ndomba", action: "interested" }),
  });
  await fetch(BASE + "/api/match", {
    method: "POST", headers: { cookie: investor, "Content-Type": "application/json" },
    body: JSON.stringify({ listingId: "comicordia-agri", action: "interested" }),
  });

  // Comicordia's own owner must see their own deal but not port-de-ndomba's
  // (a different org's listing).
  const owner = await demoLogin("owner");
  const ownerBoard = await (await fetch(BASE + "/deals", { headers: { cookie: owner } })).text();
  assert.ok(ownerBoard.includes("Comicordia"), "the sponsor must still see their own deal");
  assert.ok(!ownerBoard.includes("Port de Ndomba"), "a sponsor must not see another org's deal on the pipeline board");

  // An advisor with zero engagement must see neither.
  const advisor = await demoLogin("advisor");
  const advisorBoard = await (await fetch(BASE + "/deals", { headers: { cookie: advisor } })).text();
  assert.ok(!advisorBoard.includes("Port de Ndomba"), "an unrelated user must not see other sponsors' deals");
  assert.ok(!advisorBoard.includes("Comicordia"), "an unrelated user must not see other sponsors' deals");

  // The investor who actually engaged sees both of their own touched deals.
  const investorBoard = await (await fetch(BASE + "/deals", { headers: { cookie: investor } })).text();
  assert.ok(investorBoard.includes("Port de Ndomba"), "an investor must see deals for listings they've engaged with");
  assert.ok(investorBoard.includes("Comicordia"), "an investor must see deals for listings they've engaged with");

  // Admin remains unfiltered.
  const admin = await demoLogin("admin");
  const adminBoard = await (await fetch(BASE + "/deals", { headers: { cookie: admin } })).text();
  assert.ok(adminBoard.includes("Port de Ndomba") && adminBoard.includes("Comicordia"), "admin must remain unfiltered");
});

test("/deals/[id] 404s for a user with no relation to the deal (not a leaky 403)", async () => {
  const investor = await demoLogin("investor");
  await fetch(BASE + "/api/match", {
    method: "POST", headers: { cookie: investor, "Content-Type": "application/json" },
    body: JSON.stringify({ listingId: "port-de-ndomba", action: "interested" }),
  });

  const admin = await demoLogin("admin");
  const deal = await prismaDealLookup(admin, "port-de-ndomba");

  const owner = await demoLogin("owner"); // Comicordia — does not own port-de-ndomba
  const ownerRes = await fetch(BASE + "/deals/" + deal.id, { headers: { cookie: owner } });
  assert.equal(ownerRes.status, 404, "a sponsor from an unrelated org must get 404, not see the deal");

  const advisor = await demoLogin("advisor");
  const advisorRes = await fetch(BASE + "/deals/" + deal.id, { headers: { cookie: advisor } });
  assert.equal(advisorRes.status, 404, "a user with zero engagement must get 404");

  const investorRes = await fetch(BASE + "/deals/" + deal.id, { headers: { cookie: investor } });
  assert.equal(investorRes.status, 200, "the investor who actually engaged with this listing must be able to view it");

  const adminRes = await fetch(BASE + "/deals/" + deal.id, { headers: { cookie: admin } });
  assert.equal(adminRes.status, 200, "admin must always be able to view a deal");
});

test("two investors engaging the same listing cannot see each other's deal records", async () => {
  const firstCookie = await demoLogin("investor");
  await fetch(BASE + "/api/match", {
    method: "POST",
    headers: { cookie: firstCookie, "Content-Type": "application/json" },
    body: JSON.stringify({ listingId: "port-de-ndomba", action: "interested" }),
  });
  const firstUser = await prisma.user.findUniqueOrThrow({ where: { email: "investor@demo.invalid" } });

  const secondCookie = await demoLogin("advisor");
  const secondUser = await prisma.user.findUniqueOrThrow({ where: { email: "advisor@demo.invalid" } });
  await prisma.user.update({ where: { id: secondUser.id }, data: { role: "investor" } });
  const secondDeal = await prisma.deal.create({
    data: {
      listingId: "port-de-ndomba",
      investorId: secondUser.id,
      title: "SECOND INVESTOR PRIVATE RECORD",
      flag: "🇨🇩",
      amount: "Private",
      stage: "Interested",
      owner: "SI",
      nextStep: "Private second-investor action",
    },
  });
  try {
    const firstBoard = await (await fetch(BASE + "/deals", { headers: { cookie: firstCookie } })).text();
    assert.ok(!firstBoard.includes("SECOND INVESTOR PRIVATE RECORD"));
    const firstDetail = await fetch(BASE + "/deals/" + secondDeal.id, { headers: { cookie: firstCookie } });
    assert.equal(firstDetail.status, 404);

    const secondBoard = await (await fetch(BASE + "/deals", { headers: { cookie: secondCookie } })).text();
    assert.ok(secondBoard.includes("SECOND INVESTOR PRIVATE RECORD"));

    const firstDeal = await prisma.deal.findFirstOrThrow({
      where: { listingId: "port-de-ndomba", investorId: firstUser.id },
    });
    const secondCannotSeeFirst = await fetch(BASE + "/deals/" + firstDeal.id, { headers: { cookie: secondCookie } });
    assert.equal(secondCannotSeeFirst.status, 404);
  } finally {
    await prisma.deal.delete({ where: { id: secondDeal.id } });
    await prisma.user.update({ where: { id: secondUser.id }, data: { role: "advisor" } });
  }
});

// ---------- Phase 7: verification workflow ----------
test("unauthenticated and non-admin access to the verification workflow is rejected", async () => {
  const unauthGet = await fetch(BASE + "/api/admin/listings/comicordia-agri/verification");
  assert.equal(unauthGet.status, 401);
  const unauthPatch = await fetch(BASE + "/api/admin/listings/comicordia-agri/verification", {
    method: "PATCH", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "verify", note: "x" }),
  });
  assert.equal(unauthPatch.status, 401);

  const owner = await demoLogin("owner"); // Comicordia's own sponsor — still not admin
  const ownerRes = await fetch(BASE + "/api/admin/listings/comicordia-agri/verification", { headers: { cookie: owner } });
  assert.equal(ownerRes.status, 403, "only admin may access the verification workflow, not even the listing's own sponsor");
});

test("verify and unverify require a note, and record real reviewer identity", async () => {
  const admin = await demoLogin("admin");

  const noNote = await fetch(BASE + "/api/admin/listings/comicordia-agri/verification", {
    method: "PATCH", headers: { cookie: admin, "Content-Type": "application/json" },
    body: JSON.stringify({ action: "verify" }),
  });
  assert.equal(noNote.status, 400, "verify without a note must be rejected");

  const verifyRes = await fetch(BASE + "/api/admin/listings/comicordia-agri/verification", {
    method: "PATCH", headers: { cookie: admin, "Content-Type": "application/json" },
    body: JSON.stringify({ action: "verify", note: "Reviewed registry extract" }),
  });
  assert.equal(verifyRes.status, 200);
  const { listing } = await verifyRes.json();
  assert.equal(listing.verified, true);
  assert.equal(listing.verifiedBy, "Demo Administrator");
  assert.equal(listing.verificationNote, "Reviewed registry extract");
  assert.ok(listing.verifiedAt);

  // History is append-only and accumulates across runs against the same
  // dev.db, so assert on the newest entry, not an absolute length.
  const getRes = await fetch(BASE + "/api/admin/listings/comicordia-agri/verification", { headers: { cookie: admin } });
  const state = await getRes.json();
  const historyLenAfterVerify = state.history.length;
  const lastAfterVerify = state.history[historyLenAfterVerify - 1];
  assert.equal(lastAfterVerify.action, "verified");
  assert.equal(lastAfterVerify.by, "Demo Administrator");

  const unverifyNoNote = await fetch(BASE + "/api/admin/listings/comicordia-agri/verification", {
    method: "PATCH", headers: { cookie: admin, "Content-Type": "application/json" },
    body: JSON.stringify({ action: "unverify" }),
  });
  assert.equal(unverifyNoNote.status, 400, "unverify without a reason must be rejected");

  const unverifyRes = await fetch(BASE + "/api/admin/listings/comicordia-agri/verification", {
    method: "PATCH", headers: { cookie: admin, "Content-Type": "application/json" },
    body: JSON.stringify({ action: "unverify", note: "Registry extract expired, re-review needed" }),
  });
  assert.equal(unverifyRes.status, 200);
  const { listing: unverified } = await unverifyRes.json();
  assert.equal(unverified.verified, false);
  assert.equal(unverified.verifiedBy, null, "unverify must clear the reviewer attribution, not leave a stale claim");

  const finalState = await (await fetch(BASE + "/api/admin/listings/comicordia-agri/verification", { headers: { cookie: admin } })).json();
  assert.equal(finalState.history.length, historyLenAfterVerify + 1, "unverify must append exactly one new history entry");
  assert.equal(finalState.history[finalState.history.length - 1].action, "unverified");
});

test("gov-mechanism classification validates the mechanism and requires a note", async () => {
  const admin = await demoLogin("admin");

  const invalidMechanism = await fetch(BASE + "/api/admin/listings/comicordia-agri/verification", {
    method: "PATCH", headers: { cookie: admin, "Content-Type": "application/json" },
    body: JSON.stringify({ action: "set_gov_mechanism", governmentBacked: true, govMechanism: "not-a-real-mechanism", note: "x" }),
  });
  assert.equal(invalidMechanism.status, 400);

  const noNote = await fetch(BASE + "/api/admin/listings/comicordia-agri/verification", {
    method: "PATCH", headers: { cookie: admin, "Content-Type": "application/json" },
    body: JSON.stringify({ action: "set_gov_mechanism", governmentBacked: true, govMechanism: "guarantee" }),
  });
  assert.equal(noNote.status, 400);

  const res = await fetch(BASE + "/api/admin/listings/comicordia-agri/verification", {
    method: "PATCH", headers: { cookie: admin, "Content-Type": "application/json" },
    body: JSON.stringify({ action: "set_gov_mechanism", governmentBacked: true, govMechanism: "guarantee", note: "Reviewed executed guarantee instrument" }),
  });
  assert.equal(res.status, 200);
  const { listing } = await res.json();
  assert.equal(listing.governmentBacked, true);
  assert.equal(listing.govMechanism, "guarantee");

  // Turning governmentBacked off must clear the mechanism rather than
  // leaving a dangling classification.
  const clearRes = await fetch(BASE + "/api/admin/listings/comicordia-agri/verification", {
    method: "PATCH", headers: { cookie: admin, "Content-Type": "application/json" },
    body: JSON.stringify({ action: "set_gov_mechanism", governmentBacked: false, note: "Support instrument lapsed" }),
  });
  assert.equal(clearRes.status, 200);
  const { listing: cleared } = await clearRes.json();
  assert.equal(cleared.governmentBacked, false);
  assert.equal(cleared.govMechanism, null);
});

// ---------- Phase 8: AI features with controls ----------
test("unauthenticated access to AI generation endpoints is rejected", async () => {
  const teaserRes = await fetch(BASE + "/api/ai/teaser", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ listingId: "comicordia-agri" }),
  });
  assert.equal(teaserRes.status, 401);
  const draftRes = await fetch(BASE + "/api/ai/message-draft", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ threadId: "anything" }),
  });
  assert.equal(draftRes.status, 401);
});

test("teaser generation is honestly labeled and logged for admin oversight", async () => {
  const owner = await demoLogin("owner");
  const res = await fetch(BASE + "/api/ai/teaser", {
    method: "POST", headers: { cookie: owner, "Content-Type": "application/json" },
    body: JSON.stringify({ listingId: "comicordia-agri" }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  // No ANTHROPIC_API_KEY is configured in this environment, so this must
  // honestly report the offline-template path, not silently claim "claude".
  assert.equal(data.source, "template");
  assert.ok(data.teaser.includes("offline template"), "the teaser text itself must not overclaim AI authorship when none ran");

  const admin = await demoLogin("admin");
  const usagePage = await (await fetch(BASE + "/admin/ai-usage", { headers: { cookie: admin } })).text();
  assert.ok(usagePage.includes("Investment teaser"), "the generation must be logged for admin oversight");
  assert.ok(usagePage.includes("owner@demo.invalid"), "the log must attribute the generation to the real user, not be anonymous");
});

test("message draft generates real content per-thread, honestly labeled, and is logged", async () => {
  const investor = await demoLogin("investor");
  const investorUser = await prisma.user.findUniqueOrThrow({ where: { email: "investor@demo.invalid" } });
  const thread = await prisma.thread.create({
    data: { ownerId: investorUser.id, name: "AI Draft Test Sponsor", org: "AI Draft Test Sponsor", messages: { create: [{ sender: "them", text: "What is the diligence timeline?" }] } },
  });
  try {
    const res = await fetch(BASE + "/api/ai/message-draft", {
      method: "POST", headers: { cookie: investor, "Content-Type": "application/json" },
      body: JSON.stringify({ threadId: thread.id }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.source, "template", "no ANTHROPIC_API_KEY is configured in this environment");
    assert.ok(data.draft.length > 0);

    const advisor = await demoLogin("advisor");
    const forbiddenThread = await fetch(BASE + "/api/ai/message-draft", {
      method: "POST", headers: { cookie: advisor, "Content-Type": "application/json" },
      body: JSON.stringify({ threadId: thread.id }),
    });
    assert.equal(forbiddenThread.status, 404, "another user must not discover or use the investor's thread");

    const admin = await demoLogin("admin");
    const usagePage = await (await fetch(BASE + "/admin/ai-usage", { headers: { cookie: admin } })).text();
    assert.ok(usagePage.includes("Message draft"), "the message-draft generation must be logged");

    const missingThread = await fetch(BASE + "/api/ai/message-draft", {
      method: "POST", headers: { cookie: investor, "Content-Type": "application/json" },
      body: JSON.stringify({ threadId: "does-not-exist" }),
    });
    assert.equal(missingThread.status, 404);
  } finally {
    await prisma.message.deleteMany({ where: { threadId: thread.id } });
    await prisma.thread.delete({ where: { id: thread.id } });
  }
});

// ---------- Phase 9: pricing/revenue (plan assignment & entitlements) ----------
test("only admin may assign plans", async () => {
  const investor = await demoLogin("investor");
  const unauthRes = await fetch(BASE + "/api/admin/users/anything/plan", {
    method: "PATCH", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ planId: null }),
  });
  assert.equal(unauthRes.status, 401);

  const nonAdminRes = await fetch(BASE + "/api/admin/users/anything/plan", {
    method: "PATCH", headers: { cookie: investor, "Content-Type": "application/json" },
    body: JSON.stringify({ planId: null }),
  });
  assert.equal(nonAdminRes.status, 403);
});

test("/admin/users is an admin-only page", async () => {
  const investor = await demoLogin("investor");
  const usersRes = await fetch(BASE + "/admin/users", { headers: { cookie: investor }, redirect: "manual" });
  assert.ok([301, 302, 303, 307, 308].includes(usersRes.status), "non-admin must be redirected away from /admin/users");
});

test("Free plan caps active mandates at 3; Professional raises the limit", async () => {
  const investor = await demoLogin("investor");
  const admin = await demoLogin("admin");

  const investorRow = await prisma.user.findUnique({ where: { email: "investor@demo.invalid" } });
  assert.equal(investorRow.planId, null, "test assumes investor starts on the default Free plan");

  const created = [];
  try {
    for (let i = 0; i < 3; i++) {
      const res = await fetch(BASE + "/api/mandates", {
        method: "POST", headers: { cookie: investor, "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Plan limit test " + i, query: "" }),
      });
      assert.equal(res.status, 200, "Free plan must allow up to 3 active mandates");
      created.push((await res.json()).mandate.id);
    }
    const fourth = await fetch(BASE + "/api/mandates", {
      method: "POST", headers: { cookie: investor, "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Plan limit test 4", query: "" }),
    });
    assert.equal(fourth.status, 402, "a 4th active mandate must be rejected on the Free plan");

    const professional = await prisma.plan.findUnique({ where: { name: "Professional" } });
    const assignRes = await fetch(BASE + "/api/admin/users/" + investorRow.id + "/plan", {
      method: "PATCH", headers: { cookie: admin, "Content-Type": "application/json" },
      body: JSON.stringify({ planId: professional.id }),
    });
    assert.equal(assignRes.status, 200);

    const fourthAfterUpgrade = await fetch(BASE + "/api/mandates", {
      method: "POST", headers: { cookie: investor, "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Plan limit test 4b", query: "" }),
    });
    assert.equal(fourthAfterUpgrade.status, 200, "upgrading to Professional must raise the active-mandate cap");
    created.push((await fourthAfterUpgrade.json()).mandate.id);
  } finally {
    for (const id of created) {
      await fetch(BASE + "/api/mandates?id=" + id, { method: "DELETE", headers: { cookie: investor } });
    }
    await prisma.user.update({ where: { id: investorRow.id }, data: { planId: null } });
  }
});

test("Free plan caps saved collections at 1", async () => {
  const investor = await demoLogin("investor");
  const first = await fetch(BASE + "/api/collections", {
    method: "POST", headers: { cookie: investor, "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Plan limit collection 1" }),
  });
  assert.equal(first.status, 200);
  const { collection } = await first.json();

  const second = await fetch(BASE + "/api/collections", {
    method: "POST", headers: { cookie: investor, "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Plan limit collection 2" }),
  });
  assert.equal(second.status, 402, "a 2nd collection must be rejected on the Free plan");

  await fetch(BASE + "/api/collections?id=" + collection.id, { method: "DELETE", headers: { cookie: investor } });
});

// ---------- Phase 10: administration/analytics ----------
test("/admin dashboard is admin-only and rolls up real platform data", async () => {
  const investor = await demoLogin("investor");
  const nonAdminRes = await fetch(BASE + "/admin", { headers: { cookie: investor }, redirect: "manual" });
  assert.ok([301, 302, 303, 307, 308].includes(nonAdminRes.status), "non-admin must be redirected away from /admin");

  const admin = await demoLogin("admin");
  const adminRes = await fetch(BASE + "/admin", { headers: { cookie: admin } });
  assert.equal(adminRes.status, 200);
  const body = await adminRes.text();
  assert.ok(body.includes("Administration"));
  assert.ok(body.includes("Published listings"), "must roll up real listing counts, not a placeholder");
  assert.ok(body.includes("Assigned monthly scenario value"), "financial figures must stay honestly labeled as scenario-only");
});

test("cross-site state-changing requests are rejected", async () => {
  const res = await fetch(BASE + "/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://attacker.invalid" },
    body: JSON.stringify({}),
  });
  assert.equal(res.status, 403);
});

test("product events accept only the documented privacy-minimised contract", async () => {
  const invalid = await fetch(BASE + "/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: "arbitrary_tracking_event", path: "/" }),
  });
  assert.equal(invalid.status, 400);

  const path = "/test-product-event";
  const valid = await fetch(BASE + "/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: "page_view", path, context: { surface: "integration-test" } }),
  });
  assert.equal(valid.status, 204);
  const stored = await prisma.productEvent.findFirst({ where: { event: "page_view", path }, orderBy: { createdAt: "desc" } });
  assert.ok(stored);
  assert.equal(stored.context, JSON.stringify({ surface: "integration-test" }));
  await prisma.productEvent.delete({ where: { id: stored.id } });
});

test("organization contracts require admin approval and retain decision history", async () => {
  const investor = await demoLogin("investor");
  const organization = await prisma.organization.findFirstOrThrow();
  const plan = await prisma.plan.findFirstOrThrow({ orderBy: { sortOrder: "asc" } });
  const denied = await fetch(BASE + "/api/admin/contracts", {
    method: "POST",
    headers: { cookie: investor, "Content-Type": "application/json" },
    body: JSON.stringify({ orgId: organization.id, planId: plan.id }),
  });
  assert.equal(denied.status, 403);

  const admin = await demoLogin("admin");
  const createdRes = await fetch(BASE + "/api/admin/contracts", {
    method: "POST",
    headers: { cookie: admin, "Content-Type": "application/json" },
    body: JSON.stringify({ orgId: organization.id, planId: plan.id, currency: "usd", seatLimit: 10 }),
  });
  assert.equal(createdRes.status, 200);
  const { contract } = await createdRes.json();
  try {
    assert.equal(contract.status, "draft");
    const activeRes = await fetch(BASE + "/api/admin/contracts", {
      method: "PATCH",
      headers: { cookie: admin, "Content-Type": "application/json" },
      body: JSON.stringify({ id: contract.id, status: "active", note: "Approved for controlled pilot" }),
    });
    assert.equal(activeRes.status, 200);
    const active = await prisma.commercialContract.findUniqueOrThrow({ where: { id: contract.id } });
    assert.equal(active.status, "active");
    assert.ok(active.approvedBy);
    assert.ok(JSON.parse(active.history).length >= 2);
  } finally {
    await prisma.commercialContract.delete({ where: { id: contract.id } });
  }
});
