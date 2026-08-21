import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const siteUrl = "https://www.taxiayud.es";
const pages = JSON.parse(readFileSync("src/seoPages.json", "utf8"));
const template = readFileSync("dist/index.html", "utf8");
const buildDate = new Date().toISOString().slice(0, 10);
const htmlLangByPrefix = {
  "/en/": "en",
  "/fr/": "fr",
  "/ca/": "ca-ES",
  "/de/": "de",
  "/it/": "it",
  "/pt/": "pt",
  "/nl/": "nl",
  "/ar/": "ar",
};
const ogLocaleByLang = {
  "es-ES": "es_ES",
  en: "en_GB",
  fr: "fr_FR",
  "ca-ES": "ca_ES",
  de: "de_DE",
  it: "it_IT",
  pt: "pt_PT",
  nl: "nl_NL",
  ar: "ar_AR",
};
const localizedTaxiAlternates = [
  { path: "/taxi-calatayud/", hreflang: "es-ES", label: "Español" },
  { path: "/en/taxi-calatayud/", hreflang: "en", label: "English" },
  { path: "/fr/taxi-calatayud/", hreflang: "fr", label: "Français" },
  { path: "/ca/taxi-calatayud/", hreflang: "ca-ES", label: "Català" },
  { path: "/de/taxi-calatayud/", hreflang: "de", label: "Deutsch" },
  { path: "/it/taxi-calatayud/", hreflang: "it", label: "Italiano" },
  { path: "/pt/taxi-calatayud/", hreflang: "pt", label: "Português" },
  { path: "/nl/taxi-calatayud/", hreflang: "nl", label: "Nederlands" },
  { path: "/ar/taxi-calatayud/", hreflang: "ar", label: "العربية" },
];
const localizedTaxiPaths = new Set(localizedTaxiAlternates.map((item) => item.path));
const priorityStaticLinks = [
  "/taxi-calatayud/",
  "/taxi-cerca-de-mi-calatayud/",
  "/taxi-averia-carretera-calatayud/",
  "/taxi-pasajeros-averia-a2-calatayud/",
  "/taxi-a2-valdeherrera-ateca-ariza/",
  "/taxi-estacion-calatayud-monasterio-de-piedra/",
  "/taxi-hoteles-calatayud/",
  "/taxi-pueblos-comarca-calatayud/",
  "/taxi-calatayud-monasterio-de-piedra/",
  "/taxi-calatayud-jaraba-balnearios/",
  "/taxi-calatayud-aeropuerto-zaragoza/",
  "/telefono-taxi-calatayud/",
  "/reservar/",
  "/tarifas/",
];
const staticCopy = {
  "es-ES": {
    call: "Llamar al 611 861 041",
    whatsapp: "Reservar por WhatsApp",
    serviceAreasHeading: "Zonas habituales de recogida",
    serviceAreasText:
      "Taxi oficial con recogidas en Calatayud, hoteles, estación, balnearios, pueblos de la comarca y destinos turísticos cercanos.",
    imageAlt: "Taxi Ayud Calatayud Peugeot 408 Hybrid blanco en la comarca de Calatayud",
    imageCaption: "Taxi oficial en Calatayud para estación AVE, comarca, balnearios, Monasterio de Piedra, A-2, Zaragoza y aeropuerto.",
    faqHeading: "Preguntas frecuentes",
    related: "Rutas relacionadas",
  },
  en: {
    call: "Call 611 861 041",
    whatsapp: "Book by WhatsApp",
    serviceAreasHeading: "Frequent pick-up areas",
    serviceAreasText:
      "Official taxi pick-ups in Calatayud, hotels, the station, spas, nearby villages and tourist destinations.",
    imageAlt: "Taxi Ayud Calatayud white Peugeot 408 Hybrid in the Calatayud area",
    imageCaption: "Official taxi in Calatayud for the AVE station, local villages, spas, Monasterio de Piedra, the A-2, Zaragoza and airport.",
    faqHeading: "Frequently asked questions",
    related: "Related taxi pages",
  },
  fr: {
    call: "Appeler le 611 861 041",
    whatsapp: "Réserver par WhatsApp",
    serviceAreasHeading: "Zones de prise en charge habituelles",
    serviceAreasText:
      "Taxi officiel avec prises en charge à Calatayud, hôtels, gare, thermes, villages proches et destinations touristiques.",
    imageAlt: "Taxi Ayud Calatayud Peugeot 408 Hybrid blanc dans la région de Calatayud",
    imageCaption: "Taxi officiel à Calatayud pour la gare AVE, villages, thermes, Monasterio de Piedra, A-2, Saragosse et aéroport.",
    faqHeading: "Questions fréquentes",
    related: "Pages taxi liées",
  },
  "ca-ES": {
    call: "Trucar al 611 861 041",
    whatsapp: "Reservar per WhatsApp",
    serviceAreasHeading: "Zones habituals de recollida",
    serviceAreasText:
      "Taxi oficial amb recollides a Calatayud, hotels, estació, balnearis, pobles propers i destinacions turístiques.",
    imageAlt: "Taxi Ayud Calatayud Peugeot 408 Hybrid blanc a la comarca de Calatayud",
    imageCaption: "Taxi oficial a Calatayud per a estació AVE, comarca, balnearis, Monasterio de Piedra, A-2, Saragossa i aeroport.",
    faqHeading: "Preguntes freqüents",
    related: "Pàgines relacionades",
  },
  de: {
    call: "611 861 041 anrufen",
    whatsapp: "Per WhatsApp buchen",
    serviceAreasHeading: "Häufige Abholbereiche",
    serviceAreasText:
      "Offizielles Taxi mit Abholung in Calatayud, Hotels, Bahnhof, Thermalbädern, nahen Orten und touristischen Zielen.",
    imageAlt: "Taxi Ayud Calatayud weißer Peugeot 408 Hybrid in der Region Calatayud",
    imageCaption: "Offizielles Taxi in Calatayud für AVE-Bahnhof, Dörfer, Thermalbäder, Monasterio de Piedra, A-2, Zaragoza und Flughafen.",
    faqHeading: "Häufige Fragen",
    related: "Verwandte Taxiseiten",
  },
  it: {
    call: "Chiama 611 861 041",
    whatsapp: "Prenota su WhatsApp",
    serviceAreasHeading: "Zone abituali di ritiro",
    serviceAreasText:
      "Taxi ufficiale con ritiri a Calatayud, hotel, stazione, terme, paesi vicini e destinazioni turistiche.",
    imageAlt: "Taxi Ayud Calatayud Peugeot 408 Hybrid bianco nella comarca di Calatayud",
    imageCaption: "Taxi ufficiale a Calatayud per stazione AVE, comarca, terme, Monasterio de Piedra, A-2, Saragozza e aeroporto.",
    faqHeading: "Domande frequenti",
    related: "Pagine taxi correlate",
  },
  pt: {
    call: "Ligar 611 861 041",
    whatsapp: "Reservar por WhatsApp",
    serviceAreasHeading: "Áreas habituais de recolha",
    serviceAreasText:
      "Táxi oficial com recolhas em Calatayud, hotéis, estação, termas, aldeias próximas e destinos turísticos.",
    imageAlt: "Taxi Ayud Calatayud Peugeot 408 Hybrid branco na comarca de Calatayud",
    imageCaption: "Táxi oficial em Calatayud para estação AVE, comarca, termas, Monasterio de Piedra, A-2, Zaragoza e aeroporto.",
    faqHeading: "Perguntas frequentes",
    related: "Páginas relacionadas",
  },
  nl: {
    call: "Bel 611 861 041",
    whatsapp: "Boek via WhatsApp",
    serviceAreasHeading: "Veelgebruikte ophaalgebieden",
    serviceAreasText:
      "Officiële taxi met ophaalservice in Calatayud, hotels, station, kuuroorden, nabijgelegen dorpen en toeristische bestemmingen.",
    imageAlt: "Taxi Ayud Calatayud witte Peugeot 408 Hybrid in de regio Calatayud",
    imageCaption: "Officiële taxi in Calatayud voor AVE-station, dorpen, kuuroorden, Monasterio de Piedra, A-2, Zaragoza en luchthaven.",
    faqHeading: "Veelgestelde vragen",
    related: "Gerelateerde taxipagina's",
  },
  ar: {
    call: "اتصل على 611 861 041",
    whatsapp: "احجز عبر واتساب",
    serviceAreasHeading: "مناطق الاستلام الشائعة",
    serviceAreasText:
      "تاكسي رسمي مع استلام في كالاتايود والفنادق والمحطة والمنتجعات والقرى القريبة والوجهات السياحية.",
    imageAlt: "Taxi Ayud Calatayud Peugeot 408 Hybrid أبيض في منطقة كالاتايود",
    imageCaption: "تاكسي رسمي في كالاتايود للمحطة والقرى والمنتجعات وMonasterio de Piedra وطريق A-2 وسرقسطة والمطار.",
    faqHeading: "الأسئلة الشائعة",
    related: "صفحات تاكسي ذات صلة",
  },
};

