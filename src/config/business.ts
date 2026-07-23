export const BUSINESS_CONFIG = {
  tradeName: "Taxi Ayud",
  legalBusinessName: "Taxi Ayud",
  canonicalDomain: "https://www.taxiayud.es",
  phoneDisplay: "611 861 041",
  phoneHref: "tel:611861041",
  phoneE164: "+34611861041",
  whatsapp: "34611861041",
  publicAddress: "Pl. del Fuerte, 50300 Calatayud, Zaragoza",
  publicPlace: "Calatayud, Zaragoza",
  googleProfile: "https://share.google/QJyQ83oNHjkRqtciX",
  googleReviewUrl: "https://share.google/vVhE9TRxVGqUYTwKp",
  license: "Licencia municipal n.º 18",
  vehicle: {
    model: "Peugeot 408 Hybrid",
    color: "blanco",
    maxPassengers: 4,
    luggage: "Maletero amplio",
    climate: "Climatización",
    childSeat: "Consultar antes de reservar",
    pets: "Consultar antes de reservar",
    accessibility: "Consultar necesidades concretas por WhatsApp",
  },
  paymentMethods: ["Efectivo", "Tarjeta", "Bizum", "Apple Pay", "Google Pay"],
  languages: ["es", "en", "fr", "ca", "de", "it", "pt", "nl", "ar"],
  serviceAreas: [
    "Calatayud",
    "Comarca de Calatayud",
    "Estación AVE Calatayud",
    "Monasterio de Piedra",
    "Nuévalos",
    "Jaraba",
    "Alhama de Aragón",
    "Ateca",
    "Maluenda",
    "Ariza",
    "Zaragoza",
    "Aeropuerto de Zaragoza",
    "A-2 y carreteras cercanas a Calatayud",
  ],
} as const;

export type BusinessConfig = typeof BUSINESS_CONFIG;

export function validateBusinessConfig(config: BusinessConfig) {
  const required = [
    config.tradeName,
    config.canonicalDomain,
    config.phoneDisplay,
    config.phoneHref,
    config.phoneE164,
    config.whatsapp,
    config.publicPlace,
    config.googleProfile,
    config.license,
    config.vehicle.model,
  ];

  if (required.some((value) => !String(value || "").trim())) {
    throw new Error("Taxi Ayud: faltan datos obligatorios en BUSINESS_CONFIG.");
  }

  if (!config.phoneHref.startsWith("tel:") || !config.phoneE164.startsWith("+34")) {
    throw new Error("Taxi Ayud: el telefono principal no esta normalizado.");
  }

  if (config.vehicle.maxPassengers < 1 || config.vehicle.maxPassengers > 8) {
    throw new Error("Taxi Ayud: revisa la capacidad de pasajeros del vehiculo.");
  }

  if (!config.canonicalDomain.startsWith("https://www.")) {
    throw new Error("Taxi Ayud: el dominio canonico debe usar https y www.");
  }
}
