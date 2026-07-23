# Configuracion de dominios Taxi Ayud

Dominio canonico de la web:

`https://www.taxiayud.es`

## Objetivo

Todas las variantes deben resolver al mismo proyecto de Vercel y redirigir con 301 al dominio canonico:

- `http://taxiayud.es/*` -> `https://www.taxiayud.es/*`
- `https://taxiayud.es/*` -> `https://www.taxiayud.es/*`
- `http://taxiayud.com/*` -> `https://www.taxiayud.es/*`
- `https://taxiayud.com/*` -> `https://www.taxiayud.es/*`
- `http://www.taxiayud.com/*` -> `https://www.taxiayud.es/*`
- `https://www.taxiayud.com/*` -> `https://www.taxiayud.es/*`

Vercel conserva query strings habituales en redirects, por lo que enlaces con UTM siguen llegando a la URL canonica.

## Estado en el repositorio

`vercel.json` incluye redirecciones 301 explicitas para:

- `taxiayud.com`
- `www.taxiayud.com`
- `taxiayud.es`

Tambien redirige restos habituales de WordPress como `/hello-world/`, `/sample-page/` y variantes antiguas hacia la portada canonica.

El HTML, sitemap y robots apuntan a `https://www.taxiayud.es`.

## Diagnostico del 23-07-2026

- `taxiayud.es` redirige correctamente a `https://www.taxiayud.es/`.
- `taxiayud.com/hello-world/` ya no sirve WordPress: devuelve una 404 de Vercel.
- `www.taxiayud.com` seguia sirviendo la misma web con estado 200, por lo que podia generar contenido duplicado frente a `.es`.
- La correccion del repositorio fuerza que `taxiayud.com`, `www.taxiayud.com` y `taxiayud.es` redirijan por 301 a `https://www.taxiayud.es`.

## Pasos en Vercel

1. En el proyecto de Vercel, anadir estos dominios:
   - `www.taxiayud.es`
   - `taxiayud.es`
   - `taxiayud.com`
   - `www.taxiayud.com`
2. Confirmar que el dominio principal sea `www.taxiayud.es`.
3. Revisar que el certificado SSL este activo para los cuatro hosts.
4. Desplegar desde `main`.
5. Probar en navegador privado cada variante.

## Pasos en Arsys/DNS

Configurar DNS segun indique Vercel:

- Para `www`: normalmente CNAME hacia Vercel.
- Para apex (`taxiayud.es` y `taxiayud.com`): A record o configuración recomendada por Vercel.

Eliminar o desactivar cualquier hosting WordPress antiguo que siga respondiendo en `taxiayud.com`. Si `taxiayud.com` no apunta a Vercel, Google puede seguir viendo `Hello world!`.

## Search Console

1. Verificar propiedad de dominio para `taxiayud.es`.
2. Verificar tambien propiedad de dominio para `taxiayud.com` para controlar la migracion y retirar restos antiguos.
3. Enviar `https://www.taxiayud.es/sitemap.xml`.
4. Solicitar inspeccion de:
   - `https://www.taxiayud.es/`
   - `https://www.taxiayud.es/tarifas/`
   - `https://www.taxiayud.es/reservar/`
   - `https://www.taxiayud.es/vehiculo/`
5. Inspeccionar `https://taxiayud.com/hello-world/` y `https://www.taxiayud.com/hello-world/`. Cuando Google vea 301/404 sin WordPress, solicitar retirada temporal solo si el resultado `Hello world!` sigue visible.
6. Revisar que la URL canonica seleccionada por Google sea `https://www.taxiayud.es/`.

## Comprobacion rapida

```bash
curl -I https://taxiayud.com/
curl -I https://www.taxiayud.com/
curl -I https://taxiayud.es/
curl -I https://www.taxiayud.es/
```

Esperado:

- Las tres primeras devuelven 301 a `https://www.taxiayud.es/` despues del nuevo despliegue.
- La ultima devuelve 200.
