// app/admin/manage-users/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase"; // Corrected path for subpage
import styles from "../page.module.css";

export default function ManageUsers() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push("/auth");
      } else {
        setUser(user);
        fetchUsers();
      }
    };
    checkUser();
  }, [router]);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, banned")
      .order("username", { ascending: true });

    if (error) {
      console.error("Error fetching users:", error.message || error);
    } else {
      setUsers(data);
    }
  };

  const handleSelectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((u) => u.id));
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleDeleteUsers = async () => {
    if (!confirm("Are you sure you want to delete these users?")) return;

    const { error } = await supabase
      .from("profiles")
      .delete()
      .in("id", selectedUsers);

    if (error) {
      console.error("Error deleting users:", error.message || error);
      alert("Failed to delete users.");
    } else {
      setUsers((prev) => prev.filter((u) => !selectedUsers.includes(u.id)));
      setSelectedUsers([]);
    }
  };

  const handleBanUsers = async () => {
    if (!confirm("Are you sure you want to ban these users?")) return;

    const { error } = await supabase
      .from("profiles")
      .update({ banned: true })
      .in("id", selectedUsers);

    if (error) {
      console.error("Error banning users:", error.message || error);
      alert("Failed to ban users.");
    } else {
      setUsers((prev) =>
        prev.map((u) => (selectedUsers.includes(u.id) ? { ...u, banned: true } : u))
      );
      setSelectedUsers([]);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  if (!user) return null;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manage Users</h1>
      <button onClick={handleLogout} className={styles.stickyLogoutButton}>
        Log Out
      </button>
      <button onClick={() => router.push("/admin")} className={styles.backButton}>
        Back to Dashboard
      </button>

      <div className={styles.actions}>
        <button onClick={handleSelectAllUsers} className={styles.actionButton}>
          {selectedUsers.length === users.length ? "Deselect All Users" : "Select All Users"}
        </button>
        <button
          onClick={handleDeleteUsers}
          className={styles.actionButton}
          disabled={selectedUsers.length === 0}
        >
          Delete Selected Users
        </button>
        <button
          onClick={handleBanUsers}
          className={styles.actionButton}
          disabled={selectedUsers.length === 0}
        >
          Ban Selected Users
        </button>
      </div>
      <ul className={styles.userList}>
        {users.map((u) => (
          <li key={u.id} className={u.banned ? styles.bannedUser : ""}>
            <input
              type="checkbox"
              checked={selectedUsers.includes(u.id)}
              onChange={() => handleSelectUser(u.id)}
            />
            {u.username} {u.banned ? "(Banned)" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}