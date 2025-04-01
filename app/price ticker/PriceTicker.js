"use client";

import { useState, useEffect } from "react";
import styles from "./PriceTicker.module.css";

export default function PriceTicker() {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchPrices = async () => {
    try {
      const res = await fetch(
        "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,BNB,XRP,PI,ADA,SOL,DOT,DOGE,LTC&tsyms=USD&api_key=YOUR_API_KEY"
      );
      const data = await res.json();
      console.log("API Response:", data); // Debug log
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
        ADA: {
          price: data.RAW.ADA?.USD?.PRICE,
          change: data.RAW.ADA?.USD?.CHANGEPCT24HOUR,
        },
        SOL: {
          price: data.RAW.SOL?.USD?.PRICE,
          change: data.RAW.SOL?.USD?.CHANGEPCT24HOUR,
        },
        DOT: {
          price: data.RAW.DOT?.USD?.PRICE,
          change: data.RAW.DOT?.USD?.CHANGEPCT24HOUR,
        },
        DOGE: {
          price: data.RAW.DOGE?.USD?.PRICE,
          change: data.RAW.DOGE?.USD?.CHANGEPCT24HOUR,
        },
        LTC: {
          price: data.RAW.LTC?.USD?.PRICE,
          change: data.RAW.LTC?.USD?.CHANGEPCT24HOUR,
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
        <div className={styles.tickerContent}>
          {/* First set */}
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
          <span>
            ADA: ${prices.ADA?.price?.toLocaleString() || "N/A"} (
            {prices.ADA?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span>
            SOL: ${prices.SOL?.price?.toLocaleString() || "N/A"} (
            {prices.SOL?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span>
            DOT: ${prices.DOT?.price?.toLocaleString() || "N/A"} (
            {prices.DOT?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span>
            DOGE: ${prices.DOGE?.price?.toLocaleString() || "N/A"} (
            {prices.DOGE?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span>
            LTC: ${prices.LTC?.price?.toLocaleString() || "N/A"} (
            {prices.LTC?.change?.toFixed(2) || "N/A"}%)
          </span>
          {/* Second set for seamless loop */}
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
          <span>
            ADA: ${prices.ADA?.price?.toLocaleString() || "N/A"} (
            {prices.ADA?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span>
            SOL: ${prices.SOL?.price?.toLocaleString() || "N/A"} (
            {prices.SOL?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span>
            DOT: ${prices.DOT?.price?.toLocaleString() || "N/A"} (
            {prices.DOT?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span>
            DOGE: ${prices.DOGE?.price?.toLocaleString() || "N/A"} (
            {prices.DOGE?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span>
            LTC: ${prices.LTC?.price?.toLocaleString() || "N/A"} (
            {prices.LTC?.change?.toFixed(2) || "N/A"}%)
          </span>
        </div>
      )}
    </div>
  );
}