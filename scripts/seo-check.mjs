import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const siteUrl = "https://www.taxiayud.es";
const pages = JSON.parse(readFileSync("src/seoPages.json", "utf8"));
const errors = [];
const titles = new Map();
const descriptions = new Map();
const pageUrls = new Set(pages.map((page) => `${siteUrl}${page.path === "/" ? "/" : page.path}`));
const localizedTaxiPaths = new Set([
  "/taxi-calatayud/",
  "/en/taxi-calatayud/",
  "/fr/taxi-calatayud/",
  "/ca/taxi-calatayud/",
  "/de/taxi-calatayud/",
  "/it/taxi-calatayud/",
  "/pt/taxi-calatayud/",
  "/nl/taxi-calatayud/",
  "/ar/taxi-calatayud/",
]);

function fail(message) {
  errors.push(message);
}

function pageFile(path) {
  return path === "/" ? "dist/index.html" : join("dist", path, "index.html");
}

function match(html, pattern) {
  return html.match(pattern)?.[1]?.trim() || "";
}

for (const page of pages) {
  const file = pageFile(page.path);
  if (!existsSync(file)) {
    fail(`Falta el HTML de ${page.path}`);
    continue;
  }

  const html = readFileSync(file, "utf8");
  const canonical = `${siteUrl}${page.path === "/" ? "/" : page.path}`;
  const title = match(html, /<title>([\s\S]*?)<\/title>/);
  const description = match(html, /<meta\s+name="description"\s+content="([^"]*)"\s*\/>/);
  const h1 = match(html, /<h1>([\s\S]*?)<\/h1>/);

  if (html.includes("taxiayud.com")) fail(`${page.path} contiene taxiayud.com`);
  if (/(^|\b)(24h|24 horas)(\b|$)/i.test(title) || /(^|\b)(24h|24 horas)(\b|$)/i.test(h1)) {
    fail(`${page.path} usa 24h/24 horas en title o H1 sin confirmación explícita`);
  }
  if (html.includes('"AggregateRating"')) fail(`${page.path} incluye AggregateRating no validado`);
  if (html.includes('"openingHoursSpecification"')) fail(`${page.path} incluye horario estructurado no confirmado`);
  if (html.includes('"streetAddress"')) fail(`${page.path} incluye dirección postal en JSON-LD`);
  if (html.includes('name="keywords"')) fail(`${page.path} contiene meta keywords innecesario`);
  if (!title) fail(`${page.path} no tiene title`);
  if (!description) fail(`${page.path} no tiene meta description`);
  if (!h1) fail(`${page.path} no tiene H1 inicial`);
  if (!html.includes("<html lang=")) fail(`${page.path} no declara lang en html`);
  if (!html.includes('dir="ltr"') && !html.includes('dir="rtl"')) {
    fail(`${page.path} no declara dir en html`);
  }
  if (page.path.startsWith("/ar/") && !html.includes('dir="rtl"')) {
    fail(`${page.path} debería usar dir rtl`);
  }
  if (!html.includes(`<link rel="canonical" href="${canonical}" />`)) {
    fail(`${page.path} canonical incorrecto`);
  }
  if (!html.includes(`<meta property="og:url" content="${canonical}" />`)) {
    fail(`${page.path} og:url incorrecto`);
  }
  if (!html.includes('<script id="page-structured-data" type="application/ld+json">')) {
    fail(`${page.path} no tiene JSON-LD principal`);
  }
  if (!html.includes("static-seo-content")) {
    fail(`${page.path} no tiene contenido HTML inicial`);
  }

  const jsonScripts = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  if (!jsonScripts.length) fail(`${page.path} no tiene JSON-LD parseable`);
  for (const script of jsonScripts) {
    try {
      JSON.parse(script[1]);
    } catch (error) {
      fail(`${page.path} contiene JSON-LD inválido: ${error.message}`);
    }
  }

  const hreflangLinks = [
    ...html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"\s*\/>/g),
  ];
  for (const [, hreflang, href] of hreflangLinks) {
    if (hreflang !== "x-default" && !pageUrls.has(href)) {
      fail(`${page.path} hreflang ${hreflang} apunta a URL no indexable: ${href}`);
    }
  }
  if (localizedTaxiPaths.has(page.path) && hreflangLinks.length !== 10) {
    fail(`${page.path} debería tener 10 hreflang incluyendo x-default`);
  }
  if (hreflangLinks.length && !hreflangLinks.some(([, , href]) => href === canonical)) {
    fail(`${page.path} tiene hreflang pero no se referencia a sí misma`);
  }

  if (titles.has(title)) fail(`Title duplicado: ${title}`);
  if (descriptions.has(description)) fail(`Description duplicada: ${description}`);
  titles.set(title, page.path);
  descriptions.set(description, page.path);
}

const robots = readFileSync("dist/robots.txt", "utf8");
const sitemap = readFileSync("dist/sitemap.xml", "utf8");
if (!robots.includes(`${siteUrl}/sitemap.xml`)) fail("robots.txt no apunta al sitemap .es");
if (robots.includes("taxiayud.com")) fail("robots.txt contiene .com");
if (sitemap.includes("taxiayud.com")) fail("sitemap contiene .com");
if (!sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"')) {
  fail("sitemap no declara alternates xhtml");
}
if (!sitemap.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"')) {
  fail("sitemap no declara namespace de imágenes");
}
if (!sitemap.includes("<image:image>")) fail("sitemap no incluye imágenes");

for (const page of pages) {
  const url = `${siteUrl}${page.path === "/" ? "/" : page.path}`;
  if (!sitemap.includes(`<loc>${url}</loc>`)) fail(`sitemap no incluye ${url}`);
  if (localizedTaxiPaths.has(page.path) && !sitemap.includes(`<xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/taxi-calatayud/" />`)) {
    fail(`sitemap no incluye hreflang x-default para ${page.path}`);
  }
}

const sitemapUrls = [...sitemap.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map((item) => item[1]);
if (sitemapUrls.length !== pages.length) {
  fail(`sitemap tiene ${sitemapUrls.length} URLs, se esperaban ${pages.length}`);
}

if (!existsSync("dist/404.html")) fail("Falta dist/404.html");

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`SEO check OK: ${pages.length} URLs indexables, canonicals .es y JSON-LD válido.`);