const businessGraph = {
  "@type": ["TaxiService", "LocalBusiness"],
  "@id": `${siteUrl}/#taxi-ayud`,
  name: "Taxi Ayud",
  alternateName: [
    "Taxi Calatayud Ayud",
    "Taxi Ayud Calatayud",
    "Taxi en Calatayud",
    "Taxi desde Calatayud",
    "Taxi cerca de mi Calatayud",
    "Taxi avería autovía Calatayud",
    "Taxi A-2 Calatayud",
    "Taxi avería A-2 Calatayud",
    "Taxi avería carretera Calatayud",
    "Taxi estación Calatayud Monasterio de Piedra",
    "Taxi A-2 Valdeherrera Ateca Ariza",
    "Teléfono taxi Calatayud",
  ],
  slogan: "Tu taxi de confianza en Calatayud",
  description:
    "Taxi oficial en Calatayud para traslados a Monasterio de Piedra, Zaragoza, aeropuerto, estación, balnearios y pueblos de la comarca.",
  telephone: "+34611861041",
  areaServed: [
    "Calatayud",
    "Comarca de Calatayud",
    "A-2 Calatayud",
    "Autovía A-2",
    "A-2 km 231 Valdeherrera",
    "A-2 salida Ateca",
    "A-2 Ariza",
    "A-2 Valdeherrera Ateca Ariza",
    "N-II Calatayud",
    "N-234 Calatayud",
    "Carreteras de la comarca de Calatayud",
    "Monasterio de Piedra",
    "Nuévalos",
    "Jaraba",
    "Alhama de Aragón",
    "Ateca",
    "Ariza",
    "Maluenda",
    "Cetina",
    "Paracuellos de Jiloca",
    "Munébrega",
    "Ibdes",
    "Carenas",
    "Daroca",
    "Zaragoza",
    "Aeropuerto de Zaragoza",
    "Estación Zaragoza-Delicias",
    "Aragón",
    "Fiestas de San Roque Calatayud",
    "Fiestas patronales comarca de Calatayud",
  ],
  url: `${siteUrl}/`,
  image: [
    `${siteUrl}/assets/og-image.jpg`,
    `${siteUrl}/assets/peugeot-408-hybrid.webp`,
    `${siteUrl}/assets/taxi-calatayud-landscape.webp`,
    `${siteUrl}/assets/roadside-pickup-taxi.webp`,
  ],
  logo: `${siteUrl}/assets/logo.webp`,
  priceRange: "€€",
  paymentAccepted: ["Cash", "Credit Card", "Bizum", "Apple Pay", "Google Pay"],
  currenciesAccepted: "EUR",
  hasMap: "https://share.google/QJyQ83oNHjkRqtciX",
  sameAs: ["https://share.google/QJyQ83oNHjkRqtciX"],
  knowsAbout: [
    "taxi en Calatayud",
    "taxi desde Calatayud",
    "taxi cerca de mi en Calatayud",
    "taxi por avería en autovía cerca de Calatayud",
    "taxi por avería en carretera cerca de Calatayud",
    "taxi A-2 Calatayud",
    "taxi avería A-2 Calatayud",
    "taxi A-2 Valdeherrera Ateca Ariza",
    "taxi estación Calatayud Monasterio de Piedra",
    "taxi desde estación de Calatayud al Monasterio de Piedra",
    "taxi me he quedado tirado cerca de Calatayud",
    "recogida de pasajeros en carretera cerca de Calatayud",
    "teléfono taxi Calatayud",
    "WhatsApp taxi Calatayud",
    "traslados a Monasterio de Piedra",
    "taxi a balnearios de Jaraba y Alhama",
    "taxi estación AVE Calatayud",
    "taxi Aeropuerto de Zaragoza",
    "taxi pueblos comarca de Calatayud",
    "taxi fiestas Calatayud",
    "taxi San Roque Calatayud",
    "taxi fiestas pueblos comarca de Calatayud",
    "taxi eventos Calatayud",
    "taxi hoteles fiestas Calatayud",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios de taxi en Calatayud y comarca",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Taxi cerca de mi en Calatayud",
          serviceType: "Recogida local de taxi",
          areaServed: "Calatayud",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Taxi desde Calatayud",
          serviceType: "Traslados desde Calatayud",
          areaServed: "Comarca de Calatayud, Zaragoza",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Taxi por avería en autovía cerca de Calatayud",
          serviceType: "Recogida de pasajeros en carretera",
          areaServed: "A-2, N-II, N-234 y carreteras de la comarca de Calatayud",
          description: "Servicio de taxi para pasajeros, no grúa ni asistencia mecánica.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Taxi por avería en carretera cerca de Calatayud",
          serviceType: "Recogida de pasajeros por incidencia en carretera",
          areaServed: "A-2, N-II, N-234, Valdeherrera, Ateca, Ariza y carreteras cercanas a Calatayud",
          description: "Taxi para pasajeros que necesitan continuar viaje desde carretera hacia Calatayud, hotel, estación, taller o destino confirmado.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Taxi A-2 cerca de Calatayud",
          serviceType: "Recogida de pasajeros en la A-2",
          areaServed: "Autovía A-2, Valdeherrera, Ateca, Ariza y Calatayud",
          description: "Traslado de pasajeros desde puntos seguros de la A-2 hacia Calatayud, taller, hotel, estación o destino confirmado.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Taxi A-2 Valdeherrera Ateca Ariza",
          serviceType: "Recogida de pasajeros en autovía A-2",
          areaServed: "Valdeherrera, Ateca, Ariza, Calatayud y salidas próximas de la A-2",
          description: "Recogida de pasajeros en puntos habituales de la A-2 con ubicación y confirmación directa por WhatsApp.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Teléfono y WhatsApp taxi Calatayud",
          serviceType: "Reserva directa de taxi",
          areaServed: "Calatayud",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Taxi a Monasterio de Piedra y Nuévalos",
          serviceType: "Traslado turístico",
          areaServed: "Comarca de Calatayud",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Taxi estación Calatayud a Monasterio de Piedra",
          serviceType: "Traslado turístico desde estación AVE",
          areaServed: "Estación de Calatayud, Nuévalos y Monasterio de Piedra",
          description: "Taxi para viajeros que llegan en tren a Calatayud y continúan hacia Monasterio de Piedra, Nuévalos, hoteles o vuelta programada.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Taxi a balnearios de Jaraba y Alhama de Aragón",
          serviceType: "Traslado a balnearios",
          areaServed: "Jaraba, Alhama de Aragón",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Taxi Calatayud Aeropuerto de Zaragoza",
          serviceType: "Traslado al aeropuerto",
          areaServed: "Zaragoza",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Taxi para fiestas en Calatayud y San Roque",
          serviceType: "Traslados para fiestas, eventos y vueltas programadas",
          areaServed: "Calatayud, San Roque Calatayud, estación, hoteles y pueblos de la comarca",
          description: "Reserva anticipada de taxi por WhatsApp para fiestas, eventos, noches de verano, estación, hoteles y traslados a pueblos cercanos.",
        },
      },
    ],
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+34611861041",
    contactType: "reservas de taxi",
    areaServed: "ES",
  },
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function absoluteUrl(path) {
  return `${siteUrl}${path === "/" ? "/" : path}`;
}

