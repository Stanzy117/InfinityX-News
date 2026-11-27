const allowedOrigins = new Set([
  "https://stanzy117.github.io",
  "https://infinityx-news-nlro.netlify.app",
]);

function getCorsHeaders(origin) {
  return {
    ...(allowedOrigins.has(origin)
      ? { "Access-Control-Allow-Origin": origin }
      : {}),
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function jsonResponse(body, status = 200, origin = "") {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...getCorsHeaders(origin),
    },
  });
}

export default async (request) => {
  const origin = request.headers.get("Origin") || "";

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(origin),
    });
  }

  try {
    const API_KEY = process.env.GNEWS_API_KEY;

    if (!API_KEY) {
      return jsonResponse(
        { error: "News API key is missing on the server." },
        500,
        origin
      );
    }

    const url = new URL(request.url);
    const query = url.searchParams.get("query") || "";
    const category = url.searchParams.get("category") || "";

    const params = new URLSearchParams({
      lang: "en",
      max: "10",
      apikey: API_KEY,
    });

    if (query) {
      params.set("q", query);
    } else {
      const topics = [
        "general",
        "world",
        "nation",
        "business",
        "technology",
        "entertainment",
        "sports",
        "science",
        "health",
      ];

      if (topics.includes(category.toLowerCase())) {
        params.set("topic", category.toLowerCase());
      } else {
        params.set("country", "us");
      }
    }

    const response = await fetch(
      `https://gnews.io/api/v4/top-headlines?${params}`
    );

    const data = await response.json();

    if (!response.ok) {
      return jsonResponse(
        { error: data.errors?.[0] || "Unable to retrieve news." },
        response.status,
        origin
      );
    }

    return jsonResponse(data, 200, origin);
  } catch (error) {
    return jsonResponse(
      { error: "News service is temporarily unavailable." },
      500,
      origin
    );
  }
};
