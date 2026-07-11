const ORS_BASE_URL = "https://api.openrouteservice.org";
const CALATAYUD_LAT = "41.3527";
const CALATAYUD_LON = "-1.6432";

function withSpain(value) {
  const clean = String(value || "").trim();
  if (!clean) return "";
  return /spain|españa/i.test(clean) ? clean : `${clean}, España`;
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
  return String(label || "")
    .replace(/,\s*Aragón,\s*España$/i, ", Zaragoza, España")
    .replace(/^Calatayud,\s*España$/i, "Calatayud, Zaragoza, España")
    .replace(/^Calatayud,\s*Aragón/i, "Calatayud, Zaragoza");
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

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ message: "Método no permitido." });
    return;
  }

  const apiKey = process.env.OPENROUTESERVICE_API_KEY;

  if (!apiKey) {
    response.status(500).json({
      code: "OPENROUTESERVICE_API_KEY_MISSING",
      message: "Ahora mismo no se puede calcular la ruta exacta. Puedes consultar por WhatsApp.",
    });
    return;
  }

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
    const [originPoint, destinationPoint] = await Promise.all([
      directOriginPoint || geocode(origin, apiKey),
      directDestinationPoint || geocode(destination, apiKey),
    ]);
    const route = await getDrivingRoute(originPoint, destinationPoint, apiKey);

    response.status(200).json({
      ...route,
      originLabel: originPoint.label,
      destinationLabel: destinationPoint.label,
      provider: "openrouteservice",
    });
  } catch (error) {
    response.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "No se pudo calcular la ruta exacta.",
    });
  }
}