function pageLang(page) {
  const entry = Object.entries(htmlLangByPrefix).find(([prefix]) => page.path.startsWith(prefix));
  return entry?.[1] ?? "es-ES";
}

function pageDir(page) {
  return pageLang(page) === "ar" ? "rtl" : "ltr";
}

function pageStaticCopy(page) {
  return staticCopy[pageLang(page)] ?? staticCopy["es-ES"];
}

function isLocalizedTaxiPage(path) {
  return localizedTaxiPaths.has(path);
}

function serviceAreasForPage(page) {
  if (page.path.includes("estacion-ave")) {
    return ["Estación AVE de Calatayud", "Plaza del Fuerte", "Hoteles de Calatayud", "Monasterio de Piedra", "Balnearios", "Pueblos de la comarca"];
  }
  if (page.path.includes("monasterio") || page.path.includes("nuevalos")) {
    return ["Monasterio de Piedra", "Nuévalos", "Embalse de La Tranquera", "Ibdes", "Calatayud", "Estación AVE de Calatayud"];
  }
  if (page.path.includes("balnearios") || page.path.includes("jaraba") || page.path.includes("alhama")) {
    return ["Jaraba", "Alhama de Aragón", "Paracuellos de Jiloca", "Balneario Sicilia", "Balneario Serón", "Balneario de la Virgen", "Termas Pallarés"];
  }
  if (page.path.includes("aeropuerto") || page.path.includes("zaragoza")) {
    return ["Calatayud", "Zaragoza", "Zaragoza-Delicias", "Aeropuerto de Zaragoza", "Hospitales de Zaragoza", "Hoteles de Zaragoza"];
  }
  if (page.path.includes("a2") || page.path.includes("autovia") || page.path.includes("averia-carretera")) {
    return ["A-2 Valdeherrera", "A-2 Ateca", "A-2 Ariza", "N-II Calatayud", "N-234 Calatayud", "Talleres, hoteles y estación de Calatayud"];
  }
  if (page.path.includes("pueblos") || page.path.includes("ariza") || page.path.includes("ateca")) {
    return ["Ateca", "Ariza", "Maluenda", "Terrer", "Munébrega", "Ibdes", "Jaraba", "Alhama de Aragón", "Nuévalos", "Paracuellos de Jiloca"];
  }
  if (page.path.includes("fiestas") || page.path.includes("san-roque")) {
    return ["San Roque Calatayud", "Hoteles de Calatayud", "Estación de Calatayud", "Pueblos de la comarca", "Restaurantes y eventos"];
  }

  return ["Calatayud", "Estación AVE de Calatayud", "Hoteles de Calatayud", "Pueblos de la comarca", "Monasterio de Piedra", "Balnearios", "Zaragoza"];
}

