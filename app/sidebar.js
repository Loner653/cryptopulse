"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./sidebar.module.css"; 
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("./chart/CryptoChart"), { ssr: false });



export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showChart, setShowChart] = useState(false);

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
      
      {/* Toggle Button */}
      <button className={styles.toggleBtn} onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? "➡️" : "⬅️"}
      </button>

      {/* Dashboard Title */}
      {!isCollapsed && <h2 className={styles.logo}>📊 Dashboard</h2>}

      {/* Navigation Menu */}
      <nav>
        <ul>
          <li><Link href="/">🏠 Home</Link></li>
        
          <li><Link href="/articles">📚 Articles</Link></li>
          
          <li><Link href="/history">📜 History</Link></li>
         
          <li><Link href="/chart">🤖 Crypto-Bot</Link></li>

          <li><Link href="/analytics">📊 Analytics</Link></li>
          
          <li><Link href="/news">🚪 News</Link></li>
         
          <li><Link href="/chart">📈 Chart Page</Link></li>

          {/* Toggle Chart Button */}
          <li>
            <button className={styles.chartBtn} onClick={() => setShowChart(!showChart)}>
              {showChart ? "❌ Hide Chart" : "📈 Show Chart"}
            </button>
          </li>
        </ul>
      </nav>

      {/* Render Chart if Enabled */}
      {showChart && (
        <div className={styles.chartContainer}>
          <Chart />
        </div>
      )}
    </aside>
  );
}
