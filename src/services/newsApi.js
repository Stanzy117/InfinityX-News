import { demoArticles } from "../data/demoArticles";

const API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
const API_BASE = "https://gnews.io/api/v4";

function mapArticle(article, index = 0) {
  const title = article.title || "Untitled story";
  return {
    id: `${slugify(title)}-${index}`,
    title,
    description: article.description || "Open this story to read more.",
    content: article.content || article.description || "The publisher has not supplied a full article body. Follow the source link to continue reading.",
    category: "Latest",
    author: article.source?.name || "News desk",
    publishedAt: article.publishedAt || new Date().toISOString(),
    image: article.image || "",
    source: article.source?.name || "External source",
    url: article.url || "#"
  };
}
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 65);
}

export async function getTopHeadlines({ category = "", query = "" } = {}) {
  if (!API_KEY) {
    await new Promise(resolve => setTimeout(resolve, 350));
    let items = demoArticles;
    if (category && category !== "All") items = items.filter(a => a.category === category);
    if (query) items = items.filter(a => `${a.title} ${a.description} ${a.category}`.toLowerCase().includes(query.toLowerCase()));
    return { articles: items, demo: true };
  }

  const params = new URLSearchParams({ lang: "en", max: "10", apikey: API_KEY });
  if (query) params.set("q", query);
  else if (category && category !== "All") params.set("topic", category.toLowerCase());
  else params.set("country", "us");

  const response = await fetch(`${API_BASE}/top-headlines?${params}`);
  if (!response.ok) {
    const message = response.status === 401 ? "The news API key was rejected. Check VITE_GNEWS_API_KEY in your .env file." : `News service returned ${response.status}. Please try again.`;
    throw new Error(message);
  }
  const data = await response.json();
  return { articles: (data.articles || []).map(mapArticle), demo: false };
}

export async function getArticleById(id) {
  const { articles } = await getTopHeadlines();
  return articles.find(article => article.id === id) || demoArticles.find(article => article.id === id) || null;
}