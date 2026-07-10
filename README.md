# Taxi Ayud

Web moderna para Taxi Ayud Calatayud, lista para desplegar en Vercel sin WordPress.

## Qué incluye

- Portada con imagen optimizada y llamadas directas.
- Calculadora de tarifas desde Calatayud con mensaje de WhatsApp preparado.
- Modo "Taxi ahora" con opción de enviar ubicación del cliente.
- Bloque de reseñas públicas de Google.
- Tabla de destinos frecuentes.
- Servicios, vehículo, métodos de pago y contacto.
- SEO básico y metadatos para compartir.

## Rutas exactas sin Google Maps

La calculadora usa primero la tabla oficial de destinos habituales desde Calatayud.
Para direcciones exactas queda preparada una alternativa más económica:
OpenRouteService, basada en OpenStreetMap.

En Vercel añade esta variable de entorno:

```bash
OPENROUTESERVICE_API_KEY=tu_clave
```

La clave no va en el navegador. La función `api/route.js` calcula la ruta desde
Vercel y devuelve solo distancia y duración. Si no configuras la variable, la web
seguirá funcionando con la tabla de tarifas y la consulta por WhatsApp.

Alternativas:

- OpenRouteService: recomendada para empezar, con plan gratuito y API key.
- Mapbox: buena opción profesional con plan gratuito y pago por uso.
- OSRM: motor libre, pero el servidor demo público no es para producción.
- Nominatim/OpenStreetMap público: útil para pruebas, pero no conviene usarlo
  como geocodificador comercial sin revisar su política o alojarlo tú.

## Vercel

Vercel detecta el proyecto como Vite:

- Install command: `pnpm install`
- Build command: `pnpm build`
- Output directory: `dist`

Si usas rutas exactas, añade también la variable `OPENROUTESERVICE_API_KEY` en:

Project Settings -> Environment Variables.

## Desarrollo local

```bash
pnpm install
pnpm dev
pnpm build
```

La web es estática y no necesita base de datos.
