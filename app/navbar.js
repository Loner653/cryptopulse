"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">Welcome to CryptoGlobal</h1>
      <ul className="nav-list">
        <li>
          <Link href="/articles" className="nav-link">
            Article
          </Link>
        </li>
        <li>
          <Link href="/news" className="nav-link">
            News
          </Link>
        </li>
        <li>
          <Link href="/chart" className="nav-link">
            Chart
          </Link>
        </li>
        <li>
          <Link href="/history" className="nav-link">
            History
          </Link>
        </li>
        <li>
          <Link href="/analytics" className="nav-link">
            Analytics
          </Link>
        </li>
        <li>
          <Link href="/crypto-bot" className="nav-link">
            Crypto Bot
          </Link>
        </li>
      </ul>
    </nav>
  );
}