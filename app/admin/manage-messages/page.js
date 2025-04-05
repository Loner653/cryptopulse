// app/admin/manage-messages/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase"; // Corrected path for subpage
import styles from "../page.module.css";

export default function ManageMessages() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [expandedMessages, setExpandedMessages] = useState(new Set());
  const router = useRouter();
  const chatRoomId = "general";

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push("/auth");
      } else {
        setUser(user);
        fetchMessages();
      }
    };
    checkUser();
  }, [router]);

  const fetchMessages = async () => {
    const { data: messagesData, error: messagesError } = await supabase
      .from("messages")
      .select("id, text, user_id, created_at")
      .eq("chat_room_id", chatRoomId)
      .order("created_at", { ascending: false })
      .limit(100);

    if (messagesError) {
      console.error("Error fetching messages:", messagesError.message || messagesError);
      return;
    }

    const userIds = [...new Set(messagesData.map((m) => m.user_id))];
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", userIds);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError.message || profilesError);
      return;
    }

    const profilesMap = new Map(profilesData.map((p) => [p.id, p.username]));
    const enrichedMessages = messagesData.map((m) => ({
      ...m,
      profiles: { username: profilesMap.get(m.user_id) || "Unknown User" },
    }));

    setMessages(enrichedMessages);
  };

  const handleSelectAllMessages = () => {
    if (selectedMessages.length === messages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(messages.map((m) => m.id));
    }
  };

  const handleSelectMessage = (messageId) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId) ? prev.filter((id) => id !== messageId) : [...prev, messageId]
    );
  };

  const toggleMessageExpand = (messageId) => {
    setExpandedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const handleDeleteMessages = async () => {
    if (!confirm("Are you sure you want to delete these messages?")) return;

    const { error } = await supabase
      .from("messages")
      .delete()
      .in("id", selectedMessages);

    if (error) {
      console.error("Error deleting messages:", error.message || error);
      alert("Failed to delete messages.");
    } else {
      setMessages((prev) => prev.filter((m) => !selectedMessages.includes(m.id)));
      setSelectedMessages([]);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  if (!user) return null;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manage Messages</h1>
      <button onClick={handleLogout} className={styles.stickyLogoutButton}>
        Log Out
      </button>
      <button onClick={() => router.push("/admin")} className={styles.backButton}>
        Back to Dashboard
      </button>

      <div className={styles.actions}>
        <button onClick={handleSelectAllMessages} className={styles.actionButton}>
          {selectedMessages.length === messages.length ? "Deselect All Messages" : "Select All Messages"}
        </button>
        <button
          onClick={handleDeleteMessages}
          className={styles.actionButton}
          disabled={selectedMessages.length === 0}
        >
          Delete Selected Messages
        </button>
      </div>
      <ul className={styles.messageList}>
        {messages.map((m) => (
          <li key={m.id} className={expandedMessages.has(m.id) ? styles.expanded : ""}>
            <input
              type="checkbox"
              checked={selectedMessages.includes(m.id)}
              onChange={() => handleSelectMessage(m.id)}
            />
            <div className={styles.messageContent}>
              <span className={styles.messageSender}>
                {m.profiles?.username || "Unknown User"}
              </span>
              <span className={styles.messageText}>{m.text}</span>
              <span className={styles.messageTimestamp}>
                {new Date(m.created_at).toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => toggleMessageExpand(m.id)}
              className={styles.expandButton}
            >
              {expandedMessages.has(m.id) ? "Collapse" : "Expand"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}