"use client";

import { useState, useEffect } from "react"; // Fix the import syntax
import Image from "next/image"; // Import Image component
import styles from "./page.module.css";

export default function Analytics() {
  const [marketData, setMarketData] = useState([]);
  const [defiData, setDefiData] = useState([]);
  const [trendingData, setTrendingData] = useState([]);
  const [binanceData, setBinanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Utility function to add a delay
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Function to fetch market data from CoinGecko
  const fetchMarketData = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false",
        { cache: "no-store" }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch market data: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setMarketData(data);
    } catch (err) {
      console.error("Error fetching market data:", err);
      setError(`Failed to load market data: ${err.message}. Please try again later.`);
    }
  };

  // Function to fetch DeFi data from DefiLlama
  const fetchDefiData = async () => {
    try {
      await delay(1000); // Add 1-second delay to avoid rate limits
      const response = await fetch("https://api.llama.fi/protocols");
      if (!response.ok) {
        throw new Error(`Failed to fetch DeFi data: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      const sortedData = data.sort((a, b) => b.tvl - a.tvl).slice(0, 5);
      setDefiData(sortedData);
    } catch (err) {
      console.error("Error fetching DeFi data:", err);
      setError(`Failed to load DeFi data: ${err.message}. Please try again later.`);
    }
  };

  // Function to fetch trending coins from CoinGecko
  const fetchTrendingData = async () => {
    try {
      await delay(2000); // Add 2-second delay
      const response = await fetch("https://api.coingecko.com/api/v3/search/trending");
      if (!response.ok) {
        throw new Error(`Failed to fetch trending data: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      const trendingCoins = data.coins.slice(0, 5);
      setTrendingData(trendingCoins);
    } catch (err) {
      console.error("Error fetching trending data:", err);
      setError(`Failed to load trending data: ${err.message}. Please try again later.`);
    }
  };

  // Function to fetch Binance-related price data from CoinGecko
  const fetchBinanceData = async () => {
    try {
      await delay(3000); // Add 3-second delay
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false",
        { cache: "no-store" }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch Binance data: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      const binanceFocusedData = data
        .filter((coin) => coin.total_volume > 1000000)
        .slice(0, 5);
      setBinanceData(binanceFocusedData);
    } catch (err) {
      console.error("Error fetching Binance data:", err);
      setError(`Failed to load Binance data: ${err.message}. Please try again later.`);
    }
  };

  // Fetch data on mount and every 48 hours
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        await fetchMarketData();
        await fetchDefiData();
        await fetchTrendingData();
        await fetchBinanceData();
      } catch (err) {
        setError(`An error occurred while fetching data: ${err.message}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    const interval = setInterval(fetchAllData, 48 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Crypto Analytics</h1>

      {loading ? (
        <p className={styles.loading}>Loading analytics data...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <>
          {/* Market Overview Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Market Overview</h2>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Coin</th>
                    <th>Price (USD)</th>
                    <th>24h Change</th>
                    <th>Market Cap</th>
                    <th>24h Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {marketData.length > 0 ? (
                    marketData.map((coin) => (
                      <tr key={coin.id}>
                        <td>
                          <Image
                            src={coin.image}
                            alt={`${coin.name} logo`}
                            width={24}
                            height={24}
                            className={styles.coinImage}
                          />
                          {coin.name}
                        </td>
                        <td>${coin.current_price.toLocaleString()}</td>
                        <td
                          className={
                            coin.price_change_percentage_24h >= 0
                              ? styles.positive
                              : styles.negative
                          }
                        >
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </td>
                        <td>${coin.market_cap.toLocaleString()}</td>
                        <td>${coin.total_volume.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>No market data available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* DeFi Metrics Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>DeFi Metrics</h2>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Protocol</th>
                    <th>Total Value Locked (TVL)</th>
                    <th>Chain</th>
                  </tr>
                </thead>
                <tbody>
                  {defiData.length > 0 ? (
                    defiData.map((protocol) => (
                      <tr key={protocol.name}>
                        <td>{protocol.name}</td>
                        <td>${protocol.tvl.toLocaleString()}</td>
                        <td>{protocol.chain || "Multi-Chain"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3}>No DeFi data available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Trending Coins Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Trending Coins</h2>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Coin</th>
                    <th>Market Cap Rank</th>
                    <th>Price (BTC)</th>
                  </tr>
                </thead>
                <tbody>
                  {trendingData && trendingData.length > 0 ? (
                    trendingData.map((coin) => (
                      <tr key={coin.item.id}>
                        <td>
                          <Image
                            src={coin.item.small}
                            alt={`${coin.item.name} logo`}
                            width={24}
                            height={24}
                            className={styles.coinImage}
                          />
                          {coin.item.name}
                        </td>
                        <td>{coin.item.market_cap_rank || "N/A"}</td>
                        <td>
                          {coin.item.price_btc
                            ? coin.item.price_btc.toFixed(8)
                            : "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3}>No trending data available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className={styles.note}>
              Trending coins are based on search volume on CoinGecko.
            </p>
          </section>

          {/* Binance Price Overview Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Binance Price Overview</h2>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Coin</th>
                    <th>Price (USD)</th>
                    <th>24h Change</th>
                    <th>24h Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {binanceData.length > 0 ? (
                    binanceData.map((coin) => (
                      <tr key={coin.id}>
                        <td>
                          <Image
                            src={coin.image}
                            alt={`${coin.name} logo`}
                            width={24}
                            height={24}
                            className={styles.coinImage}
                          />
                          {coin.name}
                        </td>
                        <td>${coin.current_price.toLocaleString()}</td>
                        <td
                          className={
                            coin.price_change_percentage_24h >= 0
                              ? styles.positive
                              : styles.negative
                          }
                        >
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </td>
                        <td>${coin.total_volume.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4}>No Binance data available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className={styles.note}>
              Prices reflect top coins with significant volume on Binance (via
              CoinGecko).
            </p>
          </section>
        </>
      )}
    </div>
  );
}