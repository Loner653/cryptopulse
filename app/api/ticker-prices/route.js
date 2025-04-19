// C:\Users\hp\Desktop\cryptopulse\app\api\ticker-prices\route.js
let cache = {};
const CACHE_DURATION = 10 * 60 * 1000;
const BINANCE_API = 'https://api.binance.com';
const MAX_RETRIES = 4;

const MOCK_DATA = {
  BTC: { price: 60000, change: 2.34, high: 62000, low: 58000, volume: 1.2e9 },
  ETH: { price: 2500, change: -1.12, high: 2600, low: 2400, volume: 8e8 },
  BNB: { price: 550, change: 1.5, high: 560, low: 540, volume: 3e8 },
  XRP: { price: 0.5, change: 0.8, high: 0.52, low: 0.48, volume: 1e8 },
  ADA: { price: 0.35, change: -0.9, high: 0.36, low: 0.34, volume: 5e7 },
  SOL: { price: 150, change: 2.1, high: 155, low: 145, volume: 2e8 },
  DOT: { price: 6, change: -1.3, high: 6.2, low: 5.8, volume: 3e7 },
  DOGE: { price: 0.12, change: 3.2, high: 0.13, low: 0.11, volume: 4e7 },
  LTC: { price: 70, change: 0.4, high: 72, low: 68, volume: 2e7 },
  AVAX: { price: 25, change: -2.0, high: 26, low: 24, volume: 1e7 },
  LINK: { price: 14, change: 1.8, high: 14.5, low: 13.5, volume: 1e7 },
  MATIC: { price: 0.5, change: -0.7, high: 0.51, low: 0.49, volume: 8e6 },
  SHIB: { price: 0.000017, change: 4.0, high: 0.000018, low: 0.000016, volume: 5e6 },
  UNI: { price: 7, change: -1.5, high: 7.2, low: 6.8, volume: 4e6 },
  ATOM: { price: 6, change: 0.9, high: 6.1, low: 5.9, volume: 3e6 },
  XLM: { price: 0.1, change: -0.3, high: 0.11, low: 0.09, volume: 2e6 },
  TRX: { price: 0.13, change: 0.2, high: 0.14, low: 0.12, volume: 1e6 },
  ALGO: { price: 0.14, change: -1.1, high: 0.15, low: 0.13, volume: 9e5 },
  VET: { price: 0.025, change: 1.4, high: 0.026, low: 0.024, volume: 8e5 },
};

export async function GET() {
  const now = Date.now();

  if (cache.data && now - cache.timestamp < CACHE_DURATION) {
    console.log('Serving cached ticker price data');
    return Response.json(cache.data, {
      headers: {
        'Content-Encoding': 'gzip',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
    });
  }

  const symbols = [
    'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'SOLUSDT', 'DOTUSDT',
    'DOGEUSDT', 'LTCUSDT', 'AVAXUSDT', 'LINKUSDT', 'MATICUSDT', 'SHIBUSDT',
    'UNIUSDT', 'ATOMUSDT', 'XLMUSDT', 'TRXUSDT', 'ALGOUSDT', 'VETUSDT'
  ];

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Fetching ticker prices from Binance (Attempt ${attempt})`, {
        url: `${BINANCE_API}/api/v3/ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(symbols))}`,
        method: 'GET',
      });
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

      const response = await fetch(
        `${BINANCE_API}/api/v3/ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(symbols))}`,
        { cache: 'no-store', signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error(`Binance API response error: ${response.status} - ${errorText}`, {
          headers: Object.fromEntries(response.headers.entries()),
          url: response.url,
        });
        if (response.status === 429) {
          if (attempt === MAX_RETRIES) {
            console.error('Binance rate limit exceeded:', errorText);
            return Response.json(
              { error: 'Binance API rate limit exceeded. Please try again later.' },
              { status: 429, headers: { 'Access-Control-Allow-Origin': '*' } }
            );
          }
          const delay = (5000 + Math.random() * 2000) * Math.pow(2, attempt - 1); // 5-7s, 10-14s, etc.
          console.log(`Rate limit hit, waiting ${delay / 1000}s...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw new Error(`Binance API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const prices = symbols.reduce((acc, symbol) => {
        const coinData = Array.isArray(data) ? data.find(d => d.symbol === symbol) : data;
        const coinSymbol = symbol.replace('USDT', '');
        acc[coinSymbol] = {
          price: parseFloat(coinData?.lastPrice) || 0,
          change: parseFloat(coinData?.priceChangePercent) || 0,
          high: parseFloat(coinData?.highPrice) || 0,
          low: parseFloat(coinData?.lowPrice) || 0,
          volume: parseFloat(coinData?.quoteVolume) || 0,
        };
        return acc;
      }, {});

      cache = { data: prices, timestamp: now };
      console.log('Fetched ticker prices:', Object.keys(prices));
      return Response.json(prices, {
        headers: {
          'Content-Encoding': 'gzip',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
        },
      });
    } catch (error) {
      console.error(`Ticker API Error (Attempt ${attempt}):`, error.message, error.cause || '', {
        stack: error.stack,
      });
      if (attempt === MAX_RETRIES) {
        console.warn('Returning cached or mock data as fallback');
        if (cache.data) {
          return Response.json(cache.data, {
            headers: { 'Content-Encoding': 'gzip', 'Access-Control-Allow-Origin': '*' },
          });
        }
        console.warn('No cache available, using mock data');
        return Response.json(MOCK_DATA, {
          headers: { 'Content-Encoding': 'gzip', 'Access-Control-Allow-Origin': '*' },
        });
      }
    }
  }
}