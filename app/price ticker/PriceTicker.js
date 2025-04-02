"use client";

import { useState, useEffect } from "react";
import styles from "./PriceTicker.module.css";

export default function PriceTicker() {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchPrices = async () => {
    try {
      const res = await fetch(
        "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,BNB,XRP,PI,ADA,SOL,DOT,DOGE,LTC,AVAX,LINK,MATIC,SHIB,UNI,ATOM,XLM,TRX,ALGO,VET&tsyms=USD&api_key=YOUR_API_KEY"
      );
      const data = await res.json();
      console.log("API Response:", data); // Debug log
      setPrices({
        BTC: { price: data.RAW.BTC?.USD?.PRICE, change: data.RAW.BTC?.USD?.CHANGEPCT24HOUR },
        ETH: { price: data.RAW.ETH?.USD?.PRICE, change: data.RAW.ETH?.USD?.CHANGEPCT24HOUR },
        BNB: { price: data.RAW.BNB?.USD?.PRICE, change: data.RAW.BNB?.USD?.CHANGEPCT24HOUR },
        XRP: { price: data.RAW.XRP?.USD?.PRICE, change: data.RAW.XRP?.USD?.CHANGEPCT24HOUR },
        PI: { price: data.RAW.PI?.USD?.PRICE, change: data.RAW.PI?.USD?.CHANGEPCT24HOUR },
        ADA: { price: data.RAW.ADA?.USD?.PRICE, change: data.RAW.ADA?.USD?.CHANGEPCT24HOUR },
        SOL: { price: data.RAW.SOL?.USD?.PRICE, change: data.RAW.SOL?.USD?.CHANGEPCT24HOUR },
        DOT: { price: data.RAW.DOT?.USD?.PRICE, change: data.RAW.DOT?.USD?.CHANGEPCT24HOUR },
        DOGE: { price: data.RAW.DOGE?.USD?.PRICE, change: data.RAW.DOGE?.USD?.CHANGEPCT24HOUR },
        LTC: { price: data.RAW.LTC?.USD?.PRICE, change: data.RAW.LTC?.USD?.CHANGEPCT24HOUR },
        AVAX: { price: data.RAW.AVAX?.USD?.PRICE, change: data.RAW.AVAX?.USD?.CHANGEPCT24HOUR },
        LINK: { price: data.RAW.LINK?.USD?.PRICE, change: data.RAW.LINK?.USD?.CHANGEPCT24HOUR },
        MATIC: { price: data.RAW.MATIC?.USD?.PRICE, change: data.RAW.MATIC?.USD?.CHANGEPCT24HOUR },
        SHIB: { price: data.RAW.SHIB?.USD?.PRICE, change: data.RAW.SHIB?.USD?.CHANGEPCT24HOUR },
        UNI: { price: data.RAW.UNI?.USD?.PRICE, change: data.RAW.UNI?.USD?.CHANGEPCT24HOUR },
        ATOM: { price: data.RAW.ATOM?.USD?.PRICE, change: data.RAW.ATOM?.USD?.CHANGEPCT24HOUR },
        XLM: { price: data.RAW.XLM?.USD?.PRICE, change: data.RAW.XLM?.USD?.CHANGEPCT24HOUR },
        TRX: { price: data.RAW.TRX?.USD?.PRICE, change: data.RAW.TRX?.USD?.CHANGEPCT24HOUR },
        ALGO: { price: data.RAW.ALGO?.USD?.PRICE, change: data.RAW.ALGO?.USD?.CHANGEPCT24HOUR },
        VET: { price: data.RAW.VET?.USD?.PRICE, change: data.RAW.VET?.USD?.CHANGEPCT24HOUR },
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
          <span className={styles.welcomeMessage}>Welcome to CryptoGlobal</span>
          <span className={prices.BTC?.change >= 0 ? styles.priceUp : styles.priceDown}>
            BTC: ${prices.BTC?.price?.toLocaleString() || "N/A"} (
            {prices.BTC?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.ETH?.change >= 0 ? styles.priceUp : styles.priceDown}>
            ETH: ${prices.ETH?.price?.toLocaleString() || "N/A"} (
            {prices.ETH?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.BNB?.change >= 0 ? styles.priceUp : styles.priceDown}>
            BNB: ${prices.BNB?.price?.toLocaleString() || "N/A"} (
            {prices.BNB?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.XRP?.change >= 0 ? styles.priceUp : styles.priceDown}>
            XRP: ${prices.XRP?.price?.toLocaleString() || "N/A"} (
            {prices.XRP?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.PI?.change >= 0 ? styles.priceUp : styles.priceDown}>
            PI: ${prices.PI?.price?.toLocaleString() || "N/A"} (
            {prices.PI?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.ADA?.change >= 0 ? styles.priceUp : styles.priceDown}>
            ADA: ${prices.ADA?.price?.toLocaleString() || "N/A"} (
            {prices.ADA?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.SOL?.change >= 0 ? styles.priceUp : styles.priceDown}>
            SOL: ${prices.SOL?.price?.toLocaleString() || "N/A"} (
            {prices.SOL?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.DOT?.change >= 0 ? styles.priceUp : styles.priceDown}>
            DOT: ${prices.DOT?.price?.toLocaleString() || "N/A"} (
            {prices.DOT?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.DOGE?.change >= 0 ? styles.priceUp : styles.priceDown}>
            DOGE: ${prices.DOGE?.price?.toLocaleString() || "N/A"} (
            {prices.DOGE?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.LTC?.change >= 0 ? styles.priceUp : styles.priceDown}>
            LTC: ${prices.LTC?.price?.toLocaleString() || "N/A"} (
            {prices.LTC?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.AVAX?.change >= 0 ? styles.priceUp : styles.priceDown}>
            AVAX: ${prices.AVAX?.price?.toLocaleString() || "N/A"} (
            {prices.AVAX?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.LINK?.change >= 0 ? styles.priceUp : styles.priceDown}>
            LINK: ${prices.LINK?.price?.toLocaleString() || "N/A"} (
            {prices.LINK?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.MATIC?.change >= 0 ? styles.priceUp : styles.priceDown}>
            MATIC: ${prices.MATIC?.price?.toLocaleString() || "N/A"} (
            {prices.MATIC?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.SHIB?.change >= 0 ? styles.priceUp : styles.priceDown}>
            SHIB: ${prices.SHIB?.price?.toLocaleString() || "N/A"} (
            {prices.SHIB?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.UNI?.change >= 0 ? styles.priceUp : styles.priceDown}>
            UNI: ${prices.UNI?.price?.toLocaleString() || "N/A"} (
            {prices.UNI?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.ATOM?.change >= 0 ? styles.priceUp : styles.priceDown}>
            ATOM: ${prices.ATOM?.price?.toLocaleString() || "N/A"} (
            {prices.ATOM?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.XLM?.change >= 0 ? styles.priceUp : styles.priceDown}>
            XLM: ${prices.XLM?.price?.toLocaleString() || "N/A"} (
            {prices.XLM?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.TRX?.change >= 0 ? styles.priceUp : styles.priceDown}>
            TRX: ${prices.TRX?.price?.toLocaleString() || "N/A"} (
            {prices.TRX?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.ALGO?.change >= 0 ? styles.priceUp : styles.priceDown}>
            ALGO: ${prices.ALGO?.price?.toLocaleString() || "N/A"} (
            {prices.ALGO?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.VET?.change >= 0 ? styles.priceUp : styles.priceDown}>
            VET: ${prices.VET?.price?.toLocaleString() || "N/A"} (
            {prices.VET?.change?.toFixed(2) || "N/A"}%)
          </span>
          {/* Second set for seamless loop */}
          <span className={styles.welcomeMessage}>Welcome to CryptoGlobal</span>
          <span className={prices.BTC?.change >= 0 ? styles.priceUp : styles.priceDown}>
            BTC: ${prices.BTC?.price?.toLocaleString() || "N/A"} (
            {prices.BTC?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.ETH?.change >= 0 ? styles.priceUp : styles.priceDown}>
            ETH: ${prices.ETH?.price?.toLocaleString() || "N/A"} (
            {prices.ETH?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.BNB?.change >= 0 ? styles.priceUp : styles.priceDown}>
            BNB: ${prices.BNB?.price?.toLocaleString() || "N/A"} (
            {prices.BNB?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.XRP?.change >= 0 ? styles.priceUp : styles.priceDown}>
            XRP: ${prices.XRP?.price?.toLocaleString() || "N/A"} (
            {prices.XRP?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.PI?.change >= 0 ? styles.priceUp : styles.priceDown}>
            PI: ${prices.PI?.price?.toLocaleString() || "N/A"} (
            {prices.PI?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.ADA?.change >= 0 ? styles.priceUp : styles.priceDown}>
            ADA: ${prices.ADA?.price?.toLocaleString() || "N/A"} (
            {prices.ADA?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.SOL?.change >= 0 ? styles.priceUp : styles.priceDown}>
            SOL: ${prices.SOL?.price?.toLocaleString() || "N/A"} (
            {prices.SOL?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.DOT?.change >= 0 ? styles.priceUp : styles.priceDown}>
            DOT: ${prices.DOT?.price?.toLocaleString() || "N/A"} (
            {prices.DOT?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.DOGE?.change >= 0 ? styles.priceUp : styles.priceDown}>
            DOGE: ${prices.DOGE?.price?.toLocaleString() || "N/A"} (
            {prices.DOGE?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.LTC?.change >= 0 ? styles.priceUp : styles.priceDown}>
            LTC: ${prices.LTC?.price?.toLocaleString() || "N/A"} (
            {prices.LTC?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.AVAX?.change >= 0 ? styles.priceUp : styles.priceDown}>
            AVAX: ${prices.AVAX?.price?.toLocaleString() || "N/A"} (
            {prices.AVAX?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.LINK?.change >= 0 ? styles.priceUp : styles.priceDown}>
            LINK: ${prices.LINK?.price?.toLocaleString() || "N/A"} (
            {prices.LINK?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.MATIC?.change >= 0 ? styles.priceUp : styles.priceDown}>
            MATIC: ${prices.MATIC?.price?.toLocaleString() || "N/A"} (
            {prices.MATIC?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.SHIB?.change >= 0 ? styles.priceUp : styles.priceDown}>
            SHIB: ${prices.SHIB?.price?.toLocaleString() || "N/A"} (
            {prices.SHIB?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.UNI?.change >= 0 ? styles.priceUp : styles.priceDown}>
            UNI: ${prices.UNI?.price?.toLocaleString() || "N/A"} (
            {prices.UNI?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.ATOM?.change >= 0 ? styles.priceUp : styles.priceDown}>
            ATOM: ${prices.ATOM?.price?.toLocaleString() || "N/A"} (
            {prices.ATOM?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.XLM?.change >= 0 ? styles.priceUp : styles.priceDown}>
            XLM: ${prices.XLM?.price?.toLocaleString() || "N/A"} (
            {prices.XLM?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.TRX?.change >= 0 ? styles.priceUp : styles.priceDown}>
            TRX: ${prices.TRX?.price?.toLocaleString() || "N/A"} (
            {prices.TRX?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.ALGO?.change >= 0 ? styles.priceUp : styles.priceDown}>
            ALGO: ${prices.ALGO?.price?.toLocaleString() || "N/A"} (
            {prices.ALGO?.change?.toFixed(2) || "N/A"}%)
          </span>
          <span className={prices.VET?.change >= 0 ? styles.priceUp : styles.priceDown}>
            VET: ${prices.VET?.price?.toLocaleString() || "N/A"} (
            {prices.VET?.change?.toFixed(2) || "N/A"}%)
          </span>
        </div>
      )}
    </div>
  );
}