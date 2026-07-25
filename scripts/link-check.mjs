import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const distDir = "dist";
const errors = [];
const htmlFiles = [];

function walk(dir) {
  for (const item of readdirSync(dir)) {
    const path = join(dir, item);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      walk(path);
    } else if (path.endsWith(".html")) {
      htmlFiles.push(path);
    }
  }
}

function isIgnoredUrl(value) {
  return (
    !value ||
    value.startsWith("#") ||
    value.startsWith("//") ||
    value.startsWith("tel:") ||
    value.startsWith("mailto:") ||
    value.startsWith("https://wa.me/") ||
    value.startsWith("https://share.google/") ||
    value.startsWith("https://maps.google.com/") ||
    value.startsWith("https://www.taxiayud.es/") ||
    value.startsWith("https://www.google") ||
    value.startsWith("data:")
  );
}

function targetForUrl(url) {
  const clean = url.split("#")[0].split("?")[0];
  if (isIgnoredUrl(clean)) return null;
  if (!clean.startsWith("/")) return null;
  if (clean === "/") return join(distDir, "index.html");

  const extension = extname(clean);
  if (extension) return join(distDir, clean);

  return join(distDir, clean, "index.html");
}

function checkUrl(file, attr, url) {
  const target = targetForUrl(url);
  if (!target) return;
  if (!existsSync(target)) {
    errors.push(`${file}: ${attr}="${url}" apunta a ${target}, pero no existe`);
  }
}

if (!existsSync(distDir)) {
  console.error("No existe dist/. Ejecuta primero pnpm build.");
  process.exit(1);
}

walk(distDir);

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");

  for (const [, attr, url] of html.matchAll(/\b(href|src)=["']([^"']+)["']/g)) {
    checkUrl(file, attr, url);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Link check OK: ${htmlFiles.length} HTML revisados sin enlaces internos rotos.`);
