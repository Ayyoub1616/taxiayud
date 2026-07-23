# Configuración De Dominios

Dominio canónico: `https://www.taxiayud.es`

Dominio legado solo para redirección: `https://www.taxiayud.com`

## Implementado En El Repositorio

`vercel.json` incluye redirecciones permanentes 301 explícitas para:

- `taxiayud.com/(.*)` -> `https://www.taxiayud.es/$1`
- `www.taxiayud.com/(.*)` -> `https://www.taxiayud.es/$1`
- `taxiayud.es/(.*)` -> `https://www.taxiayud.es/$1`
- `/hello-world/`, `/sample-page/` y restos comunes de WordPress -> `https://www.taxiayud.es/`

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
   - `https://www.taxiayud.com/hello-world/`
5. En Search Console, usar `https://www.taxiayud.es` como propiedad principal.

## Pasos DNS En Arsys

Para `taxiayud.es`:

- Crear `CNAME` para `www` apuntando al valor que indique Vercel.
- Configurar el dominio raíz `taxiayud.es` con los registros A/CNAME que indique Vercel.

Para `taxiayud.com`:

- Mantenerlo conectado a Vercel solo para redirigir.
- No indexarlo, no enlazarlo internamente y no dejarlo como dominio principal del proyecto.

## Comprobación Recomendable

Después del despliegue:

```bash
curl -I https://taxiayud.com/taxi-monasterio-de-piedra/
curl -I https://www.taxiayud.com/hello-world/
curl -I https://taxiayud.es/taxi-monasterio-de-piedra/
curl -I https://www.taxiayud.es/sitemap.xml
```

Las URL de `.com` y el apex `.es` deben devolver una redirección permanente hacia `https://www.taxiayud.es/...`. Solo `https://www.taxiayud.es` debe responder 200 con contenido.
