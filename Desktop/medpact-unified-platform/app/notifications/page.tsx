"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';


export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<{ id: string; message: string; userId?: string }[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/notifications")
      .then(res => res.json())
      .then(data => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load notifications");
        setLoading(false);
      });
  }, []);

  async function addNotification(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), userId: "system" })
      });
      const newNotification = await res.json();
      if (res.ok) {
        setNotifications([newNotification, ...notifications]);
        setMessage("");
        toast.success("Notification added successfully");
      } else {
        setError(newNotification.error || "Failed to add notification");
        toast.error(newNotification.error || "Failed to add notification");
      }
    } catch {
      setError("Failed to add notification");
      toast.error("Failed to add notification");
    }
    setLoading(false);
  }

  async function deleteNotification(id: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setNotifications(notifications.filter(n => n.id !== id));
        toast.success("Notification deleted successfully");
      } else {
        setError(result.error || "Failed to delete notification");
        toast.error(result.error || "Failed to delete notification");
      }
    } catch {
      setError("Failed to delete notification");
      toast.error("Failed to delete notification");
    }
    setLoading(false);
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-4">Notifications</h1>
      <p className="mb-6 text-gray-700 dark:text-gray-300">Manage system and user notifications below.</p>
      <form onSubmit={addNotification} className="flex flex-col md:flex-row gap-2 mb-6" aria-label="Add notification">
        <label htmlFor="notificationMessage" className="sr-only">Notification Message</label>
        <input
          id="notificationMessage"
          className="border p-2 rounded w-full md:w-2/3 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Notification Message"
          required
          aria-required="true"
        />
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded font-bold transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Adding..." : "Add Notification"}
        </button>
      </form>
  {error && <div className="text-red-600 mb-4" role="alert">{error}</div>}
      <div className="border rounded p-4 bg-blue-50 dark:bg-neutral-900">
        <h2 className="text-xl font-semibold mb-2">Notification List</h2>
        {loading ? (
          <span className="text-gray-500">Loading...</span>
        ) : notifications.length === 0 ? (
          <span className="text-gray-500">No notifications added yet.</span>
        ) : (
          <ul className="divide-y divide-blue-200 dark:divide-neutral-800">
            {notifications.map(n => (
              <li key={n.id} className="flex items-center justify-between py-2">
                <span className="font-bold text-blue-700 dark:text-blue-300">{n.message}</span>
                <button
                  onClick={() => deleteNotification(n.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded font-bold hover:bg-red-600"
                >Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
