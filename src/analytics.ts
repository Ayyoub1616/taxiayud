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
  clic_llamada: "click_phone",
  clic_whatsapp: "click_whatsapp",
  consulta_tarifa: "route_calculated",
  clic_reserva: "booking_start",
  formulario_enviado: "booking_whatsapp",
  share_location: "use_location",
  route_whatsapp: "booking_whatsapp",
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
