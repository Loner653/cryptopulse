"use client";

import { useState, useEffect } from "react";
import styles from "./PriceTicker.module.css";

export default function PriceTicker() {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchPrices = async () => {
    try {
      const res = await fetch(
        "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,BNB,XRP,PI&tsyms=USD&api_key=YOUR_API_KEY"
      );
      const data = await res.json();
      setPrices({
        BTC: {
          price: data.RAW.BTC?.USD?.PRICE,
          change: data.RAW.BTC?.USD?.CHANGEPCT24HOUR,
        },
        ETH: {
          price: data.RAW.ETH?.USD?.PRICE,
          change: data.RAW.ETH?.USD?.CHANGEPCT24HOUR,
        },
        BNB: {
          price: data.RAW.BNB?.USD?.PRICE,
          change: data.RAW.BNB?.USD?.CHANGEPCT24HOUR,
        },
        XRP: {
          price: data.RAW.XRP?.USD?.PRICE,
          change: data.RAW.XRP?.USD?.CHANGEPCT24HOUR,
        },
        PI: {
          price: data.RAW.PI?.USD?.PRICE,
          change: data.RAW.PI?.USD?.CHANGEPCT24HOUR,
        },
      });
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch prices:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.ticker}>
      {loading ? (
        <span>Loading prices...</span>
      ) : (
        <>
          <span>
            BTC: ${prices.BTC?.price?.toLocaleString() || "N/A"} (
            {prices.BTC?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span>
            ETH: ${prices.ETH?.price?.toLocaleString() || "N/A"} (
            {prices.ETH?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span>
            BNB: ${prices.BNB?.price?.toLocaleString() || "N/A"} (
            {prices.BNB?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span>
            XRP: ${prices.XRP?.price?.toLocaleString() || "N/A"} (
            {prices.XRP?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span>
            PI: ${prices.PI?.price?.toLocaleString() || "N/A"} (
            {prices.PI?.change?.toFixed(2) || "N/A"}%)
          </span>
        </>
      )}
    </div>
  );
}