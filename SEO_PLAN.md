# Plan SEO y arquitectura

## Objetivo

Mejorar la visibilidad de Taxi Ayud para búsquedas locales reales relacionadas con Calatayud, comarca, estación, Monasterio de Piedra, balnearios, pueblos, Zaragoza y aeropuerto, sin prometer ser “el mejor”, “el número uno” ni crear páginas repetidas.

## Arquitectura implementada

- `/`: portada principal y reserva rápida.
- `/taxi-calatayud/`: intención general “taxi en Calatayud”.
- `/en/taxi-calatayud/`, `/fr/taxi-calatayud/`, `/ca/taxi-calatayud/`, `/de/taxi-calatayud/`, `/it/taxi-calatayud/`, `/pt/taxi-calatayud/`, `/nl/taxi-calatayud/`, `/ar/taxi-calatayud/`: versiones por idioma para visitantes que buscan taxi en Calatayud en su propio idioma.
- `/taxi-desde-calatayud/`: búsquedas de salida desde Calatayud a comarca, estación, balnearios, Zaragoza y aeropuerto.
- `/taxi-pasajeros-averia-a2-calatayud/`: recogida de pasajeros por avería o incidencia en A-2, N-II, Valdeherrera, Ateca, Ariza y carreteras cercanas. No es servicio de grúa.
- `/servicios/`: resumen de servicios reales.
- `/taxi-estacion-ave-calatayud/`: recogidas en estación y tren.
- `/taxi-calatayud-monasterio-de-piedra/`: traslado turístico específico.
- `/taxi-calatayud-jaraba-balnearios/`: Jaraba, Alhama y balnearios.
- `/taxi-calatayud-aeropuerto-zaragoza/`: Zaragoza, Delicias y aeropuerto.
- `/taxi-pueblos-comarca-calatayud/`: pueblos de la comarca sin crear doorway pages.
- `/taxi-cerca-de-mi-calatayud/`: intención local “taxi cerca de mí” en Calatayud.
- `/telefono-taxi-calatayud/`: intención directa de teléfono y WhatsApp. La antigua `/taxi-24-horas-calatayud/` queda redirigida hasta confirmar disponibilidad 24 horas real.
- `/taxi-hoteles-calatayud/`: recogidas en hoteles, alojamientos y casas rurales.
- `/taxi-nuevalos-monasterio-piedra/`: Nuévalos y Monasterio de Piedra.
- `/taxi-jaraba/`: Jaraba y balnearios.
- `/taxi-calatayud-alhama-de-aragon/`: Alhama de Aragón y balnearios.
- `/taxi-ariza/`: Ariza y eje hacia Soria.
- `/taxi-ateca/`: Ateca y pueblos cercanos.
- `/contacto/`: teléfono, WhatsApp y datos para reservar.
- `/telefono-taxi-calatayud/`: intención directa de teléfono y WhatsApp.
- `/preguntas-frecuentes/`: dudas habituales.

## Criterios aplicados

- Una intención clara por URL.
- Titles y descriptions únicos.
- Canonical autorreferente en `https://www.taxiayud.es`.
- H1 único en HTML inicial.
- FAQ útil por página.
- Enlaces internos contextuales.
- Sitemap con solo URLs indexables.
- `llms.txt` con resumen de servicios, contacto y URLs principales.
- `404.html` no indexable.
- JSON-LD con `TaxiService`, `LocalBusiness`, `WebSite`, `WebPage`, `BreadcrumbList` y `FAQPage`.
- `hreflang` en las páginas multilingües reales para que Google relacione cada versión idiomática.

## Contenido

El contenido se ha enfocado en:

- Recogidas en estación, hoteles, domicilios y alojamientos.
- Hoteles, casas rurales, balnearios y zonas turísticas.
- Monasterio de Piedra, Nuévalos, Jaraba, Alhama de Aragón y pueblos.
- Zaragoza, estación Delicias, hospitales y aeropuerto.
- Reserva por llamada o WhatsApp sin obligar a calcular ruta.

## Medición

Eventos preparados:

- `click_to_call`
- `whatsapp_click`
- `location_share_click`
- `fare_calculation_started`
- `fare_calculation_completed`
- `booking_started`
- `booking_whatsapp_sent`
- `route_page_view`
- `google_reviews_click`
- `language_changed`

GA4 solo se carga si:

- `VITE_ENABLE_ANALYTICS=true`
- `VITE_GA_MEASUREMENT_ID` tiene un ID real
- El usuario acepta cookies.

## Próximos pasos SEO

1. Conectar Search Console con `https://www.taxiayud.es`.
2. Enviar `https://www.taxiayud.es/sitemap.xml`.
3. Configurar GA4 en Vercel.
4. Revisar indexación tras publicar.
5. Completar acciones de SEO local del archivo `LOCAL_SEO_ACTIONS.md`.
