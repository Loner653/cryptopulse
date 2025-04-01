"use client";
import Link from "next/link";
import styles from "./navbar.module.css";

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
  return (
    <nav className={styles.navbar}>
      <h1 className={styles.title}>Welcome to CryptoGlobal</h1>
      <button
        className={styles.sidebarToggle}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? "✖" : "☰"}
      </button>
      <ul className={styles.navList}>
        <li>
          <Link href="/history" className={styles.navLink}>
            History
          </Link>
        </li>
        <li>
          <Link href="/faq" className={styles.navLink}>
            🧠 FAQ
          </Link>
        </li>
        <li>
          <Link href="/news" className={styles.navLink}>
            <span className={styles.navIcon}>💬</span> News
          </Link>
        </li>
        <li>
          <Link href="/chat" className={styles.navLink}>
            <span className={styles.navIcon}>💬</span> Chat
          </Link>
        </li>
      </ul>
    </nav>
  );
}