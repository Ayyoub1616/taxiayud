const ORS_BASE_URL = "https://api.openrouteservice.org";
const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";
const OSRM_BASE_URL = "https://router.project-osrm.org";
const CALATAYUD_LAT = "41.3527";
const CALATAYUD_LON = "-1.6432";
const PUBLIC_HEADERS = {
  Accept: "application/json",
  "User-Agent": "TaxiAyudWebsite/1.0 (https://www.taxiayud.es)",
  Referer: "https://www.taxiayud.es/",
};

const COMMON_POINTS = [
  {
    keys: ["CALATAYUD", "CALATAYUD ZARAGOZA"],
    label: "Calatayud, Zaragoza, España",
    lat: 41.3535,
    lng: -1.6434,
  },
  {
    keys: ["PLAZA DEL FUERTE", "PL DEL FUERTE"],
    label: "Plaza del Fuerte, Calatayud, Zaragoza, España",
    lat: 41.3529,
    lng: -1.6431,
  },
  {
    keys: ["ESTACION DE TREN DE CALATAYUD", "RENFE CALATAYUD", "ESTACION CALATAYUD"],
    label: "Estación de tren de Calatayud, Zaragoza, España",
    lat: 41.3521,
    lng: -1.6395,
  },
  {
    keys: ["HOSPITAL ERNEST LLUCH", "HOSPITAL CALATAYUD"],
    label: "Hospital Ernest Lluch, Calatayud, Zaragoza, España",
    lat: 41.3396,
    lng: -1.6515,
  },
  {
    keys: ["MONASTERIO DE PIEDRA", "MONASTERIO PIEDRA"],
    label: "Monasterio de Piedra, Nuévalos, Zaragoza, España",
    lat: 41.1904,
    lng: -1.7822,
  },
  {
    keys: ["NUEVALOS", "NUÉVALOS"],
    label: "Nuévalos, Zaragoza, España",
    lat: 41.2114,
    lng: -1.7891,
  },
  {
    keys: ["ALHAMA DE ARAGON", "ALHAMA DE ARAGÓN", "BALNEARIO ALHAMA", "TERMAS PALLARES"],
    label: "Alhama de Aragón, Zaragoza, España",
    lat: 41.2962,
    lng: -1.8945,
  },
  {
    keys: ["JARABA", "BALNEARIO SICILIA", "BALNEARIO SERON", "BALNEARIO SERÓN"],
    label: "Jaraba, Zaragoza, España",
    lat: 41.1906,
    lng: -1.8843,
  },
  {
    keys: ["ATECA"],
    label: "Ateca, Zaragoza, España",
    lat: 41.3301,
    lng: -1.7939,
  },
  {
    keys: ["A2 CALATAYUD", "A 2 CALATAYUD", "AUTOVIA A2 CALATAYUD", "AUTOVÍA A2 CALATAYUD"],
    label: "Autovía A-2 cerca de Calatayud, Zaragoza, España",
    lat: 41.3253,
    lng: -1.6678,
  },
  {
    keys: ["VALDEHERRERA", "A2 KM 231", "A-2 KM 231"],
    label: "E.S. Valdeherrera, Autovía A-2 km 231, Calatayud, Zaragoza, España",
    lat: 41.3253,
    lng: -1.6678,
  },
  {
    keys: ["ATECA A2", "ATECA A-2", "SALIDA 218", "LA RUBIA"],
    label: "Ateca salida 218, Autovía A-2, Zaragoza, España",
    lat: 41.3301,
    lng: -1.7939,
  },
  {
    keys: ["ARIZA A2", "ARIZA A-2", "A2 KM 197", "A-2 KM 197"],
    label: "Ariza, Autovía A-2 km 197, Zaragoza, España",
    lat: 41.3131,
    lng: -2.0536,
  },
  {
    keys: ["N234 CALATAYUD", "N 234 CALATAYUD", "N-234 CALATAYUD"],
    label: "N-234 cerca de Calatayud, Zaragoza, España",
    lat: 41.3377,
    lng: -1.642,
  },
  {
    keys: ["DAROCA"],
    label: "Daroca, Zaragoza, España",
    lat: 41.1146,
    lng: -1.4143,
  },
  {
    keys: ["SORIA"],
    label: "Soria, Soria, España",
    lat: 41.7666,
    lng: -2.479,
  },
  {
    keys: ["ALMAZAN", "ALMAZÁN"],
    label: "Almazán, Soria, España",
    lat: 41.4865,
    lng: -2.5306,
  },
  {
    keys: ["MEDINACELI"],
    label: "Medinaceli, Soria, España",
    lat: 41.1722,
    lng: -2.4347,
  },
  {
    keys: ["ARCOS DE JALON", "ARCOS DE JALÓN"],
    label: "Arcos de Jalón, Soria, España",
    lat: 41.2153,
    lng: -2.2745,
  },
  {
    keys: ["AGREDA", "ÁGREDA"],
    label: "Ágreda, Soria, España",
    lat: 41.8553,
    lng: -1.9227,
  },
  {
    keys: ["ZARAGOZA", "ZARAGOZA CENTRO"],
    label: "Zaragoza, España",
    lat: 41.6488,
    lng: -0.8891,
  },
  {
    keys: ["ESTACION ZARAGOZA DELICIAS", "ZARAGOZA DELICIAS", "DELICIAS ZARAGOZA"],
    label: "Estación Zaragoza-Delicias, Zaragoza, España",
    lat: 41.6582,
    lng: -0.9118,
  },
  {
    keys: ["AEROPUERTO DE ZARAGOZA", "AEROPUERTO ZARAGOZA"],
    label: "Aeropuerto de Zaragoza, España",
    lat: 41.6662,
    lng: -1.0415,
  },
  {
    keys: ["MADRID"],
    label: "Madrid, España",
    lat: 40.4168,
    lng: -3.7038,
  },
];
const EXACT_COMMON_POINT_KEYS = new Set([
  "CALATAYUD",
  "CALATAYUD ZARAGOZA",
  "ZARAGOZA",
  "ZARAGOZA CENTRO",
  "MADRID",
]);

