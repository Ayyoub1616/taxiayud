import { existsSync, readFileSync } from "node:fs";

const checks = [];
const errors = [];

function addCheck(label, condition) {
  checks.push(label);
  if (!condition) errors.push(label);
}

function read(path) {
  if (!existsSync(path)) {
    errors.push(`No existe ${path}`);
    return "";
  }

  return readFileSync(path, "utf8");
}

const home = read("dist/index.html");
const taxiCalatayud = read("dist/taxi-calatayud/index.html");
const english = read("dist/en/taxi-calatayud/index.html");
const road = read("dist/taxi-pasajeros-averia-a2-calatayud/index.html");
const festivals = read("dist/taxi-fiestas-calatayud/index.html");
const calatayudZaragoza = read("dist/taxi-calatayud-zaragoza/index.html");
const zaragozaCalatayud = read("dist/taxi-zaragoza-calatayud/index.html");
const monastery = read("dist/taxi-calatayud-monasterio-de-piedra/index.html");
const airport = read("dist/taxi-calatayud-aeropuerto-zaragoza/index.html");
const notFound = read("dist/404.html");
const sitemap = read("dist/sitemap.xml");
const llms = read("dist/llms.txt");
const vercelConfig = JSON.parse(read("vercel.json"));

addCheck("La portada contiene el teléfono principal", home.includes("611 861 041"));
addCheck("La portada enlaza WhatsApp", home.includes("wa.me/34611861041"));
addCheck("La portada incluye contenido SEO inicial", home.includes("static-seo-content"));
addCheck("La página taxi Calatayud tiene canonical propio", taxiCalatayud.includes('href="https://www.taxiayud.es/taxi-calatayud/"'));
addCheck("La página inglesa declara idioma", english.includes('<html lang="en" dir="ltr">'));
addCheck("La página inglesa tiene hreflang a francés", english.includes('hreflang="fr" href="https://www.taxiayud.es/fr/taxi-calatayud/"'));
addCheck("La página A-2 existe para búsquedas de avería", road.includes("Taxi para pasajeros por avería"));
addCheck("La página de fiestas existe para búsquedas de San Roque", festivals.includes("San Roque"));
addCheck("La página Calatayud Zaragoza existe", calatayudZaragoza.includes("Taxi de Calatayud a Zaragoza"));
addCheck("La página Zaragoza Calatayud existe", zaragozaCalatayud.includes("Taxi de Zaragoza a Calatayud"));
addCheck("La página Calatayud Monasterio existe", monastery.includes("Taxi Calatayud-Monasterio de Piedra"));
addCheck("La página Calatayud Aeropuerto existe", airport.includes("Taxi Calatayud Aeropuerto de Zaragoza"));
addCheck("La 404 es noindex", notFound.includes('content="noindex, follow, max-image-preview:large"'));
addCheck("El sitemap incluye alternates multidioma", sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"'));
addCheck("El sitemap incluye imágenes", sitemap.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"') && sitemap.includes("<image:image>"));
addCheck("El sitemap incluye la ruta A-2 canonica", sitemap.includes("https://www.taxiayud.es/taxi-pasajeros-averia-a2-calatayud/"));
addCheck("El sitemap incluye taxi fiestas Calatayud", sitemap.includes("https://www.taxiayud.es/taxi-fiestas-calatayud/"));
addCheck("El sitemap incluye taxi Calatayud Zaragoza", sitemap.includes("https://www.taxiayud.es/taxi-calatayud-zaragoza/"));
addCheck("El sitemap incluye taxi Calatayud Monasterio", sitemap.includes("https://www.taxiayud.es/taxi-calatayud-monasterio-de-piedra/"));
addCheck("El sitemap incluye taxi Calatayud Aeropuerto", sitemap.includes("https://www.taxiayud.es/taxi-calatayud-aeropuerto-zaragoza/"));
addCheck("El sitemap no indexa taxi 24 horas sin confirmar", !sitemap.includes("https://www.taxiayud.es/taxi-24-horas-calatayud/"));
addCheck("El sitemap no indexa rutas antiguas A-2", !sitemap.includes("https://www.taxiayud.es/taxi-a2-calatayud/"));
addCheck("El sitemap no indexa ruta antigua de autovía", !sitemap.includes("https://www.taxiayud.es/taxi-autovia-calatayud/"));
addCheck("El sitemap no indexa ruta antigua de Monasterio", !sitemap.includes("https://www.taxiayud.es/taxi-monasterio-de-piedra/"));
addCheck("llms.txt no recomienda taxi 24 horas sin confirmar", !llms.includes("https://www.taxiayud.es/taxi-24-horas-calatayud/"));
addCheck(
  "No quedan URLs antiguas .com",
  !`${home}${taxiCalatayud}${english}${road}${festivals}${calatayudZaragoza}${zaragozaCalatayud}${sitemap}${llms}`.includes("taxiayud.com"),
);

const redirects = Array.isArray(vercelConfig.redirects) ? vercelConfig.redirects : [];
const canonicalHostRedirects = ["taxiayud.com", "www.taxiayud.com", "taxiayud.es"];

for (const host of canonicalHostRedirects) {
  const redirect = redirects.find(
    (item) =>
      item.source === "/(.*)" &&
      item.destination === "https://www.taxiayud.es/$1" &&
      item.statusCode === 301 &&
      item.has?.some((condition) => condition.type === "host" && condition.value === host),
  );
  addCheck(`Redirect 301 de ${host} hacia el canonico .es`, Boolean(redirect));
}

addCheck(
  "La ruta antigua Hello world redirige al dominio canonico",
  redirects.some(
    (item) =>
      item.source === "/hello-world/" &&
      item.destination === "https://www.taxiayud.es/" &&
      item.statusCode === 301,
  ),
);

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Smoke check OK: ${checks.length} comprobaciones críticas.`);
