
"use client";
import React from "react";

export default function PatientPortal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex">
      {/* AI Assistant Sidebar */}
      <aside className="w-72 min-h-screen bg-white border-r p-6 flex flex-col mr-8">
        <h2 className="text-lg font-bold mb-4 text-blue-700">AI Patient Assistant</h2>
        <button className="mb-4 px-3 py-1 bg-blue-600 text-white rounded">Get Smart Guidance</button>
        <ul className="mb-4">
          <li className="mb-2 text-gray-700">Track lab results and care plans</li>
          <li className="mb-2 text-gray-700">Receive reminders for appointments</li>
          <li className="mb-2 text-gray-700">Get help completing surveys and forms</li>
          <li className="mb-2 text-gray-700">Securely message your care team</li>
        </ul>
        <div className="text-xs text-gray-500">AI can help you understand your health data, schedule visits, and communicate securely.</div>
      </aside>
      {/* Main Content */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Patient Portal</h1>
        <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded">Login with Secure Auth</button>
        <ul className="list-disc ml-6">
          <li>View lab results and care plans (EHR integration)</li>
          <li>Complete surveys and forms</li>
          <li>Securely message your care team</li>
          <li>Upcoming appointments and reminders</li>
          <li>Upload/download documents (PDF, images)</li>
          <li>Real-time notifications for new results/messages</li>
        </ul>
        <div className="mt-4">(UI placeholder for secure login, document upload, and EHR integration)</div>
      </div>
    </div>
  );
}
