export const OFFICIAL_TARIFF_CONFIG = {
  sourceLabel: "Tarifas interurbanas oficiales 2026 · B.O.A. n.º 238 del 10-12-2025",
  lastReviewed: "2026-07-23",
  validationStatus:
    "Constantes oficiales interurbanas 2026 configuradas con precision completa; revisar con documento oficial antes de cambios de formula.",
  interurban: {
    day: {
      label: "Interurbana diurna",
      time: "Laborables de 6:00 a 22:00",
      // B.O.A. n.º 238 del 10-12-2025: tarifa interurbana 2026 sin redondear.
      pricePerKm: 0.714,
      waitPerHour: 18.921,
      minimumService: 3.5175,
    },
    nightHoliday: {
      label: "Interurbana nocturna/festiva",
      time: "Laborables de 22:00 a 6:00, sabados, domingos y festivos",
      // B.O.A. n.º 238 del 10-12-2025: tarifa interurbana 2026 sin redondear.
      pricePerKm: 0.7875,
      waitPerHour: 21.5355,
      minimumService: 3.675,
    },
  },
  urban: {
    day: {
      label: "Urbana diurna",
      flagFall: 2.51,
      pricePerKm: 0.96,
      waitPerHour: 15.89,
      minimumService: 3.31,
    },
    nightHoliday: {
      label: "Urbana nocturna/festiva",
      flagFall: 3.08,
      pricePerKm: 1.2,
      waitPerHour: 19.08,
      minimumService: 3.99,
    },
  },
  supplements: [
    { label: "Ocupacion de maletero", amount: 0.85 },
    { label: "Recogida a domicilio", amount: 0.68 },
    { label: "Salida de hospital y estaciones", amount: 1.14 },
    { label: "Salida domicilio nocturno y dia de guardia", amount: 3.42 },
    { label: "Festivo senalado", amount: 1.14 },
  ],
  calculation: {
    base: "Calatayud",
    returnFactor: 2,
    customerDisclosure:
      "La web muestra distancia y precio orientativo. La logica interna puede considerar salida y regreso a base cuando corresponde.",
  },
} as const;
