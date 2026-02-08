"use client";
import React, { useState } from "react";

const sampleData = [
  { practice: "MedPact Clinic", peers: "Peer Group A", payerMix: { Medicare: 40, Commercial: 50, Medicaid: 10 }, trend: [40, 42, 45, 43] },
  { practice: "Peer Group A", peers: "MedPact Clinic", payerMix: { Medicare: 35, Commercial: 55, Medicaid: 10 }, trend: [35, 36, 38, 37] },
];

export default function MarketAnalysis() {
  const [selected, setSelected] = useState(0);
  const [search, setSearch] = useState("");

  const filtered = sampleData.filter(d => d.practice.toLowerCase().includes(search.toLowerCase()));
  const data = filtered[selected] || sampleData[0];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Market Analysis Dashboard</h1>
      <input placeholder="Search Practice" value={search} onChange={e => setSearch(e.target.value)} className="mb-4 border px-2 py-1 rounded" />
      <select value={selected} onChange={e => setSelected(Number(e.target.value))} className="mb-4 border px-2 py-1 rounded">
        {filtered.map((d, idx) => (
          <option key={idx} value={idx}>{d.practice}</option>
        ))}
      </select>
      <div className="mb-4">
        {/* Replace with working chart component */}
        <ul>
          {Object.entries(data.payerMix).map(([payer, pct]) => (
            <li key={payer}>{payer}: {pct}%</li>
          ))}
        </ul>
      </div>
      <div>
        <strong>Peer Comparison:</strong> {data.peers}
      </div>
      <div className="mt-4">
        <strong>Trend (last 4 quarters):</strong> {data.trend.join(", ")}
      </div>
    </div>
  );
}
