export default async (request) => {
  try {
    const API_KEY = process.env.GNEWS_API_KEY;

    if (!API_KEY) {
      return Response.json(
        { error: "News API key is missing on the server." },
        { status: 500 }
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
      return Response.json(
        { error: data.errors?.[0] || "Unable to retrieve news." },
        { status: response.status }
      );
    }

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "News service is temporarily unavailable." },
      { status: 500 }
    );
  }
};