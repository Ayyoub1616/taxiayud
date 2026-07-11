# Auditoría técnica, SEO local y conversión

Fecha: 2026-07-11

## Resumen

La web estaba montada en Vite + React como SPA, con buen diseño base y llamadas a acción útiles, pero tenía una incidencia crítica: el dominio canónico, sitemap y metadatos apuntaban a `taxiayud.com` en vez de `taxiayud.es`. También dependía demasiado del renderizado en cliente y no tenía URLs SEO estáticas para servicios principales.

## Hallazgos

| Problema | Gravedad | Evidencia | Consecuencia | Solución | Estado |
|---|---:|---|---|---|---|
| Canonical apuntando a `.com` | Crítica | `index.html` usaba `https://www.taxiayud.com/` | Google podía consolidar señales en el dominio equivocado | Canonicals absolutos en `https://www.taxiayud.es/` y por página | Corregido |
| Sitemap con `.com` y solo portada | Crítica | `public/sitemap.xml` tenía una URL `.com` | Indexación pobre y dominio incorrecto | Sitemap con 10 URLs indexables `.es` | Corregido |
| `robots.txt` apuntando al sitemap `.com` | Alta | `public/robots.txt` | Descubrimiento incorrecto del sitemap | Sitemap `.es` | Corregido |
| Contenido principal dependiente de React | Alta | `index.html` tenía solo `#root` vacío | Google y asistentes podían depender de JS | HTML inicial estático por URL generado en build | Corregido |
| Sin arquitectura SEO por intención | Alta | Todo concentrado en una landing | Menos relevancia para estación, Monasterio, balnearios, aeropuerto, pueblos | URLs estáticas con title, description, H1, FAQ y enlaces internos | Corregido |
| Hreflang incorrecto | Media | Varias alternates apuntaban a la misma URL | Señal internacional confusa | Eliminado hasta tener URLs reales por idioma | Corregido |
| Textos técnicos visibles | Media | Referencias a proveedor/API en calculadora | Menos confianza para clientes | Mensajes sustituidos por textos de reserva/WhatsApp | Corregido |
| Falta de analítica configurable | Media | No había GA4 | No se medían llamadas/WhatsApp/calculadora | Integración GA4 por variables de entorno y consentimiento | Corregido |
| Legal, privacidad y cookies ausentes | Media | No había bloque legal visible | Riesgo legal y falta de confianza | Aviso legal, privacidad, cookies y banner | Corregido |
| Autocompletado mostrando región | Baja | Sugerencias podían mostrar Aragón en vez de Zaragoza | Menos claridad para usuarios | Sugerencias locales con `Calatayud, Zaragoza` y normalización en API | Corregido |
| Redirecciones de dominio no declaradas | Media | No había `vercel.json` | Posibles cadenas o dominio no preferido | Redirecciones host `.com`, raíz `.es` a `www.taxiayud.es` | Corregido en Vercel config |
| Backlinks/autoridad local | Alta | No depende del código | Dificulta competir en Maps y SEO local | Plan de acciones externas | Requiere acción externa |
| SPF/DKIM/DMARC | Media | Es DNS/correo, no repositorio | Entregabilidad y confianza de correo | Documentado como acción externa | Requiere acción externa |

## Stack detectado

- Framework: React 18 + Vite 5.
- Rutas: SPA React con generación estática post-build para URLs SEO.
- Renderizado: cliente + HTML estático inicial generado en `dist`.
- Estilos: CSS propio en `src/styles.css`.
- APIs: Vercel serverless en `api/route.js`, `api/suggest.js`, `api/reviews.js`.
- Hosting previsto: Vercel.
- Analítica: GA4 preparada, desactivada hasta configurar entorno y aceptar cookies.