function alternateTags(page) {
  if (!isLocalizedTaxiPage(page.path)) return "";

  const tags = localizedTaxiAlternates.map(
    (alternate) =>
      `<link rel="alternate" hreflang="${alternate.hreflang}" href="${absoluteUrl(alternate.path)}" />`,
  );
  tags.push(`<link rel="alternate" hreflang="x-default" href="${absoluteUrl("/taxi-calatayud/")}" />`);
  return `${tags.join("\n    ")}\n    `;
}

function sitemapAlternateTags(page) {
  if (!isLocalizedTaxiPage(page.path)) return "";

  const tags = localizedTaxiAlternates.map(
    (alternate) =>
      `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${absoluteUrl(alternate.path)}" />`,
  );
  tags.push(
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl("/taxi-calatayud/")}" />`,
  );
  return `\n${tags.join("\n")}`;
}

function sitemapImageTags(page) {
  const images = page.path.includes("a2") || page.path.includes("autovia") || page.path.includes("averia-carretera")
    ? [
        {
          loc: `${siteUrl}/assets/roadside-pickup-taxi.webp`,
          title: "Taxi Ayud recogida de pasajeros en carretera cerca de Calatayud",
        },
      ]
    : [
        {
          loc: `${siteUrl}/assets/taxi-calatayud-landscape.webp`,
          title: "Taxi Ayud en la comarca de Calatayud",
        },
        {
          loc: `${siteUrl}/assets/peugeot-408-hybrid.webp`,
          title: "Taxi Ayud Peugeot 408 Hybrid blanco",
        },
      ];

  return images
    .map(
      (image) => `    <image:image>
      <image:loc>${image.loc}</image:loc>
      <image:title>${escapeHtml(image.title)}</image:title>
    </image:image>`,
    )
    .join("\n");
}

