"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";

export default function AdminDashboard() {
    const [messages, setMessages] = useState([]);
    const router = useRouter();

    // Redirect if not logged in
    useEffect(() => {
        const isLoggedIn = localStorage.getItem("admin_logged_in") === "true";
        console.log("Checking login status:", isLoggedIn);
        if (!isLoggedIn) {
            router.push("/admin/login");
        }
    }, [router]);

    // Fetch chat messages
    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await fetch("/api/chat");
            if (!res.ok) {
                throw new Error("Failed to fetch messages");
            }
            const data = await res.json();
            setMessages(data);
        } catch (err) {
            console.log("Fetch error:", err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const adminToken = localStorage.getItem("admin_logged_in");
            const res = await fetch(`/api/chat?id=${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-Admin-Token": adminToken, // Send admin token
                },
            });
            if (!res.ok) {
                throw new Error("Failed to delete message");
            }
            fetchMessages(); // Refresh after delete
        } catch (err) {
            console.log("Delete error:", err.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("admin_logged_in");
        router.push("/admin/login");
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Admin Dashboard</h1>
            <p className={styles.welcome}>Welcome to the admin panel!</p>

            <div className={styles.messageList}>
                <h2 className={styles.subtitle}>Chat Messages</h2>
                {messages.length === 0 ? (
                    <p>No messages yet.</p>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={styles.messageItem}>
                            <span className={styles.messageText}>{msg.text}</span>
                            <span className={styles.messageTimestamp}>{msg.timestamp}</span>
                            <button
                                onClick={() => handleDelete(msg.id)}
                                className={styles.deleteButton}
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>

            <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
            </button>
        </div>
    );
}