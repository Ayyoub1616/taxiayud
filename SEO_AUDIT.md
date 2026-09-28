# SEO_AUDIT Taxi Ayud

Fecha de auditoría: 2026-09-28

## Resumen

Taxi Ayud ya tiene una base técnica fuerte: React/Vite, generación estática de landings, sitemap con hreflang, canonicals, JSON-LD, redirecciones del dominio antiguo y checks propios. La mejora principal aplicada en esta ronda ha sido reforzar la intención principal de la home: taxi en Calatayud, llamada, WhatsApp y calculadora.

## Hallazgos principales

- La home estaba dando demasiado peso a FREENOW en title, description y primera pantalla. Se ha reubicado como canal adicional.
- La campaña San Roque Calatayud 2026 quedaba en el proyecto como si pudiera ser actualidad, aunque la fecha ya pasó. Se ha convertido en contenido evergreen de fiestas/eventos.
- El contador de reseñas puede quedar obsoleto si la API de Google Places no está configurada. La UI ahora solo muestra contador cuando llega dato vivo desde la API.
- Ya existen landings útiles para estación, Monasterio de Piedra, A-2, pueblos, balnearios, Zaragoza, aeropuerto, hoteles, FREENOW, contacto, teléfono y FAQs.
- No conviene crear páginas doorway para cada pueblo. Es mejor reforzar hubs de comarca, balnearios, estación, Monasterio y carretera.

## Estado técnico

- Dominio canónico: `https://www.taxiayud.es/`.
- Redirecciones `.com`, apex `.es` y rutas WordPress antiguas: configuradas en `vercel.json`.
- Sitemap: generado desde `scripts/generate-static-pages.mjs`.
- Robots: apunta al sitemap `.es`.
- Hreflang: configurado para páginas de idioma.
- Favicon: existe en PNG/ICO con URL estable.
- Schema: LocalBusiness/TaxiService, WebSite, WebPage, BreadcrumbList y Service por página.

## Riesgos pendientes

- Comprobar en Search Console si Google ya ha retirado resultados antiguos de WordPress.
- Configurar `GOOGLE_PLACES_API_KEY` y `GOOGLE_PLACE_ID` si se quiere contador de reseñas actualizado automáticamente.
- Revisar Core Web Vitals reales con datos de campo cuando haya tráfico suficiente.
- Mantener Google Business Profile actualizado con fotos, servicios y respuestas a reseñas.

## Referencias oficiales usadas

- Google Search Central: favicons en resultados de búsqueda: https://developers.google.com/search/docs/appearance/favicon-in-search
- Google Search Central: titles y snippets: https://developers.google.com/search/docs/advanced/appearance/good-titles-snippets
- Google Search Central: LocalBusiness structured data: https://developers.google.com/search/docs/appearance/structured-data/local-business
- Google Search Central: versiones localizadas y hreflang: https://developers.google.com/search/docs/specialty/international/localized-versions
- Google Search Central: metadatos válidos: https://developers.google.com/search/docs/crawling-indexing/valid-page-metadata
