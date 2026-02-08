"use client";
import React, { useState } from "react";

const samplePatients = [
  { name: "John Doe", risk: "High", gap: "Diabetes", opportunity: 85, lat: 40.7128, lng: -74.006 },
  { name: "Jane Smith", risk: "Medium", gap: "Hypertension", opportunity: 60, lat: 34.0522, lng: -118.2437 },
];

export default function PatientOpportunityMap() {
  const [search, setSearch] = useState("");
  const [risk, setRisk] = useState("");
  const filtered = samplePatients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (risk ? p.risk === risk : true)
  );

  function exportCSV() {
    const rows = ["name,risk,gap,opportunity", ...filtered.map(p => `${p.name},${p.risk},${p.gap},${p.opportunity}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "patients.csv";
    a.click();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Patient Opportunity Map</h1>
      <input placeholder="Search Patient" value={search} onChange={e => setSearch(e.target.value)} className="mb-4 border px-2 py-1 rounded mr-2" />
      <select value={risk} onChange={e => setRisk(e.target.value)} className="mb-4 border px-2 py-1 rounded">
        <option value="">All Risks</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button onClick={exportCSV} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">Export CSV</button>
      <table className="min-w-full border mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">Patient</th>
            <th className="border px-4 py-2">Risk</th>
            <th className="border px-4 py-2">Gap</th>
            <th className="border px-4 py-2">Opportunity Score</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p, idx) => (
            <tr key={idx}>
              <td className="border px-4 py-2">{p.name}</td>
              <td className="border px-4 py-2">{p.risk}</td>
              <td className="border px-4 py-2">{p.gap}</td>
              <td className="border px-4 py-2">{p.opportunity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-8">
        <strong>Map Visualization:</strong> (Google Maps integration placeholder)
      </div>
    </div>
  );
}
