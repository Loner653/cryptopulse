"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./sidebar.module.css";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("./chart/CryptoChart"), { ssr: false });

export default function Sidebar({ isOpen, articles, ref }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showChart, setShowChart] = useState(false);

  return (
    <aside
      ref={ref}
      className={`${styles.sidebar} ${isOpen ? styles.open : ""} ${isCollapsed ? styles.collapsed : ""}`}
    >
      <button
        className={styles.toggleBtn}
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label="Toggle sidebar width"
      >
        {isCollapsed ? "➡️" : "⬅️"}
      </button>

      {!isCollapsed && <h2 className={styles.logo}>📊 Dashboard</h2>}

      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li><Link href="/">🏠 Home</Link></li>
          <li><Link href="/articles">📚 Articles</Link></li>
          <li><Link href="/chat">📩 Chat</Link></li>
          <li><Link href="/history">📜 History</Link></li>
          <li><Link href="/faq"> 🧠 FAQ</Link></li>
          <li><Link href="/news">🚪 News</Link></li>
          <li><Link href="/chart">📈 Chart Page</Link></li>
          <li><Link href="/quiz">❓ Quiz</Link></li> {/* Added Quiz link */}
          <li>
            <button
              className={styles.chartBtn}
              onClick={() => setShowChart(!showChart)}
            >
              {showChart ? "❌ Hide Chart" : "📈 Show Chart"}
            </button>
          </li>
        </ul>
      </nav>

      {showChart && (
        <div className={styles.chartContainer}>
          <Chart />
        </div>
      )}

      {!isCollapsed && articles && (
        <div className={styles.articles}>
          <h3 className={styles.articlesTitle}>Latest Articles</h3>
          {articles.map((article, index) => (
            <div key={index} className={styles.articleItem}>
              <Link href={article.link}>
                <h4>{article.title}</h4>
                <p>{article.excerpt}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}