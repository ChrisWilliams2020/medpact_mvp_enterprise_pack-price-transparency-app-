"use client";
import React from "react";

  "use client";
  import React from "react";

  export default function Scheduling() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex">
        {/* AI Assistant Sidebar */}
        <aside className="w-72 min-h-screen bg-white border-r p-6 flex flex-col mr-8">
          <h2 className="text-lg font-bold mb-4 text-blue-700">AI Scheduling Assistant</h2>
          <button className="mb-4 px-3 py-1 bg-blue-600 text-white rounded">Get Smart Suggestions</button>
          <ul className="mb-4">
            <li className="mb-2 text-gray-700">Optimize appointment slots</li>
            <li className="mb-2 text-gray-700">Send automated reminders</li>
            <li className="mb-2 text-gray-700">Sync with multiple calendars</li>
            <li className="mb-2 text-gray-700">Reduce no-shows with AI</li>
          </ul>
          <div className="text-xs text-gray-500">AI can help maximize provider efficiency and patient satisfaction.</div>
        </aside>
        {/* Main Content */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-4">Automated Scheduling</h1>
          {/* Biometric Login Integration Placeholder */}
          <div className="mb-4">
            <button className="px-3 py-1 bg-purple-600 text-white rounded">Login with Biometric Auth</button>
          </div>
          <div className="mb-4">
            <button className="px-3 py-1 bg-blue-600 text-white rounded">Sync with Google Calendar</button>
            <button className="px-3 py-1 bg-green-600 text-white rounded ml-2">Sync with Outlook</button>
          </div>
          <div className="mt-4">(UI placeholder for booking, reminders, and calendar integration)</div>
        </div>
      </div>
    );
  }
