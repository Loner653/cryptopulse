"use client";

import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import styles from "./cryptoChart.module.css";

export default function CryptoChart() {
  const [coins, setCoins] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView();

  const formatMarketCap = (value) => {
    if (!value) return "N/A";
    if (value >= 1_000_000_000_000) return (value / 1_000_000_000_000).toFixed(2) + "T";
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(2) + "B";
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + "M";
    return value.toLocaleString();
  };

  const fetchCoins = useCallback(async (isRefresh = false, attempt = 1) => {
    if (loading) return;
    setLoading(true);

    try {
      console.log(`Fetching data... Attempt ${attempt}`);
      const response = await fetch(`/api/coins?page=${isRefresh ? 1 : page}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch");

      setCoins((prevCoins) => {
        if (isRefresh) {
          return data; // Refresh resets list
        } else {
          return [...prevCoins, ...data]; // Append new data
        }
      });

      if (!isRefresh) setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error(`Error fetching coins (Attempt ${attempt}):`, error);
      if (attempt < 3) {
        setTimeout(() => fetchCoins(isRefresh, attempt + 1), 3000);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, page]);

  useEffect(() => {
    fetchCoins();
  }, []);

  useEffect(() => {
    if (inView) {
      fetchCoins();
    }
  }, [inView, fetchCoins]);

  return (
    <div className={styles.chartContainer}>
      <h1 className={styles.title}>📈 Crypto Prices (Live Updates)</h1>
      <button onClick={() => fetchCoins(true)} className={styles.refreshButton}>🔄 Refresh Data</button>
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
          {coins.length > 0 ? (
            coins.map((coin, index) => (
              <tr key={coin.id}>
                <td>{index + 1}</td>
                <td>
                  <Image
                    src={coin.image}
                    alt={coin.name}
                    width={24}
                    height={24}
                    className={styles.coinImage}
                  />
                  {coin.name} ({coin.symbol.toUpperCase()})
                </td>
                <td>${coin.current_price?.toLocaleString() ?? "N/A"}</td>
                <td>${formatMarketCap(coin.market_cap)}</td>
                <td style={{ color: coin.price_change_percentage_24h >= 0 ? "green" : "red" }}>
                  {coin.price_change_percentage_24h?.toFixed(2) ?? "N/A"}%
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>
                {loading ? "Loading..." : "No data available"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div ref={ref} style={{ height: "70px" }}>
        {loading ? "Loading..." : ""}
      </div>
    </div>
  );
}
