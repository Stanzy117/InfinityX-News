import React from "react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bookmark, Menu, Search, Sun, Moon, X, Zap } from "lucide-react";

export default function Header({ savedCount, dark, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  function submitSearch(event) {
    event.preventDefault();
    navigate(`/news${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
    setMenuOpen(false);
  }
  const navClass = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;
  return <>
    <div className="topline"><div className="container topline-inner"><span><Zap size={14} fill="currentColor"/> THE WORLD, IN CONTEXT</span><span>Independent perspectives. Informed readers.</span><span className="top-date">{new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span></div></div>
    <header className="site-header">
      <div className="container header-main">
        <button className="icon-button mobile-menu" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
        <Link to="/" className="brand" aria-label="InfinityX News home"><span className="brand-mark">∞</span><span>INFINITY<span className="brand-red">X</span><small>NEWSROOM</small></span></Link>
        <form className="header-search" onSubmit={submitSearch}><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search stories, topics, people..." aria-label="Search stories"/><button type="submit">Search</button></form>
        <div className="header-actions"><Link to="/bookmarks" className="saved-link"><Bookmark size={18}/><span>Saved</span>{savedCount > 0 && <b>{savedCount}</b>}</Link><button className="icon-button theme-button" onClick={onToggleTheme} aria-label="Toggle theme">{dark ? <Sun size={19}/> : <Moon size={19}/>}</button></div>
      </div>
      <nav className={`main-nav${menuOpen ? " open" : ""}`}><div className="container nav-inner">
        <NavLink end to="/" className={navClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
        <NavLink to="/news" className={navClass} onClick={() => setMenuOpen(false)}>Latest News</NavLink>
        {["Technology","Business","Sports","Entertainment","Politics","Health"].map(category => <NavLink key={category} to={`/category/${category.toLowerCase()}`} className={navClass} onClick={() => setMenuOpen(false)}>{category}</NavLink>)}
        <Link to="/about" className="nav-link about-nav" onClick={() => setMenuOpen(false)}>About</Link>
      </div></nav>
    </header>
  </>;
}