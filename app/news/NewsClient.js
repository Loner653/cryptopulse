"use client"; // Client Component
import React from 'react';
import styles from './NewsClient.module.css'; // Import renamed CSS Module

export default function NewsClient({ newsData, newsError }) {
  const shareToTwitter = (url, title) => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      '_blank'
    );
  };

  const shareToLinkedIn = (url) => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  if (newsError) {
    return <p>Error loading news: {newsError}</p>;
  }

  return (
    <div className={styles.newsContainer}>
      {newsData.length > 0 ? (
        newsData.map((article) => (
          <div key={article.id} className={styles.newsCard}>
            <h3 className={styles.newsTitle}>{article.title}</h3>
            <p className={styles.newsMeta}>
              {article.source} | {new Date(article.publishedAt).toLocaleDateString()}
            </p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.navLink}
            >
              Read More
            </a>
            <div className={styles.shareButtons}>
              <button
                className={`${styles.shareButton} ${styles.twitter}`}
                onClick={() => shareToTwitter(article.url, article.title)}
              >
                Twitter
              </button>
              <button
                className={`${styles.shareButton} ${styles.linkedin}`}
                onClick={() => shareToLinkedIn(article.url)}
              >
                LinkedIn
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No news available.</p>
      )}
    </div>
  );
}