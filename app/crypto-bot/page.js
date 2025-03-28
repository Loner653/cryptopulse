"use client";

import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import coinListData from "../data/coin-list.json";
import styles from "../chart/cryptoChart.module.css";

export default function CryptoBotPage() {
  const [coins, setCoins] = useState([]);
  const [coinList, setCoinList] = useState(coinListData);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { ref, inView } = useInView();

  const formatMarketCap = (value) => {
    if (!value) return "N/A";
    if (value >= 1_000_000_000_000) return (value / 1_000_000_000_000).toFixed(2) + "T";
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(2) + "B";
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + "M";
    return value.toLocaleString();
  };

  const fetchCoinList = useCallback(async () => {
    try {
      const response = await fetch("/api/get-coin-list");
      if (!response.ok) throw new Error("Failed to fetch coin list");
      const data = await response.json();
      setCoinList(data);
      console.log("Coin list loaded from API, total coins:", data.length);
    } catch (error) {
      console.error("Error fetching coin list, using cached data:", error.message);
      setCoinList(coinListData);
      console.log("Coin list loaded from cache, total coins:", coinListData.length);
    }
  }, []);

  const fetchCoins = useCallback(async (isRefresh = false, attempt = 1) => {
    if (isLoading && !isRefresh) return;
    setIsLoading(true);

    try {
      console.log(`Fetching data... Attempt ${attempt}`);
      const response = await fetch(`/api/coins?page=${isRefresh ? 1 : page}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch");

      setCoins((prevCoins) => {
        const newCoins = isRefresh ? data : [...prevCoins, ...data];
        window.cryptoChartData = newCoins;
        return newCoins;
      });

      if (!isRefresh) setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error(`Error fetching coins (Attempt ${attempt}):`, error);
      if (attempt < 3) {
        setTimeout(() => fetchCoins(isRefresh, attempt + 1), 3000);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, page]);

  useEffect(() => {
    fetchCoinList();
    fetchCoins();

    // Configure Tawk.to (script is in RootLayout)
    if (window.Tawk_API && window.Tawk_API.onLoad) {
      window.Tawk_API.onLoad = function () {
        window.Tawk_API.setAttributes({ name: "Crypto Bot" });
        window.Tawk_API.hideWidget();

        window.Tawk_API.onChatMessageVisitor = function (message) {
          const userMessage = message.toLowerCase().trim();
          const coinsData = window.cryptoChartData || coins;

          if (isLoading) {
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
              `The current price of ${detectedCoin.name} (${detectedCoin.symbol.toUpperCase()}) is $${detectedCoin.current_price?.toLocaleString() ?? "N/A"} USD.`
            );
          } else if (userMessage.includes("market cap")) {
            window.Tawk_API.sendMessage(
              `The market cap of ${detectedCoin.name} (${detectedCoin.symbol.toUpperCase()}) is $${formatMarketCap(detectedCoin.market_cap)} USD.`
            );
          } else if (userMessage.includes("24h change") || userMessage.includes("24 hour change")) {
            window.Tawk_API.sendMessage(
              `The 24h price change of ${detectedCoin.name} (${detectedCoin.symbol.toUpperCase()}) is ${detectedCoin.price_change_percentage_24h?.toFixed(2) ?? "N/A"}%.`
            );
          } else {
            window.Tawk_API.sendMessage(
              `I can help with price, market cap, or 24h change for ${detectedCoin.name}. What would you like to know?`
            );
          }
        };
      };
    }
  }, [fetchCoinList, fetchCoins]);

  useEffect(() => {
    if (inView) fetchCoins();
  }, [inView, fetchCoins]);

  return (
    <div className={`${styles.chartContainer} content-container crypto-section`}>
      <h1 className={styles.title}>📈 Crypto Assistant</h1>
      <button onClick={() => fetchCoins(true)} className={styles.refreshButton}>🔄 Refresh Data</button>
      <div id="tawkto-container" className="price-list">
        <iframe
          src="https://tawk.to/chat/67e617ed84c833190b654d9f/1indcqu9r"
          style={{ width: "100%", height: "500px", border: "none" }}
          title="Crypto Bot Chat"
        />
      </div>
      <div ref={ref} style={{ height: "70px" }}>
        {isLoading ? "Loading..." : ""}
      </div>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`${styles.backToTop} back-to-top`}
      >
        ↑ Back to Top
      </button>
    </div>
  );
}