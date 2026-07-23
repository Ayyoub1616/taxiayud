# Auditoria web Taxi Ayud

Fecha: 2026-07-23

## Resumen

La web ya cuenta con base solida: React/Vite, generacion estatica de paginas SEO, sitemap, canonical a `https://www.taxiayud.es`, redirecciones de dominios en Vercel, calculadora con fallback OpenStreetMap/OSRM, reseña principal real, imagenes reales del vehiculo, cookie banner, footer legal con `data-nosnippet` y mensajes de WhatsApp por idioma.

La prioridad es mantener una experiencia movil directa: llamar, WhatsApp, enviar ubicacion, reserva rapida y calculadora orientativa sin obligar al usuario a completar rutas.

## P0 Criticos

- Unificar dominio canonico en produccion: `.com`, `www.taxiayud.com`, `taxiayud.es` y HTTP deben redirigir a `https://www.taxiayud.es` con 301.
- Eliminar o desconectar el WordPress antiguo que aun pueda servir `Hello world!` desde `taxiayud.com` si DNS/Vercel no apuntan todos los hosts al mismo proyecto.
- Mantener datos legales sensibles fuera de metadescripcion, Open Graph, JSON-LD y texto promocional. El footer legal se mantiene con `data-nosnippet`.
- No publicar tarifas como precio cerrado. La calculadora y tabla deben indicar presupuesto orientativo sujeto a confirmacion directa.

## P1 Importantes

- La home movil debe mostrar acciones utiles antes de bloques largos: llamada, WhatsApp, ubicacion y reserva rapida.
- La tabla completa de destinos no debe bloquear la home. Debe estar en desplegable, con filtros y version legible en movil.
- La reserva de carretera debe separar consejos para el cliente del mensaje enviado al taxista. El mensaje de WhatsApp queda limpio.
- Los idiomas deben traducir acciones, botones, avisos y mensajes principales. Se mantiene aviso del idioma del cliente dentro de WhatsApp.
- La calculadora debe tener fallback profesional cuando el proveedor de rutas falle.

## P2 Mejora continua

- Revisar con propietario datos reales: silla infantil, mascotas, accesibilidad, capacidad exacta de equipaje y si hay disponibilidad horaria definida.
- Confirmar documento oficial de tarifas cada vez que cambie B.O.A. o normativa local.
- Completar Google Places API si se quiere actualizacion automatica de resenas reales.
- Revisar Search Console despues de desplegar `.es` para solicitar reindexacion de URLs antiguas `.com`.

## P3 Optimización futura

- Medir Lighthouse real en produccion tras desplegar en Vercel.
- Anadir imagen interior real si el propietario la facilita.
- Crear contenido editorial solo si existe servicio real: empresas, mutuas, fiestas, enoturismo o traslados medicos.

## Cambios implementados en esta revision

- Nuevo panel centralizado `src/config/business.ts`.
- Nuevo panel de tarifas `src/config/tarifas.ts`.
- Reserva rapida con modo ahora/programado, recogidas habituales, ubicacion, destino, pasajeros, equipaje, ida/vuelta, tren/vuelo y WhatsApp limpio.
- Favoritos de destino con `localStorage`, sin coordenadas y con opcion de borrar.
- Boton `Guardar contacto` con `.vcf`.
- Boton `Compartir taxi` con Web Share API y fallback de copiar enlace.
- Barra movil simplificada: llamar, WhatsApp, ubicacion.
- Tabla completa de tarifas filtrable por categoria y buscador.
- Nuevas rutas SEO: `/reservar/`, `/tarifas/`, `/vehiculo/`.

## Referencias SEO usadas

- Google Search Central: canonicalizacion y redirecciones.
- Google Search Central: versiones localizadas y `hreflang`.
- Google Search Central: datos estructurados LocalBusiness.
- Google Search Central: `robots`, `nosnippet` y `data-nosnippet`.
