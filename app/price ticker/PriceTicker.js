"use client";

import { useState, useEffect, useRef, memo } from "react";
import Link from "next/link";
import styles from "./PriceTicker.module.css";

// Map symbols to coin IDs for routing
const coinMap = {
  BTC: "bitcoin",
  ETH: "ethereum",
  BNB: "binancecoin",
  XRP: "ripple",
  PI: "pi-network",
  ADA: "cardano",
  SOL: "solana",
  DOT: "polkadot",
  DOGE: "dogecoin",
  LTC: "litecoin",
  AVAX: "avalanche",
  LINK: "chainlink",
  MATIC: "matic-network",
  SHIB: "shiba-inu",
  UNI: "uniswap",
  ATOM: "cosmos",
  XLM: "stellar",
  TRX: "tron",
  ALGO: "algorand",
  VET: "vechain",
};

// Mock data fallback
const mockData = Object.keys(coinMap).reduce((acc, symbol) => {
  acc[symbol] = {
    price: Math.random() * 10000,
    change: (Math.random() - 0.5) * 10,
    high: Math.random() * 11000,
    low: Math.random() * 9000,
    volume: Math.random() * 1000000,
  };
  return acc;
}, {});

const CoinItem = memo(({ symbol, price, change, high, low, volume, coinId }) => {
  const formatPrice = (value) => {
    if (!value) return "N/A";
    return value < 1 ? value.toFixed(6) : value.toLocaleString();
  };

  const formatVolume = (vol) => {
    if (!vol) return "N/A";
    if (vol >= 1e9) return `${(vol / 1e9).toFixed(2)}B`;
    if (vol >= 1e6) return `${(vol / 1e6).toFixed(2)}M`;
    return vol.toLocaleString();
  };

  return (
    <Link
      href={`/coin/${coinId}`}
      className={`${styles.coinItem} ${change >= 0 ? styles.priceUp : styles.priceDown}`}
    >
      <span className={styles.coinText}>
        {symbol}: ${formatPrice(price)} ({change?.toFixed(2) || "N/A"}%)
      </span>
      <span className={styles.tooltip}>
        High: ${formatPrice(high)}<br />
        Low: ${formatPrice(low)}<br />
        Vol: {formatVolume(volume)}
      </span>
    </Link>
  );
});
CoinItem.displayName = "CoinItem";

