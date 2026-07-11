const ORS_BASE_URL = "https://api.openrouteservice.org";
const CALATAYUD_LAT = "41.3527";
const CALATAYUD_LON = "-1.6432";

function withSpain(value) {
  const clean = String(value || "").trim();
  if (!clean) return "";
  return /spain|españa/i.test(clean) ? clean : `${clean}, España`;
}

function compactDetail(properties = {}) {
  const province =
    properties.county ||
    (String(properties.region || "").toLowerCase() === "aragón" ? "Zaragoza" : properties.region);
  const parts = [
    properties.layer,
    [properties.street, properties.housenumber].filter(Boolean).join(" "),
    properties.postalcode,
    properties.locality || properties.localadmin,
    province,
  ]
    .filter(Boolean)
    .map((part) => String(part));

  return [...new Set(parts)].join(" · ");
}

function displayLabel(label) {
  return String(label || "")
    .replace(/,\s*Aragón,\s*España$/i, ", Zaragoza, España")
    .replace(/^Calatayud,\s*España$/i, "Calatayud, Zaragoza, España")
    .replace(/^Calatayud,\s*Aragón/i, "Calatayud, Zaragoza");
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ message: "Método no permitido." });
    return;
  }

  const apiKey = process.env.OPENROUTESERVICE_API_KEY;
  const query = String(request.query?.q || "").trim();

  if (!apiKey || query.length < 3) {
    response.status(200).json({ suggestions: [] });
    return;
  }

  try {
    const params = new URLSearchParams({
      text: withSpain(query),
      size: "8",
      layers: "address,street,venue,locality,neighbourhood",
      "boundary.country": "ES",
      "focus.point.lat": CALATAYUD_LAT,
      "focus.point.lon": CALATAYUD_LON,
      lang: "es",
    });

    const orsResponse = await fetch(`${ORS_BASE_URL}/geocode/autocomplete?${params}`, {
      headers: { Authorization: apiKey },
    });

    if (!orsResponse.ok) {
      response.status(200).json({ suggestions: [] });
      return;
    }

    const data = await orsResponse.json();
    const seen = new Set();
    const suggestions = [];

    for (const feature of data?.features || []) {
      const label = displayLabel(feature?.properties?.label);
      if (!label || seen.has(label)) continue;

      seen.add(label);
      suggestions.push({
        label,
        detail: compactDetail(feature?.properties),
        layer: feature?.properties?.layer,
        lat: feature?.geometry?.coordinates?.[1],
        lng: feature?.geometry?.coordinates?.[0],
      });

      if (suggestions.length >= 6) break;
    }

    response.status(200).json({ suggestions });
  } catch {
    response.status(200).json({ suggestions: [] });
  }
}
