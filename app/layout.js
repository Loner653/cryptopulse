"use client";
import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "./navbar";
import styles from "./sidebar.module.css";
import "./global.css";

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const mainContainerRef = useRef(null);

  // Reset sidebar scrollability after main content is scrolled
  useEffect(() => {
    const mainContainer = mainContainerRef.current;
    const sidebar = sidebarRef.current;

    const handleMainScroll = () => {
      if (sidebarOpen && sidebar) {
        // Force a re-render of the sidebar's scroll state by toggling a CSS property
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
    <html lang="en">
      <Head>
        <title>Crypto & DePIN Hub</title>
        <meta
          name="description"
          content="Your hub for crypto airdrops, news, and real-time tracking"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <body className="dashboard-layout">
        <button
          className={`${styles.sidebarToggle} sidebar-toggle`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "✖ Close" : "☰ Menu"}
        </button>

        <aside
          ref={sidebarRef}
          className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}
        >
          <Link href="/articles" className={styles.articlesButton}>
            📜 Articles
          </Link>

          <h2 className={styles.sidebarTitle}>📊 Dashboard</h2>
          <nav>
            <ul className={styles.navList}>
              <li><Link href="/">🏠 Home</Link></li>
              
              <li><Link href="/articles">📜 Articles</Link></li>
              
              <li><Link href="/chart">📈 Chart</Link></li>
              
              <li><Link href="/news">🚪 News</Link></li>
              
              <li><Link href="/history">📜 History</Link></li>
              
              <li><Link href="/analytics">📊 Analytics</Link></li>
              
              
              
            </ul>
          </nav>

          <div className={styles.sidebarArticles}>
            <h3 className={styles.sidebarArticlesTitle}>Latest Articles</h3>
            {articles.map((article, index) => (
              <div key={index} className={styles.sidebarArticleItem}>
                <Link href={article.link}>
                  <h4>{article.title}</h4>
                  <p>{article.excerpt}</p>
                </Link>
              </div>
            ))}
          </div>
        </aside>

        <div className="main-container" ref={mainContainerRef}>
          <header className="top-header">
            <Navbar />
          </header>

          <main className="dashboard-content">
            {children}
          </main>

          <footer className="footer">
            <p>© 2025 Crypto & DePIN Hub</p>
          </footer>
        </div>
      </body>
    </html>
  );
}