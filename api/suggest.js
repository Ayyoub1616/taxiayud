const ORS_BASE_URL = "https://api.openrouteservice.org";

function withSpain(value) {
  const clean = String(value || "").trim();
  if (!clean) return "";
  return /spain|españa/i.test(clean) ? clean : `${clean}, España`;
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ message: "Método no permitido." });
    return;
  }

  const apiKey = process.env.OPENROUTESERVICE_API_KEY;
  const query = String(request.query?.q || "").trim();

  if (!apiKey || query.length < 3) {
    response.status(200).json({ suggestions: [] });
    return;
  }

  try {
    const params = new URLSearchParams({
      text: withSpain(query),
      size: "5",
      "boundary.country": "ES",
      "focus.point.lat": "41.3527",
      "focus.point.lon": "-1.6432",
    });

    const orsResponse = await fetch(`${ORS_BASE_URL}/geocode/autocomplete?${params}`, {
      headers: { Authorization: apiKey },
    });

    if (!orsResponse.ok) {
      response.status(200).json({ suggestions: [] });
      return;
    }

    const data = await orsResponse.json();
    const suggestions = (data?.features || [])
      .map((feature) => ({
        label: feature?.properties?.label,
        detail: feature?.properties?.locality || feature?.properties?.region,
      }))
      .filter((item) => item.label)
      .slice(0, 5);

    response.status(200).json({ suggestions });
  } catch {
    response.status(200).json({ suggestions: [] });
  }
}
