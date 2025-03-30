"use client";

import { useState, useEffect } from "react";
import styles from "./chat.module.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    console.log("Getting messages...");
    fetch("/api/chat")
      .then((res) => {
        if (!res.ok) {
          console.log("Fetch didn’t work:", res.status);
          throw new Error("Fetch failed");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Here are the messages:", data);
        setMessages(data);
      })
      .catch((err) => console.log("Error:", err));
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const message = {
        text: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      };
      console.log("Sending this:", message);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(message),
        });
        if (!res.ok) {
          console.log("Send didn’t work:", res.status);
          throw new Error("Send failed");
        }
        const updatedRes = await fetch("/api/chat");
        const updatedData = await updatedRes.json();
        setMessages(updatedData);
        setNewMessage("");
        console.log("Sent it!");
      } catch (err) {
        console.log("Send error:", err);
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