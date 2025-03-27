// app/news/page.js
// NO 'use client' – this is a Server Component

import NewsClient from "./NewsClient";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, options = {}, retries = 3, backoff = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.warn(`Retrying fetch for ${url}... Attempt ${i + 1}/${retries}`);
      await delay(backoff * Math.pow(2, i));
    }
  }
}

async function fetchNewsData() {
  try {
    await delay(1000); // Simulate delay for testing
    const response = await fetchWithRetry(
      `https://newsapi.org/v2/everything?q=cryptocurrency&sortBy=publishedAt&apiKey=d2ace4ea1aa84228853c072414e47606`,
      { next: { revalidate: 300 } }
    );
    return {
      data: response.articles
        .map((article, index) => ({
          id: `${article.url}-${index}`, // Ensure unique ID
          title: article.title,
          source: article.source.name,
          publishedAt: article.publishedAt,
          url: article.url,
        }))
        .slice(0, 10), // Show 10 articles on a dedicated page
      error: null,
    };
  } catch (error) {
    return { data: [], error: error.message };
  }
}

export const metadata = {
  title: "Crypto News | CryptoPulse",
  description: "Stay updated with the latest cryptocurrency news and updates.",
};

export default async function News() {
  const newsResult = await fetchNewsData();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Crypto News",
    description: "Latest cryptocurrency news and updates.",
    mainEntity: [
      {
        "@type": "ItemList",
        name: "Crypto News",
        itemListElement: newsResult.data.map((article, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "NewsArticle",
            headline: article.title,
            url: article.url,
            publisher: article.source,
            datePublished: article.publishedAt,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <NewsClient newsData={newsResult.data} newsError={newsResult.error} />
    </>
  );
}