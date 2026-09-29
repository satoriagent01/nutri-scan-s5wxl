import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  parseNutritionInfo,
  detectLanguage,
  extractProductName,
  extractServingInfo,
  extractNutrients,
  extractIngredients,
  extractAllergens
} from "./src/parser.js";

describe("parseNutritionInfo", () => {
  test("parses German nutrition table from image 1", () => {
    const text = `Nährwertdeklaration / Déclaration nutritionnelle / Voedingswaarde / Dichiarazione nutrizionale
100 g	30 g = 1 Melto
Energie / énergie / energie / energia	2292 kJ 549 kcal	688 kJ 165 kcal
Fett / matières grasses / vetten / grassi	33 g	10 g
davon gesättigte Fettsäuren / dont acides gras saturés / waarvan verzadigde vetzuren / di cui acidi grassi saturi	13 g	3,9 g
Kohlenhydrate / glucides / koolhydraten / carboidrati	55 g	16 g
davon Zucker / dont sucres / waarvan suikers / di cui zuccheri	45 g	14 g
Ballaststoffe / fibres alimentaires / vezels / fibre	2,4 g	0,7 g
Eiweiß / protéines / eiwitten / proteine	6,8 g	2,0 g
Salz / sel / zout / sale	0,18 g	0,05 g`;

    const result = parseNutritionInfo(text);
    assert.equal(result.language, "de");
    assert.equal(result.productName, "");
    assert.deepEqual(result.serving, { amount: 30, unit: "g", label: "1 Melto" });
    assert.deepEqual(result.nutrients, {
      energy: { kJ: 2292, kcal: 549 },
      fat: 33,
      saturatedFat: 13,
      carbohydrates: 55,
      sugars: 45,
      fiber: 2.4,
      protein: 6.8,
      salt: 0.18
    });
  });

  test("parses Dutch nutrition table from image 2", () => {
    const text = `Voedingswaarde per	100 ml	glas (200 ml)
energie	199 kJ / 47 kcal	399 kJ / 94 kcal
vetten, waarvan	0 g	0 g
- verzadigde vetzuren	0 g	0 g
- onverzadigde vetzuren	0 g	0 g
koolhydraten, waarvan	11 g	22 g
- suikers	10 g	20 g
- zoetstoffen	0 g	0 g
vezels	0,7 g	1,4 g
eiwitten	0,4 g	0,8 g
zout	0 g	0 g`;

    const result = parseNutritionInfo(text);
    assert.equal(result.language, "nl");
    assert.deepEqual(result.serving, { amount: 200, unit: "ml", label: "glas" });
    assert.deepEqual(result.nutrients, {
      energy: { kJ: 199, kcal: 47 },
      fat: 0,
      saturatedFat: 0,
      carbohydrates: 11,
      sugars: 10,
      fiber: 0.7,
      protein: 0.4,
      salt: 0
    });
  });
});

describe("detectLanguage", () => {
  test("detects German", () => {
    assert.equal(detectLanguage("Nährwertdeklaration"), "de");
  });

  test("detects Dutch", () => {
    assert.equal(detectLanguage("Voedingswaarde"), "nl");
  });

  test("detects French", () => {
    assert.equal(detectLanguage("Déclaration nutritionnelle"), "fr");
  });

  test("detects Italian", () => {
    assert.equal(detectLanguage("Dichiarazione nutrizionale"), "it");
  });
});

describe("extractProductName", () => {
  test("extracts product name from text", () => {
    const text = "VERSGEPERST APPEL-SINAASAPPEL- EN MANGOSAP";
    assert.equal(extractProductName(text), "VERSGEPERST APPEL-SINAASAPPEL- EN MANGOSAP");
  });
});

describe("extractServingInfo", () => {
  test("extracts serving size", () => {
    const text = "1 L / 5 porties (200 ml)";
    const result = extractServingInfo(text);
    assert.equal(result.amount, 200);
    assert.equal(result.unit, "ml");
  });
});

describe("extractNutrients", () => {
  test("extracts nutrients from a line", () => {
    const line = "Energie / énergie / energie / energia	2292 kJ 549 kcal	688 kJ 165 kcal";
    const result = extractNutrients(line);
    assert.deepEqual(result, { kJ: 2292, kcal: 549 });
  });
});

describe("extractIngredients", () => {
  test("extracts ingredients list", () => {
    const text = "Ingrediënten: 45% appel, 35% sinaasappel, 20% mango, antioxidant (ascorbinezuur [E300]).";
    const result = extractIngredients(text);
    assert.equal(result.length, 4);
    assert.equal(result[0], "appel");
  });
});

describe("extractAllergens", () => {
  test("extracts allergen information", () => {
    const text = "Allergie-informatie: - glutenhoudend lactosevrij";
    const result = extractAllergens(text);
    assert.ok(result.includes("lactosevrij"));
  });
});