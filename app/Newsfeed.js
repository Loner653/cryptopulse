"use client";

import { useState, useEffect } from "react";
import styles from "./news.module.css";

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news");
      const data = await response.json();
      if (response.ok) {
        setNews(data);
        setError(null);
      } else {
        setError(data.error || "Failed to fetch news");
      }
    } catch (error) {
      setError("An error occurred while fetching news");
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();

    // Set up polling to fetch news every 5 minutes
    const interval = setInterval(fetchNews, 300000); // 5 minutes
    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  if (loading) return <div className={styles.newsContainer}>Loading...</div>;
  if (error) return <div className={styles.newsContainer}>Error: {error}</div>;

  return (
    <div className={styles.newsContainer}>
      <h1 className={styles.title}>📰 Crypto News</h1>
      {news.length === 0 ? (
        <p>No news articles available at the moment.</p>
      ) : (
        <ul className={styles.newsList}>
          {news.map((article, index) => (
            <li key={index} className={styles.newsItem}>
              <h3>{article.title || "Untitled Article"}</h3>
              <p>{article.body ? article.body.slice(0, 150) + "..." : "No description available"}</p>
              <p>
                Published on:{" "}
                {article.published_on
                  ? new Date(article.published_on * 1000).toLocaleDateString()
                  : "Unknown Date"}{" "}
                by {article.source || "Unknown Source"}
              </p>
              <a
                href={article.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read more
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}