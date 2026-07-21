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
const staticCopy = {
  "es-ES": {
    call: "Llamar al 611 861 041",
    whatsapp: "Reservar por WhatsApp",
    serviceAreasHeading: "Zonas habituales de recogida",
    serviceAreasText:
      "Taxi oficial con recogidas en Calatayud, hoteles, estación, balnearios, pueblos de la comarca y destinos turísticos cercanos.",
    faqHeading: "Preguntas frecuentes",
    related: "Rutas relacionadas",
  },
  en: {
    call: "Call 611 861 041",
    whatsapp: "Book by WhatsApp",
    serviceAreasHeading: "Frequent pick-up areas",
    serviceAreasText:
      "Official taxi pick-ups in Calatayud, hotels, the station, spas, nearby villages and tourist destinations.",
    faqHeading: "Frequently asked questions",
    related: "Related taxi pages",
  },
  fr: {
    call: "Appeler le 611 861 041",
    whatsapp: "Réserver par WhatsApp",
    serviceAreasHeading: "Zones de prise en charge habituelles",
    serviceAreasText:
      "Taxi officiel avec prises en charge à Calatayud, hôtels, gare, thermes, villages proches et destinations touristiques.",
    faqHeading: "Questions fréquentes",
    related: "Pages taxi liées",
  },
  "ca-ES": {
    call: "Trucar al 611 861 041",
    whatsapp: "Reservar per WhatsApp",
    serviceAreasHeading: "Zones habituals de recollida",
    serviceAreasText:
      "Taxi oficial amb recollides a Calatayud, hotels, estació, balnearis, pobles propers i destinacions turístiques.",
    faqHeading: "Preguntes freqüents",
    related: "Pàgines relacionades",
  },
  de: {
    call: "611 861 041 anrufen",
    whatsapp: "Per WhatsApp buchen",
    serviceAreasHeading: "Häufige Abholbereiche",
    serviceAreasText:
      "Offizielles Taxi mit Abholung in Calatayud, Hotels, Bahnhof, Thermalbädern, nahen Orten und touristischen Zielen.",
    faqHeading: "Häufige Fragen",
    related: "Verwandte Taxiseiten",
  },
  it: {
    call: "Chiama 611 861 041",
    whatsapp: "Prenota su WhatsApp",
    serviceAreasHeading: "Zone abituali di ritiro",
    serviceAreasText:
      "Taxi ufficiale con ritiri a Calatayud, hotel, stazione, terme, paesi vicini e destinazioni turistiche.",
    faqHeading: "Domande frequenti",
    related: "Pagine taxi correlate",
  },
  pt: {
    call: "Ligar 611 861 041",
    whatsapp: "Reservar por WhatsApp",
    serviceAreasHeading: "Áreas habituais de recolha",
    serviceAreasText:
      "Táxi oficial com recolhas em Calatayud, hotéis, estação, termas, aldeias próximas e destinos turísticos.",
    faqHeading: "Perguntas frequentes",
    related: "Páginas relacionadas",
  },
  nl: {
    call: "Bel 611 861 041",
    whatsapp: "Boek via WhatsApp",
    serviceAreasHeading: "Veelgebruikte ophaalgebieden",
    serviceAreasText:
      "Officiële taxi met ophaalservice in Calatayud, hotels, station, kuuroorden, nabijgelegen dorpen en toeristische bestemmingen.",
    faqHeading: "Veelgestelde vragen",
    related: "Gerelateerde taxipagina's",
  },
  ar: {
    call: "اتصل على 611 861 041",
    whatsapp: "احجز عبر واتساب",
    serviceAreasHeading: "مناطق الاستلام الشائعة",
    serviceAreasText:
      "تاكسي رسمي مع استلام في كالاتايود والفنادق والمحطة والمنتجعات والقرى القريبة والوجهات السياحية.",
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
    "Teléfono taxi Calatayud",
    "Taxi 24 horas Calatayud",
  ],
  slogan: "Tu taxi de confianza en Calatayud",
  description:
    "Taxi oficial en Calatayud para traslados 24h a Monasterio de Piedra, Zaragoza, aeropuerto, estación, balnearios y pueblos de la comarca.",
  telephone: "+34611861041",
  areaServed: [
    "Calatayud",
    "Comarca de Calatayud",
    "A-2 Calatayud",
    "Autovía A-2",
    "A-2 km 231 Valdeherrera",
    "A-2 salida Ateca",
    "A-2 Ariza",
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
  ],
  url: `${siteUrl}/`,
  image: `${siteUrl}/assets/og-image.jpg`,
  logo: `${siteUrl}/assets/logo.webp`,
  priceRange: "€€",
  paymentAccepted: ["Cash", "Credit Card", "Bizum", "Apple Pay", "Google Pay"],
  currenciesAccepted: "EUR",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "10",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Pl. del Fuerte",
    postalCode: "50300",
    addressLocality: "Calatayud",
    addressRegion: "Aragón",
    addressCountry: "ES",
  },
  hasMap: "https://share.google/QJyQ83oNHjkRqtciX",
  sameAs: ["https://share.google/QJyQ83oNHjkRqtciX"],
  geo: {
    "@type": "GeoCoordinates",
    latitude: 41.3535,
    longitude: -1.6432,
  },
  knowsAbout: [
    "taxi en Calatayud",
    "taxi desde Calatayud",
    "taxi cerca de mi en Calatayud",
    "taxi por avería en autovía cerca de Calatayud",
    "taxi A-2 Calatayud",
    "taxi avería A-2 Calatayud",
    "taxi me he quedado tirado cerca de Calatayud",
    "recogida de pasajeros en carretera cerca de Calatayud",
    "teléfono taxi Calatayud",
    "WhatsApp taxi Calatayud",
    "taxi 24 horas",
    "traslados a Monasterio de Piedra",
    "taxi a balnearios de Jaraba y Alhama",
    "taxi estación AVE Calatayud",
    "taxi Aeropuerto de Zaragoza",
    "taxi pueblos comarca de Calatayud",
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
    ],
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+34611861041",
    contactType: "reservas de taxi",
    areaServed: "ES",
    availableLanguage: ["es", "en", "fr", "ca", "de", "it", "pt", "nl", "ar"],
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

