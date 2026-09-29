import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { parseNutritionTable } from "./parser.js";

describe("parseNutritionTable", () => {
  test("parses German nutrition table from image 1", () => {
    const ocrText = `Nährwertdeklaration / Déclaration
nutritionnelle / Voedingswaarde /
Dichiarazione nutrizionale
100 g    30 g = 1 Melto
Energie / énergie / energie / energia    2292 kJ    688 kJ
549 kcal    165 kcal
Fett / matières grasses / vetten / grassi    33 g    10 g
davon gesättigte Fettsäuren / dont
acides gras saturés / waarvan verzadigde
vetzuren / di cui acidi grassi saturi    13 g    3,9 g
Kohlenhydrate / glucides / koolhydraten /
carboidrati    55 g    16 g
davon Zucker / dont sucres / waarvan suikers
/ di cui zuccheri    45 g    14 g
Ballaststoffe / fibres alimentaires / vezels /
fibre    2,4 g    0,7 g
Eiweiß / protéines / eiwitten / proteine    6,8 g    2,0 g
Salz / sel / zout / sale    0,18 g    0,05 g`;

    const result = parseNutritionTable(ocrText);

    assert.strictEqual(result.servingSize, "30 g");
    assert.strictEqual(result.servingName, "1 Melto");
    assert.deepStrictEqual(result.nutrients, {
      energy: { per100g: { kJ: 2292, kcal: 549 }, perServing: { kJ: 688, kcal: 165 } },
      fat: { per100g: 33, perServing: 10, unit: "g" },
      saturatedFat: { per100g: 13, perServing: 3.9, unit: "g" },
      carbohydrates: { per100g: 55, perServing: 16, unit: "g" },
      sugars: { per100g: 45, perServing: 14, unit: "g" },
      fiber: { per100g: 2.4, perServing: 0.7, unit: "g" },
      protein: { per100g: 6.8, perServing: 2.0, unit: "g" },
      salt: { per100g: 0.18, perServing: 0.05, unit: "g" },
    });
  });

  test("parses Dutch nutrition table from image 2", () => {
    const ocrText = `Voedingswaarde per    100 ml    glas (200 ml)
energie    199 kJ / 47 kcal    399 kJ / 94 kcal
vetten, waarvan    0 g    0 g
- verzadigde vetzuren    0 g    0 g
- onverzadigde vetzuren    0 g    0 g
koolhydraten, waarvan    11 g    22 g
- suikers    10 g    20 g
- vezels    0,7 g    1,4 g
eiwitten    0,4 g    0,8 g
zout    0 g    0 g`;

    const result = parseNutritionTable(ocrText);

    assert.strictEqual(result.servingSize, "200 ml");
    assert.strictEqual(result.servingName, "glas");
    assert.deepStrictEqual(result.nutrients, {
      energy: { per100g: { kJ: 199, kcal: 47 }, perServing: { kJ: 399, kcal: 94 } },
      fat: { per100g: 0, perServing: 0, unit: "g" },
      saturatedFat: { per100g: 0, perServing: 0, unit: "g" },
      carbohydrates: { per100g: 11, perServing: 22, unit: "g" },
      sugars: { per100g: 10, perServing: 20, unit: "g" },
      fiber: { per100g: 0.7, perServing: 1.4, unit: "g" },
      protein: { per100g: 0.4, perServing: 0.8, unit: "g" },
      salt: { per100g: 0, perServing: 0, unit: "g" },
    });
  });

  test("parses simple per-100ml format from image 3", () => {
    const ocrText = `Voedingswaarde per 100 ml
energie    3404 kJ / 828 kcal    vetten    92 g
waarvan verzadigde vetzuren    14 g    koolhydraten    0 g
waarvan suikers    0 g    eiwitten    0 g
vezels    0 g    zout    0 g`;

    const result = parseNutritionTable(ocrText);

    assert.strictEqual(result.servingSize, "100 ml");
    assert.strictEqual(result.servingName, undefined);
    assert.deepStrictEqual(result.nutrients, {
      energy: { per100g: { kJ: 3404, kcal: 828 }, perServing: { kJ: 3404, kcal: 828 } },
      fat: { per100g: 92, perServing: 92, unit: "g" },
      saturatedFat: { per100g: 14, perServing: 14, unit: "g" },
      carbohydrates: { per100g: 0, perServing: 0, unit: "g" },
      sugars: { per100g: 0, perServing: 0, unit: "g" },
      fiber: { per100g: 0, perServing: 0, unit: "g" },
      protein: { per100g: 0, perServing: 0, unit: "g" },
      salt: { per100g: 0, perServing: 0, unit: "g" },
    });
  });

  test("returns empty result when no table found", () => {
    const ocrText = "This is just random text with no nutrition info.";
    const result = parseNutritionTable(ocrText);
    assert.deepStrictEqual(result, { nutrients: {}, servingSize: undefined, servingName: undefined });
  });
});