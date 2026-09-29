# NutriScan Specification

## Overview
NutriScan is a free, open-source nutrition tracker that allows users to:
1. Take photos of food labels (nutrition tables)
2. Extract nutrition information using OCR with AI
3. Parse the extracted text into structured data
4. Track daily nutrition intake (calories, sodium, saturated fats, etc.)
5. Plan meals by specifying gram amounts of each food

## Acceptance Criteria

### AC-1: OCR Extraction
- User can provide an image of a nutrition label
- System extracts text from the image using OCR
- Returns structured text blocks with position information

### AC-2: Nutrition Table Parsing
- System parses OCR text to identify nutrition tables
- Extracts nutrient names, values, and units
- Handles multiple languages (German, Dutch, French, Italian, English, Spanish)
- Example from Image 1 (German chocolate bar):
  - Energie: 2292 kJ / 549 kcal per 100g
  - Fett: 33g per 100g
  - Kohlenhydrate: 55g per 100g
  - Zucker: 45g per 100g
  - Ballaststoffe: 2.4g per 100g
  - Eiweiß: 6.8g per 100g
  - Salz: 0.18g per 100g

### AC-3: Nutrition Tracking
- User can log foods with their nutrition values
- System tracks daily intake of custom nutrients
- User can query daily totals for any nutrient
- Example: Log 30g of chocolate bar (from Image 1)
  - Should calculate: 30% of 100g values
  - Fett: 9.9g, Zucker: 13.5g, etc.

### AC-4: Meal Planning
- User can create meals with multiple food items
- User specifies gram amounts for each food
- System calculates total nutrition for the meal
- Example: Meal with 100g apple juice (from Image 2)
  - Energie: 199 kJ / 47 kcal
  - Kohlenhydrate: 11g
  - Zucker: 10g

### AC-5: Custom Nutrients
- User can define custom nutrients to track
- System tracks any nutrient, not just standard ones
- No hardcoded nutrient list

## Modules

### OCR Module (`src/ocr.js`)
- `extractText(imagePath: string): Promise<string[]>`
  - Extracts text from image using OCR
  - Returns array of text lines with position info
  - Example: `[{text: "Energie", x: 10, y: 20, width: 50, height: 15}, ...]`

### Parser Module (`src/parser.js`)
- `parseNutritionTable(ocrText: string[]): NutritionInfo`
  - Parses OCR text to extract nutrition table
  - Returns structured nutrition data
  - Example input: `["Energie", "2292 kJ", "549 kcal", "per 100g"]`
  - Example output: `{energie: {kj: 2292, kcal: 549}, fett: 33, ...}`

### Tracker Module (`src/tracker.js`)
- `logFood(foodName: string, nutrition: NutritionInfo, grams: number): void`
  - Logs a food item with specified grams
  - Calculates nutrition based on grams
- `getDailyTotals(date: string): Record<string, number>`
  - Returns daily totals for all nutrients
- `addCustomNutrient(nutrientName: string): void`
  - Adds a custom nutrient to track

### Meal Planner Module (`src/meal-planner.js`)
- `createMeal(mealName: string, items: MealItem[]): Meal`
  - Creates a meal with multiple food items
  - Each item has food name and gram amount
- `getMealNutrition(meal: Meal): NutritionInfo`
  - Calculates total nutrition for the meal
- `getWeeklyPlan(date: string): WeeklyPlan`
  - Returns meal plan for a week

## Data Structures

### NutritionInfo
```typescript
interface NutritionInfo {
  energie?: {kj: number, kcal: number};
  fett?: number;
  gesattigteFettsauren?: number;
  kohlenhydrate?: number;
  zucker?: number;
  ballaststoffe?: number;
  eiweiss?: number;
  salz?: number;
  [nutrient: string]: number | {kj: number, kcal: number} | undefined;
}
```

### MealItem
```typescript
interface MealItem {
  foodName: string;
  grams: number;
  nutrition: NutritionInfo;
}
```

### Meal
```typescript
interface Meal {
  name: string;
  items: MealItem[];
  totalNutrition: NutritionInfo;
  date: string;
}
```