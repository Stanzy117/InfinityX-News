import React from "react";
import ArticleCard from "./ArticleCard";
export default function ArticleGrid({ articles, savedIds, onToggleSave }) {
  if (!articles.length)
    return (
      <div className="empty-state">
        <span className="empty-icon">∅</span>
        <h3>No stories found</h3>
        <p>Try another search term or select a different category.</p>
      </div>
    );
  return (
    <div className="article-grid">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          saved={savedIds.includes(article.id)}
          onToggleSave={onToggleSave}
        />
      ))}
    </div>
  );
}
