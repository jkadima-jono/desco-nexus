import assert from "node:assert/strict";
import test from "node:test";
import { listings } from "../src/lib/data";
import { projectDocumentSources } from "../src/lib/project-documents";
import { relatedPartyMetadata } from "../src/lib/related-parties";

test("project source manifest contains only controlled, project-linked records", () => {
  const listingIds = new Set(listings.map((listing) => listing.id));
  const keys = new Set<string>();

  for (const document of projectDocumentSources) {
    assert.ok(listingIds.has(document.listingId), `unknown listing ${document.listingId}`);
    assert.ok(!document.sourceRef.startsWith("/"), "source paths must remain relative");
    assert.ok(["desco_archive", "google_drive"].includes(document.sourceLibrary ?? "desco_archive"));
    assert.ok(["restricted", "internal"].includes(document.visibility));
    assert.ok(document.reviewNote.trim().length > 20);
    const key = `${document.listingId}:${document.sourceRef}`;
    assert.ok(!keys.has(key), `duplicate project source ${key}`);
    keys.add(key);
  }
});

test("source-rich projects have indexed project-room documents", () => {
  const covered = new Set(projectDocumentSources.map((document) => document.listingId));
  for (const listingId of [
    "port-de-ndomba",
    "port-de-kasenga",
    "comicordia-mining",
    "comicordia-agri",
    "manioc-plant",
    "phardesco-mbuji-mayi",
    "waterdesco-grand-kasai",
    "tilu-pepm-8252",
    "sciress-kolwezi-12423",
    "energulf-lotshi-block",
  ]) {
    assert.ok(covered.has(listingId), `${listingId} should have an indexed source`);
  }
});

test("DESCO relationships are explicit instead of inferred from names", () => {
  const sponsored = relatedPartyMetadata("waterdesco-grand-kasai");
  assert.equal(sponsored.relatedParty, true);
  assert.match(sponsored.relatedPartyType ?? "", /sponsor|development/i);

  const mandate = relatedPartyMetadata("sciress-kolwezi-12423");
  assert.equal(mandate.relatedParty, true);
  assert.match(mandate.relatedPartyType ?? "", /mandate|facilitation|advisory/i);

  const independent = relatedPartyMetadata("kasaji-kisenge-solar-50mw");
  assert.equal(independent.relatedParty, false);
});
