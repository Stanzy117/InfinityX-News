import React from "react";
import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Bookmark, CheckCircle2, Clock3, ExternalLink, Flame, LoaderCircle, Newspaper, Search, ShieldCheck } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ArticleCard, { formatDate } from "./components/ArticleCard";
import ArticleGrid from "./components/ArticleGrid";
import { getTopHeadlines } from "./services/newsApi";
import { demoArticles } from "./data/demoArticles";

const categories = ["All", "Technology", "Business", "Sports", "Entertainment", "Politics", "Health"];

function useBookmarks() {
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem("infinityx-bookmarks") || "[]"); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem("infinityx-bookmarks", JSON.stringify(saved)); }, [saved]);
  const savedIds = useMemo(() => saved.map(item => item.id), [saved]);
  function toggle(article) { setSaved(current => current.some(item => item.id === article.id) ? current.filter(item => item.id !== article.id) : [article, ...current]); }
  return { saved, savedIds, toggle };
}

function LoadingState() { return <div className="loading-state"><LoaderCircle className="spin" size={30}/><strong>Gathering the latest stories</strong><span>Just a moment while we load your newsroom.</span></div>; }
function ErrorState({ message, onRetry }) { return <div className="error-state"><span>!</span><h3>We couldn't load the news</h3><p>{message}</p><button className="button button-dark" onClick={onRetry}>Try again</button></div>; }

function useArticles(category = "", query = "") {
  const [state, setState] = useState({ articles: [], loading: true, error: "", demo: false });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let alive = true;
    setState(s => ({ ...s, loading: true, error: "" }));
    getTopHeadlines({ category, query }).then(result => { if (alive) setState({ ...result, loading: false, error: "" }); })
      .catch(error => { if (alive) setState({ articles: [], loading: false, error: error.message || "Please check your connection.", demo: false }); });
    return () => { alive = false; };
  }, [category, query, retry]);
  return { ...state, retry: () => setRetry(n => n + 1) };
}

function BreakingStrip() {
  return <div className="breaking-strip"><div className="container breaking-inner"><span className="breaking-label"><Flame size={15} fill="currentColor"/> THE BRIEFING</span><span>Stay informed. Look deeper. See the bigger picture.</span><span className="live-dot"><i/> NEWS DESK</span></div></div>;
}

function SectionHeading({ eyebrow, title, description, action, to = "/news" }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{description && <p>{description}</p>}</div>{action && <Link className="text-link" to={to}>{action}<ArrowRight size={16}/></Link>}</div>;
}

function HomePage({ bookmarks }) {
  const { articles, loading, error, retry, demo } = useArticles();
  const lead = articles[0] || demoArticles[0];
  const latest = articles.slice(1, 5);
  const categoryArticles = (category) => articles.filter(a => a.category === category).slice(0, 2);
  return <><BreakingStrip/><main>
    <section className="container hero-section">
      <div className="hero-intro"><span className="eyebrow"><span className="eyebrow-line"/> YOUR WORLD, EXPLAINED</span><h1>Stay curious.<br/><em>Stay informed.</em></h1><p>Stories that matter, perspectives that challenge, and the context behind today's headlines.</p><Link to="/news" className="button button-red">Explore the latest <ArrowRight size={17}/></Link><div className="hero-trust"><span><CheckCircle2 size={15}/> Curated perspectives</span><span><Clock3 size={15}/> Updated regularly</span></div></div>
      <div className="hero-feature">
        {loading && <div className="hero-image-loading"><LoaderCircle className="spin"/></div>}
        <Link to={`/article/${lead.id}`} className="hero-image">{lead.image && <img src={lead.image} alt="" onError={e => e.currentTarget.style.display = "none"}/>}<span className="hero-image-shade"/></Link>
        <div className="hero-feature-copy"><div className="article-meta"><span className="red-meta">{lead.category || "Editor's pick"}</span><i/><time>{formatDate(lead.publishedAt)}</time></div><h2><Link to={`/article/${lead.id}`}>{lead.title}</Link></h2><p>{lead.description}</p><Link to={`/article/${lead.id}`} className="read-link">Read featured story <ArrowUpRight size={16}/></Link></div>
      </div>
    </section>
    <div className="container hero-bottom-line"><span>INDEPENDENT THINKING. CONNECTED WORLD.</span><span>VOL. 01 <b>✳</b> DAILY EDITION</span></div>
    <section className="container section-block"><SectionHeading eyebrow="WHAT'S HAPPENING" title="The latest stories" description="A closer look at the stories shaping our world." action="View all news"/>{demo && <div className="demo-notice">Demo mode: sample articles are shown. Add a GNews API key to load live headlines.</div>}{loading ? <LoadingState/> : error ? <ErrorState message={error} onRetry={retry}/> : <ArticleGrid articles={latest.length ? latest : articles.slice(0, 4)} savedIds={bookmarks.savedIds} onToggleSave={bookmarks.toggle}/>}</section>
    <section className="category-band"><div className="container"><SectionHeading eyebrow="FOLLOW YOUR INTERESTS" title="Stories by topic" description="Go deeper into the subjects you care about."/><div className="category-grid">{categories.slice(1).map((cat, i) => <Link key={cat} to={`/category/${cat.toLowerCase()}`} className={`category-tile category-${i+1}`}><span className="category-number">0{i+1}</span><span>{cat}</span><ArrowUpRight size={19}/></Link>)}</div></div></section>
    <section className="container section-block newsletter-section"><div className="newsletter-copy"><span className="eyebrow">A MORE INFORMED INBOX</span><h2>Good stories.<br/><em>No unnecessary noise.</em></h2><p>Follow the topics that matter to you and make room for a little more context.</p></div><div className="newsletter-card"><Newspaper size={27}/><h3>Your daily perspective starts here.</h3><p>Explore the latest coverage, save stories for later, and build your own reading list.</p><Link to="/news" className="button button-dark">Browse the newsroom <ArrowRight size={16}/></Link></div></section>
  </main></>;
}

