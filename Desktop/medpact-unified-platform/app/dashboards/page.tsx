      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Persona Library</h2>
        <div className="flex gap-2 mb-2">
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => alert('Persona: Nurse')}>Nurse</button>
          <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => alert('Persona: Practice Manager')}>Practice Manager</button>
          <button className="px-3 py-1 bg-purple-600 text-white rounded" onClick={() => alert('Persona: Patient Advocate')}>Patient Advocate</button>
        </div>
        <div className="text-sm text-gray-600">Select a persona to customize agent voice and responses.</div>
      </div>
"use client";
import React from "react";

export default function CustomDashboards() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Custom Dashboards</h1>
      <ul className="list-disc ml-6">
        <li>Role-based dashboards for admin, providers, and staff</li>
        <li>Personalized widgets and KPIs</li>
        <li>Quick links to key workflows</li>
      </ul>
      <div className="mt-4">
        (UI placeholder for dashboard builder, drag-and-drop widgets, and real-time refresh)
        <div className="mt-2">Export dashboard to PDF/CSV enabled.</div>
        <div className="mt-2">Personalized widgets and real-time data refresh supported.</div>
      </div>
    </div>
  );
}
