"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NewsFeed from "./Newsfeed"; // Points to app/Newsfeed.js
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import styles from "./page.module.css"; // Import the new CSS

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
    <div className={styles.contentContainer}>
      {/* Crypto Prices Section */}
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

      {/* Airdrop Section */}
      <section className={styles.airdropSection}>
        <h2>
          <span className={styles.sectionIcon}>🎁</span> Latest Airdrop
        </h2>
        <p>Check out the hottest airdrop listings!</p>
        <ul>
          <li>Project X: 500 tokens - Claim by April 1, 2025</li>
          <li>Grass airdrop: 1000 tokens - Claim by Q3 2025</li>
        </ul>
      </section>

      {/* News Section */}
      <section className={styles.newsSection}>
        <h2>
          <span className={styles.sectionIcon}>📰</span> Latest Crypto Articles
        </h2>
        <NewsFeed />
      </section>

      {/* Article Section (Preview) */}
      <section className={styles.articleSection}>
        <h1>
          <span className={styles.sectionIcon}>📜</span> Featured Article
        </h1>
        <h2>The Origin of Bitcoin: A Revolutionary Digital Currency</h2>
        <p>
          Bitcoin (BTC) is the world’s first decentralized digital currency, a groundbreaking innovation that has reshaped the financial industry since its inception. Launched in 2009, Bitcoin emerged in the wake of the 2008 global financial crisis, a period marked by widespread distrust in traditional banking systems. It was created as a radical alternative to centralized financial systems, offering a decentralized, peer-to-peer network that operates without the need for intermediaries like banks or governments.
        </p>
        <Link href="/articles#origin-of-bitcoin" className={styles.readMoreButton}>
          Read More →
        </Link>
      </section>
    </div>
  );
}