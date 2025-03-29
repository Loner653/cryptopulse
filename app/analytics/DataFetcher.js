const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchMarketData() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false",
      { cache: "no-store" }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch market data: ${response.status} ${response.statusText}`);
    }
    return { data: await response.json(), error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
}

async function fetchDefiData() {
  try {
    await delay(1000);
    const response = await fetch("https://api.llama.fi/protocols");
    if (!response.ok) {
      throw new Error(`Failed to fetch DeFi data: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return { data: data.sort((a, b) => b.tvl - a.tvl).slice(0, 5), error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
}

async function fetchTrendingData() {
  try {
    await delay(2000);
    const response = await fetch("https://api.coingecko.com/api/v3/search/trending");
    if (!response.ok) {
      throw new Error(`Failed to fetch trending data: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return { data: data.coins.slice(0, 5), error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
}

async function fetchBinanceData() {
  try {
    await delay(3000);
    const coinIds = "bitcoin,ethereum,binancecoin,ripple,cardano";
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=5&page=1&sparkline=false`,
      { cache: "no-store" }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch Binance data: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return {
      data: data.map((coin) => ({
        name: coin.symbol.toUpperCase(),
        price: coin.current_price,
        priceChangePercent: coin.price_change_percentage_24h || 0,
        volume: coin.total_volume,
      })),
      error: null,
    };
  } catch (error) {
    return { data: [], error: error.message };
  }
}

async function fetchCryptoCompareData() {
  try {
    await delay(4000);
    const response = await fetch(
      "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD",
      { cache: "no-store" }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch CryptoCompare data: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return {
      data: data.Data.map((coin) => ({
        id: coin.CoinInfo.Id,
        name: coin.CoinInfo.Name, // Using ticker only
        price: coin.RAW?.USD?.PRICE ?? 0, // Fallback to 0
        marketCap: coin.RAW?.USD?.MKTCAP ?? 0, // Fallback to 0
        volume24h: coin.RAW?.USD?.VOLUME24HOUR ?? 0, // Fallback to 0
      })),
      error: null,
    };
  } catch (error) {
    return { data: [], error: error.message };
  }
}

async function fetchMessariData() {
  try {
    await delay(5000);
    const response = await fetch(
      "https://data.messari.io/api/v1/assets?fields=id,name,symbol,metrics/market_data/price_usd,metrics/marketcap/current_marketcap_usd,metrics/supply/circulating",
      { cache: "no-store" }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch Messari data: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return {
      data: data.data.slice(0, 5).map((asset) => ({
        id: asset.id,
        name: asset.symbol.toUpperCase(),
        fullName: asset.name,
        price: asset.metrics.market_data.price_usd || 0,
        marketCap: asset.metrics.marketcap.current_marketcap_usd || 0,
        supply: asset.metrics.supply.circulating || 0,
      })),
      error: null,
    };
  } catch (error) {
    return { data: [], error: error.message };
  }
}

export default async function DataFetcher({ children }) {
  const [marketResult, defiResult, trendingResult, binanceResult, cryptoCompareResult, messariResult] = await Promise.all([
    fetchMarketData(),
    fetchDefiData(),
    fetchTrendingData(),
    fetchBinanceData(),
    fetchCryptoCompareData(),
    fetchMessariData(),
  ]);

  return children({
    marketData: marketResult.data,
    marketError: marketResult.error,
    defiData: defiResult.data,
    defiError: defiResult.error,
    trendingData: trendingResult.data,
    trendingError: trendingResult.error,
    binanceData: binanceResult.data,
    binanceError: binanceResult.error,
    cryptoCompareData: cryptoCompareResult.data,
    cryptoCompareError: cryptoCompareResult.error,
    messariData: messariResult.data,
    messariError: messariResult.error,
  });
}