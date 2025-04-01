"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import styles from "./page.module.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [userProfiles, setUserProfiles] = useState({});
  const chatRoomId = "general";
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const channelRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push("/auth");
      } else {
        setUser(user);
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();

        if (profileError || !profile) {
          setShowUsernamePrompt(true);
        } else {
          setUsername(profile.username);
        }
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          fetchUser();
        } else if (event === "SIGNED_OUT") {
          router.push("/auth");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    const fetchUserProfiles = async () => {
      const userIds = [...new Set(messages.map((msg) => msg.user_id))];
      if (userIds.length === 0) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", userIds);

      if (error) {
        console.error("Error fetching user profiles:", error);
        return;
      }

      const profiles = data.reduce((acc, profile) => {
        acc[profile.id] = profile.username;
        return acc;
      }, {});

      setUserProfiles(profiles);
    };

    fetchUserProfiles();
  }, [messages]);

  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_room_id", chatRoomId)
        .order("created_at", { ascending: true })
        .limit(50);

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(data);
      }
    };

    fetchMessages();
  }, [user, chatRoomId]);

  useEffect(() => {
    if (!user || channelRef.current) return;

    console.log("Initializing channel for chat_room_id:", chatRoomId);

    channelRef.current = supabase.channel(`chat:${chatRoomId}`);

    channelRef.current
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_room_id=eq.${chatRoomId}`,
        },
        (payload) => {
          console.log("Received INSERT payload:", payload);
          setMessages((prevMessages) => {
            if (prevMessages.some((msg) => msg.id === payload.new.id)) {
              return prevMessages;
            }
            return [...prevMessages, payload.new];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "messages",
          filter: `chat_room_id=eq.${chatRoomId}`,
        },
        (payload) => {
          console.log("Received DELETE payload:", payload);
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== payload.old.id)
          );
        }
      )
      .subscribe((status) => {
        console.log("Channel subscription status:", status);
        if (status === "SUBSCRIBED") {
          console.log("Successfully subscribed to channel");
        } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          console.log("Channel status changed:", status);
        }
      });

    return () => {
      console.log("Component unmounting, leaving channel active");
    };
  }, [user, chatRoomId]);

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (!messagesContainer) return;

    const isScrolledToBottom =
      messagesContainer.scrollHeight - messagesContainer.scrollTop <=
      messagesContainer.clientHeight + 50;

    if (isScrolledToBottom) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (!messagesContainer) return;

    const handleScroll = () => {
      const isScrolledToBottom =
        messagesContainer.scrollHeight - messagesContainer.scrollTop <=
        messagesContainer.clientHeight + 50;
      setShowScrollButton(!isScrolledToBottom);
    };

    messagesContainer.addEventListener("scroll", handleScroll);
    return () => messagesContainer.removeEventListener("scroll", handleScroll);
  }, []);

  const badWords = ["badword1", "badword2", "badword3"];
  const filterBadWords = (text) => {
    let filteredText = text;
    badWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      filteredText = filteredText.replace(regex, "****");
    });
    return filteredText;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const filteredMessage = filterBadWords(newMessage.trim());

    const messageData = {
      chat_room_id: chatRoomId,
      user_id: user.id,
      text: filteredMessage,
    };

    const { error } = await supabase.from("messages").insert(messageData);

    if (error) {
      console.error("Error sending message:", error);
    } else {
      setNewMessage("");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", messageId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message. You can only delete your own messages.");
      return;
    }

    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg.id !== messageId)
    );
    console.log(`Message ${messageId} deleted locally`);
    // No broadcast needed; DELETE event handles it
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, username: username.trim() });

    if (error) {
      console.error("Error setting username:", error);
      alert("Failed to set username. It may already be taken.");
    } else {
      setShowUsernamePrompt(false);
    }
  };

  const handleLogout = async () => {
    if (channelRef.current) {
      await channelRef.current.unsubscribe();
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      console.log("Channel unsubscribed and removed during logout");
    }
    await supabase.auth.signOut();
    router.push("/auth");
  };

  if (!user) return null;

  return (
    <div className={styles.container}>
      {showUsernamePrompt && (
        <div className={styles.usernameModal}>
          <form onSubmit={handleUsernameSubmit} className={styles.usernameForm}>
            <h2>Choose a Username</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className={styles.usernameInput}
              required
            />
            <button type="submit" className={styles.usernameSubmitButton}>
              Save
            </button>
          </form>
        </div>
      )}
      <button onClick={handleLogout} className={styles.stickyLogoutButton}>
        Log Out
      </button>
      <div className={styles.chatContainer}>
        <div className={styles.messages} ref={messagesContainerRef}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.messageContainer} ${
                message.user_id === user.id
                  ? styles.messageSent
                  : styles.messageReceived
              } ${styles.messageFadeIn}`}
            >
              <div className={styles.message}>
                <span className={styles.user}>
                  {message.user_id === user.id
                    ? "You"
                    : userProfiles[message.user_id] || "Unknown User"}
                </span>
                <p>{message.text}</p>
                <span className={styles.timestamp}>
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
                {message.user_id === user.id && (
                  <button
                    onClick={() => handleDeleteMessage(message.id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className={styles.scrollButton}
            aria-label="Scroll to bottom"
          >
            ↓
          </button>
        )}
        <form onSubmit={handleSendMessage} className={styles.messageForm}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className={styles.messageInput}
          />
          <button type="submit" className={styles.sendButton}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}