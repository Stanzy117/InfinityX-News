import React from "react";
import { Bookmark, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export function formatDate(date) {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? "Recently" : parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ArticleCard({ article, saved, onToggleSave, featured = false }) {
  return <article className={`article-card${featured ? " featured-card" : ""}`}>
    <Link to={`/article/${article.id}`} className="card-image-wrap">
      {article.image ? <img src={article.image} alt="" className="card-image" loading="lazy" onError={e => { e.currentTarget.style.display = "none"; }}/> : <div className="image-placeholder">IX</div>}
      <span className="image-category">{article.category || "Latest"}</span>
    </Link>
    <div className="card-copy">
      <div className="article-meta"><span>{article.source || article.author || "News desk"}</span><i/> <time>{formatDate(article.publishedAt)}</time></div>
      <h3><Link to={`/article/${article.id}`}>{article.title}</Link></h3>
      <p>{article.description}</p>
      <div className="card-bottom"><Link to={`/article/${article.id}`} className="read-link">Read story <ArrowUpRight size={15}/></Link><button className={`bookmark-button${saved ? " saved" : ""}`} onClick={() => onToggleSave(article)} aria-label={saved ? "Remove bookmark" : "Save article"} title={saved ? "Remove bookmark" : "Save for later"}><Bookmark size={18} fill={saved ? "currentColor" : "none"}/></button></div>
    </div>
  </article>;
}