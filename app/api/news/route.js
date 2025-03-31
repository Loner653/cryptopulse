import fs from "fs/promises";
import path from "path";

const CACHE_FILE = path.join(process.cwd(), "tmp", "news-cache.json");
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

async function readCache() {
  try {
    const data = await fs.readFile(CACHE_FILE, "utf8");
    const { news, timestamp } = JSON.parse(data);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return { news, timestamp };
    }
    return null; // Cache is stale
  } catch (error) {
    return null; // Cache doesn’t exist or is invalid
  }
}

async function writeCache(news, timestamp) {
  await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
  await fs.writeFile(CACHE_FILE, JSON.stringify({ news, timestamp }), "utf8");
}

export async function GET() {
  const now = Date.now();

  // Check file cache first
  const cached = await readCache();
  if (cached) {
    console.log("Returning cached news from file");
    return new Response(JSON.stringify(cached.news), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    console.log("Fetching from CoinGecko");
    const res = await fetch("https://api.coingecko.com/api/v3/news?page=1", {
      headers: { "Accept": "application/json" },
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error("CoinGecko fetch failed:", res.status, errorText);
      throw new Error(`Failed to fetch news from CoinGecko: ${res.status} - ${errorText}`);
    }
    const data = await res.json();
    const articles = data.data || data;
    if (!articles || articles.length === 0) {
      throw new Error("No news articles found");
    }

    const fetchTimestamp = now;
    const news = articles.map((article, index) => ({
      id: `${fetchTimestamp}-${index}`,
      title: article.title,
      description: article.description || "No description available.",
      url: article.url,
      date: article.published_at
        ? new Date(article.published_at).toISOString().split("T")[0]
        : "Unknown",
    }));

    // Write to file cache
    await writeCache(news, now);
    console.log("Fetched and cached news successfully");

    return new Response(JSON.stringify(news), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Route Error:", error.message);

    // Fallback if fetch fails but cache might still exist
    const cachedFallback = await readCache();
    if (cachedFallback) {
      console.log("Falling back to cached news from file");
      return new Response(JSON.stringify(cachedFallback.news), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const fallbackNews = [
      {
        id: "fallback-1",
        title: "Fallback Crypto News 1",
        description: "Placeholder news due to API failure.",
        url: "#",
        date: "2025-03-31",
      },
      {
        id: "fallback-2",
        title: "Fallback Crypto News 2",
        description: "Another placeholder news item.",
        url: "#",
        date: "2025-03-31",
      },
      {
        id: "fallback-3",
        title: "Fallback Crypto News 3",
        description: "Third placeholder news item.",
        url: "#",
        date: "2025-03-31",
      },
    ];
    console.log("Using fallback news");
    return new Response(JSON.stringify(fallbackNews), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}