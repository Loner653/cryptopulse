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

        <button
          className={styles.navButton}
          onClick={handleForward}
          aria-label="Go forward"
        >
          Forward →
        </button>
      </div>

      {/* Menu Box Row (Sidebar Toggle on Mobile) */}
      <div className={styles.menuBox}>
        <button
          className={styles.sidebarToggle}
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? "✖" : "☰"}
        </button>
      </div>
    </nav>
  );
}