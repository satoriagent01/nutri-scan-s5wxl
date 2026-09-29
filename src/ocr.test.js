import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { extractText } from "./ocr.js";

describe("OCR module", () => {
  describe("extractText", () => {
    test("should return the mock text for a given image path", () => {
      const result = extractText("test-image.jpg");
      assert.equal(result, "Mock OCR text for test-image.jpg");
    });

    test("should handle empty image path", () => {
      const result = extractText("");
      assert.equal(result, "");
    });
  });
});