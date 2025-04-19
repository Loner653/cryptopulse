'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Image from 'next/image';
import styles from './cryptoChart.module.css';

// Log CSS module to confirm loading
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
  const CACHE_DURATION = 2 * 60 * 1000;
  const PREFETCH_DELAY = 5000;
  const { ref, inView } = useInView({ threshold: 0.1, skip: typeof window === 'undefined' });
  const fetchQueue = useRef([]);
  const isFetching = useRef(false);

  const formatMarketCap = (value) => {
    if (!value) return 'N/A';
    if (value >= 1_000_000_000_000) return (value / 1_000_000_000_000).toFixed(2) + 'T';
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(2) + 'B';
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + 'M';
    return value.toLocaleString();
  };

  const formatPrice = (value) => {
    if (!value) return 'N/A';
    if (value >= 1) {
      return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    const str = value.toFixed(20);
    const match = str.match(/0\.0*([1-9])/);
    if (match && match[1]) {
      const firstNonZeroIndex = str.indexOf(match[1]);
      const leadingZeros = firstNonZeroIndex - 2;
      if (leadingZeros >= 3) {
        const significantDigits = str.slice(firstNonZeroIndex, firstNonZeroIndex + 3);
        return (
          <>
            0.0<sub>{leadingZeros - 1}</sub>{significantDigits}
          </>
        );
      }
    }
    return Number(value.toFixed(6)).toString();
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchCoins = useCallback(
    async (pageToFetch, isRefresh = false, attempt = 1) => {
      if (isFetching.current || (!isRefresh && !hasMore)) return false;
      isFetching.current = true;
      setLoading(true);
      setError(null);
      const cacheKey = `page_${pageToFetch}`;

      const cached = clientCache.current.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION && !isRefresh) {
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
        return true;
      }

      try {
        if (isOnline) {
          console.log(`Fetching page ${pageToFetch} from CoinGecko (Attempt ${attempt})`);
          const response = await fetch(`/api/coins?page=${pageToFetch}`);
          if (!response.ok) {
            if (response.status === 429) {
              if (attempt <= 3) {
                const delay = 5000 * Math.pow(2, attempt - 1);
                console.log(`Rate limit hit, waiting ${delay / 1000}s...`);
                await wait(delay);
                return fetchCoins(pageToFetch, isRefresh, attempt + 1);
              }
              throw new Error('CoinGecko API limit exceeded. Please wait and try again.');
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
          clientCache.current.set(cacheKey, { data, timestamp: Date.now() });
          if (!isRefresh) setPage(pageToFetch + 1);
          setHasMore(data.length === 50);
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
            return true;
          } else {
            throw new Error('No cached data available. Please reconnect to the internet.');
          }
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

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedFetchCoins = useCallback(debounce(queueFetch, 1500), [queueFetch]);
  const debouncedPrefetch = useCallback(debounce(prefetchNextPage, PREFETCH_DELAY), [prefetchNextPage]);

  const handleSearch = useCallback(() => {
    console.log('Search query:', searchQuery);
    if (!searchQuery.trim()) {
      console.log('No search query, resetting to all coins:', coins.length);
      setFilteredCoins(coins);
      setError(null);
      return;
    }
    const lowerQuery = searchQuery.toLowerCase().trim();
    console.log('Filtering coins with query:', lowerQuery);

    // Check cached pages for matches
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

    // Filter loaded coins
    const filtered = coins.filter(
      (coin) =>
        (coin.name && coin.name.toLowerCase().includes(lowerQuery)) ||
        (coin.symbol && coin.symbol.toLowerCase().includes(lowerQuery))
    );

    // Combine cached and loaded matches, removing duplicates
    const allMatches = [...new Map([...matchedCoins, ...filtered].map(coin => [coin.id, coin])).values()];
    console.log('Filtered coins:', allMatches.length, allMatches.map(c => c.name));
    setFilteredCoins(allMatches);
    setError(allMatches.length === 0 ? 'No coins found for your search.' : null);

    // Trigger background fetching if online and more pages are available
    if (isOnline && hasMore && allMatches.length < 10) {
      console.log('Initiating background fetch for more search results, starting at page:', page);
      const backgroundFetch = async () => {
        let nextPage = page;
        while (hasMore && isOnline && !isFetching.current) {
          console.log(`Background fetching page ${nextPage} for search query: ${lowerQuery}`);
          const success = await fetchCoins(nextPage, false);
          if (!success) break;
          nextPage++;
          // Re-run search to include new coins
          const newFiltered = coins.filter(
            (coin) =>
              (coin.name && coin.name.toLowerCase().includes(lowerQuery)) ||
              (coin.symbol && coin.symbol.toLowerCase().includes(lowerQuery))
          );
          const newMatches = [...new Map([...matchedCoins, ...newFiltered].map(coin => [coin.id, coin])).values()];
          console.log('Updated search results:', newMatches.length, newMatches.map(c => c.name));
          setFilteredCoins(newMatches);
          setError(newMatches.length === 0 ? 'No coins found for your search.' : null);
          // Small delay to avoid overwhelming the API
          await wait(1000);
        }
      };
      backgroundFetch();
    }
  }, [searchQuery, coins, isOnline, hasMore, page, fetchCoins]);

  const debouncedSearch = useCallback(debounce(handleSearch, 500), [handleSearch]);

  const handleScroll = useCallback(() => {
    if (typeof window !== 'undefined') {
      setIsBackToTopVisible(window.scrollY > 300);
    }
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

    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      window.addEventListener('scroll', handleScroll);
    }

    queueFetch(1, true);

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [queueFetch, handleScroll]);

  useEffect(() => {
    if (inView && !isFetching.current && hasMore && !searchQuery && isOnline) {
      debouncedFetchCoins(page, false);
    }
  }, [inView, debouncedFetchCoins, hasMore, searchQuery, isOnline, page]);

  useEffect(() => {
    if (coins.length > 0 && hasMore && !searchQuery && isOnline) {
      debouncedPrefetch();
    }
  }, [coins, hasMore, searchQuery, isOnline, debouncedPrefetch]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Tawk_API && window.Tawk_API.onLoad) {
      window.Tawk_API.onLoad = function () {
        window.Tawk_API.setAttributes({ name: 'Crypto-bot' });
        window.Tawk_API.onChatMessageVisitor = function (message) {
          const userMessage = message.toLowerCase().trim();
          const coinsData = window.cryptoChartData || coins;

          if (isFetching.current) {
            window.Tawk_API.sendMessage('I’m still loading the coin data, please wait a moment...');
            return;
          }

          if (coinsData.length === 0) {
            window.Tawk_API.sendMessage('Sorry, I couldn’t load the cryptocurrency data. Please try again later.');
            return;
          }

          let detectedCoin = null;
          for (const coin of coinsData) {
            if (
              userMessage.includes(coin.name?.toLowerCase()) ||
              userMessage.includes(coin.symbol?.toLowerCase())
            ) {
              detectedCoin = coin;
              break;
            }
          }

          if (!detectedCoin) {
            window.Tawk_API.sendMessage('Sorry, I couldn’t find that cryptocurrency in the chart data. Try another coin.');
            return;
          }

          if (userMessage.includes('price') || userMessage.includes('how much')) {
            window.Tawk_API.sendMessage(
              `The current price of ${detectedCoin.symbol.toUpperCase()} is $${formatPrice(detectedCoin.current_price)} USD.`
            );
          } else if (userMessage.includes('market cap')) {
            window.Tawk_API.sendMessage(
              `The market cap of ${detectedCoin.symbol.toUpperCase()} is $${formatMarketCap(detectedCoin.market_cap)} USD.`
            );
          } else if (userMessage.includes('24h change') || userMessage.includes('24 hour')) {
            window.Tawk_API.sendMessage(
              `The 24h price change of ${detectedCoin.symbol.toUpperCase()} is ${detectedCoin.price_change_percentage_24h?.toFixed(2) ?? 'N/A'}%.`
            );
          } else {
            window.Tawk_API.sendMessage(
              `I can help with price, market cap, or 24h change for ${detectedCoin.symbol.toUpperCase()}. What would you like to know?`
            );
          }
        };
      };
    }
  }, [coins]);

  const displayedCoins = searchQuery ? filteredCoins : coins;

  return (
    <div className={styles.chartContainer}>
      <h1 className={styles.title}>📈 Crypto Live Updates</h1>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            console.log('Input change:', e.target.value);
            setSearchQuery(e.target.value);
          }}
          placeholder="Search coins (e.g., Bitcoin, BTC)"
          className={styles.searchInput}
        />
      </div>
      <div className={styles.coinCount}>
        {displayedCoins.length} out of a vast array of coins
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
          onClick={() => debouncedFetchCoins(page, false)}
          className={styles.loadMore}
          disabled={loading}
        >
          <span className={styles.loadMoreText}>
            {loading ? 'Loading...' : 'Load More'}
          </span>
        </button>
      )}
      <button
        onClick={() => typeof window !== 'undefined' && window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`${styles.backToTop} ${isBackToTopVisible ? styles.visible : ''}`}
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  );
}