const EVENT_KEY = "taxiayud:admin-events";
const MAX_EVENTS = 600;
const MAX_TEXT_LENGTH = 140;
const ALLOWED_EVENTS = new Set([
  "page_view",
  "route_page_view",
  "click_to_call",
  "whatsapp_click",
  "location_share_click",
  "fare_calculation_started",
  "fare_calculation_completed",
  "route_search",
  "route_search_result",
  "route_error",
  "booking_started",
  "booking_whatsapp_sent",
  "google_reviews_click",
  "language_changed",
  "tariff_search",
  "destination_selected",
  "save_contact",
  "share_business",
]);
const ALLOWED_PARAM_KEYS = new Set([
  "path",
  "source",
  "language",
  "mode",
  "device",
  "route_type",
  "provider",
  "approximate",
  "base_adjusted",
  "origin",
  "destination",
  "km",
  "passengers",
  "status",
]);

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

async function redisPipeline(commands) {
  const config = redisConfig();
  if (!config) return null;

  const response = await fetch(`${config.url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
  });

  if (!response.ok) throw new Error("No se pudo guardar el evento.");
  return response.json();
}

function safeEventName(value) {
  const clean = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .slice(0, 80);

  return ALLOWED_EVENTS.has(clean) ? clean : "";
}

function safeText(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/[<>]/g, "")
    .replace(/\b\d{1,5}[a-zºª-]?\b/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_TEXT_LENGTH);
}

function safeParams(params = {}) {
  const clean = {};

  for (const [key, value] of Object.entries(params || {})) {
    if (!ALLOWED_PARAM_KEYS.has(key) || value === undefined || value === null) continue;

    if (typeof value === "number") {
      if (Number.isFinite(value)) clean[key] = Math.round(value * 10) / 10;
      continue;
    }

    if (typeof value === "boolean") {
      clean[key] = value;
      continue;
    }

    const text = safeText(value);
    if (text) clean[key] = text;
  }

  return clean;
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ ok: false, message: "Metodo no permitido." });
    return;
  }

  const type = safeEventName(request.body?.type);
  if (!type) {
    response.status(400).json({ ok: false, message: "Evento no valido." });
    return;
  }

  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    createdAt: new Date().toISOString(),
    type,
    params: safeParams(request.body?.params),
  };

  try {
    if (!redisConfig()) {
      response.status(200).json({ ok: true, stored: false });
      return;
    }

    await redisPipeline([
      ["LPUSH", EVENT_KEY, JSON.stringify(entry)],
      ["LTRIM", EVENT_KEY, "0", String(MAX_EVENTS - 1)],
    ]);

    response.status(200).json({ ok: true, stored: true });
  } catch {
    response.status(200).json({ ok: false, stored: false });
  }
}
