// app/articles/ArticlesContentClient.js
"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./ArticlesContentClient.module.css";

export default function ArticlesContentClient({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("hashchange", scrollToHash);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname, searchParams]);

  return (
    <div className={styles.pageLayout}>
      {children}
      {showBackToTop && (
        <button
          className={`${styles.backToTop} ${showBackToTop ? styles.visible : ""}`}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑ Back to Top
        </button>
      )}
    </div>
  );
}