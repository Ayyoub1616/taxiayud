# Informe de implementación

Fecha: 2026-07-11

## Resumen ejecutivo

Se ha renovado la base técnica y SEO de Taxi Ayud para que el dominio principal sea `https://www.taxiayud.es`, con páginas estáticas indexables, contenido inicial en HTML, sitemap completo, datos estructurados, cookies, legal, privacidad, analítica preparada y mejoras de conversión para móvil.

## Archivos modificados o creados

- `index.html`
- `src/main.tsx`
- `src/styles.css`
- `src/data.ts`
- `src/analytics.ts`
- `src/seoPages.json`
- `src/vite-env.d.ts`
- `api/route.js`
- `api/suggest.js`
- `api/reviews.js`
- `public/robots.txt`
- `public/sitemap.xml`
- `public/llms.txt`
- `scripts/generate-static-pages.mjs`
- `scripts/seo-check.mjs`
- `package.json`
- `.env.example`
- `vercel.json`
- `AUDIT.md`
- `SEO_PLAN.md`
- `CONTENT_REQUIRED.md`
- `LOCAL_SEO_ACTIONS.md`
- `IMPLEMENTATION_REPORT.md`

## Páginas creadas

- `/`
- `/taxi-calatayud/`
- `/servicios/`
- `/taxi-estacion-ave-calatayud/`
- `/taxi-monasterio-de-piedra/`
- `/taxi-balnearios-jaraba-alhama/`
- `/taxi-aeropuerto-zaragoza/`
- `/taxi-pueblos-comarca-calatayud/`
- `/contacto/`
- `/preguntas-frecuentes/`
- `404.html` no indexable

## Problemas corregidos

- Dominio canónico `.es` en vez de `.com`.
- Sitemap y robots con `taxiayud.es`.
- Metadatos únicos por URL.
- HTML inicial con H1, texto, teléfono, WhatsApp y enlaces internos.
- JSON-LD por página con entidad local y FAQ.
- Eliminación de hreflang incorrecto.
- Redirecciones de dominio preparadas en `vercel.json`.
- Textos técnicos de API retirados del frontal.
- Reseñas actualizadas a 10, con Raquel C destacada como última reseña.
- Banner de cookies con opción de aceptar o solo necesarias.
- Aviso legal, privacidad y política de cookies rellenos.
- Autocompletado y sugerencias locales mostrando `Calatayud, Zaragoza`.
- GA4 preparado con consentimiento.
- Favicon reemplazado por iconos de Taxi Ayud en `/favicon.ico`, PNG estándar, Apple Touch Icon y manifest.

## Validación realizada

- `pnpm build`: correcto.
- `pnpm seo:check`: correcto.
- JSON-LD parseable en todas las URLs generadas.
- 10 URLs indexables en sitemap.
- Canonicals y Open Graph apuntando a `https://www.taxiayud.es`.
- Contenido principal presente en HTML inicial.
- Revisión responsive en móvil estrecho sin scroll horizontal.
- Favicon comprobado en `/favicon.ico` como icono de Taxi Ayud.

## Pendiente externo

- Publicar en Vercel y conectar `taxiayud.es`.
- Configurar Search Console y enviar sitemap.
- Configurar variables de entorno de OpenRouteService y Google Places si se desea autocompletado/reseñas dinámicas completas.
- Configurar GA4 si se desea medición.
- Completar acciones de Perfil de Empresa de Google y enlaces locales.
- Revisar DNS SPF/DKIM/DMARC con el proveedor de correo.
