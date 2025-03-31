"use client";

import { useState, useEffect } from "react";
import styles from "./Newsfeed.module.css";

const CACHE_KEY = "newsfeed-cache";
const CLIENT_CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export default function NewsFeed() {
  const [newsItems, setNewsItems] = useState([]);
  const [displayedNews, setDisplayedNews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNews() {
      // Check localStorage first
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CLIENT_CACHE_DURATION) {
          console.log("Using client-side cache");
          setNewsItems(data);
          setError(null);
          return;
        }
      }

      try {
        const res = await fetch("/api/news");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `Failed to fetch news (Status: ${res.status})`);
        }
        const data = await res.json();
        const news = data.map((article) => ({
          id: article.id,
          title: article.title,
          description: article.description || "No description available.",
          url: article.url,
          date: article.date,
        }));
        setNewsItems(news);
        setError(null);
        // Cache in localStorage
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: news, timestamp: Date.now() }));
      } catch (error) {
        console.error("Error fetching news:", error);
        setError(`Failed to fetch news: ${error.message}`);
      }
    }
    fetchNews();
  }, []);

  useEffect(() => {
    function updateDisplayedNews() {
      if (newsItems.length === 0) return;

      const today = new Date();
      const dayOfYear = Math.floor(
        (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
      );

      const totalNews = newsItems.length;
      const newsPerDay = 3;
      const startIndex = (dayOfYear * newsPerDay) % totalNews;

      const selectedNews = [];
      for (let i = 0; i < newsPerDay; i++) {
        const index = (startIndex + i) % totalNews;
        selectedNews.push(newsItems[index]);
      }

      setDisplayedNews(selectedNews);
    }

    updateDisplayedNews();
    const interval = setInterval(updateDisplayedNews, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [newsItems]);

  return (
    <div className={styles.newsFeed}>
      {error ? (
        <p className={styles.error}>Error: {error}</p>
      ) : displayedNews.length > 0 ? (
        displayedNews.map((news) => (
          <div key={news.id} className={styles.newsItem}>
            <h3>
              <a href={news.url} target="_blank" rel="noopener noreferrer">
                {news.title}
              </a>
            </h3>
            <p>{news.description}</p>
            <p className={styles.newsDate}>{news.date}</p>
          </div>
        ))
      ) : (
        <p>Loading news...</p>
      )}
    </div>
  );
}