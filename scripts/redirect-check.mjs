const strict = process.argv.includes("--strict");
const canonicalHost = "https://www.taxiayud.es";
const expected = [
  ["https://www.taxiayud.es/", 200, "canonical home"],
  ["https://taxiayud.es/", 301, "apex .es to www"],
  ["http://taxiayud.es/", 301, "http .es to https www"],
  ["https://www.taxiayud.com/", 301, "www .com to .es"],
  ["https://taxiayud.com/", 301, "apex .com to .es"],
  ["http://taxiayud.com/", 301, "http .com to .es"],
  ["https://www.taxiayud.com/hello-world/", 301, "old WordPress post"],
  [
    "https://www.taxiayud.com/taxi-monasterio-de-piedra/",
    301,
    "old .com route to canonical .es route",
  ],
  [
    "https://www.taxiayud.es/taxi-monasterio-de-piedra/",
    308,
    "old route to new canonical route",
  ],
  [
    "https://www.taxiayud.es/taxi-a2-calatayud/",
    308,
    "old A-2 route to passenger breakdown route",
  ],
];

function isPermanent(status) {
  return status === 301 || status === 308;
}

async function step(url) {
  const response = await fetch(url, {
    method: "HEAD",
    redirect: "manual",
  });
  const location = response.headers.get("location");
  return {
    status: response.status,
    location: location ? new URL(location, url).toString() : "",
  };
}

async function follow(url) {
  const chain = [];
  let current = url;

  for (let index = 0; index < 6; index += 1) {
    const result = await step(current);
    chain.push({ url: current, ...result });
    if (!result.location || !isPermanent(result.status)) break;
    current = result.location;
  }

  return chain;
}

const failures = [];
const warnings = [];

for (const [url, expectedStatus, label] of expected) {
  try {
    const chain = await follow(url);
    const first = chain[0];
    const final = chain.at(-1);
    const finalUrl = final.location || final.url;

    if (url === `${canonicalHost}/`) {
      if (first.status !== 200) failures.push(`${label}: esperado 200, recibido ${first.status}`);
      continue;
    }

    if (!isPermanent(first.status)) {
      failures.push(`${label}: esperado redirect permanente, recibido ${first.status}`);
    }

    if (strict && first.status !== expectedStatus) {
      failures.push(`${label}: esperado ${expectedStatus}, recibido ${first.status}`);
    }

    if (!finalUrl.startsWith(canonicalHost)) {
      failures.push(`${label}: termina en ${finalUrl}, no en ${canonicalHost}`);
    }

    if (strict && chain.length > 2) {
      failures.push(`${label}: tiene ${chain.length - 1} saltos; en modo estricto se espera 1`);
    } else if (chain.length > 2) {
      warnings.push(`${label}: ${chain.length - 1} saltos (${chain.map((item) => item.status).join(" -> ")})`);
    }
  } catch (error) {
    failures.push(`${label}: ${error instanceof Error ? error.message : "error de red"}`);
  }
}

for (const warning of warnings) {
  console.warn(`Aviso: ${warning}`);
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Redirect check OK: ${expected.length} URLs terminan en el dominio canonico.`);
