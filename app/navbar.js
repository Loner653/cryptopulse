"use client";

import Link from "next/link";
import styles from "./navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <h1 className={styles.title}>Welcome to CryptoPulse</h1>
      <ul className={styles.navList}>
        <li>
          <Link href="/articles" className={styles.navLink}>
            Article
          </Link>
        </li>
        <li>
          <Link href="/news" className={styles.navLink}>
            News
          </Link>
        </li>
        <li>
          <Link href="/chart" className={styles.navLink}>
            Chart
          </Link>
        </li>
        <li>
          <Link href="/history" className={styles.navLink}>
            History
          </Link>
        </li>
        <li>
          <Link href="/analytics" className={styles.navLink}>
            Analytics
          </Link>
        </li>
      </ul>
    </nav>
  );
}