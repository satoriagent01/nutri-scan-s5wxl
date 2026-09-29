/**
 * Meal Planner Module
 * 
 * Allows planning meals with gram amounts of tracked products.
 */

/**
 * Creates a new meal planner instance.
 * @param {Object} tracker - The tracker instance to look up products.
 * @returns {Object} The meal planner instance.
 */
export function createMealPlanner(tracker) {
  const meals = [];

  /**
   * Adds a meal to the planner.
   * @param {string} date - The date of the meal (YYYY-MM-DD).
   * @param {string} name - The name of the meal (e.g., "Breakfast").
   * @param {Array} items - Array of { productId, grams, productName }.
   * @returns {Object} The added meal.
   */
  function addMeal(date, name, items) {
    const meal = {
      id: Date.now().toString(),
      date,
      name,
      items,
      createdAt: new Date().toISOString()
    };
    meals.push(meal);
    return meal;
  }

  /**
   * Gets all meals for a given date.
   * @param {string} date - The date to filter by (YYYY-MM-DD).
   * @returns {Array} Array of meals for that date.
   */
  function getMealsByDate(date) {
    return meals.filter(meal => meal.date === date);
  }

  /**
   * Gets the total nutrition for a meal based on gram amounts.
   * @param {Object} meal - The meal object.
   * @returns {Object} Total nutrition values.
   */
  function getMealTotals(meal) {
    const totals = {
      energy: 0,
      fat: 0,
      saturatedFat: 0,
      carbohydrates: 0,
      sugars: 0,
      fiber: 0,
      protein: 0,
      salt: 0
    };

    for (const item of meal.items) {
      const product = tracker.getEntry(item.productId);
      if (product && product.nutrition) {
        const ratio = item.grams / 100;
        for (const key of Object.keys(totals)) {
          if (product.nutrition[key] !== undefined) {
            totals[key] += product.nutrition[key] * ratio;
          }
        }
      }
    }

    // Round to 1 decimal place
    for (const key of Object.keys(totals)) {
      totals[key] = Math.round(totals[key] * 10) / 10;
    }

    return totals;
  }

  /**
   * Removes a meal by ID.
   * @param {string} mealId - The ID of the meal to remove.
   * @returns {boolean} Whether the meal was removed.
   */
  function removeMeal(mealId) {
    const index = meals.findIndex(meal => meal.id === mealId);
    if (index !== -1) {
      meals.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Gets all meals.
   * @returns {Array} All meals.
   */
  function getAllMeals() {
    return [...meals];
  }

  return {
    addMeal,
    getMealsByDate,
    getMealTotals,
    removeMeal,
    getAllMeals
  };
}