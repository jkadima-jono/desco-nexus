import assert from "node:assert/strict";
import test from "node:test";
import { documentMimeForExtension, safeDocumentName } from "../src/lib/document-upload";

test("document uploads use controlled MIME types", () => {
  assert.equal(documentMimeForExtension(".pdf"), "application/pdf");
  assert.equal(documentMimeForExtension(".JPG"), "image/jpeg");
  assert.equal(documentMimeForExtension(".unknown"), "application/octet-stream");
});

test("document names cannot inject paths or response headers", () => {
  assert.equal(safeDocumentName("../folder/report\r\nX-Test: injected.pdf", ".pdf"), "reportX-Test: injected.pdf");
  assert.equal(safeDocumentName("\u0000\r\n", ".pdf"), "document.pdf");
  assert.ok(safeDocumentName("x".repeat(300) + ".pdf", ".pdf").length <= 200);
});
