'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Image from 'next/image';
import styles from './cryptoChart.module.css';

console.log('CryptoChart CSS module loaded:', Object.keys(styles));

export default function CryptoChart() {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isBackToTopVisible, setIsBackToTopVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const clientCache = useRef(new Map());
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  const PREFETCH_DELAY = 10000; // 10s
  const { ref, inView } = useInView({ threshold: 0.5, skip: !isOnline || searchQuery });
  const fetchQueue = useRef([]);
  const isFetching = useRef(false);
  const lastFetchTime = useRef(0);
  const MIN_FETCH_INTERVAL = 2000; // 2s between fetches

  const formatMarketCap = (value) => {
    if (!value) return 'N/A';
    if (value >= 1_000_000_000_000) return (value / 1_000_000_000_000).toFixed(2) + 'T';
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(2) + 'B';
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + 'M';
    return value.toLocaleString();
  };

  const formatPrice = (value) => {
    if (!value) return 'N/A';
    if (value >= 1) return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const str = value.toFixed(20);
    const match = str.match(/0\.0*([1-9])/);
    if (match && match[1]) {
      const firstNonZeroIndex = str.indexOf(match[1]);
      const leadingZeros = firstNonZeroIndex - 2;
      if (leadingZeros >= 3) {
        const significantDigits = str.slice(firstNonZeroIndex, firstNonZeroIndex + 3);
        return <>{`0.0${leadingZeros - 1}${significantDigits}`}</>;
      }
    }
    return Number(value.toFixed(6)).toString();
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchCoins = useCallback(
    async (pageToFetch, isRefresh = false, attempt = 1) => {
      if (isFetching.current || (!isRefresh && !hasMore)) return false;
      const now = Date.now();
      if (now - lastFetchTime.current < MIN_FETCH_INTERVAL && !isRefresh) {
        console.log(`Throttling fetch for page ${pageToFetch}, waiting...`);
        await wait(MIN_FETCH_INTERVAL - (now - lastFetchTime.current));
      }
      isFetching.current = true;
      setLoading(true);
      setError(null);
      const cacheKey = `page_${pageToFetch}`;

      const cached = clientCache.current.get(cacheKey);
      if (cached && now - cached.timestamp < CACHE_DURATION && !isRefresh) {
        console.log(`Serving client-cached data for page ${pageToFetch}`);
        setCoins((prev) => {
          const existingIds = new Set(prev.map((coin) => coin.id));
          const newCoins = cached.data.filter((coin) => !existingIds.has(coin.id));
          const updatedCoins = isRefresh ? newCoins : [...prev, ...newCoins];
          window.cryptoChartData = updatedCoins;
          return updatedCoins;
        });
        if (!searchQuery) {
          setFilteredCoins((prev) => {
            const existingIds = new Set(prev.map((coin) => coin.id));
            const newCoins = cached.data.filter((coin) => !existingIds.has(coin.id));
            return isRefresh ? newCoins : [...prev, ...newCoins];
          });
        }
        if (!isRefresh) setPage(pageToFetch + 1);
        setHasMore(cached.data.length === 50);
        setLoading(false);
        isFetching.current = false;
        lastFetchTime.current = now;
        return true;
      }

      try {
        if (isOnline) {
          console.log(`Fetching page ${pageToFetch} from CoinGecko (Attempt ${attempt})`);
          const response = await fetch(`/api/coins?page=${pageToFetch}`, { cache: 'no-store' });
          if (!response.ok) {
            if (response.status === 429) {
              if (attempt <= 3) {
                const delay = 6000 * Math.pow(2, attempt);
                console.log(`Rate limit hit, waiting ${delay / 1000}s...`);
                await wait(delay);
                return fetchCoins(pageToFetch, isRefresh, attempt + 1);
              }
              throw new Error('Rate limit exceeded. Please wait and try again.');
            }
            throw new Error(`Failed to fetch coins: ${response.status}`);
          }

          const data = await response.json();
          if (data.error) throw new Error(data.error);

          setCoins((prev) => {
            const existingIds = new Set(prev.map((coin) => coin.id));
            const newCoins = data.filter((coin) => !existingIds.has(coin.id));
            const updatedCoins = isRefresh ? newCoins : [...prev, ...newCoins];
            window.cryptoChartData = updatedCoins;
            return updatedCoins;
          });
          if (!searchQuery) {
            setFilteredCoins((prev) => {
              const existingIds = new Set(prev.map((coin) => coin.id));
              const newCoins = data.filter((coin) => !existingIds.has(coin.id));
              return isRefresh ? newCoins : [...prev, ...newCoins];
            });
          }
          clientCache.current.set(cacheKey, { data, timestamp: now });
          if (!isRefresh) setPage(pageToFetch + 1);
          setHasMore(data.length === 50);
          lastFetchTime.current = now;
          return true;
        } else {
          if (cached) {
            console.log(`Serving offline client-cached data for page ${pageToFetch}`);
            setCoins((prev) => {
              const existingIds = new Set(prev.map((coin) => coin.id));
              const newCoins = cached.data.filter((coin) => !existingIds.has(coin.id));
              const updatedCoins = isRefresh ? newCoins : [...prev, ...newCoins];
              window.cryptoChartData = updatedCoins;
              return updatedCoins;
            });
            if (!searchQuery) {
              setFilteredCoins((prev) => {
                const existingIds = new Set(prev.map((coin) => coin.id));
                const newCoins = cached.data.filter((coin) => !existingIds.has(coin.id));
                return isRefresh ? newCoins : [...prev, ...newCoins];
              });
            }
            if (!isRefresh) setPage(pageToFetch + 1);
            setHasMore(cached.data.length === 50);
            lastFetchTime.current = now;
            return true;
          }
          throw new Error('No cached data available. Please reconnect to the internet.');
        }
      } catch (err) {
        console.error(`Error: ${err.message}`);
        setError(err.message);
        return false;
      } finally {
        setLoading(false);
        isFetching.current = false;
        if (fetchQueue.current.length > 0) {
          const nextFetch = fetchQueue.current.shift();
          fetchCoins(nextFetch.page, nextFetch.isRefresh);
        }
      }
    },
    [hasMore, isOnline, searchQuery]
  );

  const queueFetch = useCallback(
    (pageToFetch, isRefresh = false) => {
      if (isFetching.current) {
        console.log(`Queuing fetch for page ${pageToFetch}`);
        fetchQueue.current.push({ page: pageToFetch, isRefresh });
      } else {
        fetchCoins(pageToFetch, isRefresh);
      }
    },
    [fetchCoins]
  );

  const prefetchNextPage = useCallback(async () => {
    if (!hasMore || isFetching.current || !isOnline || searchQuery) return;
    console.log(`Scheduling prefetch for page ${page} in ${PREFETCH_DELAY / 1000}s...`);
    await wait(PREFETCH_DELAY);
    queueFetch(page, false);
  }, [queueFetch, hasMore, page, isOnline, searchQuery]);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredCoins(coins);
      setError(null);
      return;
    }
    const lowerQuery = searchQuery.toLowerCase().trim();
    let matchedCoins = [];
    for (const [cacheKey, cached] of clientCache.current) {
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        matchedCoins.push(
          ...cached.data.filter(
            (coin) =>
              coin.name?.toLowerCase().includes(lowerQuery) ||
              coin.symbol?.toLowerCase().includes(lowerQuery)
          )
        );
      }
    }
    const filtered = coins.filter(
      (coin) =>
        (coin.name && coin.name.toLowerCase().includes(lowerQuery)) ||
        (coin.symbol && coin.symbol.toLowerCase().includes(lowerQuery))
    );
    const allMatches = [...new Map([...matchedCoins, ...filtered].map(coin => [coin.id, coin])).values()];
    setFilteredCoins(allMatches);
    setError(allMatches.length === 0 ? 'No coins found for your search.' : null);
  }, [searchQuery, coins]);

  const debouncedSearch = useCallback(() => {
    const timeout = setTimeout(() => handleSearch(), 500);
    return () => clearTimeout(timeout);
  }, [handleSearch]);

  const handleScroll = useCallback(() => {
    setIsBackToTopVisible(window.scrollY > 300);
  }, []);

  useEffect(() => {
    debouncedSearch();
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setError(null);
      queueFetch(1, true);
    };
    const handleOffline = () => setIsOnline(false);
    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('scroll', handleScroll);
    queueFetch(1, true);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [queueFetch, handleScroll]);

  useEffect(() => {
    if (inView && !isFetching.current && hasMore && !searchQuery && isOnline) {
      queueFetch(page, false);
    }
  }, [inView, queueFetch, hasMore, page, searchQuery, isOnline]);

  useEffect(() => {
    if (coins.length > 0 && hasMore && !searchQuery && isOnline) {
      prefetchNextPage();
    }
  }, [coins, hasMore, searchQuery, isOnline, prefetchNextPage]);

  const displayedCoins = searchQuery ? filteredCoins : coins;

  return (
    <div className={styles.chartContainer}>
      <h1 className={styles.title}>📈 Crypto Live Updates</h1>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search coins (e.g., Bitcoin, BTC)"
          className={styles.searchInput}
        />
      </div>
      <div className={styles.coinCount}>
        {displayedCoins.length} coins loaded
      </div>
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
      <div className={styles.cryptoList}>
        <div className={styles.headerRow}>
          <div className={styles.headerCell} style={{ width: '12%' }}>#</div>
          <div className={styles.headerCell} style={{ width: '42%' }}>Coin</div>
          <div className={styles.headerCell} style={{ width: '28%' }}>Price</div>
          <div className={styles.headerCell} style={{ width: '18%' }}>24h %</div>
        </div>
        <div className={styles.listContent}>
          {displayedCoins.length > 0 ? (
            displayedCoins.map((coin, index) => (
              <div key={`${coin.id}-${index}`} className={styles.listRow}>
                <div className={styles.cell} style={{ width: '12%' }}>
                  <Link href={`/coin/${coin.id}`}>{index + 1}</Link>
                </div>
                <div className={styles.cell} style={{ width: '42%' }}>
                  <Link href={`/coin/${coin.id}`}>
                    <div className={styles.coinInfo}>
                      <div>
                        <Image
                          src={coin.image}
                          alt={coin.symbol || 'Coin'}
                          width={24}
                          height={24}
                          className={styles.coinImage}
                        />
                        <span className={styles.symbol}>{coin.symbol?.toUpperCase() || 'N/A'}</span>
                      </div>
                      <div className={styles.marketCap}>
                        ${formatMarketCap(coin.market_cap)}
                      </div>
                    </div>
                  </Link>
                </div>
                <div className={styles.cell} style={{ width: '28%' }}>
                  <Link href={`/coin/${coin.id}`}>
                    ${formatPrice(coin.current_price)}
                  </Link>
                </div>
                <div
                  className={styles.cell}
                  style={{
                    width: '18%',
                    color: coin.price_change_percentage_24h >= 0 ? '#008000' : '#ff0000',
                  }}
                >
                  <Link href={`/coin/${coin.id}`}>
                    {coin.price_change_percentage_24h?.toFixed(2) ?? 'N/A'}%
                  </Link>
                  <div
                    className={styles.changeArrow}
                    style={{
                      color: coin.price_change_percentage_24h >= 0 ? '#008000' : '#ff0000',
                    }}
                  >
                    {coin.price_change_percentage_24h >= 0 ? '↑' : '↓'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyRow}>
              {loading ? (
                <span className={styles.spinner}></span>
              ) : error ? (
                error
              ) : searchQuery ? (
                'No coins found'
              ) : (
                'No data available'
              )}
            </div>
          )}
          {hasMore && !searchQuery && isOnline && (
            <div ref={ref} className={styles.loading}>
              {loading && <span className={styles.spinner}></span>}
            </div>
          )}
        </div>
      </div>
      {hasMore && !searchQuery && isOnline && (
        <button
          onClick={() => queueFetch(page, false)}
          className={styles.loadMore}
          disabled={loading}
        >
          <span className={styles.loadMoreText}>
            {loading ? 'Loading...' : 'Load More'}
          </span>
        </button>
      )}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`${styles.backToTop} ${isBackToTopVisible ? styles.visible : ''}`}
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  );
}