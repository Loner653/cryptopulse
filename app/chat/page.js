"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [isConnected, setIsConnected] = useState(true);
    const [retryCount, setRetryCount] = useState(0);
    const messagesEndRef = useRef(null);
    const chatMessagesRef = useRef(null);
    const eventSourceRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch("/api/auth/check", { credentials: "include" });
            if (res.ok) {
                const { userId, username } = await res.json();
                setUserId(userId || 1);
                setUsername(username || "Guest");
            } else {
                setError("Please log in to chat");
                router.push("/login");
            }
        };
        fetchUser();
    }, [router]);

    const fetchMessagesFallback = async () => {
        try {
            const res = await fetch("/api/chat");
            if (res.ok) {
                const allMessages = await res.json();
                setMessages(allMessages);
                setError("");
                setRetryCount(0);
                setIsConnected(true);
                console.log("Fallback fetch at:", new Date().toISOString(), "Messages:", allMessages.length);
            } else {
                throw new Error("Fallback fetch failed");
            }
        } catch (err) {
            console.error("Fallback error:", err);
            setError("Reconnecting...");
        }
    };

    useEffect(() => {
        if (!userId) return;

        const isLocal = window.location.hostname === "localhost";
        const apiUrl = isLocal ? "http://localhost:3000/api/chat" : "/api/chat";
        console.log("SSE setup for user:", userId, "URL:", apiUrl);

        const connectSSE = () => {
            console.log("SSE connecting at:", new Date().toISOString());
            const eventSource = new EventSource(apiUrl, { withCredentials: false });
            eventSourceRef.current = eventSource;

            eventSource.onopen = () => {
                console.log("SSE opened at:", new Date().toISOString());
                setIsConnected(true);
                setError("");
                setRetryCount(0);
            };

            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log("SSE message at:", new Date().toISOString(), "Type:", data.type, "Count:", data.messages?.length || 0);
                if (data.type === "initial") {
                    setMessages(data.messages);
                } else if (data.type === "new") {
                    setMessages((prev) => {
                        const newMessages = data.messages.filter(
                            (newMsg) => !prev.some((msg) => msg.id === newMsg.id)
                        );
                        return [...prev, ...newMessages];
                    });
                } else if (data.type === "error") {
                    setError(data.message);
                    console.log("Server error:", data.message);
                }
            };

            eventSource.onerror = (err) => {
                console.error("SSE error at:", new Date().toISOString(), "Details:", err);
                setIsConnected(false);
                eventSource.close();
                setRetryCount((prev) => prev + 1);
                if (retryCount >= 3) {
                    console.log("Switching to fallback after", retryCount, "retries");
                    fetchMessagesFallback();
                    setTimeout(connectSSE, 3000); // Slower retry after fallback
                } else {
                    setError(retryCount > 1 ? "Reconnecting..." : ""); // Hide error initially
                    setTimeout(connectSSE, 1500); // 1.5s retry
                }
            };
        };

        connectSSE();

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                console.log("SSE cleanup at:", new Date().toISOString());
            }
        };
    }, [userId, retryCount]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim() || !userId) return;

        const isLocal = window.location.hostname === "localhost";
        const apiUrl = isLocal ? "http://localhost:3000/api/chat" : "/api/chat";
        console.log("Sending message at:", new Date().toISOString(), "From:", window.location.hostname, "Text:", text);

        try {
            const startTime = Date.now();
            const res = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, userId }),
            });
            const endTime = Date.now();
            console.log("POST completed at:", new Date().toISOString(), "Took:", endTime - startTime, "ms", "Status:", res.status);
            if (!res.ok) throw new Error("Failed to send message");
            setText("");
        } catch (err) {
            setError(err.message);
            console.error("Send error at:", new Date().toISOString(), "Details:", err);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        router.push("/login");
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Chat Room</h2>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>
            <p className="chat-intro">Welcome, {username}! Start chatting below.</p>
            {error && <p className="error">{error}</p>}
            {!isConnected && !error && <p className="status">Reconnecting...</p>}
            <div className="chat-messages" ref={chatMessagesRef}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`chat-message ${msg.userId === userId ? "own-message" : "other-message"}`}
                    >
                        <span className="chat-sender">{msg.username}</span>
                        <span className="chat-text">{msg.text}</span>
                        <span className="chat-timestamp">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="chat-form">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="chat-input"
                    disabled={!userId}
                />
                <button type="submit" className="chat-button" disabled={!userId}>
                    Send
                </button>
            </form>
        </div>
    );
}
