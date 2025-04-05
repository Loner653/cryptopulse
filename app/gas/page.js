"use client";
import { useState, useEffect } from "react";
import styles from "./gas.module.css";

export default function GasTracker() {
  const [gas, setGas] = useState({ low: 0, avg: 0, high: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchGas = async () => {
    try {
      const response = await fetch(
        `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
      );
      const data = await response.json();
      if (data.status === "1") {
        setGas({
          low: parseInt(data.result.SafeGasPrice),
          avg: parseInt(data.result.ProposeGasPrice),
          high: parseInt(data.result.FastGasPrice),
        });
      }
    } catch (error) {
      console.error("Gas fetch error:", error);
      setGas({ low: 20, avg: 25, high: 30 }); // Mock fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGas();
    const interval = setInterval(fetchGas, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Ethereum Gas Tracker</h1>
      {isLoading ? (
        <p className={styles.feedback}>Loading...</p>
      ) : (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Current Gas Prices</h2>
          <ul>
            <li>
              <span className={styles.highlight}>Low:</span> {gas.low} Gwei
            </li>
            <li>
              <span className={styles.highlight}>Average:</span> {gas.avg} Gwei
            </li>
            <li>
              <span className={styles.highlight}>High:</span> {gas.high} Gwei
            </li>
          </ul>
        </div>
      )}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={styles.backToTop}
      >
        ↑ Top
      </button>
    </div>
  );
}