# SEO_CHANGES Taxi Ayud

Fecha: 2026-09-28

## Archivos modificados

- `src/seoPages.json`
- `src/main.tsx`
- `src/data.ts`
- `scripts/generate-static-pages.mjs`
- `scripts/smoke-check.mjs`
- `scripts/redirect-check.mjs`
- `vercel.json`
- `index.html`

## Cambios SEO

- Home title actualizado a `Taxi Calatayud | Reserva por WhatsApp, AVE y comarca | Taxi Ayud`.
- Home description enfocada en taxi en Calatayud, WhatsApp, estación AVE, comarca, Monasterio de Piedra, balnearios, Zaragoza, aeropuerto y A-2.
- FREENOW deja de dominar title, description y primera pantalla. Se mantiene como canal adicional visible.
- San Roque 2026 deja de mostrarse como campaña activa. Las páginas de fiestas quedan orientadas a fiestas locales, eventos y reservas con antelación.
- Reseñas: se evita enseñar contador rígido si no llega dato vivo desde Google Places.

## Redirecciones añadidas

- `/taxi-averia-a2-calatayud/` -> `/taxi-pasajeros-averia-a2-calatayud/`
- `/taxi-balnearios-calatayud/` -> `/taxi-calatayud-jaraba-balnearios/`
- `/taxi-comarca-calatayud/` -> `/taxi-pueblos-comarca-calatayud/`

## Decisiones

- No se han creado páginas duplicadas para rutas que ya tienen landing canónica útil.
- No se han añadido claims como "24 horas", "número 1" o "más barato".
- No se ha añadido aggregateRating en JSON-LD para evitar marcado de reseñas potencialmente problemático.

## URLs importantes para solicitar reindexación

- `https://www.taxiayud.es/`
- `https://www.taxiayud.es/taxi-calatayud/`
- `https://www.taxiayud.es/taxi-cerca-de-mi-calatayud/`
- `https://www.taxiayud.es/taxi-estacion-ave-calatayud/`
- `https://www.taxiayud.es/taxi-calatayud-monasterio-de-piedra/`
- `https://www.taxiayud.es/taxi-estacion-calatayud-monasterio-de-piedra/`
- `https://www.taxiayud.es/taxi-calatayud-jaraba-balnearios/`
- `https://www.taxiayud.es/taxi-pueblos-comarca-calatayud/`
- `https://www.taxiayud.es/taxi-pasajeros-averia-a2-calatayud/`
- `https://www.taxiayud.es/taxi-calatayud-zaragoza/`
- `https://www.taxiayud.es/taxi-calatayud-aeropuerto-zaragoza/`
- `https://www.taxiayud.es/taxi-freenow-calatayud/`
