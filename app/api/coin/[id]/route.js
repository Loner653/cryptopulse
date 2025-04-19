// C:\Users\hp\Desktop\cryptopulse\app\api\coin\[id]\route.js
let cache = {};
const CACHE_DURATION = 10 * 60 * 1000;
const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const BINANCE_API = 'https://api.binance.com';
const COINGECKO_TO_BINANCE = {
  bitcoin: 'BTCUSDT',
  ethereum: 'ETHUSDT',
  binancecoin: 'BNBUSDT',
  ripple: 'XRPUSDT',
  cardano: 'ADAUSDT',
  solana: 'SOLUSDT',
  polkadot: 'DOTUSDT',
  dogecoin: 'DOGEUSDT',
  litecoin: 'LTCUSDT',
  avalanche: 'AVAXUSDT',
  chainlink: 'LINKUSDT',
  'matic-network': 'MATICUSDT',
  'shiba-inu': 'SHIBUSDT',
  uniswap: 'UNIUSDT',
  cosmos: 'ATOMUSDT',
  stellar: 'XLMUSDT',
  tron: 'TRXUSDT',
  algorand: 'ALGOUSDT',
  vechain: 'VETUSDT',
};

export async function GET(req, { params }) {
  const { id } = await params;
  const now = Date.now();
  const cacheKey = `coin_${id}`;

  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    console.log(`Serving cached data for coin ${id}`);
    return Response.json(cache[cacheKey].data);
  }

  try {
    console.log(`Fetching coin ${id} from CoinGecko`);
    const cgResponse = await fetch(
      `${COINGECKO_API}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
      { cache: 'no-store' }
    );

    if (!cgResponse.ok) {
      if (cgResponse.status === 429) {
        return Response.json(
          { error: 'CoinGecko API rate limit exceeded.' },
          { status: 429 }
        );
      }
      throw new Error(`CoinGecko API error: ${cgResponse.status}`);
    }

    const cgData = await cgResponse.json();

    let binancePrice = null;
    const binanceSymbol = COINGECKO_TO_BINANCE[id];
    if (binanceSymbol) {
      try {
        console.log(`Fetching price for ${id} from Binance`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const binanceResponse = await fetch(
          `${BINANCE_API}/api/v3/ticker/price?symbol=${binanceSymbol}`,
          { cache: 'no-store', signal: controller.signal }
        );
        clearTimeout(timeoutId);

        if (binanceResponse.ok) {
          const binanceData = await binanceResponse.json();
          binancePrice = parseFloat(binanceData.price);
        } else if (binanceResponse.status === 429) {
          console.warn('Binance rate limit exceeded, using CoinGecko price');
        }
      } catch (error) {
        console.warn(`Binance price fetch failed for ${id}:`, error.message);
      }
    }

    const coinData = {
      id: cgData.id,
      symbol: cgData.symbol,
      name: cgData.name,
      image: cgData.image.large,
      current_price: binancePrice ?? cgData.market_data.current_price.usd,
      market_cap: cgData.market_data.market_cap.usd,
      price_change_percentage_24h: cgData.market_data.price_change_percentage_24h,
      high_24h: cgData.market_data.high_24h.usd,
      low_24h: cgData.market_data.low_24h.usd,
      total_volume: cgData.market_data.total_volume.usd,
      circulating_supply: cgData.market_data.circulating_supply,
      total_supply: cgData.market_data.total_supply,
    };

    cache[cacheKey] = { data: coinData, timestamp: now };
    return Response.json(coinData);
  } catch (error) {
    console.error('API Error:', error.message);
    return Response.json(
      { error: 'Failed to fetch coin data. Please try again.' },
      { status: 500 }
    );
  }
}