function uniquePagesByPath(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item || seen.has(item.path)) return false;
    seen.add(item.path);
    return true;
  });
}

function staticFallback(page) {
  const copy = pageStaticCopy(page);
  const prioritizedPages = priorityStaticLinks.map((path) => pages.find((item) => item.path === path));
  const links = uniquePagesByPath([...prioritizedPages, ...pages])
    .filter((item) => item.path !== page.path && (!isLocalizedTaxiPage(page.path) || isLocalizedTaxiPage(item.path)))
    .slice(0, 14)
    .map((item) => `<a href="${item.path}">${escapeHtml(item.navLabel)}</a>`)
    .join(" ");
  const serviceAreas = serviceAreasForPage(page)
    .map((area) => `<li>${escapeHtml(area)}</li>`)
    .join("");
  const sections = page.sections
    .map(
      (section) =>
        `<section><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.text)}</p></section>`,
    )
    .join("");
  const faqItems = page.faq
    .map(
      (item) =>
        `<details><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`,
    )
    .join("");
  const faq = faqItems
    ? `<section class="static-faq" id="faq"><h2>${escapeHtml(copy.faqHeading)}</h2>${faqItems}</section>`
    : "";

  const roadImage = page.path.includes("a2") || page.path.includes("autovia") || page.path.includes("averia-carretera");
  const imageSrc = roadImage ? "/assets/roadside-pickup-taxi.webp" : "/assets/taxi-calatayud-landscape.webp";
  const imageAlt = roadImage
    ? "Taxi Ayud recogiendo pasajeros por avería en carretera cerca de Calatayud"
    : copy.imageAlt;
  const imageCaption = roadImage
    ? "Taxi para pasajeros por avería o incidencia en la A-2, N-II, N-234 y carreteras cerca de Calatayud."
    : copy.imageCaption;
  const imageWidth = roadImage ? "738" : "1800";
  const imageHeight = roadImage ? "415" : "1013";
  const image = `<figure class="static-local-image"><img src="${imageSrc}" alt="${escapeHtml(imageAlt)}" width="${imageWidth}" height="${imageHeight}" loading="eager" decoding="async" fetchpriority="high" /><figcaption>${escapeHtml(imageCaption)}</figcaption></figure>`;

  return `<main class="static-seo-content" aria-label="${escapeHtml(page.h1)}"><nav aria-label="Breadcrumb"><a href="/">Taxi Ayud</a> / <span>${escapeHtml(page.breadcrumb)}</span></nav><h1>${escapeHtml(page.h1)}</h1><p>${escapeHtml(page.intro)}</p>${image}<p class="static-cta-row"><a href="tel:611861041">${escapeHtml(copy.call)}</a><a href="https://wa.me/34611861041">${escapeHtml(copy.whatsapp)}</a></p><article><h2>${escapeHtml(page.h2)}</h2><p>${escapeHtml(page.body)}</p>${sections}<section><h2>${escapeHtml(copy.serviceAreasHeading)}</h2><p>${escapeHtml(copy.serviceAreasText)}</p><ul>${serviceAreas}</ul></section></article>${faq}<nav aria-label="${escapeHtml(copy.related)}">${links}</nav></main>`;
}

