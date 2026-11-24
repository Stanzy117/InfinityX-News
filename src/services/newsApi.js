import { demoArticles } from "../data/demoArticles";

function mapArticle(article) {
  const title = article.title || "Untitled story";

  return {
    id: `${slugify(title)}-${slugify(article.url || title)}`,
    title,
    description: article.description || "Open this story to read more.",
    content:
      article.content ||
      article.description ||
      "The publisher has not supplied a full article body. Follow the source link to continue reading.",
    category: "Latest",
    author: article.source?.name || "News desk",
    publishedAt: article.publishedAt || new Date().toISOString(),
    image: article.image || "",
    source: article.source?.name || "External source",
    url: article.url || "#",
  };
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 65);
}

export async function getTopHeadlines({ category = "", query = "" } = {}) {
  const params = new URLSearchParams();

  if (query) params.set("query", query);
  if (category && category !== "All") {
    params.set("category", category.toLowerCase());
  }

  const response = await fetch(
    `/.netlify/functions/news?${params.toString()}`
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    throw new Error(
      data.error || `News service returned ${response.status}. Please try again.`
    );
  }

  const data = await response.json();
  const articles = (data.articles || []).map(mapArticle);

  const combined = [...articles, ...demoArticles];

  return {
    articles: combined.filter(
      (article, index, all) =>
        all.findIndex((item) => item.id === article.id) === index
    ),
    demo: false,
  };
}

export async function getArticleById(id) {
  const saved = JSON.parse(
    sessionStorage.getItem("savedArticles") || "[]"
  );

  const found = saved.find((article) => article.id === id);

  if (found) return found;

  const { articles } = await getTopHeadlines();

  return (
    articles.find((article) => article.id === id) ||
    demoArticles.find((article) => article.id === id) ||
    null
  );
}