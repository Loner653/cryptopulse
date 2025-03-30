"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css"; // Use your CSS module instead of Tailwind

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });

        const data = await res.json();
        if (data.success) {
            localStorage.setItem("admin_logged_in", "true"); // Set the flag
            router.push("/admin/dashboard"); // Redirect to dashboard
        } else {
            setError("Invalid password!");
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleLogin} className={styles.form}>
                <h2 className={styles.title}>Admin Login</h2>
                {error && <p className={styles.error}>{error}</p>}
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Admin Password"
                    className={styles.input}
                />
                <button type="submit" className={styles.loginButton}>
                    Login
                </button>
            </form>
        </div>
    );
}