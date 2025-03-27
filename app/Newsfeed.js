"use client";

import { useState, useEffect } from "react";

export default function NewsFeed() {
  const [newsItems, setNewsItems] = useState([]);
  const [displayedNews, setDisplayedNews] = useState([]);
  const [error, setError] = useState(null);

  // Fetch news data from the API route
  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news");
        if (!res.ok) {
          throw new Error("Failed to fetch news from API route");
        }
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        const news = data.map((article) => ({
          id: article.id,
          title: article.title,
          description: article.description || "No description available.",
          url: article.url,
          date: article.date,
        }));
        setNewsItems(news);
        setError(null);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError(error.message);
      }
    }
    fetchNews();
  }, []);

  // Rotate news every 24 hours
  useEffect(() => {
    function updateDisplayedNews() {
      if (newsItems.length === 0) return;

      // Get the current day as a number (e.g., day 1 of the year to day 365)
      const today = new Date();
      const dayOfYear = Math.floor(
        (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
      );

      // Calculate the starting index for the 3 news items based on the day
      const totalNews = newsItems.length;
      const newsPerDay = 3;
      const startIndex = (dayOfYear * newsPerDay) % totalNews;

      // Select 3 news items, wrapping around if necessary
      const selectedNews = [];
      for (let i = 0; i < newsPerDay; i++) {
        const index = (startIndex + i) % totalNews;
        selectedNews.push(newsItems[index]);
      }

      setDisplayedNews(selectedNews);
    }

    // Update news immediately and then every 24 hours
    updateDisplayedNews();
    const interval = setInterval(updateDisplayedNews, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [newsItems]);

  return (
    <div className="news-feed">
      {error ? (
        <p className="error">Error: {error}</p>
      ) : displayedNews.length > 0 ? (
        displayedNews.map((news) => (
          <div key={news.id} className="news-item">
            <h3>
              <a href={news.url} target="_blank" rel="noopener noreferrer">
                {news.title}
              </a>
            </h3>
            <p>{news.description}</p>
            <p className="news-date">{news.date}</p>
          </div>
        ))
      ) : (
        <p>Loading news...</p>
      )}
    </div>
  );
}