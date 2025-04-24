let cache = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes (increased for stability)
const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 8000; // 8s timeout

export async function GET(req) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page')) || 1;
  const now = Date.now();
  const cacheKey = `coins_page_${page}`;

  // Check cache
  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    console.log(`Serving cached data for page ${page}`);
    return Response.json(cache[cacheKey].data);
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Fetching page ${page} from CoinGecko (Attempt ${attempt})`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

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
              { error: 'Rate limit exceeded. Please wait and try again.' },
              { status: 429 }
            );
          }
          const delay = 6000 * Math.pow(2, attempt); // 12s, 24s, 48s
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
        // Fallback: Return cached data if available, even if stale
        if (cache[cacheKey]) {
          console.log(`Serving stale cache for page ${page}`);
          return Response.json(cache[cacheKey].data);
        }
        return Response.json(
          { error: `Failed to fetch coins: ${error.message}` },
          { status: 504 }
        );
      }
    }
  }
}