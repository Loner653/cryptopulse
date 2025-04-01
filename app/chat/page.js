'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import styles from './page.module.css';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatRoomId = 'general'; // Hardcoded chat room for now
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollButton(false);
  };

  // Check if user is authenticated
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
      } else {
        setUser(user);
      }
    };

    fetchUser();
  }, [router]);

  // Fetch initial messages
  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_room_id', chatRoomId)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data);
      }
    };

    fetchMessages();
  }, [user, chatRoomId]);

  // Subscribe to new messages
  useEffect(() => {
    if (!user) return;

    console.log('Setting up real-time subscription for chat_room_id:', chatRoomId);

    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_room_id=eq.${chatRoomId}`,
        },
        (payload) => {
          console.log('New message received:', payload);
          setMessages((prevMessages) => [...prevMessages, payload.new]);
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Unsubscribing from real-time channel');
      channel.unsubscribe();
    };
  }, [user, chatRoomId]);

  // Auto-scroll when messages update, unless user has scrolled up
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

  // Handle scroll to show/hide scroll-to-bottom button
  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (!messagesContainer) return;

    const handleScroll = () => {
      const isScrolledToBottom =
        messagesContainer.scrollHeight - messagesContainer.scrollTop <=
        messagesContainer.clientHeight + 50;
      setShowScrollButton(!isScrolledToBottom);
    };

    messagesContainer.addEventListener('scroll', handleScroll);
    return () => messagesContainer.removeEventListener('scroll', handleScroll);
  }, []);

  // Bad word filter
  const badWords = ['badword1', 'badword2', 'badword3']; // Replace with actual bad words
  const filterBadWords = (text) => {
    let filteredText = text;
    badWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      filteredText = filteredText.replace(regex, '****');
    });
    return filteredText;
  };

  // Send a message with bad word filtering
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const filteredMessage = filterBadWords(newMessage.trim());

    const messageData = {
      chat_room_id: chatRoomId,
      user_id: user.id,
      text: filteredMessage,
    };

    const { error } = await supabase
      .from('messages')
      .insert(messageData);

    if (error) {
      console.error('Error sending message:', error);
    } else {
      console.log('Message sent:', messageData);
      setNewMessage('');
    }
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  if (!user) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Crypto Chat</h1>
      </div>
      <button onClick={handleLogout} className={styles.stickyLogoutButton}>
        Log Out
      </button>
      <div className={styles.welcomeSection}>
        <h2 className={styles.welcomeTitle}>Welcome to the CryptoGlobal Community Chat! 🚀</h2>
        <p className={styles.welcomeMessage}>
          This chat is a space for us to learn, share, and grow together in the world of crypto. Please keep conversations respectful and constructive—no bad language or misconduct. Let’s make this a positive learning environment for everyone!
        </p>
      </div>
      <div className={styles.chatContainer}>
        <div className={styles.messages} ref={messagesContainerRef}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.messageContainer} ${
                message.user_id === user.id ? styles.messageSent : styles.messageReceived
              } ${styles.messageFadeIn}`}
            >
              <div className={styles.message}>
                <span className={styles.user}>
                  {message.user_id === user.id ? 'You' : message.user_id}
                </span>
                <p>{message.text}</p>
                <span className={styles.timestamp}>
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
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