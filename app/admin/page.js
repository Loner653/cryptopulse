// app/admin/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase"; // Corrected path
import styles from "./page.module.css";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push("/auth");
      } else {
        setUser(user);
      }
    };
    checkUser();
  }, [router]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password!");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  if (!user) return null;

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <form onSubmit={handlePasswordSubmit} className={styles.passwordForm}>
          <h2 className={styles.subtitle}>Enter Moderator Password</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={styles.passwordInput}
            required
          />
          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Moderator Dashboard</h1>
      <button onClick={handleLogout} className={styles.stickyLogoutButton}>
        Log Out
      </button>
      <button onClick={() => router.push("/chat")} className={styles.backButton}>
        Back to Chat
      </button>

      <div className={styles.links}>
        <button
          onClick={() => router.push("/admin/manage-users")}
          className={styles.linkButton}
        >
          Manage Users
        </button>
        <button
          onClick={() => router.push("/admin/manage-messages")}
          className={styles.linkButton}
        >
          Manage Messages
        </button>
        <button
          onClick={() => router.push("/admin/broadcast")}
          className={styles.linkButton}
        >
          Broadcast Message
        </button>
      </div>
    </div>
  );
}