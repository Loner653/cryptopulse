"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./navbar.module.css";

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleForward = () => {
    router.forward();
  };

  return (
    <nav className={styles.navbar}>
      {/* Main Navbar Row (Back, Nav Links, Forward) */}
      <div className={styles.navMain}>
        <button
          className={styles.navButton}
          onClick={handleBack}
          aria-label="Go back"
        >
          ← Back
        </button>

        <div className={styles.navCenter}>
          <ul className={styles.navList}>
            {/* Always visible links (phone and laptop) */}
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
            {/* Laptop-only links */}
            <li className={styles.laptopOnly}>
              <Link href="/" className={styles.navLink}>
                🏠 Home
              </Link>
            </li>
            <li className={styles.laptopOnly}>
              <Link href="/articles" className={styles.navLink}>
                📚 Articles
              </Link>
            </li>
            <li className={styles.laptopOnly}>
              <Link href="/history" className={styles.navLink}>
                📜 History
              </Link>
            </li>
            <li className={styles.laptopOnly}>
              <Link href="/quiz" className={styles.navLink}>
                ❓ Quiz
              </Link>
            </li>
          </ul>
        </div>

        <button
          className={styles.navButton}
          onClick={handleForward}
          aria-label="Go forward"
        >
          Forward →
        </button>
      </div>

      {/* Menu Box Row (Sidebar Toggle + Extra Links for Mobile) */}
      <div className={styles.menuBox}>
        <button
          className={styles.sidebarToggle}
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? "✖" : "☰"}
        </button>

        <div className={styles.menuLinks}>
          <ul className={styles.extraNavList}>
            <li>
              <Link href="/articles" className={styles.extraNavLink}>
                📚 Articles
              </Link>
            </li>
            <li>
              <Link href="/quiz" className={styles.extraNavLink}>
                ❓ Quiz
              </Link>
            </li>
            <li>
              <Link href="/history" className={styles.extraNavLink}>
                📜 History
              </Link>
            </li>
            <li>
              <Link href="/portfolio" className={styles.extraNavLink}>
                💼 Portfolio
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}