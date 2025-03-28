"use client";

import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import styles from "./cryptoChart.module.css";

export default function CryptoChart() {
  const [coins, setCoins] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isBackToTopVisible, setIsBackToTopVisible] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1 });

  const formatMarketCap = (value) => {
    if (!value) return "N/A";
    if (value >= 1_000_000_000_000) return (value / 1_000_000_000_000).toFixed(2) + "T";
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(2) + "B";
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + "M";
    return value.toLocaleString();
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchCoins = useCallback(async (isRefresh = false, attempt = 1) => {
    if (loading) return;
    setLoading(true);

    try {
      console.log(`Fetching data... Attempt ${attempt}`);
      const response = await fetch(`/api/coins?page=${isRefresh ? 1 : page}`);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) { // Rate limit hit
          throw new Error("API rate limit exceeded, retrying...");
        }
        throw new Error(data.error || "Failed to fetch");
      }

      setCoins((prevCoins) => {
        const newCoins = isRefresh ? data : [...prevCoins, ...data];
        window.cryptoChartData = newCoins;
        return newCoins;
      });

      if (!isRefresh) setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error(`Error fetching coins (Attempt ${attempt}):`, error);
      if (error.message.includes("rate limit") && attempt < 3) {
        setTimeout(() => fetchCoins(isRefresh, attempt + 1), 5000); // Longer delay for rate limits
      } else if (attempt < 3) {
        setTimeout(() => fetchCoins(isRefresh, attempt + 1), 3000);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, page]);

  const debouncedFetchCoins = useCallback(debounce(() => fetchCoins(), 1000), [fetchCoins]);

  const handleScroll = useCallback(() => {
    if (window.scrollY > 300) {
      setIsBackToTopVisible(true);
    } else {
      setIsBackToTopVisible(false);
    }
  }, []);

  useEffect(() => {
    fetchCoins();

    if (window.Tawk_API && window.Tawk_API.onLoad) {
      window.Tawk_API.onLoad = function () {
        window.Tawk_API.setAttributes({ name: "Crypto Bot" });
        window.Tawk_API.onChatMessageVisitor = function (message) {
          const userMessage = message.toLowerCase().trim();
          const coinsData = window.cryptoChartData || coins;

          if (loading) {
            window.Tawk_API.sendMessage("I’m still loading the coin data, please wait a moment...");
            return;
          }

          if (coinsData.length === 0) {
            window.Tawk_API.sendMessage("Sorry, I couldn’t load the cryptocurrency data. Please try again later.");
            return;
          }

          let detectedCoin = null;
          let coinName = "";
          for (const coin of coinsData) {
            const nameMatch = userMessage.includes(coin.name.toLowerCase());
            const symbolMatch = userMessage.includes(coin.symbol.toLowerCase());
            if (nameMatch || symbolMatch) {
              detectedCoin = coin;
              coinName = nameMatch ? coin.name : coin.symbol;
              break;
            }
          }

          if (!detectedCoin) {
            window.Tawk_API.sendMessage("Sorry, I couldn’t find that cryptocurrency in the chart data. Try another coin.");
            return;
          }

          if (userMessage.includes("price") || userMessage.includes("how much is")) {
            window.Tawk_API.sendMessage(
              `The current price of ${detectedCoin.symbol.toUpperCase()} is $${detectedCoin.current_price?.toLocaleString() ?? "N/A"} USD.`
            );
          } else if (userMessage.includes("market cap")) {
            window.Tawk_API.sendMessage(
              `The market cap of ${detectedCoin.symbol.toUpperCase()} is $${formatMarketCap(detectedCoin.market_cap)} USD.`
            );
          } else if (userMessage.includes("24h change") || userMessage.includes("24 hour change")) {
            window.Tawk_API.sendMessage(
              `The 24h price change of ${detectedCoin.symbol.toUpperCase()} is ${detectedCoin.price_change_percentage_24h?.toFixed(2) ?? "N/A"}%.`
            );
          } else {
            window.Tawk_API.sendMessage(
              `I can help with price, market cap, or 24h change for ${detectedCoin.symbol.toUpperCase()}. What would you like to know?`
            );
          }
        };
      };
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchCoins, handleScroll]);

  useEffect(() => {
    if (inView && !loading) {
      debouncedFetchCoins();
    }
  }, [inView, debouncedFetchCoins]);

  return (
    <div className={`${styles.chartContainer} content-container`}>
      <h1 className={styles.title}>📈 Crypto Prices (Live Updates)</h1>
      <button onClick={() => fetchCoins(true)} className={styles.refreshButton}>🔄 Refresh Data</button>
      <table className={styles.cryptoTable}>
        <thead>
          <tr>
            <th>#</th>
            <th>Ticker</th>
            <th>Price</th>
            <th>Market Cap</th>
            <th>24h %</th>
          </tr>
        </thead>
        <tbody>
          {coins.length > 0 ? (
            coins.map((coin, index) => (
              <tr key={`${coin.id}-${index}`}>
                <td>{index + 1}</td>
                <td>
                  <Image
                    src={coin.image}
                    alt={coin.symbol}
                    width={20}
                    height={20}
                    className={styles.coinImage}
                  />
                  {coin.symbol.toUpperCase()}
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
      <div ref={ref} style={{ height: "50px" }}>
        {loading ? "Loading..." : ""}
      </div>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`${styles.backToTop} ${isBackToTopVisible ? "visible" : ""}`}
      >
        ↑
      </button>
    </div>
  );
}