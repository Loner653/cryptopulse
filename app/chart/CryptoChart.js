"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import styles from "./cryptoChart.module.css"; // Import CSS

export default function CryptoChart() {
  const [coins, setCoins] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView();

  // Format market cap into T (Trillion), B (Billion), M (Million)
  const formatMarketCap = (value) => {
    if (value >= 1_000_000_000_000) {
      return (value / 1_000_000_000_000).toFixed(2) + "T";
    } else if (value >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(2) + "B";
    } else if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(2) + "M";
    } else {
      return value.toLocaleString();
    }
  };

  // Fetch coins with retry mechanism
  const fetchCoins = async (isLiveUpdate = false, attempt = 1) => {
    if (loading && !isLiveUpdate) return;
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=${isLiveUpdate ? 1 : page}`
      );
      const data = await response.json();

      if (!response.ok) throw new Error("Failed to fetch");

      if (isLiveUpdate) {
        setCoins((prevCoins) =>
          prevCoins.map((coin) => {
            const updatedCoin = data.find((c) => c.id === coin.id);
            return updatedCoin
              ? {
                  ...coin,
                  current_price: updatedCoin.current_price,
                  market_cap: updatedCoin.market_cap,
                  price_change_percentage_24h: updatedCoin.price_change_percentage_24h,
                }
              : coin;
          })
        );
      } else {
        // Filter out duplicates based on coin.id before appending
        setCoins((prevCoins) => {
          const existingIds = new Set(prevCoins.map((coin) => coin.id));
          const newCoins = data.filter((coin) => !existingIds.has(coin.id));
          return [...prevCoins, ...newCoins];
        });
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error fetching coins:", error);
      if (attempt < 3) {
        setTimeout(() => fetchCoins(isLiveUpdate, attempt + 1), 3000); // Retry after 3 seconds
      }
    } finally {
      setLoading(false);
    }
  };

  // Load initial coins
  useEffect(() => {
    fetchCoins();
  }, []);

  // Auto-refresh prices every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCoins(true); // Live update mode
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Load more coins when scrolling
  useEffect(() => {
    if (inView) {
      fetchCoins();
    }
  }, [inView]);

  return (
    <div className={styles.chartContainer}>
      <h1 className={styles.title}>📈 Crypto Prices (Live Updates)</h1>
      <table className={styles.cryptoTable}>
        <thead>
          <tr>
            <th>#</th>
            <th>Coin</th>
            <th>Price</th>
            <th>Market Cap</th>
            <th>24h Change</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin, index) => (
            <tr key={coin.id}>
              <td>{index + 1}</td>
              <td>
                <img src={coin.image} alt={coin.name} className={styles.coinImage} />
                {coin.name} ({coin.symbol.toUpperCase()})
              </td>
              <td>${coin.current_price.toLocaleString()}</td>
              <td>${formatMarketCap(coin.market_cap)}</td>
              <td
                style={{ color: coin.price_change_percentage_24h >= 0 ? "green" : "red" }}
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div ref={ref} style={{ height: "50px" }}></div>
    </div>
  );
}