
"use client";
import React from "react";

export default function SecureMessaging() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex">
      {/* AI Assistant Sidebar */}
      <aside className="w-72 min-h-screen bg-white border-r p-6 flex flex-col mr-8">
        <h2 className="text-lg font-bold mb-4 text-blue-700">AI Messaging Assistant</h2>
        <button className="mb-4 px-3 py-1 bg-blue-600 text-white rounded">Get Smart Suggestions</button>
        <ul className="mb-4">
          <li className="mb-2 text-gray-700">Suggest message templates</li>
          <li className="mb-2 text-gray-700">Triage urgent messages</li>
          <li className="mb-2 text-gray-700">Remind about unread messages</li>
          <li className="mb-2 text-gray-700">Summarize long threads</li>
        </ul>
        <div className="text-xs text-gray-500">AI can help you communicate efficiently, securely, and with empathy.</div>
      </aside>
      {/* Main Content */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Secure Messaging</h1>
        <ul className="list-disc ml-6 mb-4">
          <li>HIPAA-compliant staff and patient messaging</li>
          <li>Message threads and attachments</li>
          <li>Notifications for new messages</li>
          <li>End-to-end encryption and audit trail</li>
        </ul>
        {/* Real-time Chat UI Placeholder */}
        <div className="bg-white rounded-xl shadow p-6 mb-4">
          <div className="font-semibold mb-2">Inbox (coming soon)</div>
          <div className="h-40 bg-blue-50 rounded mb-2 flex items-center justify-center text-gray-400">Real-time chat, threads, and attachments UI</div>
          <div className="flex gap-2 mt-2">
            <input className="flex-1 border rounded px-2 py-1" placeholder="Type a message..." disabled />
            <button className="bg-blue-600 text-white px-4 py-1 rounded" disabled>Send</button>
            <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded" disabled>Attach</button>
          </div>
        </div>
        <div className="text-sm text-gray-600">Message templates, file attachments, and audit trail supported. Real-time notifications and search coming soon.</div>
      </div>
    </div>
  );
}
