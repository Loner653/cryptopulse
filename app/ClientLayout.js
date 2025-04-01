"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation"; // Import usePathname
import Link from "next/link";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import PriceTicker from "./price ticker/PriceTicker";
import { Analytics } from "@vercel/analytics/react";
import "./global.css";

export default function ClientLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const mainContainerRef = useRef(null);
  const pathname = usePathname(); // Get the current route

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const mainContainer = mainContainerRef.current;
    const sidebar = sidebarRef.current;

    const handleMainScroll = () => {
      if (sidebarOpen && sidebar) {
        sidebar.style.overflowY = "hidden";
        setTimeout(() => {
          sidebar.style.overflowY = "auto";
        }, 0);
      }
    };

    if (mainContainer) {
      mainContainer.addEventListener("scroll", handleMainScroll);
    }

    return () => {
      if (mainContainer) {
        mainContainer.removeEventListener("scroll", handleMainScroll);
      }
    };
  }, [sidebarOpen]);

  const articles = [
    {
      title: "The Origin of Bitcoin: A Revolutionary Digital Currency",
      excerpt: "Explore the history of Bitcoin, from Satoshi Nakamoto’s vision to its rise as digital gold.",
      link: "/articles#origin-of-bitcoin",
    },
    {
      title: "Bridging the Gap: How Real World Assets (RWA) Are Transforming Crypto",
      excerpt: "Learn how RWAs are revolutionizing finance by tokenizing real-world assets on the blockchain.",
      link: "/articles#real-world-assets",
    },
    {
      title: "Healthcare Meets Blockchain: Revolutionizing Data Privacy",
      excerpt: "Discover how blockchain is transforming healthcare with secure data and interoperability.",
      link: "/articles#healthcare-blockchain",
    },
    {
      title: "Cryptocurrency as a Global Currency",
      excerpt: "Explore how cryptocurrency can revolutionize global transactions with its decentralized nature.",
      link: "/articles#cryptocurrency-global-currency",
    },
  ];

  // Conditionally render the footer (exclude on /chat)
  const showFooter = pathname !== "/chat";

  return (
    <div className="dashboard-layout">
      <Sidebar ref={sidebarRef} isOpen={sidebarOpen} articles={articles} />
      <div className="main-container" ref={mainContainerRef}>
        <header className="top-header">
          <PriceTicker />
          <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
        </header>
        <main className="dashboard-content">{children}</main>
        {showFooter && (
          <footer className="footer">
            <p>© 2025 CryptoGlobal</p>
            <div className="footer-links">
              <Link href="/privacy-policy" className="footer-link">Privacy Policy</Link>
              <Link href="/about" className="footer-link">About</Link>
              <a href="mailto:cryptoglobalive@gmail.com" className="footer-link">
                cryptoglobalive@gmail.com
              </a>
            </div>
          </footer>
        )}
      </div>
      <Analytics />
    </div>
  );
}