function staticFallback(page) {
  const copy = pageStaticCopy(page);
  const links = pages
    .filter((item) => item.path !== page.path && (!isLocalizedTaxiPage(page.path) || isLocalizedTaxiPage(item.path)))
    .slice(0, 14)
    .map((item) => `<a href="${item.path}">${escapeHtml(item.navLabel)}</a>`)
    .join(" ");
  const serviceAreas = [
    "Calatayud",
    "Estación AVE de Calatayud",
    "Plaza del Fuerte",
    "A-2 Valdeherrera",
    "A-2 Ateca",
    "A-2 Ariza",
    "N-234 Calatayud",
    "Ateca",
    "Ariza",
    "Maluenda",
    "Nuévalos",
    "Monasterio de Piedra",
    "Jaraba",
    "Alhama de Aragón",
    "Paracuellos de Jiloca",
    "Aeropuerto de Zaragoza",
  ]
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

  return `<main class="static-seo-content" aria-label="${escapeHtml(page.h1)}"><nav aria-label="Breadcrumb"><a href="/">Taxi Ayud</a> / <span>${escapeHtml(page.breadcrumb)}</span></nav><h1>${escapeHtml(page.h1)}</h1><p>${escapeHtml(page.intro)}</p><p><a href="tel:611861041">${escapeHtml(copy.call)}</a> · <a href="https://wa.me/34611861041">${escapeHtml(copy.whatsapp)}</a></p><article><h2>${escapeHtml(page.h2)}</h2><p>${escapeHtml(page.body)}</p>${sections}<section><h2>${escapeHtml(copy.serviceAreasHeading)}</h2><p>${escapeHtml(copy.serviceAreasText)}</p><ul>${serviceAreas}</ul></section></article>${faq}<nav aria-label="${escapeHtml(copy.related)}">${links}</nav></main>`;
}

function pageJsonLd(page) {
  const pageUrl = absoluteUrl(page.path);
  const lang = pageLang(page);
  const faqEntity = page.faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  }));
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
        availableLanguage: ["es", "en", "fr", "ca", "de", "it", "pt", "nl", "ar"],
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
      ...(faqEntity.length
        ? [
            {
              "@type": "FAQPage",
              "@id": `${pageUrl}#faq`,
              mainEntity: faqEntity,
            },
          ]
        : []),
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
    <lastmod>${lastmod}</lastmod>
  </url>`;
}

function writeSitemap() {
  const entries = pages.map((page) => sitemapEntry(page, buildDate)).join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`;

  writeFileSync("dist/sitemap.xml", sitemap);
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
