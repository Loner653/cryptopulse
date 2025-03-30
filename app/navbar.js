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
            try {
                const res = await fetch("/api/auth/check", { credentials: "include" });
                if (res.ok) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Error checking login status:", error);
                setIsLoggedIn(false);
            }
        };
        checkLogin();
    }, []);

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            if (res.ok) {
                setIsLoggedIn(false);
                router.push("/login");
            } else {
                console.error("Logout failed:", res.statusText);
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    // Example of programmatically triggering logout based on a condition
    useEffect(() => {
        if (isLoggedIn) {
            // Replace this condition with your actual logout trigger
            const shouldLogout = false; // Example condition
            if (shouldLogout) {
                handleLogout();
            }
        }
    }, [isLoggedIn]);

    return (
        <nav className="navbar">
            <h1 className="navbar-title">Welcome to CryptoGlobal</h1>
            <ul className="nav-list">
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
            </ul>
        </nav>
    );
}