function withSpain(value) {
  const clean = String(value || "").trim();
  if (!clean) return "";
  return /spain|españa/i.test(clean) ? clean : `${clean}, España`;
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .toUpperCase()
    .trim();
}

function pointFromRequest(point, fallbackLabel) {
  const lat = Number(point?.lat);
  const lng = Number(point?.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return {
    label: point?.label || fallbackLabel,
    lat,
    lng,
  };
}

function displayLabel(label) {
  const ignoredParts = new Set(["ARAGON", "COMUNIDAD DE CALATAYUD"]);
  const parts = String(label || "")
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part && !/^\d{5}$/.test(part))
    .filter((part) => !ignoredParts.has(normalize(part)));
  const cleanParts = [];
  const seen = new Set();

  for (const part of parts) {
    const key = normalize(part);
    if (seen.has(key)) continue;
    seen.add(key);
    cleanParts.push(part);
  }

  return cleanParts
    .join(", ")
    .replace(/,\s*Aragón,\s*España$/i, ", Zaragoza, España")
    .replace(/^Calatayud,\s*España$/i, "Calatayud, Zaragoza, España")
    .replace(/^Calatayud,\s*Aragón/i, "Calatayud, Zaragoza");
}

async function fetchJson(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const fetchResponse = await fetch(url, { ...options, signal: controller.signal });

    if (!fetchResponse.ok) {
      throw new Error("El servicio de mapas no respondió correctamente.");
    }

    return await fetchResponse.json();
  } finally {
    clearTimeout(timeout);
  }
}

function commonPoint(text) {
  const value = normalize(text);
  if (!value) return null;

  const item = COMMON_POINTS.find((point) => {
    return point.keys.some((key) => {
      const normalizedKey = normalize(key);
      const exactOnly = EXACT_COMMON_POINT_KEYS.has(normalizedKey);

      return value === normalizedKey || (!exactOnly && value.includes(normalizedKey));
    });
  });

  return item
    ? {
        label: item.label,
        lat: item.lat,
        lng: item.lng,
      }
    : null;
}

function labelFromNominatim(item, fallbackLabel) {
  return displayLabel(item?.display_name || fallbackLabel);
}

async function geocode(text, apiKey) {
  const params = new URLSearchParams({
    text: withSpain(text),
    size: "5",
    layers: "address,street,venue,locality,neighbourhood",
    "boundary.country": "ES",
    "focus.point.lat": CALATAYUD_LAT,
    "focus.point.lon": CALATAYUD_LON,
    lang: "es",
  });

  const response = await fetch(`${ORS_BASE_URL}/geocode/search?${params}`, {
    headers: { Authorization: apiKey },
  });

  if (!response.ok) {
    throw new Error("No se pudo localizar una de las direcciones.");
  }

  const data = await response.json();
  const feature =
    (data?.features || []).find((item) => item?.geometry?.coordinates) || data?.features?.[0];
  const coordinates = feature?.geometry?.coordinates;

  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    throw new Error("No se encontró una dirección suficientemente clara.");
  }

  return {
    label: displayLabel(feature?.properties?.label),
    lng: coordinates[0],
    lat: coordinates[1],
  };
}