function pageJsonLd(page) {
  const pageUrl = absoluteUrl(page.path);
  const lang = pageLang(page);
  const pageService = {
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: page.h1,
    serviceType: page.eyebrow || "Servicio de taxi",
    description: page.description,
    inLanguage: lang,
    provider: { "@id": `${siteUrl}/#taxi-ayud` },
    areaServed: [
      "Calatayud",
      "Comarca de Calatayud",
      "A-2 Calatayud",
      "Autovía A-2",
      "N-II Calatayud",
      "N-234 Calatayud",
      "Zaragoza",
      "Monasterio de Piedra",
      "Nuévalos",
      "Jaraba",
      "Alhama de Aragón",
      "Ateca",
      "Ariza",
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: pageUrl,
      servicePhone: {
        "@type": "ContactPoint",
        telephone: "+34611861041",
        contactType: "reservas de taxi",
      },
    },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      businessGraph,
      pageService,
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: "Taxi Ayud Calatayud",
        inLanguage: "es-ES",
        publisher: { "@id": `${siteUrl}/#taxi-ayud` },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: page.title,
        description: page.description,
        inLanguage: lang,
        dateModified: buildDate,
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#taxi-ayud` },
        mainEntity: { "@id": `${pageUrl}#service` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement:
          page.path === "/"
            ? [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Inicio",
                  item: `${siteUrl}/`,
                },
              ]
            : [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Inicio",
                  item: `${siteUrl}/`,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: page.breadcrumb,
                  item: pageUrl,
                },
              ],
      },
    ],
  };
}

function replaceMeta(html, page) {
  const pageUrl = absoluteUrl(page.path);
  const lang = pageLang(page);
  const ldJson = JSON.stringify(pageJsonLd(page), null, 2)
    .replace(/</g, "\\u003c")
    .replace(/<\/script/gi, "<\\/script");

  return html
    .replace(/<html lang="[^"]*"(?: dir="[^"]*")?/, `<html lang="${lang}" dir="${pageDir(page)}"`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
      `<meta name="description" content="${escapeHtml(page.description)}" />`,
    )
    .replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
      `${alternateTags(page)}<link rel="canonical" href="${pageUrl}" />`,
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
    )
    .replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:url" content="${pageUrl}" />`,
    )
    .replace(
      /<meta\s+property="og:locale"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:locale" content="${ogLocaleByLang[lang] ?? "es_ES"}" />`,
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
      `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`,
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
      `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`,
    )
    .replace(
      /<script id="page-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script id="page-structured-data" type="application/ld+json">${ldJson}</script>`,
    )
    .replace(
      /<div id="root">[\s\S]*?<\/main><\/div>/,
      `<div id="root">${staticFallback(page)}</div>`,
    );
}

function sitemapEntry(page, lastmod) {
  return `  <url>
    <loc>${absoluteUrl(page.path)}</loc>
${sitemapAlternateTags(page)}
${sitemapImageTags(page)}
    <lastmod>${lastmod}</lastmod>
  </url>`;
}

function writeSitemap() {
  const entries = pages.map((page) => sitemapEntry(page, buildDate)).join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries}
</urlset>
`;

  writeFileSync("dist/sitemap.xml", sitemap);
}

function writeAdminPanel() {
  const outputPath = "dist/panel-ayud/index.html";
  const html = `<!doctype html>
