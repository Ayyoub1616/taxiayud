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

`vercel.json` ya incluye redirecciones 301 para:

- `taxiayud.com`
- `www.taxiayud.com`
- `taxiayud.es`

El HTML, sitemap y robots apuntan a `https://www.taxiayud.es`.

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
2. Verificar tambien `taxiayud.com` para controlar la migracion.
3. Enviar `https://www.taxiayud.es/sitemap.xml`.
4. Solicitar inspeccion de:
   - `https://www.taxiayud.es/`
   - `https://www.taxiayud.es/tarifas/`
   - `https://www.taxiayud.es/reservar/`
   - `https://www.taxiayud.es/vehiculo/`
5. Usar retirada temporal solo si Google mantiene un resultado `Hello world!` visible y ya no existe contenido util en esa URL.

## Comprobacion rapida

```bash
curl -I https://taxiayud.com/
curl -I https://www.taxiayud.com/
curl -I https://taxiayud.es/
curl -I https://www.taxiayud.es/
```

Esperado:

- Las tres primeras devuelven 301 a `https://www.taxiayud.es/`.
- La ultima devuelve 200.