async function geocodeWithOpenStreetMap(text) {
  const known = commonPoint(text);
  if (known) return known;

  const params = new URLSearchParams({
    q: withSpain(text),
    format: "jsonv2",
    limit: "5",
    countrycodes: "es",
    addressdetails: "1",
    "accept-language": "es",
  });

  const data = await fetchJson(`${NOMINATIM_BASE_URL}/search?${params}`, {
    headers: PUBLIC_HEADERS,
  });
  const item = (Array.isArray(data) ? data : []).find((entry) => entry?.lat && entry?.lon);

  if (!item) {
    throw new Error("No se encontró una dirección suficientemente clara.");
  }

  return {
    label: labelFromNominatim(item, text),
    lat: Number(item.lat),
    lng: Number(item.lon),
  };
}

async function getDrivingRoute(origin, destination, apiKey) {
  const response = await fetch(`${ORS_BASE_URL}/v2/directions/driving-car/json`, {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coordinates: [
        [origin.lng, origin.lat],
        [destination.lng, destination.lat],
      ],
      units: "km",
    }),
  });

  if (!response.ok) {
    throw new Error("No se pudo calcular la ruta por carretera.");
  }

  const data = await response.json();
  const summary = data?.routes?.[0]?.summary;

  if (!summary?.distance) {
    throw new Error("La ruta no devolvió distancia.");
  }

  return {
    km: Math.round(Number(summary.distance) * 10) / 10,
    durationMinutes: summary.duration ? Math.round(Number(summary.duration) / 60) : undefined,
  };
}

async function getDrivingRouteWithOpenStreetMap(origin, destination) {
  const coordinates = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
  const params = new URLSearchParams({
    overview: "false",
    alternatives: "false",
    steps: "false",
  });
  const data = await fetchJson(`${OSRM_BASE_URL}/route/v1/driving/${coordinates}?${params}`, {
    headers: PUBLIC_HEADERS,
  });
  const route = data?.routes?.[0];

  if (!route?.distance) {
    throw new Error("La ruta no devolvió distancia.");
  }

  return {
    km: Math.round((Number(route.distance) / 1000) * 10) / 10,
    durationMinutes: route.duration ? Math.round(Number(route.duration) / 60) : undefined,
  };
}

async function calculateWithOpenRouteService(origin, destination, originPoint, destinationPoint, apiKey) {
  const [resolvedOrigin, resolvedDestination] = await Promise.all([
    originPoint || geocode(origin, apiKey),
    destinationPoint || geocode(destination, apiKey),
  ]);
  const route = await getDrivingRoute(resolvedOrigin, resolvedDestination, apiKey);

  return {
    route,
    originPoint: resolvedOrigin,
    destinationPoint: resolvedDestination,
    provider: "openrouteservice",
  };
}

async function calculateWithOpenStreetMap(origin, destination, originPoint, destinationPoint) {
  const [resolvedOrigin, resolvedDestination] = await Promise.all([
    originPoint || geocodeWithOpenStreetMap(origin),
    destinationPoint || geocodeWithOpenStreetMap(destination),
  ]);
  const route = await getDrivingRouteWithOpenStreetMap(resolvedOrigin, resolvedDestination);

  return {
    route,
    originPoint: resolvedOrigin,
    destinationPoint: resolvedDestination,
    provider: "openstreetmap-osrm",
  };
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ message: "Método no permitido." });
    return;
  }

  const apiKey = process.env.OPENROUTESERVICE_API_KEY;

  try {
    const {
      origin,
      destination,
      originPoint: rawOriginPoint,
      destinationPoint: rawDestinationPoint,
    } =
      typeof request.body === "string" ? JSON.parse(request.body) : request.body || {};

    if (!origin || !destination) {
      response.status(400).json({ message: "Indica origen y destino." });
      return;
    }

    const directOriginPoint = pointFromRequest(rawOriginPoint, origin);
    const directDestinationPoint = pointFromRequest(rawDestinationPoint, destination);
    let calculation = null;

    if (apiKey) {
      try {
        calculation = await calculateWithOpenRouteService(
          origin,
          destination,
          directOriginPoint,
          directDestinationPoint,
          apiKey,
        );
      } catch {
        calculation = null;
      }
    }

    if (!calculation) {
      calculation = await calculateWithOpenStreetMap(
        origin,
        destination,
        directOriginPoint,
        directDestinationPoint,
      );
    }

    response.status(200).json({
      ...calculation.route,
      originLabel: calculation.originPoint.label,
      destinationLabel: calculation.destinationPoint.label,
      provider: calculation.provider,
    });
  } catch (error) {
    response.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "No se pudo calcular la ruta exacta. Puedes consultar por WhatsApp.",
    });
  }
}
