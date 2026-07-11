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
  window.gtag?.("event", name, {
    ...params,
    transport_type: "beacon",
  });
}
