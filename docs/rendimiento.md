# Rendimiento

Fecha: 2026-07-23

## Objetivos

- LCP menor de 2,5 s.
- INP menor de 200 ms.
- CLS menor de 0,1.

## Optimizaciones aplicadas

- Imagenes reales servidas como WebP.
- Hero con dimensiones estables y `prefers-reduced-motion`.
- Tabla completa de tarifas en `details`, evitando que bloquee primera pantalla.
- Reserva rapida y CTA visibles antes de bloques largos.
- Analitica GA4 cargada solo con consentimiento.
- Sin librerias externas de iconos en runtime: iconos SVG propios.
- PWA ligera con manifest, sin service worker que pueda cachear tarifas antiguas.

## Verificacion local

Ejecucion local del 2026-07-23:

```bash
pnpm run build
pnpm run test
```

Resultado:

- Build de produccion correcto.
- SEO check OK: 37 URLs indexables, canonicals `.es` y JSON-LD valido.
- Smoke check OK: 18 comprobaciones criticas.
- Lint/typecheck OK con `tsc -b --pretty false`.

Para medicion real:

1. Desplegar en Vercel.
2. Ejecutar PageSpeed Insights para `https://www.taxiayud.es/`.
3. Revisar Search Console > Core Web Vitals cuando haya datos de campo.

## Riesgos controlados

- El calculo de rutas no carga mapas visuales ni SDK pesado en la primera pantalla.
- Las resenas automaticas usan API serverless si se configuran claves; si no, queda contenido real manual.
- La tabla de destinos sigue disponible, pero no fuerza scroll infinito en la home.
