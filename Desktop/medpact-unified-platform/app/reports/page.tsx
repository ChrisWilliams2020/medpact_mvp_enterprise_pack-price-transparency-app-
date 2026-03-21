"use client";
import React, { useState } from "react";

const sampleReports = [
  { name: "Monthly Financial", type: "Financial", date: "2026-01-31" },
  { name: "Patient Outcomes", type: "Clinical", date: "2026-01-31" },
];

export default function AutomatedReports() {
  const [search, setSearch] = useState("");
  const [schedule, setSchedule] = useState("");
  const filtered = sampleReports.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase()));

  function exportCSV() {
    const rows = ["name,type,date", ...filtered.map(r => `${r.name},${r.type},${r.date}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reports.csv";
    a.click();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Automated Reporting & Export</h1>
      <input placeholder="Search Report" value={search} onChange={e => setSearch(e.target.value)} className="mb-4 border px-2 py-1 rounded mr-2" />
      <input type="datetime-local" value={schedule} onChange={e => setSchedule(e.target.value)} className="mb-4 border px-2 py-1 rounded" />
      <button onClick={exportCSV} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">Export CSV</button>
      <table className="min-w-full border mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">Report</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r, idx) => (
            <tr key={idx}>
              <td className="border px-4 py-2">{r.name}</td>
              <td className="border px-4 py-2">{r.type}</td>
              <td className="border px-4 py-2">{r.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <strong>Schedule:</strong> {schedule ? `Report scheduled for ${schedule}` : "No schedule set."}
      </div>
      <div className="mt-4">
        <strong>Custom Builder:</strong> (Select metrics, date range, etc. - UI placeholder)
      </div>
    </div>
  );
}
