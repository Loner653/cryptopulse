let cache = {};
const CACHE_DURATION = 60 * 1000; // Cache for 2 minutes

export async function GET(req) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page")) || 3; // Default to page 1
  const now = Date.now();

  // Return cached data if it's still valid
  if (cache[page] && now - cache[page].timestamp < CACHE_DURATION) {
    console.log(`Serving cached data for page ${page}...`);
    return new Response(JSON.stringify(cache[page].data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    console.log(`Fetching page ${page} from CoinGecko...`);
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=${page}&sparkline=false`,
      { headers: { "Cache-Control": "no-store" } }
    );

    if (!response.ok) throw new Error("CoinGecko API error");

    const data = await response.json();
    cache[page] = { data, timestamp: now }; // Store in cache

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error.message);
    return new Response(
      JSON.stringify({ error: "API limit exceeded. Try again later." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }
}
