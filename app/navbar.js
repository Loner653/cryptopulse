"use client";
import Link from "next/link";
import styles from "./navbar.module.css";

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
  return (
    <nav className={styles.navbar}>
      <button
        className={styles.sidebarToggle}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? "✖" : "☰"}
      </button>
      <ul className={styles.navList}>
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