"use client"

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import styles from "./page.module.css";
import Navbar from "../navbar";
import Sidebar from "../sidebar";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [userProfiles, setUserProfiles] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chatRoomId = "general";
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const channelRef = useRef(null);
  const sidebarRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const setFixedDimensions = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      document.documentElement.style.setProperty("--fixed-height", `${vh}px`);
      document.documentElement.style.setProperty("--fixed-width", `${vw}px`);
      document.body.style.width = `${vw}px`;
      document.body.style.height = `${vh}px`;
    };

    setFixedDimensions();
    window.addEventListener("resize", setFixedDimensions);
    window.addEventListener("orientationchange", setFixedDimensions);

    return () => {
      window.removeEventListener("resize", setFixedDimensions);
      window.removeEventListener("orientationchange", setFixedDimensions);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        router.push("/auth");
      } else {
        setUser(user);
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("username, banned")
          .eq("id", user.id)
          .single();

        if (profileError || !profile) {
          setShowUsernamePrompt(true);
        } else if (profile.banned) {
          alert("You are banned from this chat.");
          await supabase.auth.signOut();
          router.push("/auth");
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

    channelRef.current = supabase.channel(`chat:${chatRoomId}`, {
      config: {
        broadcast: { ack: true },
      },
    });

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
          setMessages((prevMessages) => {
            const uniqueMessages = prevMessages.filter(
              (msg) =>
                msg.id !== payload.new.id &&
                (typeof msg.id === "string" ? !msg.id.startsWith("temp-") : true)
            );
            console.log("Real-time message received:", payload.new);
            return [...uniqueMessages, payload.new];
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
          console.log("Delete event received:", payload);
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== payload.old.id)
          );
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
        if (status === "SUBSCRIBED") {
          console.log("Successfully subscribed to real-time updates");
        } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          console.error("Subscription failed or closed:", status);
        }
      });

    return () => {
      if (channelRef.current) {
        console.log("Cleaning up subscription...");
        channelRef.current.unsubscribe().then(() => {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }).catch((err) => {
          console.error("Error during unsubscribe:", err);
        });
      }
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        e.preventDefault();
        router.push("/admin");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const badWords = ["badword1", "badword2", "badword3"];
  const filterBadWords = (text) => {
    let filteredText = text;
    badWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      filteredText = filteredText.replace(regex, "****");
    });
    return filteredText;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const uploadFile = async () => {
    if (!file) return null;

    if (!(file instanceof File)) {
      console.error("Selected file is not a valid File object:", file);
      return null;
    }

    console.log("Uploading file:", { name: file.name, type: file.type, size: file.size });

    const fileExt = file.name.split(".").pop().toLowerCase();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${chatRoomId}/${fileName}`;

    try {
      const { data, error } = await supabase.storage
        .from("chat-files")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Detailed error uploading file:", error.message || error);
        return null;
      }

      const { data: publicUrlData } = supabase.storage
        .from("chat-files")
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        console.error("Failed to get public URL for file:", filePath);
        return null;
      }

      let fileType;
      if (file.type.startsWith("image")) {
        fileType = "image";
      } else if (file.type.startsWith("video") || ["mp4", "mov", "webm"].includes(fileExt)) {
        fileType = "video";
      } else if (
        file.type === "application/pdf" ||
        file.type.includes("msword") ||
        file.type.includes("officedocument") ||
        ["pdf", "doc", "docx"].includes(fileExt)
      ) {
        fileType = "document";
      } else {
        fileType = "unknown";
      }

      console.log("File upload result:", { url: publicUrlData.publicUrl, type: fileType });

      return {
        url: publicUrlData.publicUrl,
        type: fileType,
      };
    } catch (err) {
      console.error("Unexpected error during file upload:", err);
      return null;
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !file) return;

    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      id: tempId,
      chat_room_id: chatRoomId,
      user_id: user.id,
      text: newMessage.trim() || (file ? "Uploading file..." : ""),
      file_url: null,
      file_type: null,
      reply_to_id: replyingTo?.id || null,
      created_at: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, tempMessage]);

    let fileData = null;
    if (file) {
      fileData = await uploadFile();
      if (!fileData || !fileData.type) {
        alert("Failed to upload file or determine file type. Check console for details.");
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== tempId));
        return;
      }
    }

    const filteredMessage = filterBadWords(newMessage.trim());

    const messageData = {
      chat_room_id: chatRoomId,
      user_id: user.id,
      text: filteredMessage || (fileData ? "Upload complete" : ""),
      file_url: fileData?.url || null,
      file_type: fileData?.type || null,
      reply_to_id: replyingTo?.id || null,
      created_at: new Date().toISOString(),
    };

    console.log("Sending message:", messageData);

    const { error } = await supabase.from("messages").insert(messageData);

    if (error) {
      console.error("Error sending message:", error.message || error);
      alert("Failed to send message. Check console for details.");
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== tempId));
    } else {
      setNewMessage("");
      setFile(null);
      setReplyingTo(null);
    }
  };

  const handleKeyDown = (e) => {
    const isLaptop = window.innerWidth > 768; // Detect laptop vs phone

    if (e.key === "Enter") {
      if (isLaptop && !e.ctrlKey && !e.shiftKey) {
        // On laptops, Enter sends the message (no Ctrl or Shift)
        e.preventDefault();
        handleSendMessage(e);
      } else if (isLaptop && e.ctrlKey && e.shiftKey) {
        // On laptops, Ctrl + Shift + Enter adds a new line
        e.preventDefault();
        setNewMessage((prev) => prev + "\n");
      } else if (!isLaptop) {
        // On phones, Enter adds a new line (no sending)
        e.preventDefault();
        setNewMessage((prev) => prev + "\n");
      }
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (typeof messageId === "string" && messageId.startsWith("temp-")) {
      const tempMessage = messages.find((msg) => msg.id === messageId);
      if (tempMessage && tempMessage.user_id === user.id) {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== messageId)
        );
        console.log("Deleted temporary message:", messageId);
        return;
      } else {
        alert("You can only delete your own temporary messages.");
        return;
      }
    }

    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", messageId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message. You can only delete your own messages.");
    } else {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );
    }
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
      console.log("Unsubscribing channel during logout...");
      await channelRef.current.unsubscribe().catch((err) => {
        console.error("Error unsubscribing during logout:", err);
      });
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const handleReply = (message) => {
    setReplyingTo(message);
    document.querySelector(`.${styles.messageInput}`).focus();
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const renderFileContent = (fileUrl, fileType) => {
    console.log("Rendering file content:", { fileUrl, fileType });

    if (!fileUrl) {
      console.warn("renderFileContent called with null fileUrl");
      return <div className={styles.fileWrapper}>File unavailable</div>;
    }

    const safeFileType = fileType || "unknown";

    switch (safeFileType) {
      case "image":
        return (
          <div className={styles.fileWrapper}>
            <img
              src={fileUrl}
              alt="Uploaded image"
              className={styles.uploadedImage}
            />
            <a href={fileUrl} download className={styles.downloadButton}>
              Download
            </a>
          </div>
        );
      case "video":
        const videoMimeType = fileUrl.endsWith(".mp4")
          ? "video/mp4"
          : fileUrl.endsWith(".webm")
          ? "video/webm"
          : fileUrl.endsWith(".mov")
          ? "video/quicktime"
          : "video/mp4";
        return (
          <div className={styles.fileWrapper}>
            <video controls className={styles.uploadedVideo}>
              <source src={fileUrl} type={videoMimeType} />
              Your browser does not support the video tag.
            </video>
            <a href={fileUrl} download className={styles.downloadButton}>
              Download
            </a>
          </div>
        );
      case "document":
        return (
          <div className={styles.fileWrapper}>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              View Document
            </a>
            <br />
            <a href={fileUrl} download className={styles.downloadButton}>
              Download
            </a>
          </div>
        );
      case "unknown":
      default:
        return (
          <div className={styles.fileWrapper}>
            <a href={fileUrl} download className={styles.downloadButton}>
              Download Unknown File
            </a>
          </div>
        );
    }
  };

  const renderFilePreview = () => {
    if (!file) return null;
    const fileUrl = URL.createObjectURL(file);
    return (
      <div className={styles.filePreview}>
        {file.type.startsWith("image") ? (
          <img src={fileUrl} alt="Preview" className={styles.filePreviewImage} />
        ) : file.type.startsWith("video") ? (
          <video src={fileUrl} className={styles.filePreviewVideo} />
        ) : (
          <span>{file.name}</span>
        )}
      </div>
    );
  };

  const renderMessage = (message) => {
    const isOwnMessage = message.user_id === user.id;
    const repliedMessage = message.reply_to_id
      ? messages.find((m) => m.id === message.reply_to_id)
      : null;

    return (
      <div
        key={message.id}
        className={`${styles.messageContainer} ${
          isOwnMessage ? styles.messageSent : styles.messageReceived
        } ${message.is_broadcast ? styles.broadcastMessage : ""}`}
      >
        <div className={styles.message}>
          {repliedMessage && (
            <div className={styles.replyPreview}>
              <span className={styles.replyUser}>
                {userProfiles[repliedMessage.user_id] || "Unknown User"}
              </span>
              <p>{repliedMessage.text.substring(0, 50)}...</p>
            </div>
          )}
          <span className={styles.user}>
            {isOwnMessage ? "You" : userProfiles[message.user_id] || "Unknown User"}
          </span>
          <p>{message.text}</p>
          {message.file_url && (
            <div className={styles.fileContent}>
              {renderFileContent(message.file_url, message.file_type)}
            </div>
          )}
          <span className={styles.timestamp}>
            {new Date(message.created_at).toLocaleTimeString()}
          </span>
          <div className={styles.messageActions}>
            <button
              onClick={() => handleReply(message)}
              className={styles.replyButton}
            >
              Reply
            </button>
            {isOwnMessage && (
              <button
                onClick={() => handleDeleteMessage(message.id)}
                className={styles.deleteButton}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!user) return null;

  return (
    <div className={`${styles.container} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
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
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} articles={[]} ref={sidebarRef} />
      <button onClick={handleLogout} className={styles.stickyLogoutButton}>
        Log Out
      </button>
      <div className={styles.chatContainer}>
        <div className={styles.messages} ref={messagesContainerRef}>
          {messages.map(renderMessage)}
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
        {replyingTo && (
          <div className={styles.replyPreviewContainer}>
            <div className={styles.replyPreview}>
              <span className={styles.replyUser}>
                {userProfiles[replyingTo.user_id] || "Unknown User"}
              </span>
              <p>{replyingTo.text}</p>
            </div>
            <button onClick={cancelReply} className={styles.cancelReplyButton}>
              ×
            </button>
          </div>
        )}
        <form onSubmit={handleSendMessage} className={styles.messageForm}>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className={styles.messageInput}
            rows="1"
          />
          <div className={styles.fileInputWrapper}>
            <input
              type="file"
              onChange={handleFileChange}
              className={styles.fileInput}
              accept="image/*,video/*,application/pdf,.doc,.docx"
            />
            {renderFilePreview()}
          </div>
          <button type="submit" className={styles.sendButton}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}