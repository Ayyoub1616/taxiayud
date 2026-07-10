# Taxi Ayud

Web moderna para Taxi Ayud Calatayud, lista para desplegar en Vercel sin WordPress.

## Qué incluye

- Portada con imagen optimizada y llamadas directas.
- Calculadora de tarifas desde Calatayud con mensaje de WhatsApp preparado.
- Modo "Taxi ahora" con opción de enviar ubicación del cliente.
- Bloque de reseñas públicas de Google.
- Tabla de destinos frecuentes.
- Servicios, vehículo, métodos de pago y contacto.
- SEO básico y metadatos para compartir.

## Rutas exactas

La calculadora actual usa la tabla de destinos habituales desde Calatayud. Para calcular cualquier dirección exacta de origen y destino en tiempo real hace falta conectar una API de mapas, por ejemplo Google Maps Routes API o Distance Matrix API.

## Vercel

Vercel detecta el proyecto como Vite:

- Install command: `pnpm install`
- Build command: `pnpm build`
- Output directory: `dist`

## Desarrollo local

```bash
pnpm install
pnpm dev
pnpm build
```

La web es estática y no necesita base de datos.
