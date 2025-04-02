"use client";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
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
      {/* Back Button on the Far Left */}
      <button
        className={styles.navButton}
        onClick={handleBack}
        aria-label="Go back"
      >
        ← Back
      </button>

      {/* Sidebar Toggle and Navigation Links in the Center */}
      <div className={styles.navCenter}>
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
      </div>

      {/* Forward Button on the Far Right */}
      <button
        className={styles.navButton}
        onClick={handleForward}
        aria-label="Go forward"
      >
        Forward →
      </button>
    </nav>
  );
}