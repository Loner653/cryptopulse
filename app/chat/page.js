// app/chat/page.js
"use client";

import { useState, useEffect } from "react";
import styles from "./chat.module.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    console.log("Fetching initial messages...");
    fetch("/api/chat")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched messages:", data);
        setMessages(data);
      })
      .catch((err) => console.error("Failed to fetch messages:", err));
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      };
      console.log("Sending message:", message);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(message),
        });
        console.log("Response status:", res.status);
        if (res.ok) {
          const updatedRes = await fetch("/api/chat");
          const updatedData = await updatedRes.json();
          setMessages(updatedData);
          setNewMessage("");
        } else {
          console.error("POST failed with status:", res.status);
        }
      } catch (err) {
        console.error("Failed to send message:", err);
      }
    }
  };

  return (
    <div className={styles.chatContainer}>
      <h1 className={styles.chatTitle}>Community Chat</h1>
      <p className={styles.chatIntro}>
        Join the conversation! Chat with users worldwide—messages are public and permanent.
      </p>
      <div className={styles.messageList}>
        {messages.map((msg) => (
          <div key={msg.id} className={styles.messageItem}>
            <span className={styles.messageText}>{msg.text}</span>
            <span className={styles.messageTimestamp}>{msg.timestamp}</span>
          </div>
        ))}
      </div>
      <div className={styles.chatInput}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type your message..."
          className={styles.inputField}
        />
        <button onClick={handleSendMessage} className={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
}