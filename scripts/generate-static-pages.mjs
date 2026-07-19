import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const siteUrl = "https://www.taxiayud.es";
const pages = JSON.parse(readFileSync("src/seoPages.json", "utf8"));
const template = readFileSync("dist/index.html", "utf8");

const businessGraph = {
  "@type": ["TaxiService", "LocalBusiness"],
  "@id": `${siteUrl}/#taxi-ayud`,
  name: "Taxi Ayud",
  alternateName: [
    "Taxi Calatayud Ayud",
    "Taxi Ayud Calatayud",
    "Taxi en Calatayud",
    "Taxi cerca de mi Calatayud",
    "Taxi 24 horas Calatayud",
  ],
  slogan: "Tu taxi de confianza en Calatayud",
  description:
    "Taxi oficial en Calatayud para traslados 24h a Monasterio de Piedra, Zaragoza, aeropuerto, estación, balnearios y pueblos de la comarca.",
  telephone: "+34611861041",
  areaServed: [
    "Calatayud",
    "Comarca de Calatayud",
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
    "taxi cerca de mi en Calatayud",
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

function staticFallback(page) {
  const links = pages
    .filter((item) => item.path !== page.path)
    .slice(0, 14)
    .map((item) => `<a href="${item.path}">${escapeHtml(item.navLabel)}</a>`)
    .join(" ");
  const serviceAreas = [
    "Calatayud",
    "Estación AVE de Calatayud",
    "Plaza del Fuerte",
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
  const faq = page.faq
    .map(
      (item) =>
        `<details><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`,
    )
    .join("");

  return `<main class="static-seo-content" aria-label="${escapeHtml(page.h1)}"><nav aria-label="Breadcrumb"><a href="/">Taxi Ayud</a> / <span>${escapeHtml(page.breadcrumb)}</span></nav><h1>${escapeHtml(page.h1)}</h1><p>${escapeHtml(page.intro)}</p><p><a href="tel:611861041">Llamar al 611 861 041</a> · <a href="https://wa.me/34611861041">Reservar por WhatsApp</a></p><article><h2>${escapeHtml(page.h2)}</h2><p>${escapeHtml(page.body)}</p>${sections}<section><h2>Zonas habituales de recogida</h2><p>Taxi oficial con recogidas en Calatayud, hoteles, estación, balnearios, pueblos de la comarca y destinos turísticos cercanos.</p><ul>${serviceAreas}</ul></section></article>${faq}<nav aria-label="Rutas relacionadas">${links}</nav></main>`;
}

function pageJsonLd(page) {
  const pageUrl = absoluteUrl(page.path);
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
    provider: { "@id": `${siteUrl}/#taxi-ayud` },
    areaServed: [
      "Calatayud",
      "Comarca de Calatayud",
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
        inLanguage: "es-ES",
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
  const ldJson = JSON.stringify(pageJsonLd(page), null, 2)
    .replace(/</g, "\\u003c")
    .replace(/<\/script/gi, "<\\/script");

  return html
    .replace(/<html lang="[^"]*"/, '<html lang="es-ES"')
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
      `<meta name="description" content="${escapeHtml(page.description)}" />`,
    )
    .replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
      `<link rel="canonical" href="${pageUrl}" />`,
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
    <lastmod>${lastmod}</lastmod>
  </url>`;
}

function writeSitemap() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const entries = pages.map((page) => sitemapEntry(page, lastmod)).join("\n");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
