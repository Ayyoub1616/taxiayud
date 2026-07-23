export const OFFICIAL_TARIFF_CONFIG = {
  sourceLabel: "Tarifas interurbanas oficiales 2026 · B.O.A. n.º 238 del 10-12-2025",
  lastReviewed: "2026-07-23",
  validationStatus:
    "Valores configurados con la tabla aportada por el propietario; revisar con documento oficial antes de cambios de formula.",
  interurban: {
    day: {
      label: "Interurbana diurna",
      time: "Laborables de 6:00 a 22:00",
      pricePerKm: 0.71,
      waitPerHour: 18.92,
      minimumService: 3.52,
    },
    nightHoliday: {
      label: "Interurbana nocturna/festiva",
      time: "Laborables de 22:00 a 6:00, sabados, domingos y festivos",
      pricePerKm: 0.79,
      waitPerHour: 21.54,
      minimumService: 3.68,
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
