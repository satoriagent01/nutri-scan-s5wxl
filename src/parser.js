/**
 * Parser module: extracts structured nutrition data from OCR text.
 * Handles multi-language nutrition tables (DE, FR, NL, EN, ES, IT, etc.)
 * and various formats found on food labels.
 */

/**
 * Parses nutrition information from OCR text.
 * @param {string} ocrText - The raw text extracted from the image.
 * @returns {Object} Parsed nutrition data with fields:
 *   - productName: string | null
 *   - servingSize: string | null
 *   - servingsPerContainer: number | null
 *   - nutrients: { [nutrientKey]: { per100g: number | null, perServing: number | null, unit: string } }
 *   - ingredients: string[]
 *   - allergens: string[]
 *   - language: string
 */
function parseNutritionInfo(ocrText) {
  const result = {
    productName: null,
    servingSize: null,
    servingsPerContainer: null,
    nutrients: {},
    ingredients: [],
    allergens: [],
    language: detectLanguage(ocrText),
  };

  // Extract product name (first line or lines before nutrition table)
  result.productName = extractProductName(ocrText);

  // Extract serving size info
  extractServingInfo(ocrText, result);

  // Extract nutrients from nutrition table
  extractNutrients(ocrText, result);

  // Extract ingredients
  result.ingredients = extractIngredients(ocrText);

  // Extract allergens
  result.allergens = extractAllergens(ocrText);

  return result;
}

/**
 * Detects the primary language of the nutrition label.
 * @param {string} text - OCR text.
 * @returns {string} Language code (e.g., 'de', 'nl', 'en', 'fr', 'es', 'it')
 */
function detectLanguage(text) {
  const lowerText = text.toLowerCase();

  // Check for common nutrition table headers in different languages
  const languageIndicators = {
    de: ['nährwertdeklaration', 'nährwerte', 'energiewert'],
    nl: ['voedingswaarde', 'voedingswaarden', 'energie'],
    en: ['nutrition facts', 'nutrition information', 'energy'],
    fr: ['valeur nutritionnelle', 'information nutritionnelle'],
    es: ['información nutricional', 'valor nutricional'],
    it: ['dichiarazione nutrizionale', 'valore nutrizionale'],
  };

  for (const [lang, indicators] of Object.entries(languageIndicators)) {
    for (const indicator of indicators) {
      if (lowerText.includes(indicator)) {
        return lang;
      }
    }
  }

  return 'unknown';
}

/**
 * Extracts product name from OCR text.
 * @param {string} text - OCR text.
 * @returns {string | null} Product name or null.
 */
function extractProductName(text) {
  // Look for lines before the nutrition table that are uppercase or title case
  const lines = text.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    // Skip empty lines, very short lines, and lines that look like headers
    if (trimmed.length < 3 || trimmed.length > 100) continue;
    if (/^(nährwert|voedingswaarde|nutrition|valeur|información|valore)/i.test(trimmed)) continue;
    if (/^\d+\s*(g|ml|kj|kcal)/i.test(trimmed)) continue;
    // Return the first substantial line that looks like a product name
    if (trimmed.length > 5 && !/^(www|http|©|℗)/i.test(trimmed)) {
      return trimmed;
    }
  }
  return null;
}

/**
 * Extracts serving size information.
 * @param {string} text - OCR text.
 * @param {Object} result - Result object to populate.
 */
function extractServingInfo(text, result) {
  // Look for patterns like "1 L / 5 porties (200 ml)" or "30 g = 1 Melto"
  const servingPatterns = [
    /(\d+\s*(?:l|ml|g))\s*(?:\/|per|por)\s*(\d+)\s*(?:portions|porties|porciones|servings|porzioni|servizi)/i,
    /(\d+\s*(?:l|ml|g))\s*=\s*(\d+\s*(?:g|ml))/i,
    /(\d+)\s*(?:portions|porties|porciones|servings|porzioni|servizi)\s*\((\d+\s*(?:g|ml))\)/i,
  ];

  for (const pattern of servingPatterns) {
    const match = text.match(pattern);
    if (match) {
      result.servingSize = match[2] || match[1];
      if (/\d+\s*(?:portions|porties|porciones|servings|porzioni)/i.test(match[0])) {
        const countMatch = match[0].match(/(\d+)\s*(?:portions|porties|porciones|servings|porzioni)/i);
        if (countMatch) {
          result.servingsPerContainer = parseInt(countMatch[1], 10);
        }
      }
      return;
    }
  }

  // Fallback: look for "per 100g" or "per 100 ml"
  const per100Match = text.match(/per\s+(\d+\s*(?:g|ml))/i);
  if (per100Match) {
    result.servingSize = per100Match[1];
  }
}

