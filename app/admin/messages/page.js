"use client";
import { useState, useEffect } from "react";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);

  // Fetch messages from the database
  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await fetch("/api/admin/messages"); // API route for admin
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }
    fetchMessages();
  }, []);

  // Delete message function
  async function deleteMessage(id) {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessages(messages.filter((msg) => msg.id !== id));
      } else {
        console.error("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Messages</h1>
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">User</th>
              <th className="border p-2">Message</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id} className="border">
                <td className="border p-2">{msg.id}</td>
                <td className="border p-2">{msg.username || "Anonymous"}</td>
                <td className="border p-2">{msg.text}</td>
                <td className="border p-2">
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
