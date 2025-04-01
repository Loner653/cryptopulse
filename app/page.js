"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NewsFeed from "./Newsfeed";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import styles from "./page.module.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [prices, setPrices] = useState({ bitcoin: 0, ethereum: 0, bnb: 0 });

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin&vs_currencies=usd"
        );
        const data = await res.json();
        setPrices({
          bitcoin: data.bitcoin.usd,
          ethereum: data.ethereum.usd,
          bnb: data.binancecoin.usd,
        });
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
            <p>Bitcoin: ${prices.bitcoin.toLocaleString()}</p>
            <p>Ethereum: ${prices.ethereum.toLocaleString()}</p>
            <p>BNB: ${prices.bnb.toLocaleString()}</p>
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
            Get personalized insights and guidance with our Crypto Assistant! Analyze market trends, receive trading recommendations, and make informed decisions to grow your crypto portfolio.
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
            Bitcoin (BTC) is the world’s first decentralized digital currency, a groundbreaking innovation that has reshaped the financial industry since its inception. Launched in 2009, Bitcoin emerged in the wake of the 2008 global financial crisis.
          </p>
          <Link href="/articles#origin-of-bitcoin" className={styles.readMoreButton}>
            Read More →
          </Link>
        </section>
      </div>
    </div>
  );
}