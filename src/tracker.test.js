import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { Tracker } from "./tracker.js";

describe("Tracker", () => {
  test("should add a food entry and retrieve it", () => {
    const tracker = new Tracker();
    tracker.addEntry({
      name: "Chocolate Bar",
      servingSize: 30,
      servingUnit: "g",
      calories: 165,
      fat: 10,
      saturatedFat: 3.9,
      carbohydrates: 16,
      sugars: 14,
      fiber: 0.7,
      protein: 2.0,
      sodium: 0.05,
    });

    const entries = tracker.getEntries();
    assert.equal(entries.length, 1);
    assert.equal(entries[0].name, "Chocolate Bar");
    assert.equal(entries[0].calories, 165);
  });

  test("should calculate daily totals", () => {
    const tracker = new Tracker();
    tracker.addEntry({
      name: "Chocolate Bar",
      servingSize: 30,
      servingUnit: "g",
      calories: 165,
      fat: 10,
      saturatedFat: 3.9,
      carbohydrates: 16,
      sugars: 14,
      fiber: 0.7,
      protein: 2.0,
      sodium: 0.05,
    });
    tracker.addEntry({
      name: "Apple Juice",
      servingSize: 200,
      servingUnit: "ml",
      calories: 94,
      fat: 0,
      saturatedFat: 0,
      carbohydrates: 22,
      sugars: 20,
      fiber: 0,
      protein: 0.4,
      sodium: 0,
    });

    const totals = tracker.getDailyTotals();
    assert.equal(totals.calories, 259);
    assert.equal(totals.fat, 10);
    assert.equal(totals.saturatedFat, 3.9);
    assert.equal(totals.carbohydrates, 38);
    assert.equal(totals.sugars, 34);
    assert.equal(totals.fiber, 0.7);
    assert.equal(totals.protein, 2.4);
    assert.equal(totals.sodium, 0.05);
  });

  test("should clear all entries", () => {
    const tracker = new Tracker();
    tracker.addEntry({
      name: "Chocolate Bar",
      servingSize: 30,
      servingUnit: "g",
      calories: 165,
      fat: 10,
      saturatedFat: 3.9,
      carbohydrates: 16,
      sugars: 14,
      fiber: 0.7,
      protein: 2.0,
      sodium: 0.05,
    });

    tracker.clear();
    assert.equal(tracker.getEntries().length, 0);
    const totals = tracker.getDailyTotals();
    assert.equal(totals.calories, 0);
  });

  test("should handle entries with zero values", () => {
    const tracker = new Tracker();
    tracker.addEntry({
      name: "Olive Oil Spray",
      servingSize: 0,
      servingUnit: "g",
      calories: 0,
      fat: 0,
      saturatedFat: 0,
      carbohydrates: 0,
      sugars: 0,
      fiber: 0,
      protein: 0,
      sodium: 0,
    });

    const totals = tracker.getDailyTotals();
    assert.equal(totals.calories, 0);
    assert.equal(totals.fat, 0);
  });
});