"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NewsFeed from "./Newsfeed";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
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
    <div className="content-container">
      <section className="crypto-section">
        <h2>
          <span className="section-icon">📈</span> Real-Time Crypto Prices
        </h2>
        <div className="price-list">
          <p>Bitcoin: ${prices.bitcoin.toLocaleString()}</p>
          <p>Ethereum: ${prices.ethereum.toLocaleString()}</p>
          <p>BNB: ${prices.bnb.toLocaleString()}</p>
        </div>
      </section>

      <section className="airdrop-section">
        <h2>
          <span className="section-icon">🎁</span> Latest Airdrop
        </h2>
        <p>
          Don’t miss out on the hottest airdrop opportunities! Follow Blockchain Bro on X at{" "}
          <a
            href="https://x.com/Philkeyz_01"
            target="_blank"
            rel="noopener noreferrer"
            className="x-link"
          >
            @Philkeyz_01
          </a>{" "}
          for the latest updates and exclusive airdrop announcements.
        </p>
      </section>

      <section className="crypto-bot-section">
        <h2>
          <span className="section-icon">🧠</span> Crypto Assistant
        </h2>
        <p>
          Get personalized insights and guidance with our Crypto Assistant! Analyze market trends, receive trading recommendations, and make informed decisions to grow your crypto portfolio.
        </p>
        <Link href="/crypto-bot" className="read-more-button">
          Explore Crypto Assistant →
        </Link>
      </section>

      <section className="news-section">
        <h2>
          <span className="section-icon">📰</span> Latest Crypto News
        </h2>
        <NewsFeed />
      </section>

      <section className="article-section">
        <h1>
          <span className="section-icon">📜</span> Featured Article
        </h1>
        <h2>The Origin of Bitcoin: A Revolutionary Digital Currency</h2>
        <p>
          Bitcoin (BTC) is the world’s first decentralized digital currency, a groundbreaking innovation that has reshaped the financial industry since its inception. Launched in 2009, Bitcoin emerged in the wake of the 2008 global financial crisis.
        </p>
        <Link href="/articles#origin-of-bitcoin" className="read-more-button">
          Read More →
        </Link>
      </section>
    </div>
  );
}