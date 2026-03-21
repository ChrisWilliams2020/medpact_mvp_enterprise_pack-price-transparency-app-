"use client";
import React, { useState } from "react";

const sampleAppointments = [
  { patient: "John Doe", date: "2026-02-10T09:00", status: "Confirmed" },
  { patient: "Jane Smith", date: "2026-02-12T14:30", status: "Pending" },
];

export default function Appointments() {
  const [search, setSearch] = useState("");
  const filtered = sampleAppointments.filter(a => a.patient.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Appointment Scheduling</h1>
      <input placeholder="Search Patient" value={search} onChange={e => setSearch(e.target.value)} className="mb-4 border px-2 py-1 rounded" />
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Patient</th>
            <th className="border px-4 py-2">Date/Time</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((a, idx) => (
            <tr key={idx}>
              <td className="border px-4 py-2">{a.patient}</td>
              <td className="border px-4 py-2">{new Date(a.date).toLocaleString()}</td>
              <td className="border px-4 py-2">{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        (UI placeholder for online booking, calendar sync, and self-service rescheduling)
        <div className="mt-2">
          <button className="px-3 py-1 bg-green-600 text-white rounded mr-2">Sync with Google Calendar</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded">Sync with Outlook</button>
        </div>
        <div className="mt-2">Automated SMS/Email reminders enabled</div>
      </div>
    </div>
  );
}
