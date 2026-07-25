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

export function initAnalytics() {
  if (!analyticsEnabled || !measurementId || initialized || typeof window === "undefined") {
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
  if (!analyticsEnabled || !measurementId || typeof window === "undefined") return;
  const eventName = EVENT_ALIASES[name] ?? name;

  window.gtag?.("event", eventName, {
    ...params,
    transport_type: "beacon",
  });
}
