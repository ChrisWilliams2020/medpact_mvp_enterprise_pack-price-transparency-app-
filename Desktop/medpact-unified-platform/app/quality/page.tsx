"use client";
import React, { useState } from "react";

const sampleMeasures = [
  { measure: "HEDIS: Diabetes HbA1c", value: 7.2, target: 7.0, status: "Needs Improvement" },
  { measure: "MIPS: Blood Pressure", value: 130, target: 140, status: "On Track" },
];

export default function QualityMeasures() {
  const [search, setSearch] = useState("");
  const filtered = sampleMeasures.filter(m => m.measure.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Quality Measures & Accreditation</h1>
      <input placeholder="Search Measure" value={search} onChange={e => setSearch(e.target.value)} className="mb-4 border px-2 py-1 rounded" />
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Measure</th>
            <th className="border px-4 py-2">Value</th>
            <th className="border px-4 py-2">Target</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((m, idx) => (
            <tr key={idx}>
              <td className="border px-4 py-2">{m.measure}</td>
              <td className="border px-4 py-2">{m.value}</td>
              <td className="border px-4 py-2">{m.target}</td>
              <td className="border px-4 py-2">{m.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        (UI placeholder for accreditation tracking, benchmarking, and CMS API integration)
        <div className="mt-2">Automated reporting to payors/accreditors enabled.</div>
        <div className="mt-2">Benchmarking against national standards available.</div>
      </div>
    </div>
  );
}
