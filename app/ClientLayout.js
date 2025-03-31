"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Navbar from "./navbar"; // Matches your original import
import PriceTicker from "./price ticker/PriceTicker"; // Your custom path
import { Analytics } from "@vercel/analytics/react";
import "./global.css";

export default function ClientLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const mainContainerRef = useRef(null);

  useEffect(() => {
    const mainContainer = mainContainerRef.current;
    const sidebar = sidebarRef.current;

    const handleMainScroll = () => {
      if (sidebarOpen && sidebar) {
        sidebar.style.overflowY = "hidden";
        setTimeout(() => {
          sidebar.style.overflowY = "auto";
        }, 0);
      }
    };

    if (mainContainer) {
      mainContainer.addEventListener("scroll", handleMainScroll);
    }

    return () => {
      if (mainContainer) {
        mainContainer.removeEventListener("scroll", handleMainScroll);
      }
    };
  }, [sidebarOpen]);

  const articles = [
    {
      title: "The Origin of Bitcoin: A Revolutionary Digital Currency",
      excerpt: "Explore the history of Bitcoin, from Satoshi Nakamoto’s vision to its rise as digital gold.",
      link: "/articles#origin-of-bitcoin",
    },
    {
      title: "Bridging the Gap: How Real World Assets (RWA) Are Transforming Crypto",
      excerpt: "Learn how RWAs are revolutionizing finance by tokenizing real-world assets on the blockchain.",
      link: "/articles#real-world-assets",
    },
    {
      title: "Healthcare Meets Blockchain: Revolutionizing Data Privacy",
      excerpt: "Discover how blockchain is transforming healthcare with secure data and interoperability.",
      link: "/articles#healthcare-blockchain",
    },
    {
      title: "Cryptocurrency as a Global Currency",
      excerpt: "Explore how cryptocurrency can revolutionize global transactions with its decentralized nature.",
      link: "/articles#cryptocurrency-global-currency",
    },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar Toggle Button */}
      <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? "✖" : "☰"}
      </button>

      {/* Sidebar Section */}
      <aside ref={sidebarRef} className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <Link href="/articles" className="articles-button">📜 Articles</Link>
        <h2 className="sidebar-title">📊 Dashboard</h2>

        {/* Navigation Links */}
        <nav>
          <ul>
            <li><Link href="/">🏠 Home</Link></li>
            <li><Link href="/articles">📜 Articles</Link></li>
            <li><Link href="/chart">📈 Chart</Link></li>
            <li><Link href="/news">🚀 News</Link></li>
            <li><Link href="/history">📜 History</Link></li>
            <li><Link href="/analytics">📊 Analytics</Link></li>
            <li><Link href="/faq">❓ FAQ</Link></li>
          </ul>
        </nav>

        {/* Latest Articles Section */}
        <div className="sidebar-articles">
          <h3 className="sidebar-articles-title">Latest Articles</h3>
          {articles.map((article, index) => (
            <div key={index} className="sidebar-article-item">
              <Link href={article.link}>
                <h4>{article.title}</h4>
                <p>{article.excerpt}</p>
              </Link>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-container" ref={mainContainerRef}>
        <header className="top-header">
          <PriceTicker />
          <Navbar />
        </header>

        <main className="dashboard-content">{children}</main>

        <footer className="footer">
          <p>© 2025 CryptoGlobal</p>
          <div className="footer-links">
            <Link href="/privacy-policy" className="footer-link">Privacy Policy</Link>
            <Link href="/about" className="footer-link">About</Link>
            <a href="mailto:cryptoglobalive@gmail.com" className="footer-link">
              cryptoglobalive@gmail.com
            </a>
          </div>
        </footer>
      </div>

      <Analytics />
    </div>
  );
}