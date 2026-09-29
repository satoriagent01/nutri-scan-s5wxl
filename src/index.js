/**
 * NutriScan - Main entry point
 * Combines OCR, parsing, tracking, and meal planning modules.
 */

const { extractText } = require('./ocr');
const {
  parseNutritionInfo,
  detectLanguage,
  extractProductName,
  extractServingInfo,
  extractNutrients,
  extractIngredients,
  extractAllergens,
} = require('./parser');
const {
  createTracker,
  addEntry,
  getEntry,
  getEntries,
  getTotal,
  deleteEntry,
} = require('./tracker');
const {
  createMealPlanner,
  addMeal,
  getMeal,
  getMealPlan,
  getTotalNutrition,
  deleteMeal,
} = require('./meal-planner');

module.exports = {
  // OCR
  extractText,

  // Parser
  parseNutritionInfo,
  detectLanguage,
  extractProductName,
  extractServingInfo,
  extractNutrients,
  extractIngredients,
  extractAllergens,

  // Tracker
  createTracker,
  addEntry,
  getEntry,
  getEntries,
  getTotal,
  deleteEntry,

  // Meal Planner
  createMealPlanner,
  addMeal,
  getMeal,
  getMealPlan,
  getTotalNutrition,
  deleteMeal,
};