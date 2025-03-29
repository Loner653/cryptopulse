// app/chat/page.js
"use client";

import { useState, useEffect } from "react";
import io from "socket.io-client";
import styles from "./chat.module.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:4000"); // Connect to WebSocket server
    setSocket(newSocket);

    newSocket.on("initialMessages", (data) => {
      setMessages(data);
    });

    newSocket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => newSocket.disconnect(); // Cleanup on unmount
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() && socket) {
      const message = {
        id: Date.now(),
        text: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      };
      socket.emit("sendMessage", message);
      setNewMessage("");
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
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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