/**
 * Extracts nutrients from the nutrition table.
 * @param {string} text - OCR text.
 * @param {Object} result - Result object to populate.
 */
function extractNutrients(text, result) {
  // Define nutrient name mappings across languages
  const nutrientMappings = {
    energy: {
      de: ['energie', 'energiewert'],
      nl: ['energie'],
      en: ['energy'],
      fr: ['énergie', 'valeur énergétique'],
      es: ['energía', 'valor energético'],
      it: ['energia', 'valore energetico'],
    },
    fat: {
      de: ['fett', 'fette'],
      nl: ['vetten', 'vet'],
      en: ['fat', 'fats'],
      fr: ['matières grasses', 'lipides'],
      es: ['grasa', 'grasas', 'grasas totales'],
      it: ['grassi', 'grasse'],
    },
    saturatedFat: {
      de: ['gesättigte fettsäuren', 'davon gesättigte'],
      nl: ['verzadigde vetzuren'],
      en: ['saturated fat', 'saturated fatty acids'],
      fr: ['acides gras saturés'],
      es: ['grasas saturadas'],
      it: ['acidi grassi saturi'],
    },
    carbohydrates: {
      de: ['kohlenhydrate', 'carbohydraat'],
      nl: ['koolhydraten'],
      en: ['carbohydrate', 'carbohydrates'],
      fr: ['glucides', 'hydrates de carbone'],
      es: ['hidratos de carbono', 'carbohidratos'],
      it: ['carboidrati'],
    },
    sugars: {
      de: ['zucker', 'davon zucker'],
      nl: ['suikers', 'waarvan suikers'],
      en: ['sugars', 'of which sugars'],
      fr: ['sucres', 'dont sucres'],
      es: ['azúcares', 'de los cuales azúcares'],
      it: ['zuccheri', 'di cui zuccheri'],
    },
    fiber: {
      de: ['ballaststoffe', 'fibre'],
      nl: ['vezels', 'vezelf'],
      en: ['fiber', 'fibre', 'dietary fiber'],
      fr: ['fibres alimentaires'],
      es: ['fibra', 'fibra alimentaria'],
      it: ['fibre'],
    },
    protein: {
      de: ['eiweiß', 'proteine'],
      nl: ['eiwitten'],
      en: ['protein', 'proteins'],
      fr: ['protéines'],
      es: ['proteínas', 'proteina'],
      it: ['proteine'],
    },
    salt: {
      de: ['salz'],
      nl: ['zout'],
      en: ['salt'],
      fr: ['sel'],
      es: ['sal'],
      it: ['sale'],
    },
  };

  // Find the nutrition table section
  const tableSection = extractNutritionTable(text);
  if (!tableSection) return;

  // Parse each nutrient row
  const lines = tableSection.split('\n');
  let currentNutrient = null;
  let per100gValue = null;
  let perServingValue = null;
  let unit = 'g';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if this line is a nutrient header
    for (const [nutrientKey, translations] of Object.entries(nutrientMappings)) {
      const isNutrient = translations.some((t) =>
        trimmed.toLowerCase().includes(t.toLowerCase())
      );
      if (isNutrient) {
        // Save previous nutrient if exists
        if (currentNutrient && (per100gValue !== null || perServingValue !== null)) {
          result.nutrients[currentNutrient] = {
            per100g: per100gValue,
            perServing: perServingValue,
            unit,
          };
        }
        currentNutrient = nutrientKey;
        per100gValue = null;
        perServingValue = null;
        break;
      }
    }

    // If we're in a nutrient section, try to extract values
    if (currentNutrient) {
      // Look for numeric values with units
      const valueMatch = trimmed.match(/(\d+\.?\d*)\s*(?:kJ|kcal|g|mg)/);
      if (valueMatch) {
        const value = parseFloat(valueMatch[1]);
        if (trimmed.includes('kJ') || trimmed.includes('kcal')) {
          unit = trimmed.includes('kcal') ? 'kcal' : 'kJ';
          // First value is usually per 100g, second is per serving
          if (per100gValue === null) {
            per100gValue = value;
          } else {
            perServingValue = value;
          }
        } else if (trimmed.includes('g')) {
          unit = 'g';
          if (per100gValue === null) {
            per100gValue = value;
          } else {
            perServingValue = value;
          }
        }
      }
    }
  }

  // Save last nutrient
  if (currentNutrient && (per100gValue !== null || perServingValue !== null)) {
    result.nutrients[currentNutrient] = {
      per100g: per100gValue,
      perServing: perServingValue,
      unit,
    };
  }
}

