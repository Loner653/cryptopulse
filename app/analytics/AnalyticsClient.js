"use client";

import Image from "next/image";
import { useState, Suspense } from "react";
import Link from "next/link";
import { refreshAnalytics } from "./actions";
import styles from "./page.module.css";

export default function AnalyticsClient({
  marketData,
  marketError,
  defiData,
  defiError,
  trendingData,
  trendingError,
  binanceData,
  binanceError,
  cryptoCompareData,
  cryptoCompareError,
  messariData,
  messariError,
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshAnalytics();
    setIsRefreshing(false);
  };

  const formatLargeNumber = (value) => {
    if (value === undefined || value === null) return "$0";
    if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const allFailed = marketError && defiError && trendingError && binanceError && cryptoCompareError && messariError;

  return (
    <div className={styles.container}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className={styles.pageTitle}>Crypto Analytics</h1>
        <div>
          <Link href="/articles" className={styles.navLink}>Read Crypto Articles</Link>
          <button
            onClick={handleRefresh}
            className={styles.refreshButton}
            aria-label="Refresh analytics data"
            disabled={isRefreshing}
          >
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
      </div>

      {allFailed ? (
        <div className={styles.error}>
          <p>Failed to load all data. Please try again later.</p>
          <button onClick={handleRefresh}>Retry</button>
        </div>
      ) : (
        <div>
          {/* Market Overview Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Market Overview</h2>
            <Suspense
              fallback={
                <div className={styles.skeleton}>
                  <div className={styles.skeletonRow} />
                  <div className={styles.skeletonRow} />
                  <div className={styles.skeletonRow} />
                </div>
              }
            >
              {marketError && <p className={styles.error}>{marketError}</p>}
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">Coin</th>
                      <th scope="col">Price ($)</th>
                      <th scope="col">24h %</th>
                      <th scope="col">MC</th>
                      <th scope="col">24h Vol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketData.length > 0 ? (
                      marketData.map((coin) => (
                        <tr key={coin.id}>
                          <td>
                            <Image
                              src={coin.image}
                              alt={`${coin.name} logo`}
                              width={24}
                              height={24}
                              className={styles.coinImage}
                              priority={false}
                            />
                            {coin.name}
                          </td>
                          <td>${coin.current_price.toLocaleString()}</td>
                          <td className={coin.price_change_percentage_24h >= 0 ? styles.positive : styles.negative}>
                            {coin.price_change_percentage_24h.toFixed(2)}%
                          </td>
                          <td>{formatLargeNumber(coin.market_cap)}</td>
                          <td>{formatLargeNumber(coin.total_volume)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={5}>No market data available.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Suspense>
          </section>

          {/* DeFi Metrics Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>DeFi Metrics</h2>
            <Suspense
              fallback={
                <div className={styles.skeleton}>
                  <div className={styles.skeletonRow} />
                  <div className={styles.skeletonRow} />
                  <div className={styles.skeletonRow} />
                </div>
              }
            >
              {defiError && <p className={styles.error}>{defiError}</p>}
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">Protocol</th>
                      <th scope="col">TVL</th>
                      <th scope="col">Chain</th>
                    </tr>
                  </thead>
                  <tbody>
                    {defiData.length > 0 ? (
                      defiData.map((protocol, index) => (
                        <tr key={protocol.name || index}>
                          <td>{protocol.name}</td>
                          <td>{formatLargeNumber(protocol.tvl)}</td>
                          <td>{protocol.chain || "Multi-Chain"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={3}>No DeFi data available.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Suspense>
          </section>

          {/* Trending Coins Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Trending Coins</h2>
            <Suspense
              fallback={
                <div className={styles.skeleton}>
                  <div className={styles.skeletonRow} />
                  <div className={styles.skeletonRow} />
                  <div className={styles.skeletonRow} />
                </div>
              }
            >
              {trendingError && <p className={styles.error}>{trendingError}</p>}
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">Coin</th>
                      <th scope="col">MC Rank</th>
                      <th scope="col">Price (BTC)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trendingData && trendingData.length > 0 ? (
                      trendingData.map((coin) => (
                        <tr key={coin.item.id}>
                          <td>
                            <Image
                              src={coin.item.small}
                              alt={`${coin.item.name} logo`}
                              width={24}
                              height={24}
                              className={styles.coinImage}
                              priority={false}
                            />
                            {coin.item.name}
                          </td>
                          <td>{coin.item.market_cap_rank || "N/A"}</td>
                          <td>{coin.item.price_btc ? coin.item.price_btc.toFixed(8) : "N/A"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={3}>No trending data available.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className={styles.note}>
                Trending coins are based on search volume on CoinGecko.
              </p>
            </Suspense>
          </section>

          {/* Binance Price Overview Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Binance Price Overview</h2>
            <Suspense
              fallback={
                <div className={styles.skeleton}>
                  <div className={styles.skeletonRow} />
                  <div className={styles.skeletonRow} />
                  <div className={styles.skeletonRow} />
                </div>
              }
            >
              {binanceError && <p className={styles.error}>{binanceError}</p>}
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">Coin</th>
                      <th scope="col">Price $</th>
                      <th scope="col">24h %</th>
                      <th scope="col">24h Vol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {binanceData.length > 0 ? (
                      binanceData.map((coin) => (
                        <tr key={coin.id}>
                          <td>{coin.name}</td>
                          <td>${coin.price.toLocaleString()}</td>
                          <td className={coin.priceChangePercent >= 0 ? styles.positive : styles.negative}>
                            {coin.priceChangePercent.toFixed(2)}%
                          </td>
                          <td>{formatLargeNumber(coin.volume)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={4}>No Binance data available.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className={styles.note}>
                Prices reflect top coins with significant volume on Binance (via CoinGecko).
              </p>
            </Suspense>
          </section>

          {/* CryptoCompare Top Coins Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Top Coins by Market Cap (CryptoCompare)</h2>
            <Suspense
              fallback={
                <div className={styles.skeleton}>
                  <div className={styles.skeletonRow} />
                  <div className={styles.skeletonRow} />
                  <div className={styles.skeletonRow} />
                </div>
              }
            >
              {cryptoCompareError && <p className={styles.error}>{cryptoCompareError}</p>}
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">Coin</th>
                      <th scope="col">Price (USD)</th>
                      <th scope="col">MC</th>
                      <th scope="col">24h Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cryptoCompareData.length > 0 ? (
                      cryptoCompareData.map((coin) => (
                        <tr key={coin.id}>
                          <td>{coin.name}</td>
                          <td>${coin.price.toLocaleString()}</td>
                          <td>{formatLargeNumber(coin.marketCap)}</td>
                          <td>{formatLargeNumber(coin.volume24h)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={4}>No CryptoCompare data available.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className={styles.note}>
                Data sourced from CryptoCompare’s top coins by market cap.
              </p>
            </Suspense>
          </section>

          {/* Messari Asset Overview Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Messari Asset Overview</h2>
            <Suspense
              fallback={
                <div className={styles.skeleton}>
                  <div className={styles.skeletonRow} />
                  <div className={styles.skeletonRow} />
                  <div className={styles.skeletonRow} />
                </div>
              }
            >
              {messariError && <p className={styles.error}>{messariError}</p>}
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">Coin</th>
                      <th scope="col">Price (USD)</th>
                      <th scope="col">MC</th>
                      <th scope="col">CS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messariData.length > 0 ? (
                      messariData.map((asset) => (
                        <tr key={asset.id}>
                          <td>{asset.name} ({asset.fullName})</td>
                          <td>${asset.price.toLocaleString()}</td>
                          <td>{formatLargeNumber(asset.marketCap)}</td>
                          <td>{formatLargeNumber(asset.supply)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={4}>No Messari data available.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className={styles.note}>
                Data sourced from Messari’s asset metrics.
              </p>
            </Suspense>
          </section>
        </div>
      )}
    </div>
  );
}