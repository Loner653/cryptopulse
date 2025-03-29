// app/chart/CryptoChart.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import styles from "./cryptoChart.module.css";

export default function CryptoChart() {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isBackToTopVisible, setIsBackToTopVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { ref, inView } = useInView({ threshold: 0.1 });
  const COINS_PER_PAGE = 20;

  const formatMarketCap = (value) => {
    if (!value) return "N/A";
    if (value >= 1_000_000_000_000) return (value / 1_000_000_000_000).toFixed(2) + "T";
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(2) + "B";
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + "M";
    return value.toLocaleString();
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return price < 1 ? price.toFixed(6) : price.toLocaleString();
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchCoins = useCallback(
    async (isRefresh = false, attempt = 1) => {
      if (loading) return;
      setLoading(true);

      const cacheKey = `coins_page_${isRefresh ? 1 : page}`;
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData && !isRefresh) {
        try {
          const parsedData = JSON.parse(cachedData);
          if (Array.isArray(parsedData)) {
            setCoins((prevCoins) => {
              const newCoins = [...prevCoins, ...parsedData];
              window.cryptoChartData = newCoins;
              return newCoins;
            });
            setPage((prevPage) => prevPage + 1);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Failed to parse cached data:", e);
          localStorage.removeItem(cacheKey); // Clear invalid cache
        }
      }

      try {
        console.log(`Fetching data... Attempt ${attempt}`);
        const response = await fetch(`/api/coins?page=${isRefresh ? 1 : page}&per_page=${COINS_PER_PAGE}`);
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 429) {
            const delay = Math.pow(2, attempt) * 2000;
            console.log(`Rate limit hit, retrying in ${delay / 1000}s...`);
            throw new Error(`Rate limit exceeded, retrying in ${delay / 1000}s`);
          }
          throw new Error(data.error || "Failed to fetch");
        }

        setCoins((prevCoins) => {
          const newCoins = isRefresh ? data : [...prevCoins, ...data];
          window.cryptoChartData = newCoins;
          localStorage.setItem(cacheKey, JSON.stringify(data));
          return newCoins;
        });

        if (!isRefresh) setPage((prevPage) => prevPage + 1);
      } catch (error) {
        console.error(`Error fetching coins (Attempt ${attempt}):`, error);
        if (error.message.includes("rate limit") && attempt <= 3) {
          const delay = Math.pow(2, attempt) * 2000;
          setTimeout(() => fetchCoins(isRefresh, attempt + 1), delay);
        } else if (attempt <= 3) {
          setTimeout(() => fetchCoins(isRefresh, attempt + 1), 3000);
        }
      } finally {
        setLoading(false);
      }
    },
    [loading, page]
  );

  const debouncedFetchCoins = useCallback(debounce(() => fetchCoins(), 2000), [fetchCoins]);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredCoins(coins);
      return;
    }
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(lowerQuery) ||
        coin.symbol.toLowerCase().includes(lowerQuery)
    );
    setFilteredCoins(filtered);
  }, [searchQuery, coins]);

  const handleScroll = useCallback(() => {
    setIsBackToTopVisible(window.scrollY > 300);
  }, []);

  useEffect(() => {
    fetchCoins();

    if (window.Tawk_API && window.Tawk_API.onLoad) {
      window.Tawk_API.onLoad = function () {
        window.Tawk_API.setAttributes({ name: "Crypto-bot" });
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
          for (const coin of coinsData) {
            const nameMatch = userMessage.includes(coin.name.toLowerCase());
            const symbolMatch = userMessage.includes(coin.symbol.toLowerCase());
            if (nameMatch || symbolMatch) {
              detectedCoin = coin;
              break;
            }
          }

          if (!detectedCoin) {
            window.Tawk_API.sendMessage("Sorry, I couldn’t find that cryptocurrency in the chart data. Try another coin.");
            return;
          }

          if (userMessage.includes("price") || userMessage.includes("how much is")) {
            window.Tawk_API.sendMessage(
              `The current price of ${detectedCoin.symbol.toUpperCase()} is $${formatPrice(detectedCoin.current_price)} USD.`
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

  useEffect(() => {
    handleSearch();
  }, [searchQuery, handleSearch]);

  const displayedCoins = searchQuery ? filteredCoins : coins;

  return (
    <div className={`${styles.chartContainer} content-container`}>
      <h1 className={styles.title}>📈 Crypto Prices (Live Updates)</h1>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search coins (e.g., Bitcoin, BTC)"
          className={styles.searchInput}
        />
      </div>
      <div className={styles.coinCount}>
        {displayedCoins.length} out of a vast array of coins
      </div>
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
          {displayedCoins.length > 0 ? (
            displayedCoins.map((coin, index) => (
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
                <td>${formatPrice(coin.current_price)}</td>
                <td>${formatMarketCap(coin.market_cap)}</td>
                <td style={{ color: coin.price_change_percentage_24h >= 0 ? "green" : "red" }}>
                  {coin.price_change_percentage_24h?.toFixed(2) ?? "N/A"}%
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "12px" }}>
                {loading ? <span className={styles.spinner}></span> : searchQuery ? "No matching coins found" : "No data available"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div ref={ref} className={styles.loading}>
        {loading && <span className={styles.spinner}></span>}
      </div>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`${styles.backToTop} ${isBackToTopVisible ? styles.visible : ""}`}
      >
        ↑
      </button>
    </div>
  );
}