<html lang="es" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, nofollow, noarchive" />
    <meta name="googlebot" content="noindex, nofollow, noarchive" />
    <title>Panel privado Taxi Ayud</title>
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <style>
      :root { color-scheme: dark; --bg: #07110f; --panel: #101c19; --panel-2: #172823; --text: #effaf6; --muted: #9fb7ae; --line: rgba(255,255,255,.12); --green: #45d483; --amber: #ffd166; --red: #ff6b6b; }
      * { box-sizing: border-box; }
      body { margin: 0; min-height: 100vh; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: radial-gradient(circle at top left, rgba(69,212,131,.18), transparent 36rem), var(--bg); color: var(--text); }
      main { width: min(1120px, calc(100% - 32px)); margin: 0 auto; padding: 28px 0 44px; }
      header { display: flex; justify-content: space-between; gap: 16px; align-items: center; padding: 18px 0 26px; }
      h1, h2, p { margin-top: 0; }
      h1 { margin-bottom: 6px; font-size: clamp(28px, 5vw, 46px); letter-spacing: 0; }
      h2 { font-size: 18px; margin-bottom: 14px; }
      p, small { color: var(--muted); line-height: 1.55; }
      button, input { font: inherit; }
      .btn { border: 0; border-radius: 8px; min-height: 44px; padding: 0 16px; background: var(--green); color: #062014; font-weight: 800; cursor: pointer; }
      .btn.secondary { background: transparent; color: var(--text); border: 1px solid var(--line); }
      .login, .panel { background: rgba(16,28,25,.88); border: 1px solid var(--line); border-radius: 12px; box-shadow: 0 24px 80px rgba(0,0,0,.32); }
      .login { max-width: 520px; margin: 44px auto; padding: 24px; }
      label { display: grid; gap: 8px; color: var(--muted); font-weight: 700; }
      input { width: 100%; border: 1px solid var(--line); background: #07110f; color: var(--text); border-radius: 8px; padding: 12px 14px; outline: none; }
      input:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(69,212,131,.16); }
      .login form { display: grid; gap: 14px; }
      .status { min-height: 24px; color: var(--amber); }
      .grid { display: grid; gap: 14px; }
      .cards { grid-template-columns: repeat(5, minmax(0, 1fr)); }
      .card, .block { background: rgba(23,40,35,.86); border: 1px solid var(--line); border-radius: 10px; padding: 16px; }
      .metric { display: block; font-size: clamp(26px, 4vw, 40px); font-weight: 900; color: var(--green); line-height: 1; }
      .label { color: var(--muted); font-size: 13px; line-height: 1.35; }
      .columns { grid-template-columns: 1.1fr 1.1fr .8fr; margin-top: 14px; }
      ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
      li { display: flex; justify-content: space-between; gap: 12px; border-bottom: 1px solid rgba(255,255,255,.08); padding-bottom: 8px; color: var(--muted); }
      li strong { color: var(--text); font-weight: 750; }
      table { width: 100%; border-collapse: collapse; }
      th, td { text-align: left; border-bottom: 1px solid rgba(255,255,255,.08); padding: 10px 8px; vertical-align: top; color: var(--muted); }
      th { color: var(--text); font-size: 13px; }
      .toolbar { display: flex; gap: 10px; align-items: center; justify-content: flex-end; flex-wrap: wrap; }
      .hidden { display: none !important; }
      .warning { border-color: rgba(255,209,102,.38); background: rgba(255,209,102,.08); }
      @media (max-width: 860px) { header, .toolbar { align-items: flex-start; justify-content: flex-start; } header { flex-direction: column; } .cards, .columns { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 560px) { main { width: min(100% - 20px, 1120px); padding-top: 16px; } .cards, .columns { grid-template-columns: 1fr; } .login, .panel { border-radius: 10px; } th:nth-child(4), td:nth-child(4) { display: none; } }
    </style>
  </head>
  <body>
    <main>
      <header>
        <div>
          <h1>Panel privado Taxi Ayud</h1>
          <p>Ultimas visitas, clics y rutas consultadas. Datos resumidos: sin IP, sin coordenadas y sin numeros de calle.</p>
        </div>
        <div class="toolbar panel-actions hidden">
          <button class="btn secondary" id="refresh" type="button">Actualizar</button>
          <button class="btn secondary" id="logout" type="button">Cerrar acceso</button>
        </div>
      </header>

      <section class="login" id="login">
        <h2>Acceso privado</h2>
        <p>Escribe tu clave privada. La URL no aparece en la web publica ni en el sitemap.</p>
        <form id="loginForm">
          <label>Clave de panel <input id="token" type="password" autocomplete="current-password" required /></label>
          <button class="btn" type="submit">Entrar al panel</button>
          <p class="status" id="loginStatus"></p>
        </form>
      </section>

      <section class="grid panel hidden" id="dashboard" aria-live="polite" style="padding:16px">
        <div class="grid cards">
          <article class="card"><span class="metric" id="visits24h">0</span><span class="label">Visitas ultimas 24 h</span></article>
          <article class="card"><span class="metric" id="visits7d">0</span><span class="label">Visitas 7 dias</span></article>
          <article class="card"><span class="metric" id="routes7d">0</span><span class="label">Rutas consultadas 7 dias</span></article>
          <article class="card"><span class="metric" id="whatsapp7d">0</span><span class="label">WhatsApp 7 dias</span></article>
          <article class="card"><span class="metric" id="calls7d">0</span><span class="label">Llamadas 7 dias</span></article>
        </div>

        <article class="block warning hidden" id="setupWarning">
          <h2>Falta activar almacenamiento</h2>
          <p id="setupMessage"></p>
          <small>Configura en Vercel: ADMIN_PANEL_TOKEN, UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN.</small>
        </article>

        <div class="grid columns">
          <article class="block"><h2>Paginas mas vistas</h2><ul id="topPages"></ul></article>
          <article class="block"><h2>Rutas buscadas</h2><ul id="topRoutes"></ul></article>
          <article class="block"><h2>Idiomas</h2><ul id="topLanguages"></ul></article>
        </div>

        <article class="block">
          <h2>Ultimos eventos</h2>
          <table>
            <thead><tr><th>Hora</th><th>Tipo</th><th>Pagina / Ruta</th><th>Extra</th></tr></thead>
            <tbody id="events"></tbody>
          </table>
        </article>
      </section>
    </main>

    <script>
      const tokenKey = "taxiayud-admin-token";
      const login = document.getElementById("login");
      const dashboard = document.getElementById("dashboard");
      const tokenInput = document.getElementById("token");
      const loginStatus = document.getElementById("loginStatus");
      const setupWarning = document.getElementById("setupWarning");
      const setupMessage = document.getElementById("setupMessage");
      const panelActions = document.querySelector(".panel-actions");
      let timer = null;

      function qs(name) {
        return new URLSearchParams(window.location.search).get(name);
      }

      function token() {
        return window.localStorage.getItem(tokenKey) || "";
      }

      function setMetric(id, value) {
        document.getElementById(id).textContent = String(value || 0);
      }

      function list(id, items) {
        const el = document.getElementById(id);
        el.innerHTML = "";
        if (!items || !items.length) {
          el.innerHTML = "<li><span>Sin datos todavia</span><strong>0</strong></li>";
          return;
        }
        for (const item of items) {
          const li = document.createElement("li");
          const label = document.createElement("span");
          const count = document.createElement("strong");
          label.textContent = item.label || "Sin dato";
          count.textContent = item.count || 0;
          li.append(label, count);
          el.append(li);
        }
      }

      function eventExtra(event) {
        const p = event.params || {};
        return [p.source, p.language, p.device, p.provider, p.status].filter(Boolean).join(" · ");
      }

      function eventRoute(event) {
        const p = event.params || {};
        if (p.origin || p.destination) return [p.origin, p.destination].filter(Boolean).join(" -> ");
        return p.path || "";
      }

      function renderEvents(events) {
        const tbody = document.getElementById("events");
        tbody.innerHTML = "";
        if (!events || !events.length) {
          tbody.innerHTML = "<tr><td colspan='4'>Sin eventos todavia.</td></tr>";
          return;
        }
        for (const event of events.slice(0, 60)) {
          const row = document.createElement("tr");
          const created = new Date(event.createdAt);
          const cells = [
            created.toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" }),
            event.type,
            eventRoute(event),
            eventExtra(event),
          ];
          for (const value of cells) {
            const td = document.createElement("td");
            td.textContent = value || "—";
            row.append(td);
          }
          tbody.append(row);
        }
      }

      function showDashboard() {
        login.classList.add("hidden");
        dashboard.classList.remove("hidden");
        panelActions.classList.remove("hidden");
      }

      async function loadStats() {
        loginStatus.textContent = "";
        const accessToken = token();
        if (!accessToken) return;
        const response = await fetch("/api/admin-stats", {
          headers: { Authorization: "Bearer " + accessToken },
        });
        const data = await response.json().catch(() => null);
        if (!response.ok || !data?.ok) {
          window.localStorage.removeItem(tokenKey);
          dashboard.classList.add("hidden");
          panelActions.classList.add("hidden");
          login.classList.remove("hidden");
          loginStatus.textContent = data?.message || "No se pudo entrar al panel.";
          return;
        }
        showDashboard();
        const summary = data.summary || {};
        setMetric("visits24h", summary.visits24h);
        setMetric("visits7d", summary.visits7d);
        setMetric("routes7d", summary.routeSearches7d);
        setMetric("whatsapp7d", summary.whatsapp7d);
        setMetric("calls7d", summary.calls7d);
        list("topPages", summary.topPages);
        list("topRoutes", summary.topRoutes);
        list("topLanguages", summary.topLanguages);
        renderEvents(data.events);
        setupWarning.classList.toggle("hidden", data.configured !== false);
        setupMessage.textContent = data.message || "";
      }

      const urlToken = qs("token");
      if (urlToken) {
        window.localStorage.setItem(tokenKey, urlToken);
        window.history.replaceState({}, "", "/panel-ayud/");
      }
      if (token()) loadStats();
      timer = window.setInterval(() => {
        if (token()) loadStats();
      }, 25000);

      document.getElementById("loginForm").addEventListener("submit", (event) => {
        event.preventDefault();
        window.localStorage.setItem(tokenKey, tokenInput.value.trim());
        loadStats();
      });
      document.getElementById("refresh").addEventListener("click", loadStats);
      document.getElementById("logout").addEventListener("click", () => {
        window.localStorage.removeItem(tokenKey);
        if (timer) window.clearInterval(timer);
        window.location.reload();
      });
    </script>
  </body>
</html>`;

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, html);
}

for (const page of pages) {
  const html = replaceMeta(template, page);
  const outputPath = page.path === "/" ? "dist/index.html" : join("dist", page.path, "index.html");
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, html);
}

const notFoundPage = {
  ...pages[0],
  path: "/404/",
  title: "Página no encontrada | Taxi Ayud",
  description: "La página solicitada no existe. Puedes volver a Taxi Ayud Calatayud, llamar o reservar por WhatsApp.",
  breadcrumb: "Página no encontrada",
  navLabel: "404",
  h1: "Página no encontrada",
  intro: "No hemos encontrado esa página, pero puedes volver al inicio o contactar directamente con Taxi Ayud.",
  h2: "Reserva o consulta disponibilidad",
  body: "Usa los botones de llamada y WhatsApp para contactar con Taxi Ayud en Calatayud.",
};

const notFoundHtml = replaceMeta(template, notFoundPage)
  .replace(
    /<meta name="robots" content="[^"]*" \/>/,
    '<meta name="robots" content="noindex, follow, max-image-preview:large" />',
  )
  .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${siteUrl}/404/" />`);

writeFileSync("dist/404.html", notFoundHtml);
writeSitemap();
writeAdminPanel();
