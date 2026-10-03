type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === "true";

let initialized = false;

const EVENT_ALIASES: Record<string, string> = {
  clic_llamada: "click_to_call",
  clic_whatsapp: "whatsapp_click",
  consulta_tarifa: "fare_calculation_started",
  clic_reserva: "booking_started",
  formulario_enviado: "booking_whatsapp_sent",
  share_location: "location_share_click",
  route_whatsapp: "booking_whatsapp_sent",
  review_click: "google_reviews_click",
  language_change: "language_changed",
};
const ADMIN_PARAM_KEYS = new Set([
  "path",
  "source",
  "language",
  "mode",
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

function adminConsentAccepted() {
  try {
    return window.localStorage.getItem("taxiayud-cookie-consent") === "accepted";
  } catch {
    return false;
  }
}

function deviceCategory() {
  if (typeof window === "undefined") return "unknown";
  if (window.matchMedia("(max-width: 640px)").matches) return "mobile";
  if (window.matchMedia("(max-width: 1024px)").matches) return "tablet";
  return "desktop";
}

function safeText(value: unknown) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/[<>]/g, "")
    .replace(/\b\d{1,5}[a-zºª-]?\b/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 140);
}

// Record only a fixed, non-identifying campaign source. Do not store full URLs or query strings.
function campaignSource() {
  if (typeof window === "undefined" || !adminConsentAccepted()) return "";
  try {
    const source = new URLSearchParams(window.location.search).get("utm_source")?.toLowerCase();
    const recognized = ["google_business_profile", "google_business", "gbp"].includes(source || "");
    if (recognized) window.sessionStorage.setItem("taxiayud-campaign-source", "google_business_profile");
    return recognized ? "google_business_profile" :
      window.sessionStorage.getItem("taxiayud-campaign-source") === "google_business_profile" ? "google_business_profile" : "";
  } catch {
    return "";
  }
}

function safeAdminParams(params: AnalyticsParams) {
  const clean: AnalyticsParams = {
    path: typeof window !== "undefined" ? window.location.pathname : "/",
    device: deviceCategory(),
    ...(campaignSource() ? { source: campaignSource() } : {}),
  };

  for (const [key, value] of Object.entries(params)) {
    if (!ADMIN_PARAM_KEYS.has(key) || value === undefined) continue;

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

function sendAdminEvent(name: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined" || !adminConsentAccepted()) return;

  const body = JSON.stringify({
    type: name,
    params: safeAdminParams(params),
  });

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/admin-log", new Blob([body], { type: "application/json" }));
      return;
    }
  } catch {
    // Fetch fallback below.
  }

  fetch("/api/admin-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

export function initAnalytics() {
  if (!analyticsEnabled || !measurementId || initialized || typeof window === "undefined" || !adminConsentAccepted()) {
    return;
  }

  initialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true,
    send_page_view: true,
  });
}

export function trackEvent(name: string, params: AnalyticsParams = {}) {
  const eventName = EVENT_ALIASES[name] ?? name;
  sendAdminEvent(eventName, params);

  if (!analyticsEnabled || !measurementId || typeof window === "undefined" || !adminConsentAccepted()) return;

  window.gtag?.("event", eventName, {
    ...params,
    transport_type: "beacon",
  });
}
