# Calculadora y tarifas

Fecha de revision: 2026-07-23

## Configuracion

Los datos base estan centralizados en:

- `src/config/tarifas.ts`
- `src/data.ts` expone `RATES` para compatibilidad con el codigo existente.

Tarifas interurbanas configuradas:

- Diurna laborable: `0,71 €/km`, espera `18,92 €/h`.
- Nocturna/festiva: `0,79 €/km`, espera `21,54 €/h`.
- Fuente mostrada: `Tarifas interurbanas oficiales 2026 · B.O.A. n.º 238 del 10-12-2025`.

Incluye tambien tarifa urbana y suplementos de la tabla aportada por el propietario, marcados para revision antes de modificar formula.

## Logica de calculo

- Si el destino coincide con tabla habitual y el origen es Calatayud, usa kilometros de tabla.
- Si origen y destino son direcciones concretas, intenta ruta exacta.
- Si ambos puntos estan fuera de la base de Calatayud, la logica interna puede considerar salida desde Calatayud, trayecto solicitado y regreso a Calatayud.
- El cliente ve distancia estimada y precio orientativo; no ve detalles internos que puedan confundir.
- En caso de fallo de proveedor de rutas, se intenta fallback con OpenStreetMap/OSRM y despues estimacion por distancia.

## Proveedores

Opcionales en entorno Vercel:

- `OPENROUTESERVICE_API_KEY`: mejora geocoding/rutas desde API serverless.
- Sin clave, la web utiliza OpenStreetMap/Nominatim/OSRM como fallback.
- `GOOGLE_PLACES_API_KEY` y `GOOGLE_PLACE_ID`: solo para actualizar resenas reales; no son necesarios para calcular rutas.

## Avisos visibles

La web debe mostrar siempre que:

- El presupuesto es orientativo.
- La disponibilidad se confirma por llamada o WhatsApp.
- El precio final puede variar por horario, ruta final, espera y suplementos oficiales.

## Pendiente de confirmacion del propietario

- Validar tarifa oficial 2026 con documento oficial completo.
- Confirmar si algun suplemento debe aplicarse automaticamente o solo mencionarse.
- Confirmar si la tarifa urbana debe usarse para trayectos dentro de Calatayud.
