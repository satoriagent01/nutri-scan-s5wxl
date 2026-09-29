# NutriScan

NutriScan es una app gratuita y sin anuncios para rastrear la nutrición de tus alimentos escaneando las etiquetas con tu cámara.

## Características

- **OCR con IA**: Escanea fotos de etiquetas nutricionales y extrae la información automáticamente.
- **Parser inteligente**: Detecta el idioma de la etiqueta y extrae nutrientes, ingredientes y alérgenos.
- **Tracker personalizado**: Registra calorías, sodio, grasas saturadas y cualquier otro nutriente que quieras controlar.
- **Meal Planner**: Planifica tus comidas especificando cuántos gramos de cada producto consumes.

## Instalación

```bash
npm install
```

## Uso

```bash
node src/index.js
```

## Tests

```bash
npm test
```

## No hecho aún

- Interfaz de usuario (web o móvil)
- Integración real con un servicio de OCR (actualmente usa un mock)
- Base de datos persistente (actualmente usa memoria)
- Soporte para múltiples idiomas en la UI

## Licencia

MIT