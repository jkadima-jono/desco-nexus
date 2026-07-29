import { test } from "node:test";
import assert from "node:assert/strict";
import { internalProjectId, projectHref, publicProjectId } from "../src/lib/project-slugs";

test("Agridesco uses its public name without changing the linked database record", () => {
  assert.equal(internalProjectId("agridesco-grand-kasai"), "comicordia-agri");
  assert.equal(publicProjectId("comicordia-agri"), "agridesco-grand-kasai");
  assert.equal(projectHref("comicordia-agri"), "/project/agridesco-grand-kasai");
});

test("other project identifiers remain unchanged", () => {
  assert.equal(internalProjectId("tilu-resources"), "tilu-resources");
  assert.equal(publicProjectId("tilu-resources"), "tilu-resources");
  assert.equal(projectHref("tilu-resources"), "/project/tilu-resources");
});
