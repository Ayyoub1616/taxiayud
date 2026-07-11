const GOOGLE_PLACES_BASE_URL = "https://places.googleapis.com/v1";

function ratingLabel(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return `${value.toFixed(1).replace(".", ",")}/5`;
}

function countLabel(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return `${value} ${value === 1 ? "opinión" : "opiniones"}`;
}

function reviewText(review) {
  return review?.text?.text || review?.originalText?.text || "";
}

function sortByNewest(reviews) {
  return [...reviews].sort((a, b) => {
    const first = Date.parse(b?.publishTime || "");
    const second = Date.parse(a?.publishTime || "");

    if (Number.isNaN(first) || Number.isNaN(second)) return 0;
    return first - second;
  });
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ message: "Método no permitido." });
    return;
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    response.status(200).json({ configured: false });
    return;
  }

  try {
    const googleResponse = await fetch(
      `${GOOGLE_PLACES_BASE_URL}/places/${encodeURIComponent(placeId)}?languageCode=es&regionCode=ES`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "rating,userRatingCount,reviews.rating,reviews.text,reviews.originalText,reviews.authorAttribution,reviews.relativePublishTimeDescription,reviews.publishTime,reviews.googleMapsUri",
        },
      },
    );

    if (!googleResponse.ok) {
      response.status(502).json({ message: "No se pudieron cargar las reseñas de Google." });
      return;
    }

    const data = await googleResponse.json();
    const rating = ratingLabel(data.rating);
    const count = countLabel(data.userRatingCount);
    const items = sortByNewest(data.reviews || [])
      .map((review) => ({
        author: review?.authorAttribution?.displayName || "Cliente de Google",
        text: reviewText(review),
        rating: review?.rating || 5,
        time: review?.relativePublishTimeDescription,
        publishTime: review?.publishTime,
        url: review?.googleMapsUri || review?.authorAttribution?.uri,
      }))
      .filter((review) => review.text)
      .slice(0, 8);

    if (!rating || !count) {
      response.status(502).json({ message: "Google no devolvió valoración suficiente." });
      return;
    }

    response.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    response.status(200).json({
      rating,
      count,
      items,
      source: "google-places",
    });
  } catch {
    response.status(502).json({ message: "No se pudieron cargar las reseñas de Google." });
  }
}
