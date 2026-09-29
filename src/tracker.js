/**
 * Tracker module: log and query nutrition intake.
 * 
 * Exports:
 * - createTracker() -> Tracker instance
 * - Tracker methods:
 *   - addEntry(productName, nutrients, grams, servingSize) -> entryId
 *   - getEntry(entryId) -> entry or undefined
 *   - getEntries(date) -> array of entries for date (YYYY-MM-DD)
 *   - getTotal(date, nutrient) -> total grams of nutrient for date
 *   - deleteEntry(entryId) -> boolean
 */

const entries = new Map();
let nextId = 1;

/**
 * Create a new tracker instance.
 * @returns {Object} Tracker instance
 */
export function createTracker() {
  return {
    addEntry,
    getEntry,
    getEntries,
    getTotal,
    deleteEntry,
  };
}

/**
 * Add a nutrition entry.
 * @param {string} productName - Name of the product
 * @param {Object} nutrients - Nutrient values per 100g (e.g., { energy: 2292, fat: 33, carbs: 55, sugar: 45, fiber: 2.4, protein: 6.8, salt: 0.18 })
 * @param {number} grams - Amount consumed in grams
 * @param {number} servingSize - Serving size in grams (for reference)
 * @returns {string} Entry ID
 */
export function addEntry(productName, nutrients, grams, servingSize = 100) {
  const id = String(nextId++);
  const entry = {
    id,
    productName,
    nutrients,
    grams,
    servingSize,
    date: new Date().toISOString().split('T')[0],
    timestamp: new Date().toISOString(),
  };
  entries.set(id, entry);
  return id;
}

/**
 * Get an entry by ID.
 * @param {string} entryId - Entry ID
 * @returns {Object|undefined} Entry or undefined
 */
export function getEntry(entryId) {
  return entries.get(entryId);
}

/**
 * Get all entries for a date.
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Array} Array of entries
 */
export function getEntries(date) {
  return Array.from(entries.values()).filter(entry => entry.date === date);
}

/**
 * Get total of a nutrient for a date.
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} nutrient - Nutrient key (e.g., 'energy', 'fat', 'carbs')
 * @returns {number} Total value
 */
export function getTotal(date, nutrient) {
  const entriesForDate = getEntries(date);
  return entriesForDate.reduce((sum, entry) => {
    const factor = entry.grams / entry.servingSize;
    return sum + (entry.nutrients[nutrient] || 0) * factor;
  }, 0);
}

/**
 * Delete an entry.
 * @param {string} entryId - Entry ID
 * @returns {boolean} Whether the entry was deleted
 */
export function deleteEntry(entryId) {
  return entries.delete(entryId);
}