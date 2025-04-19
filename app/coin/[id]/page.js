'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './CoinDetail.module.css';

const formatNumber = (value) => {
  if (!value) return 'N/A';
  if (value >= 1_000_000_000_000) return (value / 1_000_000_000_000).toFixed(2) + 'T';
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(2) + 'B';
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + 'M';
  return value.toLocaleString();
};

const formatPrice = (price) => {
  if (!price) return 'N/A';
  return price < 1 ? price.toFixed(6) : price.toLocaleString();
};

export default function CoinDetail() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchCoinDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/coin/${id}`);
        if (!res.ok) throw new Error('Failed to fetch coin data');
        const data = await res.json();
        setCoin(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinDetail();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        Loading coin data...
      </div>
    );
  }
  if (error) {
    return (
      <div className={styles.error}>
        <span className={styles.errorIcon}>⚠</span> {error}
      </div>
    );
  }
  if (!coin) {
    return (
      <div className={styles.error}>
        <span className={styles.errorIcon}>⚠</span> No data available
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${styles.fadeIn}`}>
      <h1 className={styles.title}>
        {coin.name} ({coin.symbol.toUpperCase()})
      </h1>
      <div className={styles.priceCard}>
        <Image
          src={coin.image}
          alt={coin.symbol}
          width={56}
          height={56}
          className={styles.coinImage}
        />
        <div className={styles.priceInfo}>
          <span className={`${styles.price} ${coin.price_change_percentage_24h >= 0 ? styles.priceUp : styles.priceDown}`}>
            ${formatPrice(coin.current_price)}
          </span>
          <span
            className={styles.change}
            style={{ color: coin.price_change_percentage_24h >= 0 ? '#00ff00' : '#ff0000' }}
          >
            {coin.price_change_percentage_24h?.toFixed(2) ?? 'N/A'}% (24h)
          </span>
        </div>
      </div>
      <div className={styles.stats}>
        {[
          { label: 'Market Cap', value: `$${formatNumber(coin.market_cap)}` },
          { label: '24h High', value: `$${formatPrice(coin.high_24h)}` },
          { label: '24h Low', value: `$${formatPrice(coin.low_24h)}` },
          { label: '24h Volume', value: `$${formatNumber(coin.total_volume)}` },
          { label: 'Circulating Supply', value: formatNumber(coin.circulating_supply) },
          { label: 'Total Supply', value: coin.total_supply ? formatNumber(coin.total_supply) : 'N/A' },
        ].map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statValue}>{stat.value}</span>
          </div>
        ))}
      </div>
      <button onClick={() => router.back()} className={styles.backButton}>
        Back to Chart
      </button>
    </div>
  );
}