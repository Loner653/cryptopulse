// app/analytics/page.js
// NO 'use client' – this is a Server Component

import AnalyticsClient from "./AnalyticsClient";
import ErrorBoundary from "./ErrorBoundary";

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

async function fetchMarketData() {
  try {
    const data = await fetchWithRetry(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false",
      { next: { revalidate: 300 } }
    );
    return { data, error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
}

async function fetchDefiData() {
  try {
    await delay(1000);
    const data = await fetchWithRetry("https://api.llama.fi/protocols", {
      next: { revalidate: 300 },
    });
    return { data: data.sort((a, b) => b.tvl - a.tvl).slice(0, 5), error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
}

async function fetchTrendingData() {
  try {
    await delay(2000);
    const data = await fetchWithRetry("https://api.coingecko.com/api/v3/search/trending", {
      next: { revalidate: 300 },
    });
    return { data: data.coins.slice(0, 5), error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
}

async function fetchBinanceData() {
  try {
    await delay(3000);
    const data = await fetchWithRetry(
      "https://api.coingecko.com/api/v3/exchanges/binance/tickers?coin_ids=bitcoin,ethereum,binancecoin,ripple,cardano",
      { next: { revalidate: 300 } }
    );
    return {
      data: data.tickers
        .map((ticker, index) => ({
          id: `${ticker.base}-${ticker.target}-${index}`, // Add a unique ID
          name: ticker.base,
          price: ticker.last,
          priceChangePercent: ticker.converted_last?.usd_24h_change || 0,
          volume: ticker.converted_volume?.usd || 0,
        }))
        .slice(0, 5),
      error: null,
    };
  } catch (error) {
    return { data: [], error: error.message };
  }
}

export const metadata = {
  title: "Crypto Analytics | CryptoPulse",
  description: "Get the latest cryptocurrency analytics, including market overview, DeFi metrics, trending coins, and Binance price data.",
};

export default async function Analytics() {
  const [marketResult, defiResult, trendingResult, binanceResult] = await Promise.all([
    fetchMarketData(),
    fetchDefiData(),
    fetchTrendingData(),
    fetchBinanceData(),
  ]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Crypto Analytics",
    description: "Real-time cryptocurrency analytics including market data, DeFi metrics, trending coins, and Binance prices.",
    mainEntity: [
      {
        "@type": "ItemList",
        name: "Market Overview",
        itemListElement: marketResult.data.map((coin, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "CryptoCurrency",
            name: coin.name,
            currentPrice: coin.current_price,
            currency: "USD",
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
      <ErrorBoundary>
        <AnalyticsClient
          marketData={marketResult.data}
          marketError={marketResult.error}
          defiData={defiResult.data}
          defiError={defiResult.error}
          trendingData={trendingResult.data}
          trendingError={trendingResult.error}
          binanceData={binanceResult.data}
          binanceError={binanceResult.error}
        />
      </ErrorBoundary>
    </>
  );
}