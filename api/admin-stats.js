const EVENT_KEY = "taxiayud:admin-events";
const MAX_EVENTS = 500;

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

function requestToken(request) {
  const auth = request.headers?.authorization || request.headers?.Authorization || "";
  if (String(auth).toLowerCase().startsWith("bearer ")) return String(auth).slice(7).trim();
  return String(request.query?.token || request.headers?.["x-admin-token"] || "").trim();
}

function requireAdmin(request, response) {
  const expected = String(process.env.ADMIN_PANEL_TOKEN || "").trim();

  if (!expected) {
    response.status(503).json({
      ok: false,
      configured: false,
      reason: "missing_admin_token",
      message: "Falta configurar ADMIN_PANEL_TOKEN en Vercel.",
    });
    return false;
  }

  if (requestToken(request) !== expected) {
    response.status(401).json({
      ok: false,
      configured: true,
      reason: "unauthorized",
      message: "Clave incorrecta.",
    });
    return false;
  }

  return true;
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

  if (!response.ok) throw new Error("No se pudieron leer las estadisticas.");
  return response.json();
}

function parseEvents(rawEvents = []) {
  return rawEvents
    .map((raw) => {
      try {
        return typeof raw === "string" ? JSON.parse(raw) : raw;
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .filter((event) => event.createdAt && event.type && event.params);
}

function eventTime(event) {
  return new Date(event.createdAt).getTime();
}

function countBy(events, getter) {
  const map = new Map();

  for (const event of events) {
    const key = getter(event);
    if (!key) continue;
    map.set(key, (map.get(key) || 0) + 1);
  }

  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 12);
}

function routeLabel(event) {
  const origin = event.params?.origin || "Origen sin indicar";
  const destination = event.params?.destination || "Destino sin indicar";
  return `${origin} -> ${destination}`;
}

function summarize(events) {
  const now = Date.now();
  const dayAgo = now - 24 * 60 * 60 * 1000;
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const pageEvents = events.filter((event) => event.type === "page_view" || event.type === "route_page_view");
  const routeEvents = events.filter((event) => event.type === "route_search" || event.type === "route_search_result");
  const whatsappEvents = events.filter((event) => event.type === "whatsapp_click" || event.type === "booking_whatsapp_sent");
  const callEvents = events.filter((event) => event.type === "click_to_call");

  return {
    totalEvents: events.length,
    visits24h: pageEvents.filter((event) => eventTime(event) >= dayAgo).length,
    visits7d: pageEvents.filter((event) => eventTime(event) >= weekAgo).length,
    routeSearches7d: routeEvents.filter((event) => eventTime(event) >= weekAgo).length,
    whatsapp7d: whatsappEvents.filter((event) => eventTime(event) >= weekAgo).length,
    calls7d: callEvents.filter((event) => eventTime(event) >= weekAgo).length,
    topPages: countBy(pageEvents, (event) => event.params?.path),
    topRoutes: countBy(routeEvents, routeLabel),
    topSources: countBy(events, (event) => event.params?.source),
    topLanguages: countBy(events, (event) => event.params?.language),
    byType: countBy(events, (event) => event.type),
  };
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ ok: false, message: "Metodo no permitido." });
    return;
  }

  if (!requireAdmin(request, response)) return;

  if (!redisConfig()) {
    response.status(200).json({
      ok: true,
      configured: false,
      reason: "missing_storage",
      message: "Faltan UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN en Vercel.",
      events: [],
      summary: summarize([]),
    });
    return;
  }

  try {
    const result = await redisPipeline([["LRANGE", EVENT_KEY, "0", String(MAX_EVENTS - 1)]]);
    const rawEvents = Array.isArray(result?.[0]?.result) ? result[0].result : [];
    const events = parseEvents(rawEvents).sort((a, b) => eventTime(b) - eventTime(a));

    response.status(200).json({
      ok: true,
      configured: true,
      generatedAt: new Date().toISOString(),
      summary: summarize(events),
      events: events.slice(0, 120),
    });
  } catch {
    response.status(500).json({
      ok: false,
      configured: true,
      message: "No se pudieron cargar las estadisticas.",
    });
  }
}
