import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createMealPlan, addMeal, getMealPlan, getTotalNutrition, deleteMeal } from "../src/meal-planner.js";

describe("Meal Planner Module", () => {
  describe("createMealPlan", () => {
    test("should create an empty meal plan", () => {
      const plan = createMealPlan("2024-01-15");
      assert.equal(plan.date, "2024-01-15");
      assert.deepEqual(plan.meals, []);
    });
  });

  describe("addMeal", () => {
    test("should add a meal to the plan", () => {
      const plan = createMealPlan("2024-01-15");
      addMeal(plan, "breakfast", {
        productName: "Apple Juice",
        grams: 200,
        nutrition: {
          energy: 94,
          fat: 0,
          saturatedFat: 0,
          carbohydrates: 20,
          sugars: 14,
          fiber: 0,
          protein: 0.4,
          salt: 0
        }
      });
      assert.equal(plan.meals.length, 1);
      assert.equal(plan.meals[0].type, "breakfast");
      assert.equal(plan.meals[0].productName, "Apple Juice");
      assert.equal(plan.meals[0].grams, 200);
    });

    test("should add multiple meals", () => {
      const plan = createMealPlan("2024-01-15");
      addMeal(plan, "breakfast", {
        productName: "Apple Juice",
        grams: 200,
        nutrition: {
          energy: 94,
          fat: 0,
          saturatedFat: 0,
          carbohydrates: 20,
          sugars: 14,
          fiber: 0,
          protein: 0.4,
          salt: 0
        }
      });
      addMeal(plan, "lunch", {
        productName: "Hazelnut Chocolate",
        grams: 30,
        nutrition: {
          energy: 688,
          fat: 10,
          saturatedFat: 3.9,
          carbohydrates: 16,
          sugars: 14,
          fiber: 0.7,
          protein: 2,
          salt: 0.05
        }
      });
      assert.equal(plan.meals.length, 2);
    });
  });

  describe("getMealPlan", () => {
    test("should return the meal plan", () => {
      const plan = createMealPlan("2024-01-15");
      addMeal(plan, "breakfast", {
        productName: "Apple Juice",
        grams: 200,
        nutrition: {
          energy: 94,
          fat: 0,
          saturatedFat: 0,
          carbohydrates: 20,
          sugars: 14,
          fiber: 0,
          protein: 0.4,
          salt: 0
        }
      });
      const retrieved = getMealPlan(plan);
      assert.equal(retrieved.date, "2024-01-15");
      assert.equal(retrieved.meals.length, 1);
    });
  });

  describe("getTotalNutrition", () => {
    test("should calculate total nutrition for all meals", () => {
      const plan = createMealPlan("2024-01-15");
      addMeal(plan, "breakfast", {
        productName: "Apple Juice",
        grams: 200,
        nutrition: {
          energy: 94,
          fat: 0,
          saturatedFat: 0,
          carbohydrates: 20,
          sugars: 14,
          fiber: 0,
          protein: 0.4,
          salt: 0
        }
      });
      addMeal(plan, "lunch", {
        productName: "Hazelnut Chocolate",
        grams: 30,
        nutrition: {
          energy: 688,
          fat: 10,
          saturatedFat: 3.9,
          carbohydrates: 16,
          sugars: 14,
          fiber: 0.7,
          protein: 2,
          salt: 0.05
        }
      });
      const total = getTotalNutrition(plan);
      assert.equal(total.energy, 782);
      assert.equal(total.fat, 10);
      assert.equal(total.saturatedFat, 3.9);
      assert.equal(total.carbohydrates, 36);
      assert.equal(total.sugars, 28);
      assert.equal(total.fiber, 0.7);
      assert.equal(total.protein, 2.4);
      assert.equal(total.salt, 0.05);
    });
  });

  describe("deleteMeal", () => {
    test("should delete a meal from the plan", () => {
      const plan = createMealPlan("2024-01-15");
      addMeal(plan, "breakfast", {
        productName: "Apple Juice",
        grams: 200,
        nutrition: {
          energy: 94,
          fat: 0,
          saturatedFat: 0,
          carbohydrates: 20,
          sugars: 14,
          fiber: 0,
          protein: 0.4,
          salt: 0
        }
      });
      addMeal(plan, "lunch", {
        productName: "Hazelnut Chocolate",
        grams: 30,
        nutrition: {
          energy: 688,
          fat: 10,
          saturatedFat: 3.9,
          carbohydrates: 16,
          sugars: 14,
          fiber: 0.7,
          protein: 2,
          salt: 0.05
        }
      });
      deleteMeal(plan, 0);
      assert.equal(plan.meals.length, 1);
      assert.equal(plan.meals[0].productName, "Hazelnut Chocolate");
    });
  });
});