"use client";
import React, { useState } from "react";

const sampleReferrals = [
  { patient: "John Doe", referredTo: "Dr. Alice", status: "Sent", outcome: "Pending" },
  { patient: "Jane Smith", referredTo: "Dr. Bob", status: "Received", outcome: "Completed" },
];

export default function Referrals() {
  const [search, setSearch] = useState("");
  const filtered = sampleReferrals.filter(r => r.patient.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Referral Management</h1>
      <input placeholder="Search Patient" value={search} onChange={e => setSearch(e.target.value)} className="mb-4 border px-2 py-1 rounded" />
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Patient</th>
            <th className="border px-4 py-2">Referred To</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Outcome</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r, idx) => (
            <tr key={idx}>
              <td className="border px-4 py-2">{r.patient}</td>
              <td className="border px-4 py-2">{r.referredTo}</td>
              <td className="border px-4 py-2">{r.status}</td>
              <td className="border px-4 py-2">{r.outcome}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        (UI placeholder for referral tracking, eFax, and outcome analytics)
        <div className="mt-2">Automated status updates and eFax integration enabled.</div>
        <div className="mt-2">Referral outcome analytics dashboard coming soon.</div>
      </div>
    </div>
  );
}
