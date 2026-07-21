# Taxi Ayud

Web moderna para Taxi Ayud Calatayud, lista para desplegar en Vercel sin WordPress.

## Qué incluye

- Portada con imagen optimizada y llamadas directas.
- Calculadora de tarifas desde Calatayud con mensaje de WhatsApp preparado.
- Modo "Taxi ahora" con opción de enviar ubicación del cliente.
- Bloque de reseñas públicas de Google con actualización automática opcional.
- Tabla de destinos frecuentes.
- Servicios, vehículo, métodos de pago y contacto.
- SEO local avanzado, sitemap, robots.txt, datos estructurados y metadatos para compartir.
- Detección de idioma del navegador en español, inglés, francés, catalán, alemán, italiano, portugués, neerlandés y árabe.
- Mensajes de WhatsApp adaptados al idioma del cliente, con aviso de idioma incluido.

## Rutas exactas sin Google Maps

La calculadora usa primero la tabla oficial de destinos habituales desde Calatayud.
Para direcciones exactas usa funciones privadas en Vercel y tiene varias vías:
OpenRouteService cuando hay clave configurada, respaldo OpenStreetMap/OSRM desde
Vercel si falta o falla, y un fallback en navegador para que la preview local no
se quede rota si las funciones `/api` no están levantadas.

En Vercel añade esta variable de entorno:

```bash
OPENROUTESERVICE_API_KEY=tu_clave
```

La clave no va en el navegador. Las funciones `api/route.js` y `api/suggest.js`
calculan la ruta y muestran sugerencias desde Vercel. Si no configuras la
variable, la web intenta el respaldo libre y mantiene WhatsApp como salida profesional.
El fallback público es útil para pruebas y resiliencia, pero para producción
conviene mantener `OPENROUTESERVICE_API_KEY` en Vercel.

## Reseñas automáticas de Google

Para que el bloque de reseñas se actualice solo desde Google Places, añade en
Vercel:

```bash
GOOGLE_PLACES_API_KEY=tu_clave_google
GOOGLE_PLACE_ID=place_id_del_perfil
```

Sin estas variables la web usa las reseñas manuales de respaldo. Google Places
puede devolver valoración, número de reseñas y algunas reseñas públicas
visibles del perfil. Para gestionar/listar todas las reseñas del negocio haría
falta la Business Profile API con OAuth.

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

Si usas reseñas automáticas, añade también `GOOGLE_PLACES_API_KEY` y
`GOOGLE_PLACE_ID`.

## Desarrollo local

```bash
pnpm install
pnpm dev
pnpm build
```

La web es estática y no necesita base de datos.
