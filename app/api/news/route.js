// app/api/news/route.js
export async function GET() {
  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=cryptocurrency&apiKey=d2ace4ea1aa84228853c072414e47606&sortBy=publishedAt&language=en&pageSize=9&from=${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch news from NewsAPI");
    }
    const data = await res.json();
    if (!data.articles || data.articles.length === 0) {
      throw new Error("No news articles found");
    }
    const news = data.articles.map((article, index) => ({
      id: index,
      title: article.title,
      description: article.description || "No description available.",
      url: article.url,
      date: article.publishedAt.split("T")[0],
    }));
    return new Response(JSON.stringify(news), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}