/**
 * Extracts the nutrition table section from OCR text.
 * @param {string} text - OCR text.
 * @returns {string | null} Nutrition table text or null.
 */
function extractNutritionTable(text) {
  // Look for nutrition table headers
  const tableHeaders = [
    /nährwertdeklaration/i,
    /voedingswaarde/i,
    /nutrition\s*(facts|information)/i,
    /valeur\s*(nutritionnelle|nutritive)/i,
    /información\s*nutricional/i,
    /dichiarazione\s*nutrizionale/i,
    /valore\s*nutrizionale/i,
  ];

  let startIndex = -1;
  for (const header of tableHeaders) {
    const match = text.search(header);
    if (match !== -1) {
      startIndex = match;
      break;
    }
  }

  if (startIndex === -1) return null;

  // Find the end of the table (next major section or end of text)
  const endPatterns = [
    /ingredients/i,
    /allergie/i,
    /zubereitung/i,
    /zubereitungsart/i,
    /bereiding/i,
    /conservare/i,
    /lagerung/i,
    /^$/m,
  ];

  let endIndex = text.length;
  for (const pattern of endPatterns) {
    const match = text.slice(startIndex).search(pattern);
    if (match !== -1 && match < 2000) {
      endIndex = startIndex + match;
      break;
    }
  }

  return text.slice(startIndex, endIndex);
}

/**
 * Extracts ingredients list from OCR text.
 * @param {string} text - OCR text.
 * @returns {string[]} Array of ingredients.
 */
function extractIngredients(text) {
  const ingredientsPatterns = [
    /ingredients:\s*([\s\S]*?)(?=\n\s*(?:allergie|nährwert|voedingswaarde|nutrition|valeur|información|valore)|$)/i,
    /ingrediente.*?:\s*([\s\S]*?)(?=\n\s*(?:allergie|nährwert|voedingswaarde|nutrition|valeur|información|valore)|$)/i,
  ];

  for (const pattern of ingredientsPatterns) {
    const match = text.match(pattern);
    if (match) {
      // Split by semicolons or commas followed by space and lowercase
      const ingredients = match[1]
        .split(/;\s*/)
        .map((ing) => ing.trim())
        .filter((ing) => ing.length > 0);
      return ingredients;
    }
  }

  return [];
}

/**
 * Extracts allergen information from OCR text.
 * @param {string} text - OCR text.
 * @returns {string[]} Array of allergens.
 */
function extractAllergens(text) {
  const allergens = [];
  const commonAllergens = [
    'gluten',
    'glutenvrij',
    'glutenvrije',
    'lactose',
    'lactosevrij',
    'soja',
    'sojaproducten',
    'noten',
    'amandelen',
    'mandelen',
    'pistaches',
    'pistachenoten',
    'walnoten',
    'walnoot',
    'arachide',
    'eidoo',
    'ei',
    'vis',
    'schaaldieren',
    'sulfiet',
    'sulfieten',
    'sesam',
    'mosterd',
    'selderij',
    'lupine',
    'weekdieren',
  ];

  const lowerText = text.toLowerCase();
  for (const allergen of commonAllergens) {
    if (lowerText.includes(allergen)) {
      allergens.push(allergen);
    }
  }

  // Also check for allergen warning sections
  const allergenWarningPatterns = [
    /kan\s*(bevat|bevatten)\s*([\s\S]*?)(?=\n\s*(?:nährwert|voedingswaarde|nutrition|valeur|información|valore)|$)/i,
    /bevat\s*([\s\S]*?)(?=\n\s*(?:nährwert|voedingswaarde|nutrition|valeur|información|valore)|$)/i,
    /may\s*contain\s*([\s\S]*?)(?=\n\s*(?:nutrition|valeur|información|valore)|$)/i,
    /può\s*contenere\s*([\s\S]*?)(?=\n\s*(?:nährwert|voedingswaarde|nutrition|valeur|información|valore)|$)/i,
  ];

  for (const pattern of allergenWarningPatterns) {
    const match = text.match(pattern);
    if (match) {
      const warningText = match[1].toLowerCase();
      for (const allergen of commonAllergens) {
        if (warningText.includes(allergen) && !allergens.includes(allergen)) {
          allergens.push(allergen);
        }
      }
    }
  }

  return allergens;
}

export { parseNutritionInfo, detectLanguage, extractProductName, extractServingInfo, extractNutrients, extractIngredients, extractAllergens };