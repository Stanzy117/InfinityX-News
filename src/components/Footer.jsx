import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Infinity as InfinityIcon } from "lucide-react";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <div className="brand footer-logo">
            <span className="brand-mark">∞</span>
            <span>
              TEAM<span className="brand-red">SSDI</span>
              <small>NEWSROOM</small>
            </span>
          </div>
          <p>One world. Every story. Infinite perspectives.</p>
        </div>
        <div className="footer-links">
          <strong>Explore</strong>
          <Link to="/">Home</Link>
          <Link to="/news">Latest news</Link>
          <Link to="/bookmarks">Saved stories</Link>
          <Link to="/about">About us</Link>
        </div>
        <div className="footer-note">
          <strong>Stay curious.</strong>
          <p>Clear reporting starts with asking better questions.</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Team SSD News Portal</span>
        <span>
          Independent React project · News sources retain their rights
        </span>
      </div>
    </footer>
  );
}
