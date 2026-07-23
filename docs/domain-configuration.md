# Configuración De Dominios

Dominio canónico: `https://www.taxiayud.es`

Dominio secundario: `https://www.taxiayud.com`

## Implementado En El Repositorio

`vercel.json` incluye redirecciones permanentes 301 para:

- `taxiayud.com/:path*` -> `https://www.taxiayud.es/:path*`
- `www.taxiayud.com/:path*` -> `https://www.taxiayud.es/:path*`
- `taxiayud.es/:path*` -> `https://www.taxiayud.es/:path*`

También se han añadido redirecciones de rutas antiguas o menos seguras:

- `/taxi-24-horas-calatayud/` -> `/telefono-taxi-calatayud/`
- `/taxi-a2-recogida-pasajeros/` -> `/taxi-a2-calatayud/`
- `/taxi-fiestas-san-roque-calatayud/` -> `/taxi-san-roque-calatayud/`
- `/taxi-calatayud-delicias/` -> `/taxi-calatayud-zaragoza/`

Las URLs internas, canonical, Open Graph, JSON-LD, robots y sitemap usan solo `https://www.taxiayud.es`.

## Pasos En Vercel

1. En el proyecto de Vercel, añadir estos dominios:
   - `www.taxiayud.es`
   - `taxiayud.es`
   - `www.taxiayud.com`
   - `taxiayud.com`
2. Marcar `www.taxiayud.es` como dominio principal.
3. Verificar que Vercel muestra certificado SSL activo para los cuatro dominios.
4. Confirmar que las redirecciones funcionan:
   - `https://taxiayud.es/taxi-monasterio-de-piedra/`
   - `https://taxiayud.com/taxi-monasterio-de-piedra/`
   - `https://www.taxiayud.com/taxi-monasterio-de-piedra/`
5. En Search Console, usar `https://www.taxiayud.es` como propiedad principal.

## Pasos DNS En Arsys

Para `taxiayud.es`:

- Crear `CNAME` para `www` apuntando al valor que indique Vercel.
- Configurar el dominio raíz `taxiayud.es` con los registros A/CNAME que indique Vercel.

Para `taxiayud.com`:

- Mantenerlo conectado a Vercel solo para redirigir.
- No indexarlo ni enlazarlo internamente.

## Comprobación Recomendable

Después del despliegue:

```bash
curl -I https://taxiayud.com/taxi-monasterio-de-piedra/
curl -I https://taxiayud.es/taxi-monasterio-de-piedra/
curl -I https://www.taxiayud.es/sitemap.xml
```

Los dos primeros deben devolver una redirección permanente hacia `https://www.taxiayud.es/...`.
