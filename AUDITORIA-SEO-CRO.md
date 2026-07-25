# Auditoria SEO/CRO Taxi Ayud

Fecha: 2026-07-25

Dominio canonico: `https://www.taxiayud.es`

## Resumen ejecutivo

La web usa Vite + React con generacion estatica de paginas SEO en `dist/`, APIs serverless para rutas, autocompletado y resenas, canonical `.es`, sitemap, `hreflang`, JSON-LD, WhatsApp por idioma, cookie banner y footer legal. La prioridad de esta revision ha sido consolidar intenciones SEO, evitar duplicados por slugs antiguos, reforzar pruebas y mantener una experiencia movil directa.

## Auditoria inicial y solucion aplicada

| Problema | URL o archivo afectado | Prioridad | Solucion aplicada | Comprobacion realizada |
|---|---|---|---|---|
| `.com` podia servir contenido duplicado frente a `.es` | `vercel.json`, produccion | Critica | Redirecciones permanentes de dominios secundarios a `https://www.taxiayud.es` y restos WordPress a la portada canonica | `curl -I` y `pnpm run redirect:check` |
| Slugs antiguos competian con landings prioritarias | `src/seoPages.json`, `vercel.json` | Alta | Consolidacion de Monasterio, Aeropuerto, Jaraba, Alhama y A-2 en URLs canonicas mas claras con 301 desde rutas antiguas | `pnpm run check` |
| Faltaba prueba automatica de enlaces internos | `scripts/link-check.mjs` | Alta | Nuevo check sobre HTML generado, assets y rutas internas | Integrado en `pnpm test` |
| Faltaba prueba live de matriz de redirecciones | `scripts/redirect-check.mjs` | Alta | Script con matriz `.es`, `.com`, `hello-world` y rutas antiguas, con modo estricto opcional | `pnpm run redirect:check` |
| Tabla SEO podia quedarse desactualizada | `scripts/generate-url-table.mjs`, `URL-INTENT-MAP.md` | Media | Generador de tabla de URL, intencion, keyword, title, H1, canonical, indexabilidad e idioma | `pnpm run url:table` |
| APIs de rutas/autocompletado sin limite basico | `api/route.js`, `api/suggest.js` | Media | Rate limit en memoria por IP para reducir abuso y llamadas externas innecesarias | Typecheck y pruebas funcionales |
| Eventos GA4 no seguian la nomenclatura recomendada | `src/analytics.ts`, `src/main.tsx` | Media | Alias a `click_to_call`, `whatsapp_click`, `location_share_click`, `fare_calculation_started`, `fare_calculation_completed`, `booking_started`, `booking_whatsapp_sent`, `route_page_view`, `google_reviews_click`, `language_changed` | Typecheck |
| Riesgo de prometer 24 horas sin confirmacion | `scripts/seo-check.mjs`, sitemap, `llms.txt` | Alta | Check que impide `24h/24 horas` en title/H1 y elimina ruta 24h del sitemap | `pnpm run seo:check` |
| Resenas y rating no deben inventarse en JSON-LD | `scripts/seo-check.mjs`, `api/reviews.js` | Alta | Se evita `AggregateRating`; resenas visibles proceden de fallback real y API Google si esta configurada | `pnpm run seo:check` |
| Direcciones, coordenadas o mensajes no deben enviarse a Analytics | `src/analytics.ts`, `src/main.tsx` | Alta | Eventos solo con fuente, idioma, modo, proveedor y estado general | Revision de `trackEvent` |
| Idiomas necesitan URLs propias y `hreflang` | `scripts/generate-static-pages.mjs`, `src/seoPages.json` | Alta | Se mantienen URLs multidioma principales con canonical propio, `lang`, `dir` y `x-default` | `pnpm run seo:check` |

## Arquitectura actual

- Framework: Vite 8 + React 18 + TypeScript.
- Renderizado: SPA con HTML SEO estatico generado por `scripts/generate-static-pages.mjs`.
- APIs: `api/route.js`, `api/suggest.js`, `api/reviews.js`.
- Dominio: `https://www.taxiayud.es`; `.com` queda como legado redirigido.
- Analitica: GA4 opcional por variables de entorno y consentimiento.
- Imagenes: assets reales en WebP/JPG optimizados en `public/assets`.

## URLs canonicas prioritarias

- `/`: Taxi en Calatayud y comarca.
- `/taxi-calatayud/`: Servicio local.
- `/servicios/`: Resumen completo.
- `/reservar/`: Reserva y disponibilidad.
- `/tarifas/`: Tarifas oficiales y presupuesto orientativo.
- `/vehiculo/`: Vehiculo, licencia, capacidad y pagos.
- `/taxi-desde-calatayud/`: Hub de trayectos.
- `/taxi-estacion-ave-calatayud/`: Estacion AVE.
- `/taxi-calatayud-monasterio-de-piedra/`: Monasterio de Piedra.
- `/taxi-calatayud-aeropuerto-zaragoza/`: Aeropuerto Zaragoza.
- `/taxi-calatayud-zaragoza/`: Zaragoza.
- `/taxi-calatayud-jaraba-balnearios/`: Jaraba y balnearios.
- `/taxi-calatayud-alhama-de-aragon/`: Alhama de Aragon.
- `/taxi-hoteles-calatayud/`: Hoteles y alojamientos.
- `/taxi-pasajeros-averia-a2-calatayud/`: Pasajeros por averia/incidencia A-2.

## Riesgos pendientes o manuales

- Confirmar si Vercel puede evitar el salto automatico `taxiayud.com` -> `www.taxiayud.com` antes del 301 a `.es`; el contenido ya no se duplica, pero en algunos hosts puede haber dos saltos por configuracion de dominio.
- Confirmar horarios reales antes de publicar cualquier afirmacion de 24 horas.
- Confirmar si se ofrece factura para empresas antes de mencionarlo como servicio.
- Confirmar disponibilidad real de silla infantil, mascotas y necesidades de accesibilidad.
- Configurar `GOOGLE_PLACES_API_KEY` y `GOOGLE_PLACE_ID` en Vercel si se quieren resenas automaticas.
- Revisar Search Console para retirar o reindexar restos antiguos de WordPress como `Hello world!`.

## Comandos de validacion

```bash
pnpm run check
pnpm run lint
pnpm run url:table
pnpm run redirect:check
```

## Referencias tecnicas usadas

- Google Search Central: canonicalizacion, redirecciones y enlaces internos canonicos.
- Google Search Central: datos estructurados LocalBusiness.
- Google Search Central: versiones localizadas y `hreflang`.
