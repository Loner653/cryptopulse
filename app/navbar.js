"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    // Check login status (replace with your actual auth logic)
    useEffect(() => {
        const checkLogin = async () => {
            // Example: Check cookie or fetch user session
            const res = await fetch("/api/auth/check", { credentials: "include" });
            if (res.ok) setIsLoggedIn(true);
        };
        checkLogin();
    }, []);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        setIsLoggedIn(false);
        router.push("/login");
    };

    return (
        <nav className="navbar">
            <h1 className="navbar-title">Welcome to CryptoGlobal</h1>
            <ul className="nav-list">
                <li>
                     <Link href="/news" className="nav-link">
                        News
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
                     <Link href="/chat" className="nav-link chat-link">
                        <span className="nav-icon">💬</span> Chat
                    </Link>
                </li>
                {!isLoggedIn ? (
                    <>
                        <li>
                        </li>
                    </>
                ) : (
                    <li>
                        <button onClick={handleLogout} className="logout-button nav-link">
                            Logout
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
}