export default function PriceTicker() {
  const [prices, setPrices] = useState(mockData);
  const [loading, setLoading] = useState(true);
  const animationRef = useRef();

  const fetchPrices = async () => {
    try {
      const res = await fetch(
        "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,BNB,XRP,PI,ADA,SOL,DOT,DOGE,LTC,AVAX,LINK,MATIC,SHIB,UNI,ATOM,XLM,TRX,ALGO,VET&tsyms=USD&api_key=YOUR_API_KEY"
      );
      if (!res.ok) throw new Error("Failed to fetch prices");
      const data = await res.json();
      setPrices({
        BTC: {
          price: data.RAW.BTC?.USD?.PRICE,
          change: data.RAW.BTC?.USD?.CHANGEPCT24HOUR,
          high: data.RAW.BTC?.USD?.HIGH24HOUR,
          low: data.RAW.BTC?.USD?.LOW24HOUR,
          volume: data.RAW.BTC?.USD?.VOLUME24HOUR,
        },
        ETH: {
          price: data.RAW.ETH?.USD?.PRICE,
          change: data.RAW.ETH?.USD?.CHANGEPCT24HOUR,
          high: data.RAW.ETH?.USD?.HIGH24HOUR,
          low: data.RAW.ETH?.USD?.LOW24HOUR,
          volume: data.RAW.ETH?.USD?.VOLUME24HOUR,
        },
        BNB: {
          price: data.RAW.BNB?.USD?.PRICE,
          change: data.RAW.BNB?.USD?.CHANGEPCT24HOUR,
          high: data.RAW.BNB?.USD?.HIGH24HOUR,
          low: data.RAW.BNB?.USD?.LOW24HOUR,
          volume: data.RAW.BNB?.USD?.VOLUME24HOUR,
        },
        XRP: {
          price: data.RAW.XRP?.USD?.PRICE,
          change: data.RAW.XRP?.USD?.CHANGEPCT24HOUR,
          high: data.RAW.XRP?.USD?.HIGH24HOUR,
          low: data.RAW.XRP?.USD?.LOW24HOUR,
          volume: data.RAW.XRP?.USD?.VOLUME24HOUR,
        },
        PI: {
          price: data.RAW.PI?.USD?.PRICE,
          change: data.RAW.PI?.USD?.CHANGEPCT24HOUR,
          high: data.RAW.PI?.USD?.HIGH24HOUR,
          low: data.RAW.PI?.USD?.LOW24HOUR,
          volume: data.RAW.PI?.USD?.VOLUME24HOUR,
        },
        ADA: {
          price: data.RAW.ADA?.USD?.PRICE,
          change: data.RAW.ADA?.USD?.CHANGEPCT24HOUR,
          high: data.RAW.ADA?.USD?.HIGH24HOUR,
          low: data.RAW.ADA?.USD?.LOW24HOUR,
          volume: data.RAW.ADA?.USD?.VOLUME24HOUR,
        },
        SOL: {
          price: data.RAW.SOL?.USD?.PRICE,
          change: data.RAW.SOL?.USD?.CHANGEPCT24HOUR,
          high: data.RAW.SOL?.USD?.HIGH24HOUR,
          low: data.RAW.SOL?.USD?.LOW24HOUR,
          volume: data.RAW.SOL?.USD?.VOLUME24HOUR,
        },
        DOT: {
          price: data.RAW.DOT?.USD?.PRICE,
          change: data.RAW.DOT?.USD?.CHANGEPCT24HOUR,
          high: data.RAW.DOT?.USD?.HIGH24HOUR,
          low: data.RAW.DOT?.USD?.LOW24HOUR,
          volume: data.RAW.DOT?.USD?.VOLUME24HOUR,
        },
        DOGE: {
          price: data.RAW.DOGE?.USD?.PRICE,
          change: data.RAW.DOGE?.USD?.CHANGEPCT24HOUR,
          high: data.RAW.DOGE?.USD?.HIGH24HOUR,
          low: data.RAW.DOGE?.USD?.LOW24HOUR,
          volume: data.RAW.DOGE?.USD?.VOLUME24HOUR,
        },
        LTC: {
          price: data.RAW.LTC?.USD?.PRICE,
          change: data.RAW.LTC?.USD?.CHANGEPCT24HOUR,
          high: data.RAW.LTC?.USD?.HIGH24HOUR,
          low: data.RAW.LTC?.USD?.LOW24HOUR,
          volume: data.RAW.LTC?.USD?.VOLUME24HOUR,
        },
        AVAX: {
          price: data.RAW.AVAX?.USD?.PRICE,
          change: data.RAW.AVAX?.USD?.CHANGEPCT24HOUR,
          high: data.RAW.AVAX?.USD?.HIGH24HOUR,
          low: data.RAW.AVAX?.USD?.LOW24HOUR,
          volume: data.RAW.AVAX?.USD?.VOLUME24HOUR,
        },
        LINK: {
          price: data.RAW.LINK?.USD?.PRICE,
          change: data.RAW.LINK?.USD?.CHANGEPCT24HOUR,
          high: data.RAW.LINK?.USD?.HIGH24HOUR,
          low: data.RAW.LINK?.USD?.LOW24HOUR,
          volume: data.RAW.LINK?.USD?.VOLUME24HOUR,
        },
        MATIC: {
          price: data.RAW.MATIC?.USD?.PRICE,
          change: data.RAW.MATIC?.USD?.CHANGEPCT24HOUR,
          high: data.RAW.MATIC?.USD?.HIGH24HOUR,
          low: data.RAW.MATIC?.USD?.LOW24HOUR,
          volume: data.RAW.MATIC?.USD?.VOLUME24HOUR,
        },
        SHIB: {
          price: data.RAW.SHIB?.USD?.PRICE,
          change: data.RAW.SHIB?.USD?.CHANGEPCT24HOUR,
          high: data.RAW.SHIB?.USD?.HIGH24HOUR,
          low: data.RAW.SHIB?.USD?.LOW24HOUR,
          volume: data.RAW.SHIB?.USD?.VOLUME24HOUR,
        },
        UNI: {
          price: data.RAW.UNI?.USD?.PRICE,
          change: data.RAW.UNI?.USD?.CHANGEPCT24HOUR,
          high: data.RAW.UNI?.USD?.HIGH24HOUR,
          low: data.RAW.UNI?.USD?.LOW24HOUR,
          volume: data.RAW.UNI?.USD?.VOLUME24HOUR,
        },
        ATOM: {
          price: data.RAW.ATOM?.USD?.PRICE,
          change: data.RAW.ATOM?.USD?.CHANGEPCT24HOUR,
          high: data.RAW.ATOM?.USD?.HIGH24HOUR,
          low: data.RAW.ATOM?.USD?.LOW24HOUR,
          volume: data.RAW.ATOM?.USD?.VOLUME24HOUR,
        },
        XLM: {
          price: data.RAW.XLM?.USD?.PRICE,
          change: data.RAW.XLM?.USD?.CHANGEPCT24HOUR,
          high: data.RAW.XLM?.USD?.HIGH24HOUR,
          low: data.RAW.XLM?.USD?.LOW24HOUR,
          volume: data.RAW.XLM?.USD?.VOLUME24HOUR,
        },
        TRX: {
          price: data.RAW.TRX?.USD?.PRICE,
          change: data.RAW.TRX?.USD?.CHANGEPCT24HOUR,
          high: data.RAW.TRX?.USD?.HIGH24HOUR,
          low: data.RAW.TRX?.USD?.LOW24HOUR,
          volume: data.RAW.TRX?.USD?.VOLUME24HOUR,
        },
        ALGO: {
          price: data.RAW.ALGO?.USD?.PRICE,
          change: data.RAW.ALGO?.USD?.CHANGEPCT24HOUR,
          high: data.RAW.ALGO?.USD?.HIGH24HOUR,
          low: data.RAW.ALGO?.USD?.LOW24HOUR,
          volume: data.RAW.ALGO?.USD?.VOLUME24HOUR,
        },
        VET: {
          price: data.RAW.VET?.USD?.PRICE,
          change: data.RAW.VET?.USD?.CHANGEPCT24HOUR,
          high: data.RAW.VET?.USD?.HIGH24HOUR,
          low: data.RAW.VET?.USD?.LOW24HOUR,
          volume: data.RAW.VET?.USD?.VOLUME24HOUR,
        },
      });
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch prices:", error);
      setPrices(mockData);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);

    const handleVisibility = () => {
      if (document.hidden) {
        if (animationRef.current) {
          animationRef.current.style.animationPlayState = "paused";
        }
      } else {
        if (animationRef.current) {
          animationRef.current.style.animationPlayState = "running";
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const coins = Object.keys(coinMap);

  return (
    <div className={styles.ticker}>
      {loading ? (
        <span className={styles.loading}>Loading prices...</span>
      ) : (
        <div className={styles.tickerWrapper}>
          <div className={styles.tickerContent} ref={animationRef}>
            <span className={styles.welcomeMessage}>Welcome to CryptoGlobal</span>
            {coins.map((symbol) => (
              <CoinItem
                key={symbol}
                symbol={symbol}
                price={prices[symbol]?.price}
                change={prices[symbol]?.change}
                high={prices[symbol]?.high}
                low={prices[symbol]?.low}
                volume={prices[symbol]?.volume}
                coinId={coinMap[symbol]}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}