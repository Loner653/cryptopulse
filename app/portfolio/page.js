"use client";

import { useState, useEffect } from "react";
import { useNhostClient, useUserId } from "@nhost/nextjs";
import styles from "./portfolio.module.css";

export default function Portfolio() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState("");
  const [newAsset, setNewAsset] = useState({ symbol: "", amount: "" });
  const [newAlert, setNewAlert] = useState({ symbol: "", targetPrice: "" });
  const [assets, setAssets] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [prices, setPrices] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const nhost = useNhostClient();
  const userId = useUserId();
  const isAuthenticated = !!userId;

  const [priceCache, setPriceCache] = useState({ data: {}, timestamp: 0, symbols: [] });

  if (typeof window !== "undefined") {
    console.log("User ID:", userId, "Authenticated:", isAuthenticated);
    console.log("Session Token:", nhost.auth.getAccessToken());
  }

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("Not authenticated, skipping fetch.");
      return;
    }
    console.log("Effect running for user:", userId);
    if ("Notification" in window) Notification.requestPermission();
    fetchData();
  }, [isAuthenticated, userId]);

  const fetchData = async () => {
    if (!isAuthenticated || isLoading) {
      console.log("Skipping fetchData - not authenticated or loading.");
      return;
    }
    console.log("Fetching data for user:", userId);
    try {
      setIsLoading(true);
      const assetsRes = await nhost.graphql.request(ASSETS_QUERY, { userId });
      if (assetsRes.error) throw new Error("Assets failed");

      const alertsRes = await nhost.graphql.request(ALERTS_QUERY, { userId });
      if (alertsRes.error) throw new Error("Alerts failed");

      const assetsData = assetsRes.data?.assets || [];
      const alertsData = alertsRes.data?.alerts || [];
      setAssets(assetsData);
      setAlerts(alertsData);

      const rawSymbols = [...new Set([...assetsData, ...alertsData].map((item) => item.symbol.trim()))];
      const symbols = rawSymbols.filter((symbol) => /^[A-Z]{2,5}$/.test(symbol)).filter(Boolean);

      if (symbols.length) {
        const pricesData = await fetchPrices(symbols);
        setPrices(pricesData);
        checkAlerts(alertsData, pricesData);
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
      setMessage("Error fetching data: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPrices = async (symbols) => {
    const now = Date.now();
    const cacheAge = now - priceCache.timestamp;
    const cacheDuration = 60 * 1000;

    const cachedSymbols = new Set(priceCache.symbols);
    const requestedSymbols = new Set(symbols);
    const hasAllSymbols = [...requestedSymbols].every((sym) => cachedSymbols.has(sym));

    if (cacheAge < cacheDuration && hasAllSymbols && Object.keys(priceCache.data).length > 0) {
      console.log("Using cached prices:", priceCache.data);
      return priceCache.data;
    }

    try {
      console.log("Fetching fresh prices from API for symbols:", symbols);
      const response = await fetch(`/api/prices?symbols=${symbols.join(",")}`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const data = await response.json();
      if (!data.error) {
        setPriceCache({ data, timestamp: now, symbols });
        return data;
      }
      return priceCache.data;
    } catch (error) {
      console.error("Price fetch error:", error.message);
      return priceCache.data;
    }
  };

  const checkAlerts = (alerts, prices) => {
    alerts.forEach(async (alert) => {
      const price = prices[alert.symbol]?.quote.USD.price || 0;
      if (
        !alert.triggered &&
        ((alert.target_price > 0 && price >= alert.target_price) ||
         (alert.target_price < 0 && price <= Math.abs(alert.target_price)))
      ) {
        console.log("Alert triggered:", alert.symbol, price);
        if (Notification.permission === "granted") {
          new Notification(`${alert.symbol} hit $${alert.target_price}! Current: $${price}`);
        }
        await nhost.graphql.request(UPDATE_ALERT_MUTATION, { id: alert.id });
      }
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await nhost.auth.signIn({ email, password });
      setEmail("");
      setPassword("");
      setMessage("");
      fetchData();
    } catch (error) {
      console.error("Login error:", error.message);
      setMessage("Login failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await nhost.auth.signUp({ email, password });
      setMessage("Check your email to verify.");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Signup error:", error.message);
      setMessage("Signup failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) return;
    try {
      setIsLoading(true);
      await nhost.auth.resetPassword({ email });
      setMessage("Check your email for reset link.");
    } catch (error) {
      console.error("Reset error:", error.message);
      setMessage("Reset failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await nhost.auth.signOut();
      setAssets([]);
      setAlerts([]);
      setPrices({});
      setPriceCache({ data: {}, timestamp: 0, symbols: [] });
      setMessage("");
    } catch (error) {
      console.error("Logout error:", error.message);
      setMessage("Logout failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleAddAsset = async () => {
    if (!newAsset.symbol || !newAsset.amount || !isAuthenticated) {
      setMessage("Please fill all fields and ensure you’re logged in.");
      return;
    }
    const trimmedSymbol = newAsset.symbol.trim().toUpperCase();
    if (!/^[A-Z]{2,5}$/.test(trimmedSymbol)) {
      setMessage("Invalid symbol (use 2-5 uppercase letters).");
      return;
    }
    try {
      setIsLoading(true);
      const variables = { userId, symbol: trimmedSymbol, amount: parseFloat(newAsset.amount) };
      const result = await nhost.graphql.request(ADD_ASSET_MUTATION, variables);
      if (result.error) throw new Error(result.error[0].message);
      setNewAsset({ symbol: "", amount: "" });
      await fetchData();
    } catch (error) {
      console.error("Add asset error:", error.message);
      setMessage("Failed to add asset: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAlert = async () => {
    if (!newAlert.symbol || !newAlert.targetPrice || !isAuthenticated) {
      setMessage("Please fill all fields and ensure you’re logged in.");
      return;
    }
    const trimmedSymbol = newAlert.symbol.trim().toUpperCase();
    if (!/^[A-Z]{2,5}$/.test(trimmedSymbol)) {
      setMessage("Invalid symbol (use 2-5 uppercase letters).");
      return;
    }
    try {
      setIsLoading(true);
      const variables = { userId, symbol: trimmedSymbol, targetPrice: parseFloat(newAlert.targetPrice) };
      const result = await nhost.graphql.request(ADD_ALERT_MUTATION, variables);
      if (result.error) throw new Error(result.error[0].message);
      setNewAlert({ symbol: "", targetPrice: "" });
      await fetchData();
    } catch (error) {
      console.error("Add alert error:", error.message);
      setMessage("Failed to set alert: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAsset = async (id) => {
    try {
      setIsLoading(true);
      const result = await nhost.graphql.request(DELETE_ASSET_MUTATION, { id });
      if (result.error) throw new Error(result.error[0].message);
      await fetchData();
    } catch (error) {
      console.error("Delete asset error:", error.message);
      setMessage("Failed to delete asset: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAlert = async (id) => {
    try {
      setIsLoading(true);
      const result = await nhost.graphql.request(DELETE_ALERT_MUTATION, { id });
      if (result.error) throw new Error(result.error[0].message);
      await fetchData();
    } catch (error) {
      console.error("Delete alert error:", error.message);
      setMessage("Failed to delete alert: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>💼 CryptoPulse Tracker</h1>
      {isLoading ? (
        <p className={styles.loading}>Loading...</p>
      ) : !isAuthenticated ? (
        <div className={styles.authSection}>
          <form className={styles.authForm} onSubmit={isSignup ? handleSignup : handleLogin}>
            <div className={styles.inputGroup}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                disabled={isLoading}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <button type="submit" className={styles.actionButton} disabled={isLoading}>
              {isLoading ? "Loading..." : isSignup ? "Sign Up" : "Login"}
            </button>
          </form>
          <button
            onClick={() => setIsSignup(!isSignup)}
            className={styles.switchButton}
            disabled={isLoading}
          >
            {isSignup ? "Switch to Login" : "Switch to Sign Up"}
          </button>
          {!isSignup && (
            <button onClick={handlePasswordReset} className={styles.resetButton} disabled={isLoading}>
              Forgot Password?
            </button>
          )}
          {message && <p className={styles.feedback}>{message}</p>}
        </div>
      ) : (
        <div className={styles.content}>
          <p className={styles.welcome}>Welcome, {nhost.auth.getUser()?.email || "User"}!</p>
          <button onClick={handleRefresh} className={styles.refreshButton} disabled={isLoading}>
            {isLoading ? "Loading..." : "Refresh"}
          </button>
          <button onClick={handleLogout} className={styles.backToTop} disabled={isLoading}>
            {isLoading ? "Loading..." : "Logout"}
          </button>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Add Asset</h2>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Symbol (e.g., BTC)"
                value={newAsset.symbol}
                onChange={(e) => setNewAsset({ ...newAsset, symbol: e.target.value })}
                className={styles.input}
                disabled={isLoading}
              />
              <input
                type="number"
                placeholder="Amount"
                value={newAsset.amount}
                onChange={(e) => setNewAsset({ ...newAsset, amount: e.target.value })}
                className={styles.input}
                disabled={isLoading}
              />
              <button onClick={handleAddAsset} className={styles.actionButton} disabled={isLoading}>
                {isLoading ? "Loading..." : "Add Asset"}
              </button>
            </div>
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Set Alert</h2>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Symbol (e.g., BTC)"
                value={newAlert.symbol}
                onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value })}
                className={styles.input}
                disabled={isLoading}
              />
              <input
                type="number"
                placeholder="Target Price (USD)"
                value={newAlert.targetPrice}
                onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
                className={styles.input}
                disabled={isLoading}
              />
              <button onClick={handleAddAlert} className={styles.actionButton} disabled={isLoading}>
                {isLoading ? "Loading..." : "Set Alert"}
              </button>
            </div>
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Portfolio</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Price (USD)</th>
                  <th>Value (USD)</th>
                  <th>24h Change</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => {
                  const price = prices[asset.symbol]?.quote.USD.price || 0;
                  const change = prices[asset.symbol]?.quote.USD.percent_change_24h || 0;
                  const value = price * asset.amount;
                  return (
                    <tr key={asset.id}>
                      <td>
                        <div className={styles.assetCell}>
                          <span className={styles.symbol}>{asset.symbol}</span>
                          <span className={styles.amount}>{asset.amount}</span>
                        </div>
                      </td>
                      <td>${price.toFixed(2)}</td>
                      <td>${value.toFixed(2)}</td>
                      <td className={change >= 0 ? styles.correct : styles.incorrect}>
                        {change.toFixed(2)}%
                      </td>
                      <td>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteAsset(asset.id)}
                          disabled={isLoading}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {assets.length === 0 && (
                  <tr>
                    <td colSpan="5">No assets yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Active Alerts</h2>
            <ul className={styles.alertList}>
              {alerts.map((alert) => (
                <li key={alert.id} className={styles.alertItem}>
                  {alert.symbol} @ ${alert.target_price} {alert.triggered ? "(Triggered)" : ""}
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteAlert(alert.id)}
                    disabled={isLoading}
                  >
                    ✕
                  </button>
                </li>
              ))}
              {alerts.length === 0 && <li>No alerts yet</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

const ASSETS_QUERY = `
  query Assets($userId: uuid!) {
    assets(where: { user_id: { _eq: $userId } }) {
      id
      symbol
      amount
    }
  }
`;

const ALERTS_QUERY = `
  query Alerts($userId: uuid!) {
    alerts(where: { user_id: { _eq: $userId } }) {
      id
      symbol
      target_price
      triggered
    }
  }
`;

const ADD_ASSET_MUTATION = `
  mutation AddAsset($userId: uuid!, $symbol: String!, $amount: float8!) {
    insert_assets_one(object: { user_id: $userId, symbol: $symbol, amount: $amount }) {
      id
    }
  }
`;

const ADD_ALERT_MUTATION = `
  mutation AddAlert($userId: uuid!, $symbol: String!, $targetPrice: float8!) {
    insert_alerts_one(object: { user_id: $userId, symbol: $symbol, target_price: $targetPrice, triggered: false }) {
      id
    }
  }
`;

const UPDATE_ALERT_MUTATION = `
  mutation UpdateAlert($id: uuid!) {
    update_alerts_by_pk(pk_columns: { id: $id }, _set: { triggered: true }) {
      id
    }
  }
`;

const DELETE_ASSET_MUTATION = `
  mutation DeleteAsset($id: uuid!) {
    delete_assets_by_pk(id: $id) {
      id
    }
  }
`;

const DELETE_ALERT_MUTATION = `
  mutation DeleteAlert($id: uuid!) {
    delete_alerts_by_pk(id: $id) {
      id
    }
  }
`;