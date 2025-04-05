// app/admin/broadcast/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase"; // Corrected path for subpage
import styles from "../page.module.css";

export default function Broadcast() {
  const [user, setUser] = useState(null);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const router = useRouter();
  const chatRoomId = "general";

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

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    const { error } = await supabase.from("messages").insert({
      chat_room_id: chatRoomId,
      user_id: user.id,
      text: `[BROADCAST] ${broadcastMessage}`,
      is_broadcast: true,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error sending broadcast:", error.message || error);
      alert("Failed to send broadcast.");
    } else {
      setBroadcastMessage("");
      alert("Broadcast sent successfully!");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  if (!user) return null;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Broadcast Message</h1>
      <button onClick={handleLogout} className={styles.stickyLogoutButton}>
        Log Out
      </button>
      <button onClick={() => router.push("/admin")} className={styles.backButton}>
        Back to Dashboard
      </button>

      <form onSubmit={handleBroadcast} className={styles.broadcastForm}>
        <textarea
          value={broadcastMessage}
          onChange={(e) => setBroadcastMessage(e.target.value)}
          placeholder="Type your broadcast message..."
          className={styles.broadcastInput}
          rows="3"
        />
        <button type="submit" className={styles.submitButton}>
          Send Broadcast
        </button>
      </form>
    </div>
  );
}