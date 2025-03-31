"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    // Assuming the sidebar has a class of 'sidebar' and toggles with 'open'
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      sidebar.classList.toggle("open");
    }
  };

  return (
    <nav className="navbar">
      <h1 className="title">Welcome to CryptoGlobal</h1>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>
      <ul className="navList">
        <li>
          <Link href="/history" className="navLink">
            History
          </Link>
        </li>
        <li>
          <Link href="/analytics" className="navLink">
            Analytics
          </Link>
        </li>
        <li>
          <Link href="/news" className="navLink">
            <span className="nav-icon">💬</span> News
          </Link>
        </li>
      </ul>
    </nav>
  );
}