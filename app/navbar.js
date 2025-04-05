"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./navbar.module.css";
import { useState, useEffect } from "react";

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
  const router = useRouter();
  const [pressTimer, setPressTimer] = useState(null);

  const handleBack = () => {
    router.back();
  };

  const handleForward = () => {
    router.forward();
  };

  const startPress = () => {
    const timer = setTimeout(() => {
      router.push("/admin");
    }, 5000); // 5 seconds long-press for admin
    setPressTimer(timer);
  };

  const endPress = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleClick = () => {
    if (!pressTimer) {
      toggleSidebar(); // Immediate toggle on click if no long-press is active
    }
  };

  useEffect(() => {
    return () => {
      if (pressTimer) clearTimeout(pressTimer);
    };
  }, [pressTimer]);

  return (
    <nav className={styles.navbar}>
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
            <li>
              <Link href="/faq" className={styles.navLink}>
                🧠 FAQ
              </Link>
            </li>
            <li>
              <Link href="/news" className={styles.navLink}>
                <span className={styles.navIcon}></span> News
              </Link>
            </li>
            <li>
              <Link href="/chat" className={styles.navLink}>
                <span className={styles.navIcon}>💬</span> Chat
              </Link>
            </li>
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

      <div className={styles.menuBox}>
        <button
          className={styles.sidebarToggle}
          onClick={handleClick} // Single click for toggle
          onTouchStart={startPress} // Start long-press for admin
          onTouchEnd={endPress}
          onMouseDown={startPress} // Start long-press for admin
          onMouseUp={endPress}
          onMouseLeave={endPress}
          aria-label="Toggle sidebar (click) or access admin (hold 5s)"
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
              <Link href="/glossary" className={styles.extraNavLink}>
                📖 Glossary
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}