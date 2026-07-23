# Auditoría SEO Técnica Y Local

Fecha: 2026-07-23

## Contexto

La web de Taxi Ayud es una aplicación React con Vite y generación estática posterior mediante `scripts/generate-static-pages.mjs`. El contenido SEO indexable se define en `src/seoPages.json` y se escribe como HTML inicial en `dist/` durante `pnpm build`. Los estilos están centralizados en `src/styles.css`, la lógica principal en `src/main.tsx` y los datos de negocio en `src/data.ts`.

## Problemas Detectados

- Varias páginas y metadatos usaban `24h` o `24 horas` sin confirmación explícita del propietario.
- El JSON-LD incluía `AggregateRating`, `openingHoursSpecification`, dirección postal completa y coordenadas. Se han retirado para evitar datos no confirmados o fragmentos sensibles.
- La ruta `/taxi-24-horas-calatayud/` podía competir con búsquedas sensibles de disponibilidad permanente. Se elimina del sitemap y se redirige a `/telefono-taxi-calatayud/`.
- Faltaban páginas específicas para dos intenciones reales de alta demanda: Calatayud-Zaragoza y Zaragoza-Calatayud.
- El bloque de idiomas era largo visualmente. Se mantiene rastreable, pero ahora aparece en un desplegable accesible.
- La barra móvil tenía cuatro acciones y podía resultar cargada. Se reduce a tres acciones principales: llamada, WhatsApp y recogida/ubicación.
- El footer legal podía ser candidato a snippet de Google. Se marca con `data-nosnippet` manteniendo la información accesible.
- El sitemap no declaraba imágenes. Se añaden imágenes reales del taxi y carretera con namespace de imagen.

## Soluciones Aplicadas

- Títulos, H1 y metadescripciones de home, `/taxi-calatayud/` y `/taxi-cerca-de-mi-calatayud/` limpiados de promesas 24h.
- Nuevas URLs indexables:
  - `/taxi-calatayud-zaragoza/`
  - `/taxi-zaragoza-calatayud/`
- Redirecciones 301 añadidas en `vercel.json`:
  - `/taxi-24-horas-calatayud/` -> `/telefono-taxi-calatayud/`
  - `/taxi-a2-recogida-pasajeros/` -> `/taxi-a2-calatayud/`
  - `/taxi-fiestas-san-roque-calatayud/` -> `/taxi-san-roque-calatayud/`
  - `/taxi-calatayud-delicias/` -> `/taxi-calatayud-zaragoza/`
- JSON-LD más prudente: `TaxiService`, `LocalBusiness`, `WebSite`, `WebPage`, `Service`, `BreadcrumbList` y `FAQPage` cuando corresponde.
- Se retira marcado estructurado de reseñas, horarios, dirección postal y coordenadas hasta confirmación.
- Eventos de analítica normalizados: `click_phone`, `click_whatsapp`, `share_location`, `route_calculation`, `route_whatsapp`, `booking_start`, `booking_submit`, `language_change`, `review_click`.
- Nuevas comprobaciones en `scripts/seo-check.mjs` y `scripts/smoke-check.mjs` para evitar regresiones.

## Riesgos Pendientes

- Confirmar si el servicio se ofrece realmente 24 horas antes de reactivar una URL o schema de horario.
- Confirmar si la dirección pública debe ser Plaza del Fuerte u otra ubicación antes de incluir `PostalAddress` y `GeoCoordinates`.
- Confirmar si todos los idiomas se atienden realmente por conversación o solo se usan para facilitar el mensaje inicial.
- Confirmar métodos de pago concretos de tarjeta antes de mostrar marcas como Visa, Mastercard o American Express por separado.

## Resultado

La web queda más segura para SEO local, evita claims no verificados, mantiene contenido estático rastreable, refuerza rutas de Zaragoza y mejora la conversión móvil sin perder llamadas ni WhatsApp.
