import test from "node:test";
import assert from "node:assert/strict";
import { hasValidImageSignature } from "../src/lib/image-upload";

test("image upload accepts matching JPEG, PNG and WebP signatures", () => {
  assert.equal(
    hasValidImageSignature(".jpg", "image/jpeg", new Uint8Array([0xff, 0xd8, 0xff])),
    true,
  );
  assert.equal(
    hasValidImageSignature(
      ".png",
      "image/png",
      new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    ),
    true,
  );
  assert.equal(
    hasValidImageSignature(
      ".webp",
      "image/webp",
      new Uint8Array([82, 73, 70, 70, 0, 0, 0, 0, 87, 69, 66, 80]),
    ),
    true,
  );
});

test("image upload rejects extension, MIME and content mismatches", () => {
  const jpeg = new Uint8Array([0xff, 0xd8, 0xff]);
  assert.equal(hasValidImageSignature(".png", "image/jpeg", jpeg), false);
  assert.equal(hasValidImageSignature(".jpg", "image/png", jpeg), false);
  assert.equal(hasValidImageSignature(".jpg", "image/jpeg", new Uint8Array([1, 2, 3])), false);
});
