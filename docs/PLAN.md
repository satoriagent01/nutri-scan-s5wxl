# NutriScan - Development Plan

## Overview
NutriScan is a free, open-source nutrition tracking application that uses OCR to extract nutritional information from food labels and allows users to track their intake with custom meal planning.

## Architecture
- **OCR Module**: Extracts text from food label images using AI-powered OCR
- **Parser Module**: Parses OCR text to extract structured nutrition data (calories, macronutrients, ingredients, allergens)
- **Tracker Module**: Logs daily nutrition intake and provides queries for specific nutrients
- **Meal Planner Module**: Allows planning meals with gram amounts of tracked products

## Stack
- **Language**: JavaScript (Node.js 24)
- **Testing**: Node.js built-in test runner
- **CI**: GitHub Actions

## Decisions
1. **No external dependencies**: Using Node.js built-in modules only for simplicity and reliability
2. **OCR via AI**: Using a configurable AI OCR endpoint (user provides their own key/endpoint)
3. **Deterministic parsing**: Custom regex-based parser for nutrition tables
4. **Free and open-source**: No ads, no paywalls, fully transparent

## What's Done
- OCR module with configurable AI endpoint
- Nutrition table parser supporting multiple languages (German, Dutch, French, Italian, English)
- Tracker module for logging and querying nutrition intake
- Meal planner for planning meals with gram amounts
- Full test suite
- CI pipeline

## What's Next
- Web UI (React/Vue frontend)
- Mobile app (React Native)
- Database integration (SQLite/PostgreSQL)
- Barcode scanning integration
- Cloud sync
- More language support
- Image preprocessing (enhancement, deskewing)
- Local OCR fallback (Tesseract.js)