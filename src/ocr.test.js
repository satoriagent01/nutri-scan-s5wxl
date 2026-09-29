import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { extractTextFromImage } from "./ocr.js";

describe("OCR Module", () => {
  test("extractTextFromImage returns a string for a valid image path", () => {
    // In a real app, this would call an OCR API.
    // For now, we simulate the expected output from the sample images.
    const mockImagePath = "sample_nutrition_label.jpg";
    const result = extractTextFromImage(mockImagePath);
    assert.ok(typeof result === "string");
    assert.ok(result.length > 0);
  });

  test("extractTextFromImage handles missing file gracefully", () => {
    const mockImagePath = "non_existent_image.jpg";
    const result = extractTextFromImage(mockImagePath);
    assert.ok(typeof result === "string");
    assert.equal(result, "");
  });
});