function NewsPage({ bookmarks, category: forcedCategory = "" }) {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const category = forcedCategory || params.get("category") || "All";
  const { articles, loading, error, retry, demo } = useArticles(category, query);
  const [sort, setSort] = useState("newest");
  const sorted = [...articles].sort((a,b) => sort === "oldest" ? new Date(a.publishedAt)-new Date(b.publishedAt) : sort === "title" ? a.title.localeCompare(b.title) : new Date(b.publishedAt)-new Date(a.publishedAt));
  const title = forcedCategory ? `${forcedCategory} stories` : query ? `Search results for “${query}”` : "All the latest";
  return <main className="container page-main"><div className="page-title-row"><div><span className="eyebrow">THE NEWSROOM</span><h1>{title}</h1><p>Reporting, ideas and perspectives to help you understand what's happening.</p></div><div className="result-count">{articles.length} <span>stories</span></div></div>
    {!forcedCategory && <div className="filter-toolbar"><div className="category-pills">{categories.map(cat => <button key={cat} onClick={() => setParams(cat === "All" ? {} : { category: cat })} className={`pill${category === cat ? " selected" : ""}`}>{cat}</button>)}</div><label className="sort-select">Sort by <select value={sort} onChange={e => setSort(e.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="title">Title A–Z</option></select></label></div>}
    {demo && <div className="demo-notice">Showing sample stories. Configure your GNews API key for live articles.</div>}
    {loading ? <LoadingState/> : error ? <ErrorState message={error} onRetry={retry}/> : <ArticleGrid articles={sorted} savedIds={bookmarks.savedIds} onToggleSave={bookmarks.toggle}/>}
  </main>;
}

function CategoryPage({ bookmarks }) {
  const { category } = useParams();
  const normalized = categories.find(c => c.toLowerCase() === category?.toLowerCase());
  if (!normalized || normalized === "All") return <main className="container page-main"><div className="empty-state"><h2>Category not found</h2><p>Choose a category from the navigation.</p><Link className="button button-dark" to="/news">Browse all news</Link></div></main>;
  return <NewsPage key={normalized} bookmarks={bookmarks} category={normalized}/>;
}

function ArticlePage({ bookmarks }) {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const all = await getTopHeadlines();
        const found = all.articles.find(a => a.id === id) || demoArticles.find(a => a.id === id);
        if (active) setArticle(found || null);
      } catch { if (active) setArticle(demoArticles.find(a => a.id === id) || null); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [id]);
  if (loading) return <main className="container page-main"><LoadingState/></main>;
  if (!article) return <main className="container page-main"><div className="empty-state"><h2>Article not found</h2><p>This story may have moved or is no longer available in the current feed.</p><Link className="button button-dark" to="/news">Return to latest news</Link></div></main>;
  const saved = bookmarks.savedIds.includes(article.id);
  return <main className="container article-page"><div className="article-breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/news">News</Link><span>/</span><span>{article.category}</span></div><article className="article-detail"><div className="article-detail-head"><span className="eyebrow">{article.category || "LATEST STORY"}</span><h1>{article.title}</h1><p className="article-deck">{article.description}</p><div className="article-byline"><span className="author-avatar">{(article.author || "N").slice(0,1)}</span><span><strong>{article.author || article.source || "News desk"}</strong><small>Published {formatDate(article.publishedAt)}</small></span><button className={`button save-story${saved ? " is-saved" : ""}`} onClick={() => bookmarks.toggle(article)}><Bookmark size={16} fill={saved ? "currentColor" : "none"}/>{saved ? "Saved" : "Save story"}</button></div></div>
    {article.image && <img className="article-detail-image" src={article.image} alt="" onError={e => e.currentTarget.style.display = "none"}/>}<div className="article-body"><p className="drop-cap">{article.content || article.description}</p>{article.url && article.url !== "#" && <a className="source-link" href={article.url} target="_blank" rel="noreferrer">Continue reading at {article.source || "original publisher"} <ExternalLink size={16}/></a>}<div className="editor-note"><ShieldCheck size={19}/><p><strong>Source note</strong><br/>Article details are provided by the listed publisher. Check the original source for full context and updates.</p></div></div>
  </article><div className="article-return"><Link to="/news" className="text-link">← Back to all stories</Link></div></main>;
}

function BookmarksPage({ bookmarks }) {
  return <main className="container page-main"><div className="page-title-row"><div><span className="eyebrow">YOUR PERSONAL READING LIST</span><h1>Saved stories</h1><p>Keep the stories you want to return to, all in one place.</p></div><div className="result-count">{bookmarks.saved.length} <span>saved</span></div></div><ArticleGrid articles={bookmarks.saved} savedIds={bookmarks.savedIds} onToggleSave={bookmarks.toggle}/></main>;
}

function AboutPage() {
  return <main className="container page-main about-page"><span className="eyebrow">ABOUT THE PROJECT</span><h1>One world.<br/><em>Infinite perspectives.</em></h1><p className="about-lead">InfinityX News is a student-built React news portal designed to make it easier to discover stories, explore topics and keep a personal reading list.</p><div className="about-cards"><div><Search/><h3>Discover</h3><p>Search headlines and browse coverage by topic.</p></div><div><Bookmark/><h3>Save</h3><p>Keep interesting articles for later with browser-based bookmarks.</p></div><div><Newspaper/><h3>Understand</h3><p>Open individual stories and follow links to their original publishers.</p></div></div><div className="sponsor-credit"><span className="eyebrow">DESIGN INSPIRATION</span><h2>InfinityX News</h2><p>This independent implementation takes inspiration from <a href="https://infinityx-news.base44.app/" target="_blank" rel="noreferrer">infinityx-news.base44.app</a>. The reference is credited for inspiration; no official sponsorship or affiliation is implied.</p></div></main>;
}

export default function App() {
  const bookmarks = useBookmarks();
  const [dark, setDark] = useState(() => localStorage.getItem("infinityx-theme") === "dark");
  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; localStorage.setItem("infinityx-theme", dark ? "dark" : "light"); }, [dark]);
  return <div className="app-shell"><Header savedCount={bookmarks.saved.length} dark={dark} onToggleTheme={() => setDark(v => !v)}/><Routes>
    <Route path="/" element={<HomePage bookmarks={bookmarks}/>}/>
    <Route path="/news" element={<NewsPage bookmarks={bookmarks}/>}/>
    <Route path="/category/:category" element={<CategoryPage bookmarks={bookmarks}/>}/>
    <Route path="/article/:id" element={<ArticlePage bookmarks={bookmarks}/>}/>
    <Route path="/bookmarks" element={<BookmarksPage bookmarks={bookmarks}/>}/>
    <Route path="/about" element={<AboutPage/>}/>
    <Route path="*" element={<main className="container page-main"><div className="empty-state"><h2>Page not found</h2><p>The page you're looking for doesn't exist.</p><Link className="button button-dark" to="/">Go home</Link></div></main>}/>
  </Routes><Footer/></div>;
}