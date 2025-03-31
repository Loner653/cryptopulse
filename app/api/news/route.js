// In-memory cache (persists until server restart)
let memoryCache = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

async function getCachedNews() {
  if (memoryCache) {
    const { news, timestamp } = memoryCache;
    console.log("Cache found. Checking freshness...");
    if (Date.now() - timestamp < CACHE_DURATION) {
      console.log("Returning fresh cached news");
    } else {
      console.log("Cache is stale but still returning it until new data is fetched");
    }
    return memoryCache;
  }
  console.log("No cache available");
  return null;
}

async function setCachedNews(news, timestamp) {
  memoryCache = { news, timestamp };
  console.log("Updated cache with new news");
}

export async function GET() {
  const now = Date.now();

  // Always check cache first
  const cached = await getCachedNews();
  if (cached) {
    return new Response(JSON.stringify(cached.news), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    console.log("Fetching from CoinGecko (no cache available)");
    const res = await fetch("https://api.coingecko.com/api/v3/news?page=1", {
      headers: { "Accept": "application/json" },
    });

    if (res.status === 429) {
      console.warn("Rate limit hit (429). Returning cached news or fallback.");
      const cachedFallback = await getCachedNews();
      if (cachedFallback) {
        return new Response(JSON.stringify(cachedFallback.news), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      // If no cache, proceed to fallback below
    } else if (!res.ok) {
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

    // Store in memory cache
    await setCachedNews(news, now);

    return new Response(JSON.stringify(news), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Route Error:", error.message);

    // Return cached news even if stale, if it exists
    const cachedFallback = await getCachedNews();
    if (cachedFallback) {
      console.log("Fetch failed, returning cached news (may be stale)");
      return new Response(JSON.stringify(cachedFallback.news), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Only use fallback if no cache exists at all
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
    console.log("No cache available, using fallback news");
    return new Response(JSON.stringify(fallbackNews), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}