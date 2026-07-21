const ORS_BASE_URL = "https://api.openrouteservice.org";
const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";
const CALATAYUD_LAT = "41.3527";
const CALATAYUD_LON = "-1.6432";
const PUBLIC_HEADERS = {
  Accept: "application/json",
  "User-Agent": "TaxiAyudWebsite/1.0 (https://www.taxiayud.es)",
  Referer: "https://www.taxiayud.es/",
};

function withSpain(value) {
  const clean = String(value || "").trim().slice(0, 120);
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

async function fetchJson(url, options = {}, timeoutMs = 7000) {
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

function compactNominatimDetail(item = {}) {
  const address = item.address || {};
  const province =
    address.state_district ||
    address.province ||
    (String(address.state || "").toLowerCase() === "aragón" ? "Zaragoza" : address.state) ||
    address.county;
  const town =
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.locality;
  const parts = [
    item.type,
    [address.road, address.house_number].filter(Boolean).join(" "),
    address.postcode,
    town,
    province,
  ]
    .filter(Boolean)
    .filter((part) => !["ARAGON", "COMUNIDAD DE CALATAYUD"].includes(normalize(part)))
    .map((part) => String(part));

  return [...new Set(parts)].join(" · ");
}

async function suggestionsFromOpenRouteService(query, apiKey) {
  const params = new URLSearchParams({
    text: withSpain(query),
    size: "8",
    layers: "address,street,venue,locality,neighbourhood",
    "boundary.country": "ES",
    "focus.point.lat": CALATAYUD_LAT,
    "focus.point.lon": CALATAYUD_LON,
    lang: "es",
  });

  const data = await fetchJson(`${ORS_BASE_URL}/geocode/autocomplete?${params}`, {
    headers: { Authorization: apiKey, Accept: "application/json" },
  });
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

  return suggestions;
}

async function suggestionsFromOpenStreetMap(query) {
  const params = new URLSearchParams({
    q: withSpain(query),
    format: "jsonv2",
    limit: "8",
    countrycodes: "es",
    addressdetails: "1",
    "accept-language": "es",
  });

  const data = await fetchJson(`${NOMINATIM_BASE_URL}/search?${params}`, {
    headers: PUBLIC_HEADERS,
  });
  const seen = new Set();
  const suggestions = [];

  for (const item of Array.isArray(data) ? data : []) {
    const label = displayLabel(item?.display_name);
    if (!label || seen.has(label) || !item?.lat || !item?.lon) continue;

    seen.add(label);
    suggestions.push({
      label,
      detail: compactNominatimDetail(item),
      layer: item?.type,
      lat: Number(item.lat),
      lng: Number(item.lon),
    });

    if (suggestions.length >= 6) break;
  }

  return suggestions;
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ message: "Método no permitido." });
    return;
  }

  const apiKey = process.env.OPENROUTESERVICE_API_KEY;
  const query = String(request.query?.q || "").trim().slice(0, 120);

  if (query.length < 3) {
    response.status(200).json({ suggestions: [] });
    return;
  }

  try {
    let suggestions = [];

    if (apiKey) {
      try {
        suggestions = await suggestionsFromOpenRouteService(query, apiKey);
      } catch {
        suggestions = [];
      }
    }

    if (!suggestions.length) {
      suggestions = await suggestionsFromOpenStreetMap(query);
    }

    response.status(200).json({ suggestions });
  } catch {
    response.status(200).json({ suggestions: [] });
  }
}
