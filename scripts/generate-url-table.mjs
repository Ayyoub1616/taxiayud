import { readFileSync, writeFileSync } from "node:fs";

const siteUrl = "https://www.taxiayud.es";
const pages = JSON.parse(readFileSync("src/seoPages.json", "utf8"));

const keywordByPath = {
  "/": "taxi Calatayud",
  "/taxi-calatayud/": "taxi en Calatayud",
  "/en/taxi-calatayud/": "taxi in Calatayud",
  "/fr/taxi-calatayud/": "taxi a Calatayud en frances",
  "/ca/taxi-calatayud/": "taxi a Calatayud en catalan",
  "/de/taxi-calatayud/": "Taxi in Calatayud",
  "/it/taxi-calatayud/": "taxi a Calatayud en italiano",
  "/pt/taxi-calatayud/": "taxi em Calatayud",
  "/nl/taxi-calatayud/": "taxi in Calatayud Nederlands",
  "/ar/taxi-calatayud/": "تاكسي في كالاتايود",
  "/taxi-desde-calatayud/": "taxi desde Calatayud",
  "/servicios/": "servicios taxi Calatayud",
  "/reservar/": "reservar taxi Calatayud",
  "/tarifas/": "tarifas taxi Calatayud",
  "/vehiculo/": "Peugeot 408 Hybrid taxi Calatayud",
  "/taxi-estacion-ave-calatayud/": "taxi estación AVE Calatayud",
  "/taxi-calatayud-monasterio-de-piedra/": "taxi Calatayud Monasterio de Piedra",
  "/taxi-calatayud-jaraba-balnearios/": "taxi Calatayud Jaraba balnearios",
  "/taxi-calatayud-alhama-de-aragon/": "taxi Calatayud Alhama de Aragón",
  "/taxi-calatayud-aeropuerto-zaragoza/": "taxi Calatayud aeropuerto Zaragoza",
  "/taxi-calatayud-zaragoza/": "taxi Calatayud Zaragoza",
  "/taxi-zaragoza-calatayud/": "taxi Zaragoza Calatayud",
  "/taxi-pueblos-comarca-calatayud/": "taxi pueblos comarca Calatayud",
  "/taxi-cerca-de-mi-calatayud/": "taxi cerca de mi Calatayud",
  "/taxi-pasajeros-averia-a2-calatayud/": "taxi pasajeros averia A-2 Calatayud",
  "/taxi-hoteles-calatayud/": "taxi hoteles Calatayud",
  "/taxi-nuevalos-monasterio-piedra/": "taxi Nuevalos Monasterio de Piedra",
  "/taxi-jaraba/": "taxi Jaraba Calatayud",
  "/taxi-ariza/": "taxi Ariza Calatayud",
  "/taxi-ateca/": "taxi Ateca Calatayud",
  "/contacto/": "contacto Taxi Ayud Calatayud",
  "/telefono-taxi-calatayud/": "telefono taxi Calatayud",
  "/taxi-fiestas-calatayud/": "taxi fiestas Calatayud",
  "/taxi-san-roque-calatayud/": "taxi San Roque Calatayud",
  "/taxi-fiestas-pueblos-comarca-calatayud/": "taxi fiestas pueblos comarca Calatayud",
  "/preguntas-frecuentes/": "preguntas frecuentes taxi Calatayud",
};

function escapeCell(value) {
  return String(value || "")
    .replace(/\|/g, "\\|")
    .replace(/\n+/g, " ")
    .trim();
}

function canonical(path) {
  return `${siteUrl}${path === "/" ? "/" : path}`;
}

function language(path) {
  if (path.startsWith("/en/")) return "en";
  if (path.startsWith("/fr/")) return "fr";
  if (path.startsWith("/ca/")) return "ca-ES";
  if (path.startsWith("/de/")) return "de";
  if (path.startsWith("/it/")) return "it";
  if (path.startsWith("/pt/")) return "pt";
  if (path.startsWith("/nl/")) return "nl";
  if (path.startsWith("/ar/")) return "ar";
  return "es-ES";
}

function intention(page) {
  if (page.path === "/") return "Home local: taxi en Calatayud y comarca";
  if (page.path.includes("calatayud-zaragoza")) return "Trayecto Calatayud a Zaragoza";
  if (page.path.includes("zaragoza-calatayud")) return "Trayecto Zaragoza a Calatayud";
  if (page.path.includes("monasterio")) return "Traslado turistico al Monasterio de Piedra";
  if (page.path.includes("balnearios") || page.path.includes("jaraba") || page.path.includes("alhama")) {
    return "Traslado a balnearios y alojamientos termales";
  }
  if (page.path.includes("a2") || page.path.includes("averia")) return "Recogida de pasajeros por averia en carretera";
  if (page.path.includes("estacion")) return "Recogida en estacion AVE de Calatayud";
  if (page.path.includes("aeropuerto")) return "Traslado a aeropuerto de Zaragoza";
  if (page.path.includes("fiestas") || page.path.includes("san-roque")) return "Reservas para fiestas y eventos";
  if (page.path.includes("reservar")) return "Reserva y disponibilidad por WhatsApp";
  if (page.path.includes("tarifas")) return "Tarifas oficiales y presupuesto orientativo";
  if (page.path.includes("vehiculo")) return "Vehiculo, licencia, capacidad y metodos de pago";
  if (page.path.includes("contacto") || page.path.includes("telefono")) return "Contacto directo";
  return page.eyebrow || page.breadcrumb || "Servicio de taxi";
}

const date = new Date().toISOString().slice(0, 10);
const rows = pages.map((page) => [
  page.path,
  intention(page),
  keywordByPath[page.path] || page.h1,
  page.title,
  page.h1,
  canonical(page.path),
  "indexable",
  language(page.path),
]);

const fullTable = [
  "# Mapa de URLs, intencion e indexabilidad",
  "",
  `Fecha: ${date}`,
  "",
  "| URL | Intencion | Keyword principal | Title | H1 | Canonical | Indexabilidad | Idioma |",
  "|---|---|---|---|---|---|---|---|",
  ...rows.map((row) => `| ${row.map(escapeCell).join(" |")} |`),
  "",
].join("\n");

const compactTable = [
  "# Tabla SEO De URLs",
  "",
  `Fecha: ${date}`,
  "",
  "| URL | Keyword Principal | Title | H1 | Metadescripción |",
  "|---|---|---|---|---|",
  ...pages.map((page) =>
    `| ${[page.path, keywordByPath[page.path] || page.h1, page.title, page.h1, page.description]
      .map(escapeCell)
      .join(" |")} |`,
  ),
  "",
].join("\n");

writeFileSync("URL-INTENT-MAP.md", fullTable);
writeFileSync("docs/seo-pages-table.md", compactTable);
