"use client";
import React, { useState } from "react";

const sampleContracts = [
  { name: "BlueCross 2026", kpi: "Claims Paid", compliance: "On Track", deadline: "2026-06-01", performance: 92, trend: [90, 91, 92, 92], checklist: ["Submit Q1 report", "Review claims"] },
  { name: "Aetna 2026", kpi: "Patient Volume", compliance: "Needs Review", deadline: "2026-04-15", performance: 75, trend: [70, 72, 74, 75], checklist: ["Submit Q1 report", "Audit patient list"] },
];

export default function ContractPerformance() {
  const [search, setSearch] = useState("");
  const filtered = sampleContracts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  function sendAlert(contract) {
    alert(`Email alert sent for ${contract.name} deadline: ${contract.deadline}`);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Contract Performance & Compliance</h1>
      <input placeholder="Search Contract" value={search} onChange={e => setSearch(e.target.value)} className="mb-4 border px-2 py-1 rounded" />
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Contract</th>
            <th className="border px-4 py-2">KPI</th>
            <th className="border px-4 py-2">Compliance</th>
            <th className="border px-4 py-2">Deadline</th>
            <th className="border px-4 py-2">Performance</th>
            <th className="border px-4 py-2">KPI Trend</th>
            <th className="border px-4 py-2">Checklist</th>
            <th className="border px-4 py-2">Alert</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c, idx) => (
            <tr key={idx}>
              <td className="border px-4 py-2">{c.name}</td>
              <td className="border px-4 py-2">{c.kpi}</td>
              <td className="border px-4 py-2">{c.compliance}</td>
              <td className="border px-4 py-2">{c.deadline}</td>
              <td className="border px-4 py-2">{c.performance}%</td>
              <td className="border px-4 py-2">{c.trend.join(", ")}</td>
              <td className="border px-4 py-2">
                <ul>
                  {c.checklist.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </td>
              <td className="border px-4 py-2">
                <button onClick={() => sendAlert(c)} className="px-2 py-1 bg-red-500 text-white rounded">Send Alert</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
