// C:\Users\hp\Desktop\cryptopulse\app\api\coins\route.js
let cache = {};
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes
const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const MAX_RETRIES = 3;

export async function GET(req) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page')) || 1;
  const now = Date.now();
  const cacheKey = `coins_page_${page}`;

  // Check server cache
  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    console.log(`Serving cached data for page ${page}`);
    return Response.json(cache[cacheKey].data);
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Fetching page ${page} from CoinGecko (Attempt ${attempt})`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=${page}&sparkline=false`,
        { cache: 'no-store', signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 429) {
          if (attempt === MAX_RETRIES) {
            console.error('CoinGecko rate limit exceeded');
            return Response.json(
              { error: 'CoinGecko API limit exceeded. Please wait and try again.' },
              { status: 429 }
            );
          }
          const delay = 5000 * Math.pow(2, attempt - 1); // 5s, 10s, 20s
          console.log(`Rate limit hit, waiting ${delay / 1000}s...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      cache[cacheKey] = { data, timestamp: now };
      return Response.json(data);
    } catch (error) {
      console.error(`API Error (Attempt ${attempt}):`, error.message);
      if (attempt === MAX_RETRIES) {
        return Response.json(
          { error: `Failed to fetch coins: ${error.message}` },
          { status: 500 }
        );
      }
    }
  }
}