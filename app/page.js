"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NewsFeed from "./Newsfeed";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import styles from "./page.module.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Map symbols to coin IDs and names, matching PriceTicker
const coinMap = {
  BTC: { id: "bitcoin", name: "Bitcoin" },
  ETH: { id: "ethereum", name: "Ethereum" },
  BNB: { id: "binancecoin", name: "BNB" },
  XRP: { id: "ripple", name: "XRP" },
  XMR: { id: "monero", name: "Monero" },
  SOL: { id: "solana", name: "Solana" },
};

export default function Dashboard() {
  const [prices, setPrices] = useState({
    BTC: { price: 0, name: "Bitcoin", id: "bitcoin" },
    ETH: { price: 0, name: "Ethereum", id: "ethereum" },
    BNB: { price: 0, name: "BNB", id: "binancecoin" },
    XRP: { price: 0, name: "XRP", id: "ripple" },
    XMR: { price: 0, name: "Monero", id: "monero" },
    SOL: { price: 0, name: "Solana", id: "solana" },
  });

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch(
          "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,BNB,XRP,XMR,SOL&tsyms=USD&api_key=YOUR_API_KEY"
        );
        if (!res.ok) throw new Error("Failed to fetch prices");
        const data = await res.json();
        setPrices({
          BTC: { price: data.RAW.BTC?.USD?.PRICE || 0, name: "Bitcoin", id: "bitcoin" },
          ETH: { price: data.RAW.ETH?.USD?.PRICE || 0, name: "Ethereum", id: "ethereum" },
          BNB: { price: data.RAW.BNB?.USD?.PRICE || 0, name: "BNB", id: "binancecoin" },
          XRP: { price: data.RAW.XRP?.USD?.PRICE || 0, name: "XRP", id: "ripple" },
          XMR: { price: data.RAW.XMR?.USD?.PRICE || 0, name: "Monero", id: "monero" },
          SOL: { price: data.RAW.SOL?.USD?.PRICE || 0, name: "Solana", id: "solana" },
        });
        console.log("Prices:", prices); // Debug
      } catch (error) {
        console.error("Error fetching crypto prices:", error);
      }
    }
    fetchPrices();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Welcome to CryptoGlobal</h1>
          <p className={styles.heroSubtitle}>
            Your hub for real-time crypto prices, news, and community insights.
          </p>
          <Link href="/chat" className={styles.heroButton}>
            Join the Chat
          </Link>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <section className={styles.cryptoSection}>
          <h2>
            <span className={styles.sectionIcon}>📈</span> Real-Time Crypto Prices
          </h2>
          <div className={styles.priceList}>
            {Object.keys(prices).map((symbol) => (
              <Link
                key={symbol}
                href={`/coin/${prices[symbol].id}?name=${encodeURIComponent(prices[symbol].name)}&symbol=${symbol}`}
                className={styles.priceLink}
              >
                <p>
                  {symbol} ({prices[symbol].name}): ${prices[symbol].price.toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.airdropSection}>
          <h2>
            <span className={styles.sectionIcon}>🎁</span> Latest Airdrop
          </h2>
          <p>
            Don’t miss out on the hottest airdrop opportunities! Follow Blockchain Bro on X at{" "}
            <a
              href="https://x.com/Philkeyz_01"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.xLink}
            >
              @Philkeyz_01
            </a>{" "}
            for the latest updates and exclusive airdrop announcements.
          </p>
        </section>

        <section className={styles.cryptoBotSection}>
          <h2>
            <span className={styles.sectionIcon}>🧠</span> Crypto Assistant
          </h2>
          <p>
            Get personalized insights and guidance with our Crypto Assistant! Analyze market trends,
            receive trading recommendations, and make informed decisions to grow your crypto portfolio.
          </p>
          <Link href="/crypto-bot" className={styles.readMoreButton}>
            Explore Crypto Assistant →
          </Link>
        </section>

        <section className={styles.newsSection}>
          <h2>
            <span className={styles.sectionIcon}>📰</span> Latest Crypto News
          </h2>
          <NewsFeed />
        </section>

        <section className={styles.articleSection}>
          <h1>
            <span className={styles.sectionIcon}>📜</span> Featured Article
          </h1>
          <h2>The Origin of Bitcoin: A Revolutionary Digital Currency</h2>
          <p>
            Bitcoin (BTC) is the world’s first decentralized digital currency, a groundbreaking
            innovation that has reshaped the financial industry since its inception. Launched in 2009,
            Bitcoin emerged in the wake of the 2008 global financial crisis.
          </p>
          <Link href="/articles/bitcoin-origins" className={styles.readMoreButton}>
            Read More →
          </Link>
        </section>
      </div>
    </div>
  );
}